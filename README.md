# HealthBridge-AI

An agentic AI-powered, fictional US health insurance portal built for a hackathon using Neuro SAN.

## Overview

HealthBridge-AI demonstrates insurance enrollment, policy maintenance, renewal eligibility, and AI-powered customer assistance in one React web application.

All insurance plans and policyholder records are fictional.

## Features

- **Explore Plans:** Compare fictional Bronze, Silver, and Gold plans.
- **Enrollment:** Submit a simulated enrollment request.
- **Policy Maintenance:** Look up fictional policy details.
- **Renewal:** Check policy renewal eligibility using Python validation tools.
- **AI Assistant:** Ask questions through a Neuro SAN multi-agent workflow.

## Technology Stack

- React, TypeScript, Vite
- Python, FastAPI
- SQLite
- Neuro SAN multi-agent orchestration
- OpenRouter LLM

## Architecture

See [Architecture Documentation](docs/ARCHITECTURE.md).

The React frontend communicates with FastAPI through a Vite development proxy.

FastAPI provides policy lookup, plan comparison, simulated enrollment, renewal validation, and an AI chat endpoint.

The Neuro SAN HealthcareCoordinator delegates agent tasks, including renewal assistance through RenewalAgent and its read-only tools.

## Run Locally

Requires Python 3.12, Node.js, npm, Neuro SAN, and an OpenRouter API key.

### 1. Set up Python

Create and activate a virtual environment, then install the project's Python dependencies.

### 2. Initialize the demo database

    python data/setup_database.py

### 3. Configure Neuro SAN

Set the OPENROUTER_API_KEY securely in your environment.

    export AGENT_MANIFEST_FILE=$PWD/registries/manifest.hocon
    export AGENT_TOOL_PATH=$PWD/coded_tools
    export PYTHONPATH=$PWD

### 4. Start FastAPI

    python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000

### 5. Start React

In a separate terminal:

    cd frontend
    npm ci

Create frontend/.env.local with:

    VITE_API_MODE=backend
    VITE_API_BASE_URL=.

Then start the frontend:

    npm run dev -- --host 0.0.0.0

Open the forwarded frontend port in your development environment.

Keep development ports private.

## Demo Walkthrough

1. Open the HealthBridge-AI homepage.
2. Compare Bronze, Silver, and Gold plans.
3. Complete a simulated enrollment using fictional information.
4. Look up fictional policy HB-1001.
5. Check renewal eligibility for HB-1001.
6. Open the AI Assistant.
7. Ask: Check renewal eligibility for fictional policy HB-1001.
8. Observe the AI-generated response returned through Neuro SAN.

## Demo Policies

- HB-1001: Alex Morgan, HealthBridge Silver
- HB-1002: Taylor Brooks, HealthBridge Gold

These are synthetic records.

## Safety and Limitations

This is a hackathon prototype, not a production insurance platform.

- No real insurance coverage is issued.
- Enrollment requests are simulated and not persisted.
- Policy updates and renewal submissions are disabled.
- Customer authentication and authorization are not implemented.
- AI chat does not persist conversation history.
- Development ports must remain private.
- Do not enter real personal, medical, or insurance information.

## GitHub

Repository: https://github.com/saron28/HealthBridge-AI
