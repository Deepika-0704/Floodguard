import json
from database.db import get_conn, dict_from_row
from database import seed_data as sd

RISK_ORDER = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "CRITICAL"]


def bump_risk(risk: str, steps: int) -> str:
    """Escalate a risk level by `steps` on the RISK_ORDER ladder (capped)."""
    idx = RISK_ORDER.index(risk) if risk in RISK_ORDER else 1
    idx = min(idx + steps, len(RISK_ORDER) - 1)
    return RISK_ORDER[idx]


def get_zones(time_key: str = "NOW"):
    """Return all zones, with risk/population escalated according to the
    Digital Twin timeline for the requested time_key (NOW, +2HR, +4HR, +6HR, +12HR)."""
    conn = get_conn()
    rows = conn.execute("SELECT * FROM zones").fetchall()
    conn.close()
    zones = [dict_from_row(r) for r in rows]

    twin = sd.TWIN_TIMELINE.get(time_key, sd.TWIN_TIMELINE["NOW"])
    pop_mult = twin["population_multiplier"]

    # steps of escalation applied on top of base "NOW" risk
    escalation_steps = {"NOW": 0, "+2HR": 1, "+4HR": 2, "+6HR": 3, "+12HR": 4}
    steps = escalation_steps.get(time_key, 0)

    out = []
    for z in zones:
        escalated_risk = bump_risk(z["risk"], steps) if steps else z["risk"]
        out.append({
            **z,
            "risk": escalated_risk,
            "base_risk": z["risk"],
            "population_exposed_estimate": int(z["population"] * min(pop_mult, 1.0) if steps == 0
                                                 else z["population"] * min(pop_mult, 1.3)),
        })
    return out, twin


def get_roads(time_key: str = "NOW"):
    conn = get_conn()
    rows = conn.execute("SELECT * FROM roads").fetchall()
    conn.close()
    roads = [dict_from_row(r) for r in rows]
    for r in roads:
        r["path"] = json.loads(r["path"])

    twin = sd.TWIN_TIMELINE.get(time_key, sd.TWIN_TIMELINE["NOW"])
    newly_blocked = set(twin.get("additional_blocked_roads", []))
    for r in roads:
        if r["id"] in newly_blocked and r["status"] != "BLOCKED":
            r["status"] = "BLOCKED"
            r["risk"] = "VERY HIGH"
    return roads


def get_shelters(blocked_road_ids=None):
    conn = get_conn()
    rows = conn.execute("SELECT * FROM shelters").fetchall()
    conn.close()
    shelters = [dict_from_row(r) for r in rows]
    blocked_road_ids = blocked_road_ids or set()

    # Shelters near R6 (Yamuna Ghat) / R8 (Delhi embankment) / R13 become
    # inaccessible if those specific roads are blocked (used by the twin/what-if demo)
    danger_map = {"S5": "R6", "S9": "R8"}
    for s in shelters:
        linked_road = danger_map.get(s["id"])
        if linked_road and linked_road in blocked_road_ids:
            s["accessibility"] = "INACCESSIBLE"
            s["road_condition"] = "BLOCKED"
    return shelters


def get_impact(time_key: str = "NOW"):
    zones, twin = get_zones(time_key)
    roads = get_roads(time_key)

    total_pop = sum(z["population_exposed_estimate"] for z in zones if z["risk"] in ("HIGH", "VERY HIGH", "CRITICAL"))
    total_houses = sum(int(z["houses"] * (twin["population_multiplier"] if time_key != "NOW" else 1))
                        for z in zones if z["risk"] in ("HIGH", "VERY HIGH", "CRITICAL"))
    schools = sum(z["schools"] for z in zones if z["risk"] in ("HIGH", "VERY HIGH", "CRITICAL"))
    hospitals = sum(z["hospitals"] for z in zones if z["risk"] in ("HIGH", "VERY HIGH", "CRITICAL"))
    affected_roads_km = len([r for r in roads if r["status"] in ("AFFECTED", "BLOCKED")]) * 1.2

    return {
        "time": time_key,
        "scenario_label": twin["label"],
        "people_potentially_affected": total_pop,
        "houses_potentially_affected": total_houses,
        "schools_potentially_affected": schools,
        "hospitals_potentially_affected": hospitals,
        "roads_affected_km": round(affected_roads_km, 1),
        "note": "Potential Exposure Estimate — not guaranteed damage. Prototype/simulated data.",
    }


