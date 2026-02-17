#!/bin/bash
# ForgeFabric Azure Deployment Script
# Run: bash scripts/deploy-azure.sh
set -e

RG="forgefabric-rg"
LOC="westus2"
PLAN="forgefabric-plan"
BACK="forgefabric-api"
FRONT="forgefabric-web"
DB="forgefabric-db"
REDIS="forgefabric-cache"

echo "=== ForgeFabric Azure Deployment ==="

echo "[1/6] Resource group..."
az group create --name $RG --location $LOC

echo "[2/6] App Service plan..."
az appservice plan create --name $PLAN --resource-group $RG --location $LOC --sku B2 --is-linux

echo "[3/6] Backend (FastAPI)..."
az webapp create --resource-group $RG --plan $PLAN --name $BACK --runtime "PYTHON:3.11"
az webapp config set --resource-group $RG --name $BACK --startup-file "uvicorn src.main:app --host 0.0.0.0 --port 8000"

echo "[4/6] Frontend (Next.js)..."
az webapp create --resource-group $RG --plan $PLAN --name $FRONT --runtime "NODE:18-lts"

echo "[5/6] PostgreSQL..."
az postgres flexible-server create --resource-group $RG --name $DB --location $LOC --sku-name Standard_B1ms --admin-user forgefabric --storage-size 32 --version 16 --yes
az postgres flexible-server db create --resource-group $RG --server-name $DB --database-name forgefabric

echo "[6/6] Redis..."
az redis create --name $REDIS --resource-group $RG --location $LOC --sku Basic --vm-size c0

echo ""
echo "=== Done! Set env vars next ==="
echo "Backend:  https://$BACK.azurewebsites.net"
echo "Frontend: https://$FRONT.azurewebsites.net"
