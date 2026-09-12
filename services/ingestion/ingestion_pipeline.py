import uuid
import datetime
import re
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.schema import (
    Product, Company, Category, Industry, PricingPlan, AIModel, product_business_models
)
from services.ingestion.deduplication.deduplicator import ProductDeduplicator
from services.ingestion.verification.official_verifier import OfficialWebsiteVerifier

class CompleteIngestionPipeline:
    def __init__(self, db: Session):
        self.db = db
        self.deduplicator = ProductDeduplicator(db)
        self.verifier = OfficialWebsiteVerifier(db)
        self.categories_map = {}
        self.industries_map = {}
        self.companies_map = {}

    def _get_or_create_category(self, cat_name: str) -> Category:
        cat_name = cat_name.strip().title()
        if cat_name in self.categories_map:
            return self.categories_map[cat_name]
        
        slug = cat_name.lower().replace(" ", "-").replace("/", "-")
        cat = self.db.query(Category).filter(Category.name == cat_name).first()
        if not cat:
            cat = Category(id=str(uuid.uuid4()), name=cat_name, slug=slug)
            self.db.add(cat)
            self.db.flush()
        self.categories_map[cat_name] = cat
        return cat

    def _get_or_create_industry(self, ind_name: str) -> Industry:
        ind_name = ind_name.strip().title()
        if ind_name in self.industries_map:
            return self.industries_map[ind_name]
        
        slug = ind_name.lower().replace(" ", "-").replace("/", "-")
        ind = self.db.query(Industry).filter(Industry.name == ind_name).first()
        if not ind:
            ind = Industry(id=str(uuid.uuid4()), name=ind_name, slug=slug)
            self.db.add(ind)
            self.db.flush()
        self.industries_map[ind_name] = ind
        return ind

    def _get_or_create_company(self, comp_name: str, official_url: str) -> Company:
        comp_name = comp_name.strip() or "Independent"
        if comp_name in self.companies_map:
            return self.companies_map[comp_name]
        
        slug = comp_name.lower().replace(" ", "-").replace(".", "")
        comp = self.db.query(Company).filter(Company.name == comp_name).first()
        if not comp:
            comp = Company(
                id=str(uuid.uuid4()),
                name=comp_name,
                slug=slug[:250],
                website_url=official_url
            )
            self.db.add(comp)
            self.db.flush()
        self.companies_map[comp_name] = comp
        return comp

    def process_candidate(self, candidate: Dict[str, Any]) -> Product:
        name = candidate.get("name", "").strip()
        official_url = candidate.get("official_url", "").strip()
        
        if not name or not official_url:
            return None

        # 1. Clean & Normalize Slug
        slug = re.sub(r'[^a-zA-Z0-9\-]', '', name.lower().replace(" ", "-").replace("/", "-"))
        if not slug:
            slug = str(uuid.uuid4())[:8]

        # 2. Fast Deduplication check by slug or official URL
        existing_prod = self.db.query(Product).filter(
            (Product.slug == slug) | (Product.official_url == official_url)
        ).first()

        if existing_prod:
            existing_prod.last_verified = datetime.datetime.utcnow()
            return existing_prod

        # 3. Company Normalization
        comp_name = candidate.get("company_name", "Independent").strip()
        company = self.new_company = self._get_or_create_company(comp_name, official_url)

        # 4. Categories & Industries
        category_objs = [self._get_or_create_category(c) for c in candidate.get("categories", ["AI Tools"])]
        industry_objs = [self._get_or_create_industry(i) for i in candidate.get("industries", ["Technology"])]

        # 5. Create Product Record
        prod = Product(
            id=str(uuid.uuid4()),
            name=name[:255],
            slug=slug[:255],
            company_id=company.id,
            company_name=company.name,
            product_type=candidate.get("product_type", "AI Tool"),
            tagline=candidate.get("tagline", f"{name} AI solution")[:500],
            description=candidate.get("description", "AI product.")[:5000],
            official_url=official_url,
            pricing_url=candidate.get("pricing_url"),
            docs_url=candidate.get("docs_url"),
            open_source_status=bool(candidate.get("open_source", False)),
            api_available=bool(candidate.get("api_available", False)),
            free_plan_available=bool(candidate.get("free_plan", True)),
            autonomy_level=candidate.get("autonomy_level"),
            context_window=candidate.get("context_window"),
            verification_status="Verified",
            confidence_score=0.9,
            last_verified=datetime.datetime.utcnow()
        )
        prod.categories = category_objs
        prod.industries = industry_objs
        self.db.add(prod)
        self.db.flush()

        # 6. Default Freemium / Open Source pricing plan
        pricing_name = "Free Tier" if candidate.get("open_source") or candidate.get("free_plan") else "Standard Plan"
        plan = PricingPlan(
            id=str(uuid.uuid4()),
            product_id=prod.id,
            plan_name=pricing_name,
            price=0.00 if candidate.get("open_source") else 10.00,
            currency="USD",
            billing_period="monthly",
            features_summary="Access to core features and APIs.",
            source_url=official_url
        )
        self.db.add(plan)

        # 7. AI Model record if candidate has models
        for m_data in candidate.get("models", []):
            model_name = m_data.get("name", name)
            model_slug = re.sub(r'[^a-zA-Z0-9\-]', '', model_name.lower().replace(" ", "-"))
            existing_model = self.db.query(AIModel).filter(AIModel.name == model_name).first()
            if not existing_model:
                existing_model = AIModel(
                    id=str(uuid.uuid4()),
                    name=model_name[:255],
                    slug=model_slug[:255],
                    provider_id=company.id,
                    model_family=m_data.get("model_family", company.name),
                    context_window=m_data.get("context_window", 32768),
                    supports_text=m_data.get("supports_text", True),
                    supports_vision=m_data.get("supports_vision", False),
                    supports_audio=m_data.get("supports_audio", False),
                    supports_video=m_data.get("supports_video", False)
                )
                self.db.add(existing_model)
                self.db.flush()
            prod.models.append(existing_model)

        return prod
