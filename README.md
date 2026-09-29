🌊 FloodGuard AI

AI-Powered Flood Intelligence, Prediction & Emergency Response Platform
📖 Overview

During floods, people often get warnings without knowing what to actually do — which road is safe, whether the nearest shelter has space, or how fast their own risk is rising. Authorities, meanwhile, lack a single place to see exposure estimates, verified citizen reports, and where to send limited rescue resources first.

FloodGuard AI turns flood information into action for both sides:

Sense → Predict → Explain → Simulate → Verify → Guide → Prioritize → Respond

👤 Citizen Mode: location-specific risk score, "why is my risk high" explainability, flood-aware safe routes, shelter capacity, flood reporting with AI verification, one-tap SOS, bilingual (EN/HI) assistant

🚑 Response Mode: command-center dashboard, Digital Flood Twin (NOW → +12 HR), What-If simulator, vulnerability map, AI-assisted rescue resource recommendations
Tech Stack

Frontend: React, Vite, Tailwind, Leaflet, Recharts 
Backend: Python, FastAPI, SQLite 
AI/ML: scikit-learn RandomForest, pandas, NumPy

Getting Started
bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
bash
# Frontend
cd frontend
npm install
npm run dev

Open http://localhost:5173 (backend runs at http://localhost:8000, API docs at /docs). DB and ML model auto-create on first run.




