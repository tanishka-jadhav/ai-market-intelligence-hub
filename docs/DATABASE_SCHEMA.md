# AI Market Intelligence Hub - Database Schema Documentation

## Database Entity Relationship Overview

The schema is built on a fully normalized relational structure (3NF) designed for high concurrency, scalable filtering, search speed, and complete field-level data provenance.

---

## Complete Table Specifications

### 1. `products`
Primary table cataloging every AI Product, Agent, Tool, Platform, SaaS, or Model.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` / `VARCHAR(36)` | PRIMARY KEY | Unique Product Identifier |
| `name` | `VARCHAR(255)` | NOT NULL | Official Product Name |
| `slug` | `VARCHAR(255)` | UNIQUE, INDEX | URL-friendly slug (e.g., `claude`, `chatgpt`) |
| `tagline` | `VARCHAR(500)` | NULLABLE | Concise value proposition |
| `description` | `TEXT` | NOT NULL | Detailed description of features and utility |
| `company_id` | `VARCHAR(36)` | FOREIGN KEY -> `companies.id` | Producing organization |
| `product_type` | `VARCHAR(50)` | NOT NULL, INDEX | `AI Agent`, `AI Tool`, `AI Model`, `AI Platform`, `AI API`, `AI SaaS`, etc. |
| `official_url` | `TEXT` | NOT NULL | Verified official website landing page |
| `pricing_url` | `TEXT` | NULLABLE | Official pricing page link |
| `docs_url` | `TEXT` | NULLABLE | Official documentation page link |
| `api_docs_url` | `TEXT` | NULLABLE | Official API reference link |
| `logo_url` | `TEXT` | NULLABLE | Official logo image URL |
| `open_source_status` | `BOOLEAN` | DEFAULT FALSE, INDEX | Is product source code or weights open? |
| `api_available` | `BOOLEAN` | DEFAULT FALSE, INDEX | Does product offer an API? |
| `free_plan_available`| `BOOLEAN` | DEFAULT FALSE, INDEX | Is there a perpetual free tier? |
| `autonomy_level` | `INTEGER` | NULLABLE | For AI Agents: 1 (Assisted) to 5 (Full Autonomous) |
| `context_window` | `INTEGER` | NULLABLE, INDEX | Max context length in tokens (e.g. 128000, 2000000) |
| `input_token_limit` | `INTEGER` | NULLABLE | Maximum allowed input tokens |
| `output_token_limit`| `INTEGER` | NULLABLE | Maximum allowed output tokens |
| `verification_status`| `VARCHAR(30)`| DEFAULT 'Verified', INDEX | `Verified`, `Partially Verified`, `Needs Review`, `Stale`, `Deprecated` |
| `confidence_score` | `FLOAT` | DEFAULT 1.0 | Data confidence score (0.00 to 1.00) |
| `last_verified` | `TIMESTAMP` | NOT NULL, INDEX | Date/time of last official audit |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Record last update timestamp |
| `is_deleted` | `BOOLEAN` | DEFAULT FALSE, INDEX | Soft delete flag |

---

### 2. `companies`
Stores AI developers, research labs, and parent companies.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | Unique identifier |
| `name` | `VARCHAR(255)` | NOT NULL, UNIQUE | Company name (e.g. Anthropic, OpenAI, Google) |
| `slug` | `VARCHAR(255)` | UNIQUE, INDEX | URL slug |
| `website_url` | `TEXT` | NOT NULL | Official company homepage |
| `country` | `VARCHAR(100)` | NULLABLE | HQ Country |
| `founded_year` | `INTEGER` | NULLABLE | Year founded |

---

### 3. `categories` & `product_categories`
Taxonomy table for hierarchical domain classification.

```sql
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id VARCHAR(36) REFERENCES categories(id)
);

