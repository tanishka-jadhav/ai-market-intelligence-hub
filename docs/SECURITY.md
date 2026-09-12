# AI Market Intelligence Hub - Security Architecture

## Core Security Controls

### 1. Authentication & Role-Based Access Control (RBAC)
- Admin endpoints protected via JWT Bearer Tokens with `HS256`/`RS256` signatures.
- Password hashing utilizing `bcrypt` (work factor 12).
- Role Permissions:
  - **`SuperAdmin`**: Full system access, CRUD, admin user management, DB operations.
  - **`Editor`**: Product CRUD, duplicate merging, verification status updates.
  - **`Viewer` / Public**: Read-only product discovery, search, comparison, and outbound link click execution.

### 2. Defensive Controls
- **SQL Injection Prevention**: All queries parameterized via SQLAlchemy ORM / AsyncPG parameterized statements.
- **Cross-Site Scripting (XSS)**: Next.js JSX automatic escaping + strict HTML sanitization on product description inputs.
- **Cross-Site Request Forgery (CSRF)**: Anti-CSRF token verification on state-modifying requests.
- **Outbound Link Redirect Security**: Official outbound redirects routed through `/api/v1/redirect` with URL scheme validation (`http://` / `https://` only) to prevent open-redirect vulnerabilities.

### 3. Rate Limiting & Resource Protection
- API endpoints rate-limited using Token Bucket algorithm (e.g. 100 requests / minute for public search, 10 requests / minute for auth endpoints).
- Request payload size limits enforced (Max 2MB for JSON payloads, 10MB for bulk CSV import files).

### 4. Secrets & Configuration Management
- Zero committed secrets or API keys.
- Environment variables loaded via `.env` / Pydantic `BaseSettings`.
- `.env.example` committed with dummy placeholder keys.
