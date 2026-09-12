import os
import sys

# Ensure project root & apps/api are in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../apps/api")))

import json
import datetime

from app.core.database import SessionLocal
from app.models.schema import Product, Company, AIModel
from services.ingestion.source_registry.models import SourceRegistry, RawSourcePage, CrawlJob, DuplicateCandidate
from services.ingestion.source_registry.registry import SourceRegistryService
from services.ingestion.crawlers.ai_tools_directory_crawler import AIToolsDirectoryCrawler
from services.ingestion.crawlers.ai_agent_tools_crawler import AIAgentToolsCrawler
from services.ingestion.crawlers.ai_agents_directory_crawler import AIAgentsDirectoryCrawler
from services.ingestion.ingestion_pipeline import CompleteIngestionPipeline
from services.ingestion.verification.official_verifier import OfficialWebsiteVerifier

def run_phase_0_ingestion():
    print("==========================================================")
    print("STARTING PHASE 0: AI MARKET DATA DISCOVERY & WEB INGESTION")
    print("==========================================================")
    
    db = SessionLocal()
    try:
        # Step 1: Initialize Source Registry
        reg_service = SourceRegistryService(db)
        reg_service.initialize_default_sources()
        print("[Step 1] Source Registry initialized.")

        # Step 2: Initialize Ingestion Pipeline & Crawlers
        pipeline = CompleteIngestionPipeline(db)
        crawlers = [
            AIToolsDirectoryCrawler(db),
            AIAgentToolsCrawler(db),
            AIAgentsDirectoryCrawler(db)
        ]

        total_discovered = 0
        all_candidates = []

        # Step 3: Run Crawler Iterations across active sources
        for crawler in crawlers:
            items = crawler.run_crawl(max_pages=10)
            total_discovered += len(items)
            all_candidates.extend(items)

        print(f"[Step 3] Crawling complete. Discovered {total_discovered} raw candidates.")

        # Step 4: Normalization & Deduplication Pass
        print("[Step 4] Normalizing and deduplicating candidates...")
        processed_count = 0
        for cand in all_candidates:
            try:
                pipeline.process_candidate(cand)
                processed_count += 1
            except Exception as e:
                print(f"Candidate processing error: {e}")

        # Step 5: Official Website Verification Pass
        print("[Step 5] Running Official Website Verification sweep...")
        verifier = OfficialWebsiteVerifier(db)
        all_prods = db.query(Product).filter(Product.is_deleted == False).all()
        for prod in all_prods:
            verifier.verify_and_update_product(prod.id)

        # Step 6: Generate Output Datasets (/data/raw/, /data/normalized/, /data/verified/)
        generate_dataset_exports(db)

        # Step 7: Generate Data Quality Reports
        generate_reports(db)

        print("==========================================================")
        print("PHASE 0 INGESTION RUN COMPLETE!")
        print("==========================================================")

    finally:
        db.close()

def generate_dataset_exports(db):
    os.makedirs("data/raw", exist_ok=True)
    os.makedirs("data/normalized", exist_ok=True)
    os.makedirs("data/verified", exist_ok=True)

    # Raw pages count
    raw_count = db.query(RawSourcePage).count()
    
    # Export Normalized Products
    products = db.query(Product).filter(Product.is_deleted == False).all()
    norm_list = []
    ver_list = []
    
    for p in products:
        item = {
            "name": p.name,
            "company": p.company_name,
            "description": p.description,
            "official_url": p.official_url,
            "product_type": p.product_type,
            "context_window": p.context_window,
            "api_available": p.api_available,
            "free_plan": p.free_plan_available,
            "open_source": p.open_source_status,
            "verification_status": p.verification_status,
            "confidence_score": p.confidence_score,
            "last_verified": p.last_verified.isoformat() if p.last_verified else None
        }
        norm_list.append(item)
        if p.verification_status == "Verified":
            ver_list.append(item)

    with open("data/raw/raw_summary.json", "w", encoding="utf-8") as f:
        json.dump({"raw_pages_stored": raw_count}, f, indent=2)

    with open("data/normalized/normalized_products.json", "w", encoding="utf-8") as f:
        json.dump(norm_list, f, indent=2)

    with open("data/verified/verified_products.json", "w", encoding="utf-8") as f:
        json.dump(ver_list, f, indent=2)

    print(f"[Export] Saved {len(norm_list)} normalized and {len(ver_list)} verified records to /data.")

