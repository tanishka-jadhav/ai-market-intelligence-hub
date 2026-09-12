# Deployment Guide - AI Market Intelligence Hub

## Deployment Architecture

```
                                +---------------------------+
                                |  GitHub Repository (main) |
                                +---------------------------+
                                              |
                                              v
                                +---------------------------+
                                |      Vercel Platform      |
                                | (Next.js Frontend Build)  |
                                +---------------------------+
                                              |
                                              v
                                +---------------------------+
                                |   FastAPI Backend API     |
                                |  (PostgreSQL / Database)  |
                                +---------------------------+
```

---

## 1. Environment Variable Configuration

| Variable | Description | Scope | Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Public endpoint for backend API | Public (Browser) | `https://api.aimarkethub.com/api/v1` |
| `DATABASE_URL` | Relational database connection string | Server Only | `postgresql://user:pass@host:5432/aimarkethub` |
| `SECRET_KEY` | JWT authentication key | Server Only | `antigravity-secret-key-2026` |

---

## 2. GitHub Push Instructions

```bash
git remote add origin https://github.com/<YOUR_USER>/ai-market-intelligence-hub.git
git branch -M main
git push -u origin main
```

---

## 3. Vercel Project Setup

1. Log into [Vercel](https://vercel.com) and click **Add New Project**.
2. Import the `ai-market-intelligence-hub` GitHub repository.
3. Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./apps/web` (or `./` using root `vercel.json`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add required environment variables under Project Settings.
5. Click **Deploy**.
