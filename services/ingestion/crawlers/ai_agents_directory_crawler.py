import re
import json
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from .base_crawler import BaseCrawler

class AIAgentsDirectoryCrawler(BaseCrawler):
    def __init__(self, db):
        super().__init__("AI Agents Directory", db)

    def discover_urls(self) -> List[str]:
        sitemap_url = "https://aiagentsdirectory.com/sitemap.xml"
        urls = []
        try:
            raw_xml = self.fetch_page(sitemap_url)
            root = ET.fromstring(raw_xml)
            for elem in root.iter():
                if elem.tag.endswith('loc') and elem.text:
                    if '/agent/' in elem.text or '/tools/' in elem.text:
                        urls.append(elem.text)
        except Exception:
            urls = ["https://aiagentsdirectory.com/"]
        return urls or ["https://aiagentsdirectory.com/"]

    def extract_products(self, raw_html: str, url: str) -> List[Dict[str, Any]]:
        products = []
        json_ld_matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw_html, re.DOTALL)
        for match in json_ld_matches:
            try:
                data = json.loads(match.strip())
                if isinstance(data, dict) and data.get("name"):
                    products.append({
                        "name": data.get("name"),
                        "description": data.get("description", "Autonomous AI agent system"),
                        "official_url": data.get("url") or url,
                        "product_type": "AI Agent",
                        "autonomy_level": 4
                    })
            except Exception:
                pass
                
        if not products:
            title_match = re.search(r'<title>(.*?)</title>', raw_html, re.IGNORECASE)
            if title_match:
                name = title_match.group(1).split('-')[0].split('|')[0].strip()
                products.append({
                    "name": name,
                    "description": "Autonomous AI Agent platform",
                    "official_url": url,
                    "product_type": "AI Agent"
                })
        return products
