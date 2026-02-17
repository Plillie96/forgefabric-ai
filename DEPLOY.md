# Production Deploy Guide

## Option A: Azure (Recommended)

### Prerequisites
- Azure CLI installed (`az login`)
- Azure subscription

### One-Command Deploy
```bash
bash scripts/deploy-azure.sh
```

This creates:
- **Azure App Service** (Backend - Python 3.11 + FastAPI)
- **Azure App Service** (Frontend - Node 18 + Next.js)
- **Azure Database for PostgreSQL** Flexible Server
- **Azure Cache for Redis**

### After deploy - set environment variables

**Backend:**
```bash
az webapp config appsettings set --resource-group forgefabric-rg --name forgefabric-api --settings \
  OPENAI_API_KEY=<your-key> \
  SECRET_KEY=<random-32-char-string> \
  DATABASE_URL=<postgres-connection-string> \
  REDIS_URL=<redis-connection-string> \
  CORS_ORIGINS=https://forgefabric-web.azurewebsites.net \
  CLERK_SECRET_KEY=<your-clerk-secret> \
  OPA_URL=http://localhost:8181
```

**Frontend:**
```bash
az webapp config appsettings set --resource-group forgefabric-rg --name forgefabric-web --settings \
  NEXT_PUBLIC_API_URL=https://forgefabric-api.azurewebsites.net \
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
```

### Deploy code

**Backend:**
```bash
cd backend
az webapp up --name forgefabric-api --resource-group forgefabric-rg --runtime "PYTHON:3.11"
```

**Frontend:**
```bash
cd frontend
npm run build
az webapp up --name forgefabric-web --resource-group forgefabric-rg --runtime "NODE:18-lts"
```

### Run migrations
```bash
psql $DATABASE_URL -f backend/migrations/001_langgraph_checkpointer.sql
psql $DATABASE_URL -f backend/migrations/002_multi_tenancy_rls.sql
```

### URLs
- Backend: https://forgefabric-api.azurewebsites.net
- Frontend: https://forgefabric-web.azurewebsites.net

---

## Option B: Vercel + Render

### Frontend: Vercel
1. Import repo at https://vercel.com/new
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = your Clerk key
4. Deploy.

### Backend: Render
1. Create Web Service at https://dashboard.render.com/new
2. Connect GitHub repo, set **Root Directory** to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn src.main:app --host 0.0.0.0 --port 10000`
5. Add environment variables (see above)
6. Deploy.

### Database
Create a Postgres instance on Render. Run the migrations.

---

## Option C: Kubernetes (Azure AKS or any K8s)

```bash
kubectl apply -f k8s/
kubectl get hpa --watch
```

See `k8s/` directory for Deployment, HPA (auto-scale 5-100 pods), and ConfigMap.

---

## Verify

- Visit your frontend URL - landing page should load
- Click Dashboard - trigger a swarm
- Hit `/health` and `/ready` on the backend URL

## Timeline

| Method | Time |
|--------|------|
| Azure (script) | ~15 minutes |
| Vercel + Render | ~45 minutes |
| Kubernetes | ~30 minutes (after cluster setup) |
