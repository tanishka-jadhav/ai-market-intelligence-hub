import uuid
import datetime
import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from services.ingestion.crawlers.base_crawler import BaseCrawler

class PyPIAICrawler(BaseCrawler):
    def __init__(self, db: Session):
        super().__init__("PyPI AI Packages", db)

    def discover_urls(self) -> List[str]:
        # Top AI/ML keywords on PyPI search
        keywords = [
            "ai", "llm", "agent", "gpt", "rag", "langchain", "transformers", "openai",
            "anthropic", "crewai", "autogen", "mcp", "vector", "embedding", "vllm",
            "ollama", "mistral", "whisper", "diffusers", "stable-diffusion", "fastapi-ai"
        ]
        urls = []
        for kw in keywords:
            for page in range(1, 10): # 10 pages per keyword
                url = f"https://pypi.org/search/?q={kw}&page={page}"
                urls.append(url)
        return urls

    def extract_products(self, raw_html: str, url: str) -> List[Dict[str, Any]]:
        products = []
        import re
        # Parse package snippets from HTML search results
        snippets = re.findall(r'<a class="package-snippet" href="(/project/[^/]+/)">.*?<span class="package-snippet__name">(.*?)</span>.*?<p class="package-snippet__description">(.*?)</p>', raw_html, re.DOTALL)
        for path, name, desc in snippets:
            clean_name = name.strip().replace("-", " ").replace("_", " ").title()
            official_url = f"https://pypi.org{path.strip()}"
            description = desc.strip() or f"Python AI package {name.strip()} available on PyPI."
            
            prod = {
                "name": clean_name,
                "company_name": "PyPI Open Source",
                "product_type": "AI Framework" if "framework" in description.lower() or "sdk" in description.lower() else "AI Tool",
                "description": description,
                "tagline": f"Python AI Package {clean_name}",
                "official_url": official_url,
                "docs_url": official_url,
                "open_source": True,
                "api_available": True,
                "free_plan": True,
                "categories": ["Developer Tools", "Python AI SDKs", "Machine Learning"],
                "industries": ["Developer Tools", "Data Science"]
            }
            products.append(prod)
        return products
