"""
FloodGuard AI - Prototype inference + explainability layer.
Wraps the trained RandomForest model, converts the raw 0-1 score into a
risk level + estimated risk window, and produces a per-feature
contribution breakdown for the "WHY IS MY RISK HIGH?" UI panel.
"""

import os
from .train_model import load_or_train_model, FEATURES

_model = None


def get_model():
    global _model
    if _model is None:
        _model = load_or_train_model()
    return _model


def risk_level_from_score(score: float) -> str:
    if score >= 0.75:
        return "VERY HIGH"
    if score >= 0.55:
        return "HIGH"
    if score >= 0.30:
        return "MODERATE"
    return "LOW"


def risk_window_from_score(score: float) -> str:
    if score >= 0.85:
        return "0-2 hours"
    if score >= 0.65:
        return "2-4 hours"
    if score >= 0.45:
        return "4-8 hours"
    if score >= 0.25:
        return "8-24 hours"
    return "No immediate risk window"


def explain_contributions(features: dict) -> list:
    """Prototype explainability: normalize each raw feature into a 0-1
    'driver strength' using the same domain ranges used to build the
    synthetic training data, then express each as a % share of the total.
    This mirrors (but simplifies) the model's real weighting for a
    human-readable explanation panel.
    """
    rainfall_c = min(max(features["rainfall"] / 250, 0), 1)
    river_c = min(max(features["river_level"] / 10, 0), 1)
    soil_c = min(max(features["soil_moisture"] / 100, 0), 1)
    elevation_c = min(max(1 - (features["elevation"] / 300), 0), 1)
    slope_c = min(max(1 - (features.get("slope", 5) / 15), 0), 1)
    urban_c = min(max(features["urbanization"] / 100, 0), 1)

    weighted = {
        "Rainfall": 0.32 * rainfall_c,
        "River Level": 0.24 * river_c,
        "Soil Moisture": 0.18 * soil_c,
        "Urbanization": 0.14 * urban_c,
        "Elevation": 0.07 * elevation_c,
        "Terrain / Slope": 0.05 * slope_c,
    }
    total = sum(weighted.values()) or 1e-6
    contributions = [
        {"factor": k, "contribution_pct": round((v / total) * 100, 1)}
        for k, v in sorted(weighted.items(), key=lambda x: -x[1])
    ]
    return contributions


def predict_risk(features: dict) -> dict:
    model = get_model()
    row = [[features[f] for f in FEATURES]]
    score = float(model.predict(row)[0])
    score = max(0.0, min(1.0, score))

    return {
        "risk_score": round(score, 4),
        "risk_score_pct": round(score * 100, 1),
        "risk_level": risk_level_from_score(score),
        "risk_window": risk_window_from_score(score),
        "contributing_factors": explain_contributions(features),
        "note": "Prototype AI model output — trained on simulated data for SIH 2026 demo.",
    }
