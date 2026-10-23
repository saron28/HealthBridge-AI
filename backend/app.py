from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from coded_tools.healthbridge.policy_lookup import lookup_policy
from coded_tools.healthbridge.renewal_validation_tool import RenewalValidationTool

app = FastAPI(title="HealthBridge AI Demo API")

# Local development only. Restrict origins before public deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class RenewalCheckRequest(BaseModel):
    policy_id: str


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "HealthBridge AI Demo API"}


@app.get("/api/policies/{policy_id}")
def get_policy(policy_id: str):
    policy = lookup_policy(policy_id.strip().upper())

    if "error" in policy:
        raise HTTPException(status_code=404, detail="Demo policy not found")

    return {
        **policy,
        "member_name": policy["customer_name"],
    }


@app.post("/api/renewal/check")
def check_renewal(request: RenewalCheckRequest):
    policy_id = request.policy_id.strip().upper()
    policy = lookup_policy(policy_id)

    if "error" in policy:
        raise HTTPException(status_code=404, detail="Demo policy not found")

    result = RenewalValidationTool().invoke(
        {"policy_id": policy_id}, {}
    )

    import json
    validation = json.loads(result)

    if not validation.get("success"):
        raise HTTPException(status_code=400, detail=validation)

    return {
        "success": True,
        "policy": policy,
        "renewal": validation,
    }


DEMO_PLANS = [
    {
        "id": "bronze",
        "name": "HealthBridge Bronze",
        "tier": "Bronze",
        "monthlyPremium": 210,
        "deductible": 6500,
        "outOfPocketMax": 9000,
        "summary": "A fictional lower-premium plan.",
        "features": ["Preventive care", "Primary care", "Prescription coverage"],
    },
    {
        "id": "silver",
        "name": "HealthBridge Silver",
        "tier": "Silver",
        "monthlyPremium": 320,
        "deductible": 3500,
        "outOfPocketMax": 7500,
        "summary": "A fictional balanced coverage plan.",
        "features": ["Preventive care", "Specialist visits", "Prescription coverage"],
        "recommended": True,
    },
    {
        "id": "gold",
        "name": "HealthBridge Gold",
        "tier": "Gold",
        "monthlyPremium": 450,
        "deductible": 1500,
        "outOfPocketMax": 5500,
        "summary": "A fictional higher-premium plan.",
        "features": ["Preventive care", "Specialist visits", "Prescription coverage"],
    },
]


@app.get("/api/plans")
def get_plans():
    return DEMO_PLANS


class EnrollmentRequest(BaseModel):
    fullName: str
    email: str
    dateOfBirth: str
    planId: str


@app.post("/api/enrollment")
def create_enrollment(request: EnrollmentRequest):
    if request.planId not in {plan["id"] for plan in DEMO_PLANS}:
        raise HTTPException(status_code=400, detail="Invalid demo plan")

    # Do not store enrollment details or issue real coverage.
    return {
        "success": True,
        "referenceId": "DEMO-ENROLLMENT",
        "message": "Your fictional enrollment request was simulated. No insurance coverage has been issued.",
    }


# Neuro SAN chat integration — fictional demo data only.
import logging
import os
from pathlib import Path

from fastapi import HTTPException
from pydantic import BaseModel, Field

PROJECT_ROOT = Path(__file__).resolve().parent.parent

os.environ.setdefault(
    "AGENT_MANIFEST_FILE",
    str(PROJECT_ROOT / "registries" / "manifest.hocon"),
)
os.environ.setdefault(
    "AGENT_TOOL_PATH",
    str(PROJECT_ROOT / "coded_tools"),
)
os.environ.setdefault("PYTHONPATH", str(PROJECT_ROOT))


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


@app.post("/api/chat")
def chat_with_agent(request: ChatRequest):
    from neuro_san.client.direct_agent_session_factory import (
        DirectAgentSessionFactory,
    )

    session = None

    try:
        factory = DirectAgentSessionFactory()
        session = factory.create_session("healthbridge/healthbridge")

        reply = ""

        for event in session.streaming_chat({
            "user_message": {"text": request.message}
        }):
            response = event.get("response")
            if isinstance(response, dict):
                text = response.get("text")
                if isinstance(text, str) and text.strip():
                    reply = text.strip()

        if not reply:
            raise RuntimeError("Agent returned no text response")

        return {"reply": reply}

    except Exception:
        logging.exception("HealthBridge AI chat failed")
        raise HTTPException(
            status_code=503,
            detail="The demo AI assistant is temporarily unavailable.",
        )
    finally:
        if session is not None:
            session.close()
