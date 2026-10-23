# HealthBridge-AI Architecture

## System Overview

HealthBridge-AI is a fictional US health insurance portal built for a hackathon.

It demonstrates enrollment, policy lookup, renewal eligibility,
and multi-agent AI assistance.

## Architecture Diagram

```mermaid
flowchart TD
    U[Demo User] --> F[React + TypeScript Frontend]
    F --> V[Vite API Proxy]
    V --> API[FastAPI Backend]

    API --> P[Insurance Plan Catalog]
    API --> E[Simulated Enrollment]
    API --> DB[(SQLite Demo Database)]
    API --> NS[Neuro SAN Multi-Agent System]

    NS --> HC[HealthcareCoordinator]
    HC --> EA[EnrollmentAgent]
    HC --> MA[MaintenanceAgent]
    HC --> RA[RenewalAgent]

    RA --> PL[PolicyLookupTool]
    RA --> RV[RenewalValidationTool]

    PL --> DB
    RV --> DB

    NS --> LLM[OpenRouter LLM]

```

## Technology Stack
- React, TypeScript, Vite
- Python and FastAPI
- SQLite
- Neuro SAN multi-agent orchestration
- OpenRouter LLM
## Working Features
- Fictional insurance plan comparison
- Simulated enrollment
- Policy lookup
- Renewal eligibility validation
- AI Assistant powered by Neuro SAN
## Demo Safety
This prototype uses synthetic data only. No real insurance
coverage is issued. Policy updates and renewal submissions are
disabled. Authentication is not implemented, so the application
must remain private and must not process real personal data.