CREATE TABLE product_categories (
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    category_id VARCHAR(36) REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);
```

---

### 4. `industries` & `product_industries`
Industry sector mapping (BFSI, Healthcare, Legal, Retail, Software, etc.).

```sql
CREATE TABLE industries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE product_industries (
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    industry_id VARCHAR(36) REFERENCES industries(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, industry_id)
);
```

---

### 5. `business_models` & `product_business_models`
Business engagement classifications (B2B, B2C, Enterprise, Developer, Open Source, API, Freemium).

```sql
CREATE TABLE product_business_models (
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    business_model VARCHAR(50) NOT NULL, -- B2B, B2C, C2C, D2C, Enterprise, Developer, Open Source, API, Freemium
    PRIMARY KEY (product_id, business_model)
);
```

---

### 6. `pricing_plans`
Detailed structured pricing records.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY |
| `product_id` | `VARCHAR(36)` | FOREIGN KEY -> `products.id` |
| `plan_name` | `VARCHAR(100)` | Plan Tier Name (e.g. Free, Pro, Enterprise, API Pay-As-You-Go) |
| `price` | `NUMERIC(10, 2)` | Monthly cost (0.00 if Free) |
| `currency` | `VARCHAR(10)` | USD, EUR, etc. |
| `billing_period` | `VARCHAR(20)` | `monthly`, `annual`, `one-time`, `usage_based` |
| `free_trial_days` | `INTEGER` | Days of free trial (if any) |
| `features_summary` | `TEXT` | Bullet summary of features included |
| `input_price_per_1m` | `NUMERIC(10, 4)`| API cost per 1M input tokens |
| `output_price_per_1m`| `NUMERIC(10, 4)`| API cost per 1M output tokens |
| `source_url` | `TEXT` | Verification URL for pricing source |
| `last_verified` | `TIMESTAMP` | Timestamp of pricing verification |

---

### 7. `models` & `product_models`
First-class AI Model entities linked to parent providers and supporting products.

```sql
CREATE TABLE models (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    provider_id VARCHAR(36) REFERENCES companies(id),
    model_family VARCHAR(100), -- e.g. Claude 3.5, GPT-4, Llama 3
    release_date DATE,
    context_window INTEGER,
    input_token_limit INTEGER,
    output_token_limit INTEGER,
    input_price_per_1m NUMERIC(10, 4),
    output_price_per_1m NUMERIC(10, 4),
    supports_text BOOLEAN DEFAULT TRUE,
    supports_vision BOOLEAN DEFAULT FALSE,
    supports_audio BOOLEAN DEFAULT FALSE,
    supports_video BOOLEAN DEFAULT FALSE,
    supports_reasoning BOOLEAN DEFAULT FALSE,
    supports_tool_calling BOOLEAN DEFAULT FALSE,
    supports_structured_output BOOLEAN DEFAULT FALSE,
    api_available BOOLEAN DEFAULT TRUE,
    official_docs_url TEXT,
    last_verified TIMESTAMP NOT NULL
);

CREATE TABLE product_models (
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    model_id VARCHAR(36) REFERENCES models(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, model_id)
);
```

---

### 8. `agent_capabilities`
Specialized attributes for AI Agents.

| Column | Type | Description |
| :--- | :--- | :--- |
| `product_id` | `VARCHAR(36)` | PRIMARY KEY, FOREIGN KEY -> `products.id` |
| `autonomy_level` | `INTEGER` | Level 1-5 |
| `web_browsing` | `BOOLEAN` | Can browse external web |
| `code_execution` | `BOOLEAN` | Can execute sandbox code |
| `computer_use` | `BOOLEAN` | Can interact with desktop UI |
| `multi_agent` | `BOOLEAN` | Supports multi-agent collaboration |
| `workflow_automation`| `BOOLEAN` | Can execute scheduled workflows |
| `memory_type` | `VARCHAR(100)` | e.g. Long-term vector memory, Ephemeral |
| `human_approval_required`| `BOOLEAN` | Requires human sign-off before action |

---

### 9. `change_history` & `verification_records`
Audit trail logging every metric shift.

```sql
CREATE TABLE change_history (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    source_url TEXT NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'Verified' -- Verified, Pending Review, Rejected
);

CREATE TABLE outbound_clicks (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referrer_page VARCHAR(255),
    user_agent TEXT
);
```

---

## Recommended Database Indexes
```sql
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_status ON products(verification_status);
CREATE INDEX idx_products_last_verified ON products(last_verified);
CREATE INDEX idx_products_context_window ON products(context_window);
CREATE INDEX idx_products_fts ON products USING gin(to_tsvector('english', name || ' ' || tagline || ' ' || description));
```
