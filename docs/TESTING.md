# AI Market Intelligence Hub - Testing Strategy

## Quality Assurance Methodology

Testing spans multiple automated layers to ensure strict operational stability, factual search speed, and seamless browser UI performance.

---

## 1. Automated Test Suites

### Backend Unit & API Tests (`pytest`)
- **Database Model Tests**: Verify constraints, schema foreign keys, default field behaviors.
- **Search & Filter Tests**: Test trigram full-text search, combined facet queries, and sorting logic.
- **Ingestion Tests**: Verify normalizers, validation logic, confidence scoring, and deduplication engine.
- **Auth & RBAC Tests**: Validate JWT authentication, password hashing, and role permission enforcement.

### Frontend Component & Integration Tests
- **Component Unit Tests**: Validate rendering of Product Cards, Filtering sidebar, Search command, and Comparison matrix.
- **API Integration Tests**: Mock backend response streams to verify client-side data binding and state management.

---

## 2. Browser End-to-End Testing (`browser_subagent`)

Automated browser verification using Antigravity browser tools across critical user flows:

1. **Homepage & Search Navigation**: Verify search bar execution, autocomplete dropdown, hero statistics counter, and category pill navigation.
2. **Explore & Filtering Matrix**: Test combination filters (Category + Price + Business Model + API availability) and ensure responsive card grid rendering.
3. **Product Detail Page**: Verify all 20+ detail fields, official outbound link click redirection, model cards, and documentation links.
4. **Side-by-Side Comparison**: Select 3 products, launch `/compare`, verify difference highlighting and metric alignment.
5. **Admin Portal**: Log in as administrator, view metrics, trigger verification audit, test bulk CSV data import, and inspect change history log.
