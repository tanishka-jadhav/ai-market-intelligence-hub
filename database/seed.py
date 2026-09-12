import json
import os
import sys
import uuid
import datetime

# Ensure app package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/api")))

from app.core.database import engine, Base, SessionLocal
from app.models.schema import (
    Product, Company, Category, Industry, PricingPlan, AgentCapabilities, AIModel, AdminUser, product_business_models
)

def seed_database():
    print("Creating database schema tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        existing_count = db.query(Product).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} products. Seeding skipped.")
            return
            
        seed_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "seed_data.json"))
        if not os.path.exists(seed_path):
            print(f"Seed file not found at {seed_path}")
            return
            
        with open(seed_path, "r", encoding="utf-8") as f:
            seed_products = json.load(f)
            
        print(f"Found {len(seed_products)} items to seed...")
        
        # Cache companies, categories, industries to prevent duplicate inserts
        companies_map = {}
        categories_map = {}
        industries_map = {}
        
        # Default Admin User
        admin = AdminUser(
            id=str(uuid.uuid4()),
            username="admin@aimarkethub.com",
            # Standard bcrypt hash for "admin123"
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW",
            role="SuperAdmin"
        )
        db.add(admin)
        
        for item in seed_products:
            # 1. Company
            comp_name = item.get("company_name", "Independent")
            if comp_name not in companies_map:
                comp_slug = comp_name.lower().replace(" ", "-").replace(".", "")
                comp = db.query(Company).filter(Company.name == comp_name).first()
                if not comp:
                    comp = Company(
                        id=str(uuid.uuid4()),
                        name=comp_name,
                        slug=comp_slug,
                        website_url=item.get("company_website", item["official_url"])
                    )
                    db.add(comp)
                    db.flush()
                companies_map[comp_name] = comp
            company = companies_map[comp_name]
            
            # 2. Categories
            category_objs = []
            for cat_name in item.get("categories", []):
                if cat_name not in categories_map:
                    cat_slug = cat_name.lower().replace(" ", "-").replace("/", "-")
                    cat = db.query(Category).filter(Category.name == cat_name).first()
                    if not cat:
                        cat = Category(id=str(uuid.uuid4()), name=cat_name, slug=cat_slug)
                        db.add(cat)
                        db.flush()
                    categories_map[cat_name] = cat
                category_objs.append(categories_map[cat_name])
                
            # 3. Industries
            industry_objs = []
            for ind_name in item.get("industries", []):
                if ind_name not in industries_map:
                    ind_slug = ind_name.lower().replace(" ", "-").replace("/", "-")
                    ind = db.query(Industry).filter(Industry.name == ind_name).first()
                    if not ind:
                        ind = Industry(id=str(uuid.uuid4()), name=ind_name, slug=ind_slug)
                        db.add(ind)
                        db.flush()
                    industries_map[ind_name] = ind
                industry_objs.append(industries_map[ind_name])
                
            # 4. Product Record
            prod = Product(
                id=item["id"],
                name=item["name"],
                slug=item["slug"],
                company_id=company.id,
                company_name=company.name,
                product_type=item["product_type"],
                tagline=item.get("tagline"),
                description=item["description"],
                official_url=item["official_url"],
                pricing_url=item.get("pricing_url"),
                docs_url=item.get("docs_url"),
                api_docs_url=item.get("api_docs_url"),
                logo_url=item.get("logo_url"),
                open_source_status=item.get("open_source_status", False),
                api_available=item.get("api_available", False),
                free_plan_available=item.get("free_plan_available", False),
                autonomy_level=item.get("autonomy_level"),
                context_window=item.get("context_window"),
                input_token_limit=item.get("input_token_limit"),
                output_token_limit=item.get("output_token_limit"),
                verification_status=item.get("verification_status", "Verified"),
                confidence_score=item.get("confidence_score", 1.0),
                last_verified=datetime.datetime.utcnow()
            )
            prod.categories = category_objs
            prod.industries = industry_objs
            db.add(prod)
            db.flush()
            
            # 5. Business Models
            for bm in item.get("business_models", []):
                db.execute(
                    product_business_models.insert().values(product_id=prod.id, business_model=bm)
                )
                
            # 6. Pricing Plans
            for plan_data in item.get("pricing_plans", []):
                plan = PricingPlan(
                    id=str(uuid.uuid4()),
                    product_id=prod.id,
                    plan_name=plan_data["plan_name"],
                    price=plan_data["price"],
                    currency=plan_data.get("currency", "USD"),
                    billing_period=plan_data.get("billing_period", "monthly"),
                    features_summary=plan_data.get("features_summary"),
                    input_price_per_1m=plan_data.get("input_price_per_1m"),
                    output_price_per_1m=plan_data.get("output_price_per_1m"),
                    source_url=plan_data.get("source_url", prod.official_url)
                )
                db.add(plan)
                
            # 7. Agent Capabilities (if AI Agent)
            if "agent_capabilities" in item and item["agent_capabilities"]:
                caps = item["agent_capabilities"]
                agent_cap = AgentCapabilities(
                    product_id=prod.id,
                    autonomy_level=caps.get("autonomy_level", 1),
                    web_browsing=caps.get("web_browsing", False),
                    code_execution=caps.get("code_execution", False),
                    computer_use=caps.get("computer_use", False),
                    multi_agent=caps.get("multi_agent", False),
                    workflow_automation=caps.get("workflow_automation", False),
                    memory_type=caps.get("memory_type"),
                    human_approval_required=caps.get("human_approval_required", True)
                )
                db.add(agent_cap)
                
            # 8. AI Models
            for m_data in item.get("models", []):
                model_slug = m_data["name"].lower().replace(" ", "-").replace("(", "").replace(")", "")
                existing_model = db.query(AIModel).filter(AIModel.name == m_data["name"]).first()
                if not existing_model:
                    existing_model = AIModel(
                        id=str(uuid.uuid4()),
                        name=m_data["name"],
                        slug=model_slug,
                        provider_id=company.id,
                        model_family=m_data.get("model_family"),
                        context_window=m_data.get("context_window"),
                        input_price_per_1m=m_data.get("input_price_per_1m"),
                        output_price_per_1m=m_data.get("output_price_per_1m"),
                        supports_text=m_data.get("supports_text", True),
                        supports_vision=m_data.get("supports_vision", False),
                        supports_audio=m_data.get("supports_audio", False),
                        supports_video=m_data.get("supports_video", False),
                        supports_reasoning=m_data.get("supports_reasoning", False),
                        supports_tool_calling=m_data.get("supports_tool_calling", False),
                        official_docs_url=prod.docs_url or prod.official_url
                    )
                    db.add(existing_model)
                    db.flush()
                prod.models.append(existing_model)

        db.commit()
        print("Database successfully seeded!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
