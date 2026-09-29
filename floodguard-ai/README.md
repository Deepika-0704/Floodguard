# 🌊 FloodGuard AI
### AI-Powered Flood Intelligence, Prediction & Emergency Response Platform
**Smart India Hackathon 2026 — Working Prototype**

> **DEMO / SIMULATED FLOOD SCENARIO.** All flood risk, population, road, shelter,
> and resource data in this prototype is **synthetic**, generated for a fictional
> Panipat / Yamuna-belt demo scenario. It is **not live government data**, and the
> app never claims otherwise. The architecture is designed so real data sources
> (IMD rainfall feeds, CWC river-gauge data, census data, NDMA shelter registries,
> etc.) can be plugged in later without redesigning the system.

---

## 1. Project Overview

FloodGuard AI turns flood information into action for two kinds of users:

- 👤 **Citizens** — get a location-specific risk score, understand *why* the risk
  is high, see a flood-aware safe route, check shelter capacity, report flooding,
  and send an SOS.
- 🚑 **Government / NGO / Rescue Responders** — get a command-center view of
  risk zones, population exposure, live citizen reports and SOS requests, a
  Digital Flood Twin to see how the scenario evolves over time, a What-If
  simulator, and AI-assisted resource deployment recommendations.

Flow: **Sense → Predict → Explain → Simulate → Verify → Guide → Prioritize → Respond**

## 2. Problem Statement

During floods, people often receive generic warnings without knowing what
action to take, don't know when their local risk will increase, and can't tell
whether a road or shelter is actually safe to use right now. Authorities, in
turn, lack a single place to see exposure estimates, verified citizen reports,
and where to send limited rescue resources first. FloodGuard AI converts
**Flood Information → Intelligence → Action** for both groups in one platform.

## 3. Key Features

**Citizen Mode**
- AI flood-risk prediction with an estimated risk window
- "Why is my risk high?" explainability panel (contributing-factor bar chart)
- Interactive Leaflet flood map (zones, shelters, hospitals, schools, reports, SOS)
- Flood-aware Safe Route (Route A potentially affected vs. Route B safer)
- Shelter directory with live capacity & accessibility
- Citizen flood reporting with a prototype AI verification pipeline
- One-tap Emergency SOS with online/SMS-fallback simulation
- Bilingual (English/Hindi) rule-based assistant, offline-capable

**Response Mode**
- Command Center with live stats: high-risk zones, population exposure, active
  SOS, citizen reports, shelters, resources
- Human Vulnerability Map (population, elderly/children %, hospitals, schools)
- **Digital Flood Twin** — NOW / +2HR / +4HR / +6HR / +12HR timeline that
  visibly changes zone risk, roads, shelter accessibility, and impact stats
- **What-If Simulator** — rainfall / river-level / soil-moisture sliders and a
  road-status toggle that recompute exposure, affected roads, and shelter
  status live
- AI-assisted rescue resource recommendation (boats, ambulances, rescue teams)

## 4. Architecture

```
Frontend (React/Vite/Tailwind/Leaflet/Recharts)
        │  REST (JSON) over HTTP
        ▼
Backend (FastAPI)
   ├── ML layer (scikit-learn RandomForest) — /predict-risk
   ├── Business logic (digital twin, what-if, routing, resources)
   ├── Verification service (citizen report AI verification)
   └── SQLite database (seeded demo dataset)
```

The frontend never hard-fails if the backend is briefly unreachable — every API
call has a bundled fallback so the demo UI stays usable (see
`frontend/src/services/api.js`).

## 5. Technology Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Leaflet/React-Leaflet, Recharts, Lucide icons |
| Backend | Python 3, FastAPI, Uvicorn |
| AI/ML | scikit-learn (RandomForestRegressor), pandas, NumPy |
| Database | SQLite |
| Maps | OpenStreetMap tiles via Leaflet (no paid Google Maps API) |

## 6. AI/ML Approach

`backend/ml/train_model.py` generates a **synthetic but physically plausible**
training dataset (4,000 rows) where flood risk is built from a weighted,
non-linear combination of rainfall, river level, soil moisture, elevation,
slope, and urbanization — the same drivers used in real flood-risk literature
— plus noise and a rainfall×soil-moisture interaction term. A
`RandomForestRegressor` (150 trees) is trained on this data (test MAE ≈ 0.04)
and saved to `backend/ml/flood_model.pkl`. The model is trained automatically
on first run if the artifact doesn't exist — it is not hardcoded, and it
genuinely processes whatever feature values the frontend sends it.

