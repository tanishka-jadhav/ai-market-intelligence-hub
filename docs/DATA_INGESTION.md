# AI Market Intelligence Hub - Data Ingestion Architecture

## Data Pipeline Architecture

The **Data Ingestion Engine** is designed to continuously scale the catalog from hundreds of initial seed products to 10,000+ AI tools, agents, platforms, and models without manual data entry.

```
+------------------+
| Official APIs    |---+
+------------------+   |
| Public Webpages  |---|   +-------------------+   +--------------------+   +--------------------+
+------------------+   |-->| Source Collector  |-->| Normalizer &       |-->| Deduplication      |
| Official Docs    |---|   | Pipeline          |   | Validator Engine   |   | Engine             |
+------------------+   |   +-------------------+   +--------------------+   +--------------------+
| Admin CSV/JSON   |---+                                                               |
+------------------+                                                                   v
                                                                            +--------------------+
                                                                            | Database Ingestion |
                                                                            | & Search Index     |
                                                                            +--------------------+
```

---

## Pipeline Stages

### Stage 1: Multi-Source Collection (`Source Collector`)
- **Official APIs**: GitHub Releases API, Model Registries, Official Product Endpoints.
- **Official Web Documents**: Public pricing pages, product documentation, official blogs.
- **Bulk Data Imports**: CSV / JSON files uploaded by administrators with strict schema validation.
- **Rate-Limiting & Compliance**: Strict adherence to `robots.txt`, request throttling, custom User-Agent headers, and API key management.

### Stage 2: Data Normalization (`Normalizer`)
- Standardizes raw string values into strict platform primitives:
  - Token counts: Conversions from `128k`, `1.5M`, `200000` to standard integer `128000`, `1500000`, `200000`.
  - Pricing: Standardizes currency to USD, periodic billings to normalized monthly / annual rates.
  - Modalities & Capabilities: Mapping synonyms (`coding`, `code generation`, `programming`) to standard tags (`Coding`).

### Stage 3: Validation & Quality Control (`Validator`)
- **Factual Guarantee**: Records missing `source_url` or `official_url` are rejected.
- **Schema Validation**: Verified against Pydantic schemas. Mandatory fields must pass strict type constraints.
- **Data Confidence Scoring**:
  $$\text{Confidence Score} = W_{\text{source}} \times (1 - D_{\text{decay}})$$
  Where $W_{\text{source}}$ is source weight (Official Domain = 1.0, Official Docs = 0.9, Directory = 0.6) and $D_{\text{decay}}$ is age decay past 30 days.

### Stage 4: Deduplication (`Deduplicator`)
- Detects potential duplicates using:
  1. Exact Domain Match (`official_url` hostname comparison).
  2. Company + Product Name exact match.
  3. Normalized name slug comparison.
  4. Trigram Levenshtein string distance (> 0.85 similarity score).
- Actions: Auto-merge verified non-conflicting attributes or push flag to `admin_duplicate_queue` for admin review.

---

## Batch Import Schema (CSV/JSON)

Supported bulk format for seeding or administrative updates:

```json
[
  {
    "name": "Claude 3.5 Sonnet",
    "company_name": "Anthropic",
    "product_type": "AI Model",
    "tagline": "Most intelligent model for reasoning, coding, and multi-step tasks",
    "description": "Claude 3.5 Sonnet sets new industry benchmarks for reasoning, coding, and vision analysis.",
    "official_url": "https://www.anthropic.com/claude",
    "pricing_url": "https://www.anthropic.com/pricing",
    "docs_url": "https://docs.anthropic.com/",
    "api_available": true,
    "free_plan_available": true,
    "context_window": 200000,
    "input_token_limit": 200000,
    "output_token_limit": 8192,
    "input_price_per_1m": 3.00,
    "output_price_per_1m": 15.00,
    "categories": ["AI Models", "Developer Tools", "Coding", "Writing"],
    "industries": ["Software", "Research", "BFSI", "Healthcare"],
    "business_models": ["B2B", "Developer", "API", "Freemium"],
    "source_url": "https://www.anthropic.com/claude",
    "last_verified": "2026-09-12T00:00:00Z"
  }
]
```
