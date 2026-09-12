import re
import json
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from services.ingestion.crawlers.base_crawler import BaseCrawler

class PublicSitemapCrawler(BaseCrawler):
    def __init__(self, source_name: str, base_sitemap_url: str, db: Session):
        super().__init__(source_name, db)
        self.base_sitemap_url = base_sitemap_url

    def discover_urls(self) -> List[str]:
        urls = []
        try:
            raw_xml = self.fetch_page(self.base_sitemap_url)
            root = ET.fromstring(raw_xml)
            for elem in root.iter():
                if elem.tag.endswith('loc') and elem.text:
                    loc = elem.text.strip()
                    if any(p in loc for p in ['/tool/', '/tools/', '/agent/', '/agents/', '/product/', '/ai/']):
                        urls.append(loc)
        except Exception as e:
            print(f"[{self.source_name}] Sitemap parse error: {e}")
        return urls or [self.base_sitemap_url]

    def extract_products(self, raw_html: str, url: str) -> List[Dict[str, Any]]:
        products = []
        # JSON-LD software extraction
        json_ld_matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw_html, re.DOTALL)
        for match in json_ld_matches:
            try:
                data = json.loads(match.strip())
                if isinstance(data, dict) and data.get("@type") in ["SoftwareApplication", "Product"]:
                    prod_name = data.get("name")
                    if prod_name:
                        products.append({
                            "name": prod_name.strip(),
                            "description": data.get("description", f"AI tool listed on {self.source_name}"),
                            "official_url": data.get("url") or url,
                            "company_name": data.get("author", {}).get("name") if isinstance(data.get("author"), dict) else "Independent",
                            "product_type": "AI Tool",
                            "categories": [data.get("applicationCategory", "AI Tools")],
                            "industries": ["Technology"]
                        })
            except Exception:
                pass

        if not products:
            title_match = re.search(r'<title>(.*?)</title>', raw_html, re.IGNORECASE)
            desc_match = re.search(r'<meta name="description" content="(.*?)"', raw_html, re.IGNORECASE)
            if title_match:
                title_text = title_match.group(1).split('|')[0].split('-')[0].split('–')[0].strip()
                if len(title_text) > 2 and title_text.lower() not in ["home", "404", "error", "sitemap"]:
                    products.append({
                        "name": title_text,
                        "description": desc_match.group(1).strip() if desc_match else f"AI tool product discovered on {self.source_name}.",
                        "official_url": url,
                        "company_name": "Independent",
                        "product_type": "AI Tool",
                        "categories": ["AI Tools"],
                        "industries": ["Technology"]
                    })
        return products
