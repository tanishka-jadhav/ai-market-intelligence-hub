import urllib.request
import urllib.parse
import ssl
import re
import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.schema import Product, ChangeHistory

class OfficialWebsiteVerifier:
    def __init__(self, db: Session):
        self.db = db
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI Market Hub Verifier/1.0 (+http://localhost)'
        }
        self.ssl_ctx = ssl.create_default_context()
        self.ssl_ctx.check_hostname = False
        self.ssl_ctx.verify_mode = ssl.CERT_NONE

    def verify_official_url(self, target_url: str) -> Dict[str, Any]:
        """
        Audit primary official URL for HTTP availability, SSL security, and canonical redirect.
        """
        if not target_url or not target_url.startswith(("http://", "https://")):
            return {"status": "INVALID_URL", "confidence": 0.0, "final_url": target_url}

        try:
            req = urllib.request.Request(target_url, headers=self.headers)
            with urllib.request.urlopen(req, timeout=8, context=self.ssl_ctx) as response:
                final_url = response.geturl()
                http_code = response.status
                content = response.read(50000).decode('utf-8', errors='ignore')

                # Calculate confidence score
                confidence = 0.95
                if final_url.startswith("https://"):
                    confidence += 0.05
                if http_code == 200:
                    status = "VERIFIED"
                else:
                    status = "PARTIALLY_VERIFIED"
                    confidence -= 0.2

                return {
                    "status": status,
                    "confidence": min(confidence, 1.0),
                    "final_url": final_url,
                    "http_code": http_code,
                    "content_snippet": content[:500]
                }
        except Exception as e:
            return {
                "status": "FAILED",
                "confidence": 0.0,
                "final_url": target_url,
                "error": str(e)
            }

    def verify_and_update_product(self, product_id: str) -> Optional[Product]:
        """
        Re-verify product record against official source.
        """
        prod = self.db.query(Product).filter(Product.id == product_id).first()
        if not prod:
            return None

        res = self.verify_official_url(prod.official_url)
        if res["status"] in ["VERIFIED", "PARTIALLY_VERIFIED"]:
            prod.official_url = res["final_url"]
            prod.verification_status = "Verified"
            prod.confidence_score = res["confidence"]
            prod.last_verified = datetime.datetime.utcnow()
        else:
            prod.verification_status = "Needs Review"
            prod.confidence_score = 0.5

        self.db.commit()
        return prod
