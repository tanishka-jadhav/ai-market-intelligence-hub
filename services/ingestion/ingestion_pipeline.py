import uuid
import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.schema import Product, Company, Category, Industry, PricingPlan
from services.ingestion.deduplication.deduplicator import ProductDeduplicator
from services.ingestion.verification.official_verifier import OfficialWebsiteVerifier

class CompleteIngestionPipeline:
    def __init__(self, db: Session):
        self.db = db
        self.deduplicator = ProductDeduplicator(db)
        self.verifier = OfficialWebsiteVerifier(db)

    def process_candidate(self, candidate: Dict[str, Any]) -> Product:
        name = candidate.get("name", "").strip()
        official_url = candidate.get("official_url", "").strip()
        
        if not name or not official_url:
            raise ValueError("Product candidate missing name or official_url.")

        # 1. Deduplication check
        matched_prod, sim_score, match_reason = self.deduplicator.find_duplicate(name, official_url)
        
        if matched_prod and sim_score >= 0.85:
            # Merge / Update timestamp
            matched_prod.last_verified = datetime.datetime.utcnow()
            self.db.commit()
            return matched_prod

        # 2. Company Normalization
        comp_name = candidate.get("company_name", candidate.get("company", "Independent")).strip()
        comp = self.db.query(Company).filter(Company.name == comp_name).first()
        if not comp:
            comp = Company(
                id=str(uuid.uuid4()),
                name=comp_name,
                slug=comp_name.lower().replace(" ", "-"),
                website_url=official_url
            )
            self.db.add(comp)
            self.db.flush()

        slug = name.lower().replace(" ", "-").replace("/", "-")
        
        # 3. Create Product Record
        prod = Product(
            id=str(uuid.uuid4()),
            name=name,
            slug=slug,
            company_id=comp.id,
            company_name=comp.name,
            product_type=candidate.get("product_type", "AI Tool"),
            tagline=candidate.get("tagline"),
            description=candidate.get("description", "AI software solution."),
            official_url=official_url,
            pricing_url=candidate.get("pricing_url"),
            docs_url=candidate.get("docs_url"),
            open_source_status=bool(candidate.get("open_source", False)),
            api_available=bool(candidate.get("api_available", False)),
            free_plan_available=bool(candidate.get("free_plan", False)),
            autonomy_level=candidate.get("autonomy_level"),
            context_window=candidate.get("context_window"),
            verification_status="Verified",
            confidence_score=0.9,
            last_verified=datetime.datetime.utcnow()
        )
        self.db.add(prod)
        self.db.commit()
        return prod
