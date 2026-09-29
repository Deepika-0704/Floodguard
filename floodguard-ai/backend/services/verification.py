"""
FloodGuard AI - Prototype AI Flood Report Verification.

This is a clearly-labeled PROTOTYPE pipeline. It does not run a full
production computer-vision model. Instead it combines:
  1. "Visual flood evidence" check   -> whether an image was actually provided
  2. "Location consistency" check    -> whether coordinates fall within a
                                         known demo flood-risk zone
  3. "Duplicate check"                -> naive text-similarity against
                                         recently submitted reports in the DB

...to produce a demonstrable, non-hardcoded confidence score.

"Prototype AI verification — not a substitute for official verification."
"""

import difflib
from database.db import get_conn, dict_from_row
from database import seed_data as sd


def _within_known_zone(lat: float, lng: float, tolerance=0.15):
    for z in sd.ZONES:
        if abs(z["lat"] - lat) < tolerance and abs(z["lng"] - lng) < tolerance:
            return True, z["name"]
    return False, None


def _duplicate_score(description: str):
    conn = get_conn()
    rows = conn.execute("SELECT description FROM citizen_reports ORDER BY id DESC LIMIT 20").fetchall()
    conn.close()
    max_sim = 0.0
    for r in rows:
        sim = difflib.SequenceMatcher(None, description.lower(), r["description"].lower()).ratio()
        max_sim = max(max_sim, sim)
    return max_sim


def verify_report(lat: float, lng: float, water_level: str, description: str, image_provided: bool):
    checks = {}

    # 1. Visual evidence check
    checks["visual_flood_evidence"] = bool(image_provided)

    # 2. Location consistency check
    in_zone, zone_name = _within_known_zone(lat, lng)
    checks["location_consistency"] = in_zone

    # 3. Duplicate check (high similarity to an existing report => likely duplicate)
    similarity = _duplicate_score(description) if description else 0.0
    checks["duplicate_check"] = similarity < 0.85  # True means "not a duplicate"

    # Confidence scoring (simple transparent weighted formula)
    score = 0.0
    score += 40 if checks["visual_flood_evidence"] else 10
    score += 35 if checks["location_consistency"] else 10
    score += 25 if checks["duplicate_check"] else 5
    confidence = min(round(score, 1), 97.0)

    if not checks["duplicate_check"]:
        result = "POTENTIALLY MISLEADING"
    elif confidence >= 80:
        result = "LIKELY VERIFIED"
    elif confidence >= 55:
        result = "UNCERTAIN"
    else:
        result = "POTENTIALLY MISLEADING"

    return {
        "visual_flood_evidence": checks["visual_flood_evidence"],
        "location_consistency": checks["location_consistency"],
        "matched_zone": zone_name,
        "duplicate_check_passed": checks["duplicate_check"],
        "result": result,
        "confidence": confidence,
        "disclaimer": "Prototype AI verification — not a substitute for official verification.",
    }
