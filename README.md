# AI Market Intelligence Hub 🚀

> Centralized enterprise platform discovering, cataloging, categorizing, searching, comparing, and monitoring 10,000+ AI tools, autonomous AI agents, AI models, AI platforms, and AI SaaS products across global markets.

---

## 🌟 Architecture & Features

- **Scalable 10,000+ Product Architecture**: Dual-engine PostgreSQL & SQLite relational database with normalized schema.
- **Factual Integrity & Data Provenance**: Zero fabricated prices, token limits, or URLs. Every dynamic record tracks `source_url`, `last_verified`, `verification_status`, and `confidence_score`.
- **Side-by-Side Comparison Matrix (`/compare`)**: Compare specs, context windows, 1M token input/output pricing, models, and features with difference highlighting.
- **Autonomous AI Agent Directory (`/agents`)**: Autonomy Levels 1-5 matrix tracking web browsing, code execution, computer use, and multi-agent delegation.
- **AI Model Registry (`/models`)**: Foundation & SLM registry tracking context window lengths (e.g. 200k, 2M tokens) and multimodal capabilities.
- **Data Ingestion & Verification Engine (`services/ingestion/`)**: Multi-source crawlers, raw snapshot store, deduplication engine, and primary domain verifier.
- **Official Redirect System**: Secure outbound redirect handler (`/api/v1/redirect`) logging telemetry before forwarding to verified official product sites.
- **Admin Governance Portal (`/admin`)**: Metric analytics, full verification sweep trigger, bulk dataset CSV/JSON import, and JSON export.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend API**: Python FastAPI (REST API), Pydantic 2.0 validation
- **Database / ORM**: PostgreSQL / SQLite, SQLAlchemy 2.0 ORM
- **Ingestion Pipeline**: Python BeautifulSoup, JSON-LD Extractor, Levenshtein Deduplicator, HTTP Verifier

---

## 🚀 Quickstart & Local Setup

### 1. Backend Server (FastAPI)
```bash
# Install Python dependencies
pip install -r apps/api/requirements.txt

# Seed database
python database/seed.py

# Run FastAPI backend API (port 8000)
python scripts/run_backend.py
```

### 2. Frontend Web Application (Next.js)
```bash
# Navigate to web app
cd apps/web

# Install node packages
npm install

# Run Next.js dev server (port 3000)
npm run dev
```

---

## 🧪 Testing & Verification

```bash
# Run Backend PyTest Suite
python apps/api/tests/test_api.py

# Run Frontend Type Check
cd apps/web && npx tsc --noEmit

# Run Next.js Production Build
cd apps/web && npm run build
```

---

## ☁️ Deployment (GitHub & Vercel)

1. Push repository to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR_USER>/ai-market-intelligence-hub.git
   git branch -M main
   git push -u origin main
   ```
2. Connect repository on [Vercel Dashboard](https://vercel.com).
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://<YOUR_API_DOMAIN>/api/v1`