The "Why is my risk high?" panel uses a transparent, human-readable
recomputation of each feature's normalized contribution (mirroring the
training data's known weights) rather than a black-box SHAP call, which is
more legible for a hackathon demo and clearly labeled as an
**AI explanation / prototype model output**.

## 7. Database

SQLite tables (auto-created and seeded on first run):
`locations`, `zones`, `roads`, `shelters`, `hospitals`, `schools`, `resources`,
`citizen_reports`, `sos_requests`, `vulnerability_data`, `flood_predictions`,
`simulation_results`.

## 8. How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend
```bash
cd backend
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```
The database and ML model are created automatically on first run. To force a
clean reseed at any time: `POST http://localhost:8000/admin/reset-demo-data`.

API docs (Swagger UI) are available at `http://localhost:8000/docs`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`. The frontend expects the backend at
`http://localhost:8000` by default (override with a `VITE_API_URL` env var).

### Suggested demo path
1. Open the landing page → **Citizen Mode**
2. Dashboard → note the risk score → click **Simulate worsening rainfall**
   → risk jumps to HIGH/VERY HIGH
3. Click **Why is my risk high?** → contributing-factor chart
4. Click **Open Digital Flood Twin** → scrub NOW → +2HR → +4HR → watch the
   map and impact stats change
5. **Safe Route** → see Route A (affected) vs Route B (safer) on the map
6. **Shelters** → check capacity/accessibility
7. **Report Flood** → submit → see AI verification result
8. **SOS** → send an emergency request
9. Switch to **Response Mode** → Command Center shows the new SOS + report
10. **What-If Simulator** → push rainfall/river-level sliders high → **Run
    Simulation** → see additional risk zones, exposed population, affected
    roads, and a shelter becoming inaccessible
11. **Resource Planning** → AI-assisted boat/ambulance/team recommendation

## 9. Demo Credentials

None required — this is an open prototype demo with no authentication layer
(out of scope for the hackathon prototype; see Future Scope).

## 10. Implemented Prototype Features
- End-to-end ML flood-risk prediction (real RandomForest inference, not hardcoded)
- Full REST API (17 endpoints) backed by SQLite
- Interactive multi-layer Leaflet map
- Digital Flood Twin with a genuinely time-varying map and stats
- Rule-based What-If simulator that visibly responds to slider inputs
- Prototype AI report-verification pipeline (image-provided + location +
  duplicate-text heuristics, not a full CV model)
- Rule-based bilingual assistant driven by live application data
- Two fully separate, purpose-built UI experiences (citizen vs. command center)

## 11. Known Prototype Limitations
- All environmental, population, and infrastructure data is **synthetic**,
  generated for a fictional Panipat/Yamuna scenario — not real-time sensor or
  government data
- Flood-report verification uses lightweight heuristics (image presence,
  coordinate proximity to a known zone, text-similarity duplicate check), not
  a trained computer-vision model
- Safe routing picks between two precomputed candidate paths rather than
  running true graph-based shortest-path routing over live road-risk data
- SOS "SMS fallback" and the offline mesh-relay concept are UI demonstrations
  only; no real SMS gateway or Bluetooth mesh networking is implemented
- No authentication/authorization layer; not multi-tenant
- The assistant is rule-based (keyword matching over live app data), not an
  LLM, by design so it works fully offline for the demo

## 12. Future Scope
- Ingest real rainfall (IMD), river-gauge (CWC), and elevation (SRTM/DEM) data
- Replace the rule-based report verification with a trained CV model + a
  human-in-the-loop review queue for authorities
- Real graph-based flood-aware routing (e.g., OSRM/GraphHopper with a dynamic
  road-risk cost layer)
- Real SMS gateway (e.g., Twilio/MSG91) and an actual offline mesh-relay
  implementation for zero-connectivity areas
- Role-based authentication for responders, audit logging, and multi-district
  scaling
- Integration with NDMA/SDMA shelter registries and census data for accurate
  vulnerability layers

## 13. SIH Relevance
FloodGuard AI directly addresses the disaster-management/emergency-response
theme area: it demonstrates real AI/ML (not just a UI mockup), a genuinely
interactive geospatial command system, citizen-to-government feedback loops
(reports, SOS), and decision-support tooling for resource-constrained rescue
operations — all built on a free, open stack (OpenStreetMap, scikit-learn,
SQLite) so it can be extended and deployed without licensing costs.
