import os
import sys
import datetime
import time

# Ensure import paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/api")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import engine, Base, SessionLocal
from app.models.schema import Product, Company, Category, Industry
from services.ingestion.source_registry.registry import SourceRegistryService
from services.ingestion.ingestion_pipeline import CompleteIngestionPipeline
from services.ingestion.crawlers.huggingface_crawler import HuggingFaceCrawler
from services.ingestion.crawlers.github_ai_crawler import GitHubAICrawler
from services.ingestion.crawlers.pypi_ai_crawler import PyPIAICrawler
from services.ingestion.crawlers.sitemap_crawler import PublicSitemapCrawler

def run_mass_ingestion():
    print("=" * 70)
    print("AI MARKET INTELLIGENCE HUB — MASS DATA INGESTION ENGINE")
    print("TARGET: 10,000+ REAL UNIQUE PRODUCTS")
    print("=" * 70)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Initialize default source registry entries
        registry_svc = SourceRegistryService(db)
        registry_svc.initialize_default_sources()

        pipeline = CompleteIngestionPipeline(db)
        initial_count = db.query(Product).count()
        print(f"Initial Database Product Count: {initial_count}")

        crawlers = [
            ("HuggingFace Models Hub", HuggingFaceCrawler(db), 500),
            ("GitHub AI Open Source", GitHubAICrawler(db), 300),
            ("PyPI Python AI Index", PyPIAICrawler(db), 200),
            ("Futurepedia Catalog", PublicSitemapCrawler("Futurepedia", "https://www.futurepedia.io/sitemap.xml", db), 100),
            ("AI Agent Tools Directory", PublicSitemapCrawler("AI Agent Tools", "https://aiagenttools.dev/sitemap.xml", db), 100),
            ("AI Tools Directory", PublicSitemapCrawler("AI Tools Directory", "https://ai-tools.directory/sitemap.xml", db), 100),
            ("Tooliverse Catalog", PublicSitemapCrawler("Tooliverse", "https://tooliverse.ai/sitemap.xml", db), 100)
        ]

        total_processed = 0
        milestones = [1000, 5000, 10000]

        for name, crawler, max_pages in crawlers:
            current_db_count = db.query(Product).count()
            print(f"\n>>> Launching Crawler: {name} (Current DB Count: {current_db_count})")
            
            candidates = crawler.run_crawl(max_pages=max_pages)
            print(f"[{name}] Discovered {len(candidates)} raw candidates. Processing into database...")

            batch_count = 0
            for candidate in candidates:
                try:
                    prod = pipeline.process_candidate(candidate)
                    if prod:
                        total_processed += 1
                        batch_count += 1
                        if batch_count % 100 == 0:
                            db.commit()
                            cnt = db.query(Product).count()
                            print(f"   [Batch] Saved {batch_count}/{len(candidates)} items. Current Total DB Products: {cnt:,}")
                            for m in milestones:
                                if cnt >= m and (cnt - 100) < m:
                                    print(f"\n🎉 MILESTONE REACHED: {m:,}+ Verified AI Products in Database! 🎉\n")
                except Exception as e:
                    pass

            db.commit()
            updated_count = db.query(Product).count()
            print(f"[{name}] Ingestion complete! Total Database Product Count now: {updated_count:,}")

        final_count = db.query(Product).count()
        print("\n" + "=" * 70)
        print(f"MASS INGESTION COMPLETE!")
        print(f"Final Total Products in Database: {final_count:,}")
        print("=" * 70)

    except Exception as e:
        db.rollback()
        print(f"Ingestion Pipeline Error: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    run_mass_ingestion()
