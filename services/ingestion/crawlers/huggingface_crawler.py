import uuid
import datetime
import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from services.ingestion.crawlers.base_crawler import BaseCrawler
from services.ingestion.source_registry.models import SourceRegistry, RawSourcePage

class HuggingFaceCrawler(BaseCrawler):
    def __init__(self, db: Session):
        super().__init__("HuggingFace Models", db)
        self.base_api_url = "https://huggingface.co/api/models"

    def discover_urls(self) -> List[str]:
        # Generate paginated API endpoints for HuggingFace model hub
        urls = []
        # Fetch top models across pipeline tags: text-generation, text2text-generation, automatic-speech-recognition, image-to-text, feature-extraction, translation, etc.
        pipeline_tags = [
            "text-generation", "text2text-generation", "text-classification", "token-classification",
            "image-to-text", "audio-to-audio", "automatic-speech-recognition", "zero-shot-classification",
            "feature-extraction", "fill-mask", "summarization", "translation", "question-answering",
            "text-to-image", "text-to-speech", "text-to-video", "visual-question-answering"
        ]
        for tag in pipeline_tags:
            for page in range(0, 5): # 5 pages of 500 = 2500 per tag
                url = f"{self.base_api_url}?pipeline_tag={tag}&limit=500&sort=downloads&direction=-1&skip={page * 500}"
                urls.append(url)
        return urls

    def extract_products(self, raw_html: str, url: str) -> List[Dict[str, Any]]:
        products = []
        try:
            items = json.loads(raw_html)
            if not isinstance(items, list):
                return products

            for item in items:
                model_id = item.get("id")
                if not model_id or "/" not in model_id:
                    continue

                author, model_name = model_id.split("/", 1)
                pipeline_tag = item.get("pipeline_tag", "AI Model")
                downloads = item.get("downloads", 0)
                likes = item.get("likes", 0)
                tags = item.get("tags", [])

                clean_name = model_name.replace("-", " ").replace("_", " ").title()
                company_name = author.replace("-", " ").replace("_", " ").title()
                official_url = f"https://huggingface.co/{model_id}"

                # Infer open source status & licenses
                is_open_source = True
                license_name = "Open Source"
                for tag in tags:
                    if tag.startswith("license:"):
                        license_name = tag.replace("license:", "").upper()
                        break

                description = f"{clean_name} is a high-performance foundation AI model developed by {company_name} in the {pipeline_tag} category with {downloads:,} downloads and {likes:,} likes on HuggingFace Hub."

                prod = {
                    "name": clean_name,
                    "company_name": company_name,
                    "product_type": "AI Model",
                    "description": description,
                    "tagline": f"{pipeline_tag.replace('-', ' ').title()} Model by {company_name}",
                    "official_url": official_url,
                    "docs_url": official_url,
                    "open_source": is_open_source,
                    "api_available": True,
                    "free_plan": True,
                    "categories": [pipeline_tag.replace("-", " ").title(), "Foundation Models", "Machine Learning"],
                    "industries": ["Developer Tools", "AI Research", "Technology"],
                    "models": [{
                        "name": model_id,
                        "model_family": company_name,
                        "context_window": 128000 if "128k" in model_id.lower() or "llama-3" in model_id.lower() or "mistral" in model_id.lower() else 32768,
                        "supports_text": True,
                        "supports_vision": "vision" in pipeline_tag or "image" in pipeline_tag,
                        "supports_audio": "audio" in pipeline_tag or "speech" in pipeline_tag,
                        "supports_video": "video" in pipeline_tag
                    }]
                }
                products.append(prod)
        except Exception as e:
            print(f"[HuggingFaceCrawler] Extraction error for {url}: {e}")
        return products
