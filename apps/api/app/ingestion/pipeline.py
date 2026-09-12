import uuid
import datetime
import hashlib
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.schema import Product, Company, Category, Industry, PricingPlan, ChangeHistory, product_business_models

class DataIngestionPipeline:
    def __init__(self, db: Session):
        self.db = db

    def process_raw_item(self, item: Dict[str, Any], source_url: str = None) -> Product:
        """
        Ingest, normalize, validate, deduplicate, and persist raw product data.
        """
        official_url = item.get("official_url", "").strip()
        name = item.get("name", "").strip()
        
        if not name or not official_url:
            raise ValueError("Product name and official_url are required.")
            
        slug = name.lower().replace(" ", "-").replace("/", "-")
        
        # Deduplication check
        existing = self.db.query(Product).filter(
            (Product.official_url == official_url) | (Product.slug == slug)
        ).first()
        
        comp_name = item.get("company_name", "Independent").strip()
        comp = self.db.query(Company).filter(Company.name == comp_name).first()
        if not comp:
            comp = Company(
                id=str(uuid.uuid4()),
                name=comp_name,
                slug=comp_name.lower().replace(" ", "-"),
                website_url=item.get("company_website", official_url)
            )
            self.db.add(comp)
            self.db.flush()

        # Context Window Normalization (e.g. "128k" -> 128000)
        context_window = item.get("context_window")
        if isinstance(context_window, str):
            cw_str = context_window.lower().replace(",", "").strip()
            if "k" in cw_str:
                context_window = int(float(cw_str.replace("k", "")) * 1000)
            elif "m" in cw_str:
                context_window = int(float(cw_str.replace("m", "")) * 1000000)
            elif cw_str.isdigit():
                context_window = int(cw_str)
            else:
                context_window = None

        if existing:
            # Change detection on existing product
            self._detect_and_log_changes(existing, item, source_url or official_url)
            existing.last_verified = datetime.datetime.utcnow()
            existing.verification_status = "Verified"
            existing.confidence_score = 1.0
            self.db.commit()
            return existing
            
        # Create new product
        prod = Product(
            id=str(uuid.uuid4()),
            name=name,
            slug=slug,
            company_id=comp.id,
            company_name=comp.name,
            product_type=item.get("product_type", "AI Tool"),
            tagline=item.get("tagline"),
            description=item.get("description", "No description provided."),
            official_url=official_url,
            pricing_url=item.get("pricing_url"),
            docs_url=item.get("docs_url"),
            api_docs_url=item.get("api_docs_url"),
            logo_url=item.get("logo_url"),
            open_source_status=bool(item.get("open_source_status", False)),
            api_available=bool(item.get("api_available", False)),
            free_plan_available=bool(item.get("free_plan_available", False)),
            autonomy_level=item.get("autonomy_level"),
            context_window=context_window,
            verification_status="Verified",
            confidence_score=1.0,
            last_verified=datetime.datetime.utcnow()
        )
        self.db.add(prod)
        self.db.flush()
        
        # Link Categories
        for cat_name in item.get("categories", []):
            cat_slug = cat_name.lower().replace(" ", "-")
            cat = self.db.query(Category).filter(Category.name == cat_name).first()
            if not cat:
                cat = Category(id=str(uuid.uuid4()), name=cat_name, slug=cat_slug)
                self.db.add(cat)
                self.db.flush()
            prod.categories.append(cat)

        self.db.commit()
        return prod

    def _detect_and_log_changes(self, existing: Product, new_item: Dict[str, Any], source_url: str):
        fields_to_check = ["tagline", "description", "pricing_url", "context_window"]
        for field in fields_to_check:
            new_val = str(new_item.get(field)) if new_item.get(field) is not None else None
            old_val = str(getattr(existing, field)) if getattr(existing, field) is not None else None
            
            if new_val and old_val and new_val != old_val:
                # Log change record
                ch = ChangeHistory(
                    id=str(uuid.uuid4()),
                    product_id=existing.id,
                    field_name=field,
                    old_value=old_val,
                    new_value=new_val,
                    source_url=source_url,
                    detected_at=datetime.datetime.utcnow(),
                    status="Verified"
                )
                self.db.add(ch)
                setattr(existing, field, new_item.get(field))
