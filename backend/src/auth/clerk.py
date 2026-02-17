from fastapi import Depends, HTTPException, Request
from typing import Optional
import os
import logging

logger = logging.getLogger("forgefabric.auth")

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY", "")


async def get_current_tenant(request: Request) -> str:
    """Extract tenant from Clerk JWT org_id header.

    In production Clerk populates x-clerk-org-id after verifying the
    session JWT.  For local dev without Clerk configured we fall back
    to a public tenant so the API keeps working.
    """
    org_id = request.headers.get("x-clerk-org-id")
    if org_id:
        return org_id

    # Fallback: check Authorization header for Clerk session token
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer ") and CLERK_SECRET_KEY:
        try:
            import jwt as pyjwt

            token = auth_header.split(" ", 1)[1]
            payload = pyjwt.decode(token, options={"verify_signature": False})
            return payload.get("org_id", "public")
        except Exception as exc:
            logger.warning("Clerk token decode failed: %s", exc)

    # Dev mode: no Clerk configured, use public tenant
    return "public"


async def require_tenant(request: Request) -> str:
    """Strict version that rejects unauthenticated requests in production."""
    if not CLERK_SECRET_KEY:
        # Dev mode: allow without auth
        return "public"

    tenant = await get_current_tenant(request)
    if tenant == "public":
        raise HTTPException(status_code=401, detail="Authentication required")
    return tenant
