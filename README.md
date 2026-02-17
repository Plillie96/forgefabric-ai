# ForgeFabric AI - Enterprise Agent Runtime + Governance Fabric

**The Agent Operating System for the Enterprise.**
Orchestrate thousands of agents. Govern every action in real time. Integrate anywhere. Prove ROI every second.

## Architecture

- **Orchestration**: LangGraph + Temporal.io for durable multi-agent workflows
- **Governance**: OPA (Open Policy Agent) runtime policy enforcement + audit trails
- **Backend**: FastAPI (Python) with async-first design
- **Frontend**: Next.js 15 + Tailwind CSS
- **Billing**: Stripe outcome-based billing
- **Persistence**: PostgreSQL + Redis

## Quick Start

```bash
# 1. Start infrastructure
docker compose up -d

# 2. Backend
cd backend
pip install -r requirements.txt
cp ../.env.example .env  # Edit with your keys
uvicorn src.main:app --reload

# 3. Temporal worker (separate terminal)
cd backend
python -m temporal.worker

# 4. Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/v1/agents/run` - Launch a deal swarm
- `POST /api/v1/agents/approve` - Approve/reject HITL decision
- `GET /api/v1/agents/status/{id}` - Get workflow result
- `GET /health` - Health check

## Project Structure

```
forgefabric-ai/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI entry
│   │   ├── config.py            # Settings
│   │   ├── activities/          # Temporal activities
│   │   ├── agents/              # LangGraph swarms
│   │   ├── workflows/           # Temporal workflows
│   │   ├── governance/          # OPA policies
│   │   ├── api/v1/              # REST endpoints
│   │   ├── services/            # ROI, billing
│   │   └── schemas/             # Pydantic models
│   ├── temporal/worker.py       # Temporal worker
│   └── migrations/              # DB migrations
├── frontend/                    # Next.js 15
├── shared/types/                # Shared TypeScript types
└── docker-compose.yml
```