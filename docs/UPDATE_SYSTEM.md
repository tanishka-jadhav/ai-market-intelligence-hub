# AI Market Intelligence Hub - Automatic Update & Verification System

## Monitoring & Update Architecture

AI tools, models, token limits, and pricing evolve rapidly. The **Update System** tracks field-level alterations, ensures data freshness, and logs complete audit trails.

---

## Verification Status Lifecycles

Every product and model record maintains one of five canonical statuses:

1. **`Verified`** ($\checkmark$): Verified against official sources within the last 30 days. High confidence ($\ge 0.90$).
2. **`Partially Verified`**: Core product details verified, but secondary fields (e.g. detailed enterprise SLA) require confirmation ($0.70 - 0.89$).
3. **`Needs Review`** ($\Delta$): Automated system detected dynamic field drift or source structural changes ($< 0.70$).
4. **`Stale`** ($\Delta$): Product verification timestamp exceeds 30 days without re-verification.
5. **`Deprecated`** ($\times$): Official service has sunset or shutdown.

---

## Automated Verification Cron Schedule

```
+-------------------------------------------------------------------+
| DAILY JOBS: High-Frequency Re-Verification                       |
| - Verify pricing models for top 100 featured products & models.   |
| - Check official URL HTTP response codes (Detect 404s/Redirects). |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| WEEKLY JOBS: Product Metadata Refresh                            |
| - Scan official documentation sites for context length changes.   |
| - Parse new model release declarations from provider APIs.       |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| MONTHLY JOBS: Deep Catalog Audit                                  |
| - Mark un-audited products older than 30 days as 'Stale'.         |
| - Flag structural anomalies for administrator intervention.       |
+-------------------------------------------------------------------+
```

---

## Change Detection Engine

When an automated verification worker fetches source content:

1. Computes SHA-256 field hashes of normalized dynamic fields (`pricing`, `context_window`, `token_limits`, `model_support`).
2. Compares hash against existing database state (`source_snapshots`).
3. If hash differs:
   - Extracts exact `old_value` and `new_value`.
   - Creates a record in `change_history`.
   - If confidence is high ($> 0.95$), auto-applies change and sets status to `Verified`.
   - If confidence is lower ($< 0.95$), stages update as `Pending Review` in Admin Queue.

---

## Data Provenance UI Standards

Every product card and detail page displays:

- **Last Verified**: ISO Date timestamp (e.g. `2026-09-12`).
- **Verification Badge**:
  - `✓ Verified`: Green pill badge.
  - `⚠ Needs Verification`: Amber pill badge.
  - `↻ Recently Updated`: Blue pill badge with diff summary popup.
- **Source Link**: Direct link to official source document (`source_url`).
