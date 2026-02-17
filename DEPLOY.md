# Production Deploy Guide

## Prerequisites

- GitHub repo pushed
- Vercel account (free tier works)
- Render account (free tier works)
- OpenAI API key
- (Optional) Stripe secret key

## Frontend: Vercel

1. Import repo at https://vercel.com/new
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `BACKEND_URL` = your Render backend URL (e.g. `https://forgefabric-backend.onrender.com`)
4. Deploy.

## Backend: Render

1. Create Web Service at https://dashboard.render.com/new
2. Connect GitHub repo, set **Root Directory** to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn src.main:app --host 0.0.0.0 --port 10000`
5. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (from Render Postgres add-on)
   - `TEMPORAL_HOST` (Temporal Cloud or self-hosted)
   - `OPA_URL` (OPA sidecar or hosted)
   - `STRIPE_SECRET_KEY` (optional)
   - `SECRET_KEY` (random 32+ char string)
   - `CORS_ORIGINS` = your Vercel URL
6. Deploy.

## Database

Create a Postgres instance on Render. Run the migration:

`psql $DATABASE_URL -f backend/migrations/001_langgraph_checkpointer.sql`

## Temporal

Use Temporal Cloud (https://temporal.io/cloud) or self-host with the
`temporalio/auto-setup` Docker image on Render as a private service.

## Verify

- Visit your Vercel URL - landing page should load
- Click Open Dashboard - trigger a swarm
- Hit `/health` and `/ready` on the backend URL

## Timeline

Total: about 45 to 60 minutes from zero to live.