def generate_reports(db):
    sources = db.query(SourceRegistry).all()
    raw_pages_count = db.query(RawSourcePage).count()
    total_products = db.query(Product).filter(Product.is_deleted == False).count()
    verified_products = db.query(Product).filter(Product.is_deleted == False, Product.verification_status == "Verified").count()
    duplicates_count = db.query(DuplicateCandidate).count()
    stale_count = db.query(Product).filter(Product.is_deleted == False, Product.verification_status == "Stale").count()

    # 1. DATA_DISCOVERY_REPORT.md
    report_md = f"""# AI Market Data Discovery & Web Ingestion Report (Phase 0)

**Report Date**: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}

## Executive Summary
The **Phase 0 Data Discovery Engine** has completed initial multi-source discovery, web scraping, normalization, deduplication, and primary official URL verification across public AI directories.

---

## Ingestion Metrics Overview

| Metric | Count |
| :--- | :--- |
| **Sources Registered** | {len(sources)} |
| **Active Crawlable Sources** | {len([s for s in sources if s.status == 'ACTIVE'])} |
| **Blocked / Cloudflare Protected Sources** | {len([s for s in sources if s.status == 'BLOCKED'])} |
| **Raw Pages Crawled & Snapshot Stored** | {raw_pages_count} |
| **Total Products Cataloged** | {total_products} |
| **Unique Verified Official Products** | {verified_products} |
| **Duplicate Candidates Logged** | {duplicates_count} |
| **Stale Records Flagged** | {stale_count} |

---

## Source Registry Audit

| Source Name | Base URL | Sitemap | Robots | Status |
| :--- | :--- | :--- | :--- | :--- |
"""
    for s in sources:
        report_md += f"| {s.name} | `{s.base_url}` | {'Yes' if s.sitemap_available else 'No'} | `robots.txt` | `{s.status}` |\n"

    report_md += """
---

## Scalability & Pipeline Guarantees
- **Raw Data Provenance**: Raw HTML snapshots saved in `raw_source_pages` prior to normalization.
- **Zero Hallucination Policy**: All missing prices or context tokens marked `NULL` / `Not publicly specified`.
- **Deduplication Engine**: Domain matching and fuzzy string comparison active.
- **Data Target Scaling Path**: Database structured to scale to 25,000 -> 50,000 -> 100,000+ products without schema modification.
"""

    with open("docs/DATA_DISCOVERY_REPORT.md", "w", encoding="utf-8") as f:
        f.write(report_md)

    # 2. SCRAPING_STATUS.md
    status_md = f"""# Web Scraping & Ingestion Status

**Last Audit Timestamp**: {datetime.datetime.utcnow().isoformat()}

## Source Audit Table

```
"""
    for s in sources:
        status_md += f"[{s.name}] Base: {s.base_url} | Status: {s.status} | Last Crawled: {s.last_crawled}\n"

    status_md += f"""
```

### Ingestion Output Files
- `/data/raw/raw_summary.json`
- `/data/normalized/normalized_products.json`
- `/data/verified/verified_products.json`
"""

    with open("docs/SCRAPING_STATUS.md", "w", encoding="utf-8") as f:
        f.write(status_md)

    print("[Report] DATA_DISCOVERY_REPORT.md and SCRAPING_STATUS.md generated in /docs.")

if __name__ == "__main__":
    run_phase_0_ingestion()
