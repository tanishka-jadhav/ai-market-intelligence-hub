import uuid
import datetime
import json
import time
import urllib.request
import urllib.parse
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from services.ingestion.crawlers.base_crawler import BaseCrawler

class GitHubAICrawler(BaseCrawler):
    def __init__(self, db: Session):
        super().__init__("GitHub AI Projects", db)
        self.base_api_url = "https://api.github.com/search/repositories"

    def discover_urls(self) -> List[str]:
        # Generate API search query URLs for key AI topics
        topics = [
            "ai-agent", "ai-tool", "llm", "machine-learning", "mcp-server",
            "autonomous-agents", "rag", "langchain", "vector-database",
            "generative-ai", "computer-vision", "nlp", "ai-assistant",
            "deep-learning", "ai-framework", "local-llm", "llama",
            "prompt-engineering", "fine-tuning", "agents", "ai-automation"
        ]
        urls = []
        for topic in topics:
            for page in range(1, 11): # 10 pages x 100 = 1,000 per topic
                url = f"{self.base_api_url}?q=topic:{topic}+stars:>10&sort=stars&order=desc&per_page=100&page={page}"
                urls.append(url)
        return urls

    def extract_products(self, raw_html: str, url: str) -> List[Dict[str, Any]]:
        products = []
        try:
            data = json.loads(raw_html)
            items = data.get("items", [])
            if not isinstance(items, list):
                return products

            for item in items:
                repo_name = item.get("name")
                owner_login = item.get("owner", {}).get("login", "Open Source")
                html_url = item.get("html_url")
                homepage = item.get("homepage")
                description = item.get("description") or f"Open-source AI project {repo_name} developed by {owner_login}."
                stargazers_count = item.get("stargazers_count", 0)
                topics = item.get("topics", [])
                language = item.get("language") or "Python"

                if not repo_name or not html_url:
                    continue

                clean_name = repo_name.replace("-", " ").replace("_", " ").title()
                company_name = owner_login.replace("-", " ").replace("_", " ").title()
                
                # Determine official website: use homepage if present, else fallback to GitHub repository
                official_url = homepage if homepage and homepage.startswith("http") else html_url

                # Classify product type
                product_type = "AI Tool"
                if any(t in topics for t in ["ai-agent", "autonomous-agents", "agent", "agents"]):
                    product_type = "AI Agent"
                elif any(t in topics for t in ["mcp-server", "mcp", "protocol"]):
                    product_type = "AI Infrastructure"
                elif any(t in topics for t in ["llm", "local-llm", "llama", "model"]):
                    product_type = "AI Model"
                elif any(t in topics for t in ["framework", "langchain", "sdk", "library"]):
                    product_type = "AI Platform"

                categories = ["Developer Tools", "Open Source AI"]
                if product_type == "AI Agent":
                    categories.append("Autonomous Agents")
                if language:
                    categories.append(language)
                for t in topics[:3]:
                    cat_title = t.replace("-", " ").title()
                    if cat_title not in categories:
                        categories.append(cat_title)

                prod = {
                    "name": clean_name,
                    "company_name": company_name,
                    "product_type": product_type,
                    "description": f"{clean_name}: {description} ({stargazers_count:,} GitHub stars)",
                    "tagline": f"{product_type} by {company_name} on GitHub",
                    "official_url": official_url,
                    "docs_url": html_url,
                    "open_source": True,
                    "api_available": True,
                    "free_plan": True,
                    "categories": categories[:5],
                    "industries": ["Developer Tools", "Software Engineering", "AI Infrastructure"]
                }
                products.append(prod)
        except Exception as e:
            print(f"[GitHubAICrawler] Extraction error for {url}: {e}")
        return products
