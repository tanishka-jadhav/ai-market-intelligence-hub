import abc
import hashlib
import uuid
import datetime
import sys
import urllib.request
import urllib.parse
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from services.ingestion.source_registry.models import SourceRegistry, RawSourcePage, CrawlJob, CrawlError

class BaseCrawler(abc.ABC):
    def __init__(self, source_name: str, db: Session):
        self.source_name = source_name
        self.db = db
        self.source = db.query(SourceRegistry).filter(SourceRegistry.name == source_name).first()
        if not self.source:
            self.source = SourceRegistry(
                id=str(uuid.uuid4()),
                name=source_name,
                base_url=f"https://{source_name.lower().replace(' ', '')}.com/",
                source_type="API" if "Hub" in source_name or "Projects" in source_name else "DIRECTORY",
                crawl_allowed=True,
                status="ACTIVE"
            )
            self.db.add(self.source)
            self.db.commit()

        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI Market Hub Collector/1.0 (+http://localhost)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }

    @abc.abstractmethod
    def discover_urls(self) -> List[str]:
        """Discover product detail pages or catalog URLs from sitemaps/categories."""
        pass

    @abc.abstractmethod
    def extract_products(self, raw_html: str, url: str) -> List[Dict[str, Any]]:
        """Parse raw HTML content and extract structured raw product data objects."""
        pass

    def fetch_page(self, url: str) -> str:
        req = urllib.request.Request(url, headers=self.headers)
        with urllib.request.urlopen(req, timeout=12) as response:
            content = response.read().decode('utf-8', errors='ignore')
            status_code = response.status
            
            content_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()
            raw_page = RawSourcePage(
                id=str(uuid.uuid4()),
                source_id=self.source.id if self.source else "unknown",
                url=url,
                http_status=status_code,
                content_hash=content_hash,
                raw_content=content[:50000],
                fetched_at=datetime.datetime.utcnow(),
                crawl_status="PROCESSED"
            )
            self.db.add(raw_page)
            self.db.flush()
            return content

    def run_crawl(self, max_pages: int = 50) -> List[Dict[str, Any]]:
        if not self.source or not self.source.crawl_allowed:
            print(f"[{self.source_name}] Skipping crawl: source is marked BLOCKED or disabled.", flush=True)
            return []
            
        print(f"[{self.source_name}] Starting crawl job...", flush=True)
        job = CrawlJob(
            id=str(uuid.uuid4()),
            source_id=self.source.id,
            started_at=datetime.datetime.utcnow(),
            status="RUNNING"
        )
        self.db.add(job)
        self.db.commit()

        discovered_urls = self.discover_urls()[:max_pages]
        extracted_products = []

        for url in discovered_urls:
            try:
                raw_html = self.fetch_page(url)
                items = self.extract_products(raw_html, url)
                for item in items:
                    item["source_name"] = self.source_name
                    item["source_url"] = url
                    extracted_products.append(item)
                job.pages_crawled += 1
            except Exception as e:
                err = CrawlError(
                    id=str(uuid.uuid4()),
                    source_id=self.source.id,
                    url=url,
                    error_message=str(e),
                    occurred_at=datetime.datetime.utcnow()
                )
                self.db.add(err)
                print(f"[{self.source_name}] Error crawling {url}: {e}", flush=True)

        job.products_discovered = len(extracted_products)
        job.status = "COMPLETED"
        job.completed_at = datetime.datetime.utcnow()
        if self.source:
            self.source.last_crawled = datetime.datetime.utcnow()
        self.db.commit()

        print(f"[{self.source_name}] Crawl complete! Discovered {len(extracted_products)} product candidates.", flush=True)
        return extracted_products
