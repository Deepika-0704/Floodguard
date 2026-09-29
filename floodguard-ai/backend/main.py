"""
FloodGuard AI - SIH 2026 Prototype Backend
============================================
Run with:  uvicorn main:app --reload --port 8000

All flood/risk/exposure data in this prototype is SIMULATED for the
SIH 2026 demo scenario (Panipat / Yamuna belt, fictional). It is not
live government data. See README.md for full disclosure.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import json

from database.db import init_db, get_conn, dict_from_row
from database import seed_data as sd
from ml.predict import predict_risk
from services import logic, verification, assistant

app = FastAPI(
    title="FloodGuard AI API",
    description="AI-Powered Flood Intelligence, Prediction & Emergency Response Platform (SIH 2026 Prototype)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


# ----------------------------- Schemas -----------------------------

class RiskInput(BaseModel):
    rainfall: float = Field(..., ge=0, le=500)
    river_level: float = Field(..., ge=0, le=20)
    soil_moisture: float = Field(..., ge=0, le=100)
    elevation: float = Field(..., ge=0, le=1000)
    slope: float = Field(2.0, ge=0, le=45)
    urbanization: float = Field(..., ge=0, le=100)


class CitizenReportInput(BaseModel):
    location: str
    lat: float
    lng: float
    water_level: str
    description: str
    image_provided: bool = True


class SOSInput(BaseModel):
    location: str
    lat: float
    lng: float
    people: int = Field(..., ge=1, le=100)
    type: str  # Medical, Rescue, Evacuation, Other
    connectivity: Optional[str] = "online"  # online | offline


class SimulateInput(BaseModel):
    rainfall: float = Field(..., ge=50, le=250)
    river_level: float = Field(..., ge=1, le=10)
    soil_moisture: float = Field(..., ge=20, le=100)
    road_status: str = "Open"  # Open | Blocked


class RouteInput(BaseModel):
    start: str
    destination: str


class AssistantInput(BaseModel):
    message: str
    lang: str = "en"  # en | hi


# ----------------------------- Health / meta -----------------------------

@app.get("/health")
def health():
    return {"status": "ok", "service": "FloodGuard AI Backend", "mode": "PROTOTYPE / SIMULATED DATA"}


@app.get("/locations")
def get_locations():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM locations").fetchall()
    conn.close()
    return [dict_from_row(r) for r in rows]


# ----------------------------- Flood risk prediction (ML) -----------------------------

@app.post("/predict-risk")
def predict_risk_endpoint(payload: RiskInput):
    try:
        features = payload.model_dump()
        result = predict_risk(features)

        conn = get_conn()
        conn.execute("""INSERT INTO flood_predictions
            (rainfall, river_level, soil_moisture, elevation, slope, urbanization,
             risk_score, risk_level, risk_window)
            VALUES (?,?,?,?,?,?,?,?,?)""",
            (features["rainfall"], features["river_level"], features["soil_moisture"],
             features["elevation"], features["slope"], features["urbanization"],
             result["risk_score"], result["risk_level"], result["risk_window"]))
        conn.commit()
        conn.close()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


# ----------------------------- Flood zones / Digital Twin -----------------------------

@app.get("/flood-zones")
def flood_zones(time: str = "NOW"):
    try:
        zones, twin = logic.get_zones(time)
        return {"time": time, "scenario": twin["label"], "zones": zones}
    except Exception:
        return {"time": time, "scenario": "Demo scenario", "zones": sd.ZONES}


@app.get("/roads")
def roads(time: str = "NOW"):
    try:
        return logic.get_roads(time)
    except Exception:
        return sd.ROADS


@app.get("/impact")
def impact(time: str = "NOW"):
    return logic.get_impact(time)


# ----------------------------- Shelters -----------------------------

@app.get("/shelters")
def shelters():
    try:
        return logic.get_shelters()
    except Exception:
        return sd.SHELTERS


@app.get("/hospitals")
def hospitals():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM hospitals").fetchall()
    conn.close()
    return [dict_from_row(r) for r in rows]


@app.get("/schools")
def schools():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM schools").fetchall()
    conn.close()
    return [dict_from_row(r) for r in rows]


# ----------------------------- Safe route -----------------------------

@app.post("/route")
def route(payload: RouteInput):
    return logic.get_safe_route(payload.start, payload.destination)


# ----------------------------- Citizen reporting -----------------------------

@app.post("/citizen-report")
def citizen_report(payload: CitizenReportInput):
    result = verification.verify_report(
        payload.lat, payload.lng, payload.water_level, payload.description, payload.image_provided
    )
    conn = get_conn()
    conn.execute("""INSERT INTO citizen_reports
        (location, lat, lng, water_level, description, image_provided, status, confidence)
        VALUES (?,?,?,?,?,?,?,?)""",
        (payload.location, payload.lat, payload.lng, payload.water_level,
         payload.description, int(payload.image_provided), result["result"], result["confidence"]))
    conn.commit()
    new_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn.close()
    return {"report_id": new_id, **result}


@app.get("/citizen-reports")
def citizen_reports():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM citizen_reports ORDER BY id DESC").fetchall()
    conn.close()
    return [dict_from_row(r) for r in rows]


# ----------------------------- SOS -----------------------------

@app.post("/sos")
def sos(payload: SOSInput):
    conn = get_conn()
    conn.execute("""INSERT INTO sos_requests (location, lat, lng, people, type, status)
        VALUES (?,?,?,?,?,?)""",
        (payload.location, payload.lat, payload.lng, payload.people, payload.type, "PENDING"))
    conn.commit()
    new_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn.close()

    sms_fallback = payload.connectivity == "offline"
    return {
        "sos_id": new_id,
        "status": "SOS SENT",
        "sms_fallback_activated": sms_fallback,
        "note": ("SMS fallback simulated — prototype only, no real SMS was sent."
                  if sms_fallback else
                  "Transmitted to responder dashboard. Prototype simulated backend transmission."),
    }


@app.get("/sos")
def sos_list():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM sos_requests ORDER BY id DESC").fetchall()
    conn.close()
    return [dict_from_row(r) for r in rows]


# ----------------------------- Resources -----------------------------

@app.get("/resources")
def resources():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM resources").fetchall()
    conn.close()
    return [dict_from_row(r) for r in rows]


@app.get("/resources/recommend")
def resources_recommend():
    return logic.recommend_resources()


# ----------------------------- What-if simulator -----------------------------

@app.post("/simulate")
def simulate(payload: SimulateInput):
    return logic.run_whatif_simulation(
        payload.rainfall, payload.river_level, payload.soil_moisture, payload.road_status
    )


# ----------------------------- Vulnerability -----------------------------

@app.get("/vulnerability")
def vulnerability():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM vulnerability_data").fetchall()
    conn.close()
    return [dict_from_row(r) for r in rows]


# ----------------------------- Assistant -----------------------------

@app.post("/assistant")
def assistant_reply(payload: AssistantInput):
    reply = assistant.get_assistant_reply(payload.message, payload.lang)
    return {"reply": reply}


# ----------------------------- Admin / reset (demo convenience) -----------------------------

@app.post("/admin/reset-demo-data")
def reset_demo():
    init_db(reset=True)
    return {"status": "Demo database reset and reseeded."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
