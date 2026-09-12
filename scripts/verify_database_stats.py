import os
import sys
import sqlite3
from urllib.parse import urlparse
from sqlalchemy import func

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/api")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models.schema import Product, Company, Category, Industry, PricingPlan, AIModel

def verify_stats():
    db = SessionLocal()
    try:
        total_products = db.query(Product).count()
        total_companies = db.query(Company).count()
        total_categories = db.query(Category).count()
        total_industries = db.query(Industry).count()
        total_models = db.query(AIModel).count()
        total_pricing = db.query(PricingPlan).count()

        # Product Type Breakdown
        types_breakdown = {}
        for row in db.query(Product.product_type, func.count(Product.id)).group_by(Product.product_type).all():
            types_breakdown[row[0]] = row[1]

        # Open Source count
        open_source_count = db.query(Product).filter(Product.open_source_status == True).count()
        free_plan_count = db.query(Product).filter(Product.free_plan_available == True).count()
        api_available_count = db.query(Product).filter(Product.api_available == True).count()

        # Unique official domains
        all_urls = [p.official_url for p in db.query(Product.official_url).all()]
        unique_domains = len(set(urlparse(u).netloc for u in all_urls if u))

        print("=" * 75)
        print("AI MARKET INTELLIGENCE HUB — VERIFIED DATABASE STATISTICS REPORT")
        print("=" * 75)
        print(f"Total Verified Real Products: {total_products:,}")
        print(f"Total Unique Official Domains: {unique_domains:,}")
        print(f"Total Companies Registered: {total_companies:,}")
        print(f"Total Niche Categories: {total_categories:,}")
        print(f"Total Industry Sectors: {total_industries:,}")
        print(f"Total Foundation AI Models: {total_models:,}")
        print(f"Total Pricing Plans Recorded: {total_pricing:,}")
        print("-" * 75)
        print("PRODUCT TYPES BREAKDOWN:")
        for ptype, cnt in sorted(types_breakdown.items(), key=lambda x: x[1], reverse=True):
            print(f"  • {ptype}: {cnt:,}")
        print("-" * 75)
        print("FEATURES & PRICING ACCESS:")
        print(f"  • Open Source Projects: {open_source_count:,}")
        print(f"  • Free Plan / Free Tier: {free_plan_count:,}")
        print(f"  • API Available: {api_available_count:,}")
        print("=" * 75)

    finally:
        db.close()

if __name__ == "__main__":
    verify_stats()
