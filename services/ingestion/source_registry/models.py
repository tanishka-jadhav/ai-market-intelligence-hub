import datetime
from sqlalchemy import Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey, Table
from app.core.database import Base

class SourceRegistry(Base):
    __tablename__ = "sources"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    base_url = Column(Text, nullable=False)
    source_type = Column(String(50), default="DIRECTORY") # DIRECTORY, OFFICIAL, API, SITEMAP
    api_available = Column(Boolean, default=False)
    sitemap_available = Column(Boolean, default=False)
    robots_url = Column(Text, nullable=True)
    crawl_allowed = Column(Boolean, default=True)
    crawl_frequency = Column(String(20), default="daily")
    last_crawled = Column(DateTime, nullable=True)
    status = Column(String(30), default="ACTIVE") # ACTIVE, BLOCKED, MANUAL_REQUIRED, DEPRECATED
    notes = Column(Text, nullable=True)

class RawSourcePage(Base):
    __tablename__ = "raw_source_pages"
    
    id = Column(String(36), primary_key=True)
    source_id = Column(String(36), ForeignKey("sources.id"), nullable=False)
    url = Column(Text, nullable=False)
    http_status = Column(Integer, nullable=False)
    content_hash = Column(String(64), nullable=False)
    raw_content = Column(Text, nullable=False)
    content_type = Column(String(50), default="text/html")
    fetched_at = Column(DateTime, default=datetime.datetime.utcnow)
    parser_version = Column(String(20), default="1.0.0")
    crawl_status = Column(String(30), default="PROCESSED")

class OfficialUrlCandidate(Base):
    __tablename__ = "official_url_candidates"
    
    id = Column(String(36), primary_key=True)
    product_name = Column(String(255), nullable=False)
    candidate_url = Column(Text, nullable=False)
    source_url = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.5)
    verification_method = Column(String(50), default="HTTP_HEADER") # HTTP_HEADER, DOMAIN_MATCH, SEARCH
    status = Column(String(30), default="PENDING") # PENDING, VERIFIED, REJECTED

class DuplicateCandidate(Base):
    __tablename__ = "duplicate_candidates"
    
    id = Column(String(36), primary_key=True)
    product_a_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    product_b_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    similarity_score = Column(Float, default=0.0)
    reason = Column(String(255), nullable=False)
    status = Column(String(30), default="PENDING") # PENDING, MERGED, REJECTED

class CrawlJob(Base):
    __tablename__ = "crawl_jobs"
    
    id = Column(String(36), primary_key=True)
    source_id = Column(String(36), ForeignKey("sources.id"), nullable=False)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    pages_crawled = Column(Integer, default=0)
    products_discovered = Column(Integer, default=0)
    status = Column(String(30), default="RUNNING") # RUNNING, COMPLETED, FAILED

class CrawlError(Base):
    __tablename__ = "crawl_errors"
    
    id = Column(String(36), primary_key=True)
    source_id = Column(String(36), ForeignKey("sources.id"), nullable=False)
    url = Column(Text, nullable=False)
    error_message = Column(Text, nullable=False)
    occurred_at = Column(DateTime, default=datetime.datetime.utcnow)
