# AI Market Intelligence Hub — Data Source Health Status

## Active Ingestion Source Registry

| Source Name | Source Type | Base URL | Crawl Status | Products Discovered | Last Crawled | Compliance / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HuggingFace Models** | API | `https://huggingface.co/api/models` | **ACTIVE** | 11,874 | Today | Public API. Compliant with rate limits. |
| **GitHub AI Projects** | API | `https://api.github.com/search/repositories` | **ACTIVE** | 101 | Today | Public REST API. Rate limits respected via exponential backoff. |
| **PyPI AI Packages** | DIRECTORY | `https://pypi.org/search/` | **ACTIVE** | 500+ | Today | Public HTML index parsing. |
| **Futurepedia** | DIRECTORY | `https://www.futurepedia.io/` | **ACTIVE** | 100+ | Today | XML Sitemap discovery. |
| **AI Agent Tools** | DIRECTORY | `https://aiagenttools.dev/` | **ACTIVE** | 100+ | Today | XML Sitemap discovery. |
| **AI Tools Directory** | DIRECTORY | `https://ai-tools.directory/` | **ACTIVE** | 100+ | Today | XML Sitemap discovery. |
| **Tooliverse** | DIRECTORY | `https://tooliverse.ai/` | **ACTIVE** | 100+ | Today | XML Sitemap discovery. |
| **TopAI.tools** | DIRECTORY | `https://topai.tools/` | **BLOCKED** | 0 | - | Cloudflare HTTP 403 anti-bot protection. Marked MANUAL_REQUIRED per compliance rules. |
| **Toolsify** | DIRECTORY | `https://toolsify.ai/` | **ACTIVE** | 50+ | Today | XML Sitemap discovery. |
| **AI Agents Directory** | DIRECTORY | `https://aiagentsdirectory.com/` | **ACTIVE** | 50+ | Today | XML Sitemap discovery. |

---

## Health Monitoring & SLA
* **Crawler Status**: All active sources operating normally.
* **Database WAL Mode**: Enabled (`PRAGMA journal_mode=WAL;`) with 60s timeout for concurrent read/write throughput.
* **Error Rate**: 0% on active APIs.
