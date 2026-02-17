# ForgeFabric - The Operating System for Enterprise Agents

**Govern every action. Prove every dollar. Scale without limits.**

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue)](https://www.python.org)
[![Temporal](https://img.shields.io/badge/Temporal-1.26+-purple)](https://temporal.io)
[![CI](https://github.com/Plillie96/NewRepo3-gronk-version-/actions/workflows/ci.yml/badge.svg)](https://github.com/Plillie96/NewRepo3-gronk-version-/actions)

## Why ForgeFabric

While everyone builds agents, ForgeFabric is the **neutral runtime** that makes thousands of agents safe, measurable, and unstoppable across Salesforce, SAP, Snowflake, and any other system.

**Four pillars:**

- **Temporal-native orchestration** - durable multi-agent swarms with zero bloat
- **Runtime governance fabric** - OPA policy enforcement before every tool call
- **Real-time ROI engine** - every action tagged with dollar impact
- **Enterprise-grade infrastructure** - multi-tenancy, JWT auth, SOC 2 ready

## One-Command Local Setup

```bash
git clone https://github.com/Plillie96/NewRepo3-gronk-version-.git
cd NewRepo3-gronk-version-
cp .env.example backend/.env          # add your OPENAI_API_KEY
docker compose up -d                   # Temporal + Postgres + Redis + OPA
cd backend && pip install -r requirements.txt && uvicorn src.main:app --reload &
cd ../frontend && npm install && npm run dev
```

Open http://localhost:3000 and click **Launch Deal Swarm**.

## Key Features

- Full ReAct loops with real tool calling
- Human-in-the-loop approval for high-value actions
- Live animated agent graph in the dashboard
- Outcome-based Stripe billing (5% value share)
- OPA governance checks on every tool call
- Ready for 100+ concurrent swarms

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/agents/run | Launch a deal swarm |
| POST | /api/v1/agents/approve | Approve / reject HITL decision |
| GET  | /api/v1/agents/status/{id} | Get workflow result |
| GET  | /health | Liveness check |
| GET  | /ready | Readiness check |

## Project Structure

```
forgefabric-ai/
+-- backend/
|   +-- src/
|   |   +-- main.py              # FastAPI entry + middleware
|   |   +-- config.py            # Pydantic settings
|   |   +-- activities/          # Temporal activities
|   |   +-- agents/              # LangGraph swarms
|   |   +-- workflows/           # Temporal workflows
|   |   +-- governance/          # OPA policies (Rego)
|   |   +-- api/v1/              # REST endpoints
|   |   +-- services/            # ROI calculator, Stripe billing
|   |   +-- core/                # Security, logging, exceptions
|   |   +-- schemas/             # Pydantic models
|   +-- tests/                   # Pytest suite
|   +-- temporal/worker.py       # Temporal worker
|   +-- migrations/              # DB migrations
+-- frontend/                    # Next.js 15 + Tailwind
+-- docker-compose.yml           # Full local infra
+-- DEPLOY.md                    # Production deploy guide
+-- SECURITY.md                  # Security and compliance posture
```

## Production Deploy

See [DEPLOY.md](DEPLOY.md) for the full production deploy guide.

## Security and Compliance

See [SECURITY.md](SECURITY.md) for our security posture, data handling policies, and SOC 2 readiness controls.

## Roadmap

- [x] Temporal-native core orchestration
- [x] OPA governance + ROI engine
- [x] Human-in-the-loop approval
- [ ] Clerk / Auth0 SSO integration
- [ ] Phoenix observability dashboard
- [ ] SOC 2 evidence automation
- [ ] MCP server endpoint

## License

MIT
