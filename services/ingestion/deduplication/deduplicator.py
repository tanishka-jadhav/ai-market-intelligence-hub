import urllib.parse
from difflib import SequenceMatcher
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.schema import Product
from services.ingestion.source_registry.models import DuplicateCandidate
import uuid

class ProductDeduplicator:
    def __init__(self, db: Session):
        self.db = db

    def extract_domain(self, url: str) -> str:
        if not url:
            return ""
        parsed = urllib.parse.urlparse(url.lower().strip())
        domain = parsed.netloc or parsed.path
        if domain.startswith("www."):
            domain = domain[4:]
        return domain.split(":")[0]

    def compute_similarity(self, a: str, b: str) -> float:
        return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()

    def find_duplicate(self, name: str, official_url: str, company_name: str = None) -> tuple[Product | None, float, str]:
        """
        Check existing database for duplicate product candidates.
        Returns tuple: (Matched Product, Similarity Score, Match Reason)
        """
        domain = self.extract_domain(official_url)
        slug = name.lower().replace(" ", "-").replace("/", "-")
        
        # 1. Exact Domain Match
        if domain:
            all_prods = self.db.query(Product).filter(Product.is_deleted == False).all()
            for prod in all_prods:
                if self.extract_domain(prod.official_url) == domain:
                    return prod, 1.0, "EXACT_DOMAIN_MATCH"
                    
        # 2. Exact Name / Slug Match
        existing_slug = self.db.query(Product).filter(
            Product.slug == slug,
            Product.is_deleted == False
        ).first()
        if existing_slug:
            return existing_slug, 1.0, "EXACT_NAME_MATCH"

        # 3. Fuzzy Name & Company Match
        all_prods = self.db.query(Product).filter(Product.is_deleted == False).all()
        best_match = None
        best_score = 0.0
        
        for prod in all_prods:
            sim = self.compute_similarity(name, prod.name)
            if sim > best_score:
                best_score = sim
                best_match = prod

        if best_score >= 0.85 and best_match:
            return best_match, best_score, "FUZZY_NAME_MATCH"
        elif best_score >= 0.65 and best_match:
            # Record duplicate candidate for admin review
            dup = DuplicateCandidate(
                id=str(uuid.uuid4()),
                product_a_id=best_match.id,
                product_b_id="PENDING_NEW",
                similarity_score=best_score,
                reason=f"Fuzzy name similarity ({best_score:.2f}) between '{name}' and '{best_match.name}'",
                status="PENDING"
            )
            self.db.add(dup)
            self.db.commit()

        return None, 0.0, "NO_MATCH"
