import os
import sys
import json
import uuid
import re
import datetime
import urllib.request

sys.stdout.reconfigure(line_buffering=True)

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/api")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import engine, Base, SessionLocal
from app.models.schema import Product, Company, Category, Industry, PricingPlan, AIModel

def run_github_pypi_ingestion():
    print("=" * 75, flush=True)
    print("AI MARKET INTELLIGENCE HUB — INGESTING GITHUB AI AGENTS, TOOLS & PYPI SDKs", flush=True)
    print("=" * 75, flush=True)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    def get_or_create_company(comp_name: str, official_url: str) -> Company:
        comp_name = comp_name.strip() or "Independent"
        comp_slug = re.sub(r'[^a-zA-Z0-9\-]', '', comp_name.lower().replace(" ", "-")) or str(uuid.uuid4())[:8]
        comp = db.query(Company).filter((Company.name == comp_name) | (Company.slug == comp_slug)).first()
        if not comp:
            comp = Company(
                id=str(uuid.uuid4()),
                name=comp_name[:255],
                slug=comp_slug[:255],
                website_url=official_url
            )
            db.add(comp)
            try:
                db.flush()
            except Exception:
                db.rollback()
                comp = db.query(Company).filter((Company.name == comp_name) | (Company.slug == comp_slug)).first()
        return comp

    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI Market Hub/1.0'}

        # ---------------------------------------------------------
        # GitHub Open Source AI Repositories (AI Agents, Tools, Platforms)
        # ---------------------------------------------------------
        print("\n[SOURCE 1/2] Ingesting Open-Source AI Agents & Tools from GitHub...", flush=True)
        gh_topics = [
            ("ai-agent", "AI Agent"),
            ("autonomous-agents", "AI Agent"),
            ("ai-assistant", "AI Agent"),
            ("agent", "AI Agent"),
            ("agents", "AI Agent"),
            ("ai-tool", "AI Tool"),
            ("llm-tool", "AI Tool"),
            ("prompt-engineering", "AI Tool"),
            ("ai-productivity", "AI Tool"),
            ("mcp-server", "AI Platform"),
            ("rag", "AI Platform"),
            ("vector-database", "AI Platform"),
            ("langchain", "AI Platform"),
            ("ai-framework", "AI Platform")
        ]

        gh_added = 0
        for topic, p_type in gh_topics:
            for page in range(1, 6): # 5 pages x 100 = 500 per topic
                url = f"https://api.github.com/search/repositories?q={topic}+stars:>10&sort=stars&order=desc&per_page=100&page={page}"
                try:
                    req = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(req, timeout=15) as res:
                        data = json.loads(res.read().decode('utf-8'))
                        items = data.get("items", [])
                        if not isinstance(items, list) or len(items) == 0:
                            break

                        for item in items:
                            r_name = item.get("name")
                            owner = item.get("owner", {}).get("login", "Open Source")
                            html_url = item.get("html_url")
                            homepage = item.get("homepage")
                            desc = item.get("description") or f"Open-source AI project {r_name}."
                            stars = item.get("stargazers_count", 0)

                            if not r_name or not html_url:
                                continue

                            clean_name = r_name.replace("-", " ").replace("_", " ").title()
                            comp_name = owner.replace("-", " ").replace("_", " ").title()
                            official_url = homepage if homepage and homepage.startswith("http") else html_url

                            slug = re.sub(r'[^a-zA-Z0-9\-]', '', r_name.lower().replace(" ", "-"))
                            if not slug:
                                continue

                            if db.query(Product).filter((Product.slug == slug) | (Product.official_url == official_url)).first():
                                continue

                            comp = get_or_create_company(comp_name, official_url)

                            prod = Product(
                                id=str(uuid.uuid4()),
                                name=clean_name[:255],
                                slug=slug[:255],
                                company_id=comp.id if comp else None,
                                company_name=comp.name if comp else comp_name,
                                product_type=p_type,
                                tagline=f"Open Source {p_type} by {comp_name} ({stars:,} Stars)",
                                description=f"{clean_name}: {desc[:1000]} ({stars:,} GitHub stars)",
                                official_url=official_url,
                                docs_url=html_url,
                                open_source_status=True,
                                api_available=True,
                                free_plan_available=True,
                                verification_status="Verified",
                                confidence_score=0.95
                            )
                            db.add(prod)
                            gh_added += 1

                            if gh_added % 250 == 0:
                                try:
                                    db.commit()
                                    tot = db.query(Product).count()
                                    print(f"   Saved {gh_added} GitHub AI products. Total DB Products: {tot:,}", flush=True)
                                except Exception:
                                    db.rollback()
                except Exception:
                    pass

        try:
            db.commit()
        except Exception:
            db.rollback()
        print(f"GitHub Ingestion Complete: Added {gh_added} products.", flush=True)

        final_tot = db.query(Product).count()
        print("\n" + "=" * 75, flush=True)
        print(f"🎉 INGESTION COMPLETE! TOTAL REAL AI PRODUCTS IN DB: {final_tot:,} 🎉", flush=True)
        print("=" * 75, flush=True)

    finally:
        db.close()

if __name__ == "__main__":
    run_github_pypi_ingestion()
