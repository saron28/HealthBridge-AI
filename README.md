# HealthBridge-AI

Agentic AI-powered US health insurance enrollment, maintenance and renewal portal built with Neuro SAN.

## Frontend demo

The React/TypeScript customer portal lives in [`frontend/`](./frontend/). It is a fictional hackathon prototype: use only synthetic details, and do not treat its plan, policy, enrollment, chat, or renewal content as real insurance services.

### Run locally

```sh
cd frontend
npm install
cp .env.example .env
npm run dev -- --host 0.0.0.0
```

Open the Vite URL shown in the terminal (usually port 5173). The frontend defaults to local mock data and does not require the Neuro SAN backend.

### Pages and behavior

- **Overview:** navigation to each customer workflow and an always-visible demo notice.
- **Explore plans:** compare fictional Bronze, Silver, and Gold plans and submit a simulated enrollment request. The confirmation explicitly states that no coverage is issued.
- **Manage my policy:** look up synthetic records `HB-1001` and `HB-1002`. Policy updates remain unavailable.
- **Renewal:** display a demo eligibility result for a synthetic policy. Results come from API/mock responses; the page does not calculate eligibility. Renewal submission is disabled until backend identity verification and explicit authorization/confirmation are implemented.
- **AI assistant:** session-only chat history with mock responses or a backend API connection.

No user details or chat history are saved to browser storage. Do not enter real personal, policy, or health information.

### Backend connection

Set these variables in `frontend/.env` when the planned API is available:

```dotenv
VITE_API_MODE=backend
VITE_API_BASE_URL=http://localhost:8000
```

`VITE_API_MODE=mock` is the default. The backend adapter in [`frontend/src/services/api.ts`](./frontend/src/services/api.ts) uses the proposed `/api/plans`, `/api/policies/{policy_id}`, `/api/renewal/check`, `/api/enrollment`, and `/api/chat` routes. It maps the renewal-check response's illustrative snake_case fields into frontend types. The backend/API owners should confirm actual request and response fields before integration. Renewal request submission and policy maintenance updates are intentionally not connected.

To create a production bundle, run `npm run build` from `frontend/`.
