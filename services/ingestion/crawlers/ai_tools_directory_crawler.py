import re
import json
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from .base_crawler import BaseCrawler

class AIToolsDirectoryCrawler(BaseCrawler):
    def __init__(self, db):
        super().__init__("AI Tools Directory", db)

    def discover_urls(self) -> List[str]:
        # Sitemap discovery
        sitemap_url = "https://ai-tools.directory/sitemap.xml"
        urls = []
        try:
            raw_xml = self.fetch_page(sitemap_url)
            root = ET.fromstring(raw_xml)
            for elem in root.iter():
                if elem.tag.endswith('loc') and elem.text:
                    if '/tool/' in elem.text or '/tools/' in elem.text:
                        urls.append(elem.text)
        except Exception:
            # Fallback catalog endpoints
            urls = ["https://ai-tools.directory/tools"]
        return urls or ["https://ai-tools.directory/"]

    def extract_products(self, raw_html: str, url: str) -> List[Dict[str, Any]]:
        products = []
        # JSON-LD extraction
        json_ld_matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw_html, re.DOTALL)
        for match in json_ld_matches:
            try:
                data = json.loads(match.strip())
                if isinstance(data, dict) and data.get("@type") in ["SoftwareApplication", "Product"]:
                    products.append({
                        "name": data.get("name"),
                        "description": data.get("description"),
                        "official_url": data.get("url") or url,
                        "category": data.get("applicationCategory"),
                        "pricing_type": data.get("offers", {}).get("price") if isinstance(data.get("offers"), dict) else "Freemium"
                    })
            except Exception:
                pass
                
        # Regex / Microdata HTML fallback
        if not products:
            title_match = re.search(r'<title>(.*?)</title>', raw_html, re.IGNORECASE)
            desc_match = re.search(r'<meta name="description" content="(.*?)"', raw_html, re.IGNORECASE)
            if title_match:
                name = title_match.group(1).split('|')[0].split('-')[0].strip()
                desc = desc_match.group(1).strip() if desc_match else "AI software application"
                products.append({
                    "name": name,
                    "description": desc,
                    "official_url": url,
                    "product_type": "AI Tool"
                })
        return products
