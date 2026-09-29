"""
FloodGuard AI - Prototype ML Training Script
=============================================
Generates a realistic SYNTHETIC flood-risk dataset (labelled clearly as
prototype data) and trains a lightweight RandomForestRegressor to predict
a flood risk score (0-1) from environmental features.

This is NOT trained on real government data. It is a prototype model
built for the SIH 2026 demo so the pipeline is genuinely end-to-end
(features in -> model -> prediction out) rather than hardcoded.
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "flood_training_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "flood_model.pkl")

FEATURES = ["rainfall", "river_level", "soil_moisture", "elevation", "slope", "urbanization"]


def generate_dataset(n=4000, seed=42):
    """Generate a synthetic but *physically plausible* flood dataset.

    The target risk score is built from a weighted, non-linear combination
    of the features (roughly matching known flood-risk drivers) plus noise,
    so the Random Forest has real signal to learn rather than pure noise.
    """
    rng = np.random.default_rng(seed)

    rainfall = rng.uniform(0, 300, n)              # mm in last 24h
    river_level = rng.uniform(0.5, 12, n)           # meters above baseline
    soil_moisture = rng.uniform(10, 100, n)         # % saturation
    elevation = rng.uniform(5, 300, n)               # meters above sea level
    slope = rng.uniform(0, 15, n)                    # degrees
    urbanization = rng.uniform(0, 100, n)            # % built-up / impervious surface

    # Normalize each driver to 0-1 contribution
    rainfall_c = np.clip(rainfall / 250, 0, 1)
    river_c = np.clip(river_level / 10, 0, 1)
    soil_c = np.clip(soil_moisture / 100, 0, 1)
    elevation_c = np.clip(1 - (elevation / 300), 0, 1)   # lower elevation -> higher risk
    slope_c = np.clip(1 - (slope / 15), 0, 1)            # flatter land -> higher risk
    urban_c = np.clip(urbanization / 100, 0, 1)          # more concrete -> less absorption

    # Weighted combination approximating real-world flood risk drivers
    risk = (
        0.32 * rainfall_c +
        0.24 * river_c +
        0.18 * soil_c +
        0.14 * urban_c +
        0.07 * elevation_c +
        0.05 * slope_c
    )

    # Add interaction effect: heavy rain + already-saturated soil compounds risk
    risk += 0.10 * (rainfall_c * soil_c)

    # Noise for realism
    noise = rng.normal(0, 0.04, n)
    risk = np.clip(risk + noise, 0, 1)

    df = pd.DataFrame({
        "rainfall": rainfall.round(1),
        "river_level": river_level.round(2),
        "soil_moisture": soil_moisture.round(1),
        "elevation": elevation.round(1),
        "slope": slope.round(1),
        "urbanization": urbanization.round(1),
        "risk_score": risk.round(4),
    })
    return df


def train():
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)

    if not os.path.exists(DATA_PATH):
        df = generate_dataset()
        df.to_csv(DATA_PATH, index=False)
        print(f"[FloodGuard] Generated synthetic prototype dataset -> {DATA_PATH} ({len(df)} rows)")
    else:
        df = pd.read_csv(DATA_PATH)
        print(f"[FloodGuard] Loaded existing dataset -> {DATA_PATH} ({len(df)} rows)")

    X = df[FEATURES]
    y = df["risk_score"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(
        n_estimators=150,
        max_depth=10,
        min_samples_leaf=3,
        random_state=42,
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f"[FloodGuard] Model trained. Test MAE = {mae:.4f}")

    joblib.dump({"model": model, "features": FEATURES}, MODEL_PATH)
    print(f"[FloodGuard] Model saved -> {MODEL_PATH}")
    return model


def load_or_train_model():
    if os.path.exists(MODEL_PATH):
        bundle = joblib.load(MODEL_PATH)
        return bundle["model"]
    return train()


if __name__ == "__main__":
    train()