def run_whatif_simulation(rainfall: float, river_level: float, soil_moisture: float, road_status: str):
    """Prototype rule-based what-if simulator. Recalculates risk escalation,
    exposed population, affected roads and shelter availability based on
    slider inputs. Deterministic and clearly responsive to inputs."""
    conn = get_conn()
    zones = [dict_from_row(r) for r in conn.execute("SELECT * FROM zones").fetchall()]
    roads = [dict_from_row(r) for r in conn.execute("SELECT * FROM roads").fetchall()]
    shelters = [dict_from_row(r) for r in conn.execute("SELECT * FROM shelters").fetchall()]
    conn.close()

    # Composite severity score (0-1) from the three sliders
    severity = (
        0.45 * min(rainfall / 250, 1) +
        0.35 * min(river_level / 10, 1) +
        0.20 * min(soil_moisture / 100, 1)
    )

    # Number of risk-escalation steps driven by severity
    if severity >= 0.75:
        steps = 3
    elif severity >= 0.55:
        steps = 2
    elif severity >= 0.35:
        steps = 1
    else:
        steps = 0

    before_high = sum(1 for z in zones if z["risk"] in ("HIGH", "VERY HIGH"))
    escalated_zones = []
    for z in zones:
        new_risk = bump_risk(z["risk"], steps)
        escalated_zones.append({**z, "risk": new_risk})
    after_high = sum(1 for z in escalated_zones if z["risk"] in ("HIGH", "VERY HIGH", "CRITICAL"))

    additional_high_risk_zones = max(0, after_high - before_high)

    pop_multiplier = 1 + severity * 1.4
    exposed_population_before = sum(z["population"] for z in zones if z["risk"] in ("HIGH", "VERY HIGH"))
    exposed_population_after = sum(z["population"] for z in escalated_zones if z["risk"] in ("HIGH", "VERY HIGH", "CRITICAL"))
    additional_exposed = int((exposed_population_after - exposed_population_before) * pop_multiplier / max(pop_multiplier, 1))
    additional_exposed = max(additional_exposed, int(severity * 5000))

    # Roads: if road_status == "Blocked", force one more road blocked; plus severity-driven blocking
    affected_roads = [r for r in roads if r["status"] in ("AFFECTED", "BLOCKED")]
    extra_blocked = []
    candidates = [r for r in roads if r["status"] == "OPEN"]
    n_extra = steps + (1 if road_status.lower() == "blocked" else 0)
    for r in candidates[:n_extra]:
        extra_blocked.append(r["name"])

    total_roads_affected = len(affected_roads) + len(extra_blocked)

    # Shelters: mark shelters near the river as inaccessible under higher severity
    blocked_ids = set()
    if severity >= 0.55 or road_status.lower() == "blocked":
        blocked_ids.add("R6")
    if severity >= 0.75:
        blocked_ids.add("R8")

    shelter_status = get_shelters(blocked_ids)
    inaccessible = [s["name"] for s in shelter_status if s["accessibility"] == "INACCESSIBLE"]
    recommended = next((s["name"] for s in shelter_status
                         if s["accessibility"] == "AVAILABLE" and s["capacity"] - s["occupied"] > 100), "Panipat Sports Stadium")

    result = {
        "severity_score": round(severity, 3),
        "additional_high_risk_zones": additional_high_risk_zones,
        "additional_population_exposed": additional_exposed,
        "roads_affected_count": total_roads_affected,
        "newly_affected_roads": extra_blocked,
        "shelters_inaccessible": inaccessible,
        "recommended_shelter": recommended,
        "note": "Prototype rule-based simulation — for SIH 2026 demo purposes.",
    }

    conn = get_conn()
    conn.execute("INSERT INTO simulation_results (params, result) VALUES (?,?)",
                 (json.dumps({"rainfall": rainfall, "river_level": river_level,
                              "soil_moisture": soil_moisture, "road_status": road_status}),
                  json.dumps(result)))
    conn.commit()
    conn.close()
    return result


def get_safe_route(start: str, destination: str):
    """Prototype flood-aware routing: picks two candidate paths between named
    points and flags one as flood-affected using the roads table's risk data."""
    roads = get_roads()
    high_risk_roads = [r for r in roads if r["risk"] in ("HIGH", "VERY HIGH") or r["status"] in ("AFFECTED", "BLOCKED")]
    safe_roads = [r for r in roads if r["status"] == "OPEN" and r["risk"] in ("LOW", "MODERATE")]

    route_a = {
        "route": "Route A",
        "status": "POTENTIALLY AFFECTED",
        "via": (high_risk_roads[0]["name"] if high_risk_roads else "Riverside Road"),
        "estimated_time_min": 18,
        "safe": False,
    }
    route_b = {
        "route": "Route B",
        "status": "SAFER AVAILABLE ROUTE",
        "via": (safe_roads[0]["name"] if safe_roads else "NH-44 Panipat Bypass"),
        "estimated_time_min": 24,
        "safe": True,
    }
    return {
        "start": start,
        "destination": destination,
        "routes": [route_a, route_b],
        "disclaimer": "Route recommendation is based on available prototype flood-risk and road-condition data. This is not a guarantee of absolute safety.",
    }


def recommend_resources():
    """AI-assisted resource recommendation across high-risk zones based on
    current population exposure and available resources (prototype heuristic)."""
    conn = get_conn()
    zones = [dict_from_row(r) for r in conn.execute(
        "SELECT * FROM zones WHERE risk IN ('HIGH','VERY HIGH') ORDER BY population DESC LIMIT 4").fetchall()]
    resources = {row["name"]: dict_from_row(row) for row in conn.execute("SELECT * FROM resources").fetchall()}
    conn.close()

    pool = {k: v["available"] for k, v in resources.items()}
    recommendations = []
    for z in zones:
        boats = min(pool.get("boats", 0), 2 if z["risk"] == "VERY HIGH" else 1)
        ambulances = min(pool.get("ambulances", 0), 2 if z["population"] > 8000 else 1)
        teams = min(pool.get("rescue_teams", 0), 2 if z["risk"] == "VERY HIGH" else 1)

        pool["boats"] -= boats
        pool["ambulances"] -= ambulances
        pool["rescue_teams"] -= teams

        recommendations.append({
            "zone": z["name"],
            "risk": z["risk"],
            "population": z["population"],
            "boats": boats,
            "ambulances": ambulances,
            "rescue_teams": teams,
        })

    return {
        "recommendations": recommendations,
        "resources_remaining": pool,
        "note": "AI-assisted decision support. Final deployment decisions remain with authorized responders.",
    }
