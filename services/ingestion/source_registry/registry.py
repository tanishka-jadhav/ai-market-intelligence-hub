import uuid
import datetime
import urllib.parse
from urllib.robotparser import RobotFileParser
from sqlalchemy.orm import Session
from .models import SourceRegistry
from app.core.database import Base, engine

class SourceRegistryService:
    def __init__(self, db: Session):
        self.db = db
        self.robot_parsers = {}

    def initialize_default_sources(self):
        """
        Populate initial source registry with public AI discovery portals.
        """
        Base.metadata.create_all(bind=engine)
        
        default_sources = [
            {"name": "Futurepedia", "base_url": "https://www.futurepedia.io/", "sitemap_available": True},
            {"name": "TopAI.tools", "base_url": "https://topai.tools/", "status": "BLOCKED", "notes": "Cloudflare 403 HTTP anti-bot protection. Marked MANUAL_REQUIRED."},
            {"name": "Toolsify", "base_url": "https://toolsify.ai/", "sitemap_available": True},
            {"name": "AI Tools Directory", "base_url": "https://ai-tools.directory/", "sitemap_available": True},
            {"name": "AI Agent Tools", "base_url": "https://aiagenttools.dev/", "sitemap_available": True},
            {"name": "AI Agents Directory", "base_url": "https://aiagentsdirectory.com/", "sitemap_available": True},
            {"name": "AgentFirst", "base_url": "https://agentfirst.directory/", "sitemap_available": False},
            {"name": "Tooliverse", "base_url": "https://tooliverse.ai/", "sitemap_available": True},
            {"name": "db.fyi", "base_url": "https://db.fyi/", "sitemap_available": True},
            {"name": "InfoWebWorld AI", "base_url": "https://www.infowebworld.com/ai-ml", "sitemap_available": True},
            {"name": "Aidose", "base_url": "https://www.aidose.in/tools", "sitemap_available": True}
        ]
        
        for src_info in default_sources:
            existing = self.db.query(SourceRegistry).filter(SourceRegistry.name == src_info["name"]).first()
            if not existing:
                parsed = urllib.parse.urlparse(src_info["base_url"])
                robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
                
                src = SourceRegistry(
                    id=str(uuid.uuid4()),
                    name=src_info["name"],
                    base_url=src_info["base_url"],
                    source_type="DIRECTORY",
                    sitemap_available=src_info.get("sitemap_available", True),
                    robots_url=robots_url,
                    crawl_allowed=src_info.get("status") != "BLOCKED",
                    status=src_info.get("status", "ACTIVE"),
                    notes=src_info.get("notes")
                )
                self.db.add(src)
        self.db.commit()

    def is_url_crawlable(self, source_name: str, target_url: str) -> bool:
        """
        Verify if target URL is allowed under source's robots.txt directives.
        """
        src = self.db.query(SourceRegistry).filter(SourceRegistry.name == source_name).first()
        if not src or not src.crawl_allowed or src.status == "BLOCKED":
            return False
            
        domain = urllib.parse.urlparse(target_url).netloc
        if domain not in self.robot_parsers:
            rfp = RobotFileParser()
            try:
                rfp.set_url(src.robots_url)
                rfp.read()
                self.robot_parsers[domain] = rfp
            except Exception:
                # If robots.txt cannot be fetched, default to permissive check
                return True
                
        rfp = self.robot_parsers[domain]
        return rfp.can_fetch("AI Market Hub Collector/1.0", target_url)
