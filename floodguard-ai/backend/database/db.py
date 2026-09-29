import sqlite3
import os
import json
from . import seed_data as sd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "data", "floodguard.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(reset=False):
    if reset and os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    fresh = not os.path.exists(DB_PATH)
    conn = get_conn()
    cur = conn.cursor()

    cur.executescript("""
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY, name TEXT, lat REAL, lng REAL
    );
    CREATE TABLE IF NOT EXISTS zones (
        id TEXT PRIMARY KEY, name TEXT, lat REAL, lng REAL, risk TEXT,
        population INTEGER, vulnerability TEXT, hospitals INTEGER,
        schools INTEGER, houses INTEGER
    );
    CREATE TABLE IF NOT EXISTS roads (
        id TEXT PRIMARY KEY, name TEXT, status TEXT, risk TEXT, path TEXT
    );
    CREATE TABLE IF NOT EXISTS shelters (
        id TEXT PRIMARY KEY, name TEXT, lat REAL, lng REAL, capacity INTEGER,
        occupied INTEGER, accessibility TEXT, road_condition TEXT
    );
    CREATE TABLE IF NOT EXISTS hospitals (
        id TEXT PRIMARY KEY, name TEXT, lat REAL, lng REAL
    );
    CREATE TABLE IF NOT EXISTS schools (
        id TEXT PRIMARY KEY, name TEXT, lat REAL, lng REAL
    );
    CREATE TABLE IF NOT EXISTS resources (
        name TEXT PRIMARY KEY, total INTEGER, available INTEGER
    );
    CREATE TABLE IF NOT EXISTS citizen_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT, location TEXT, lat REAL, lng REAL,
        water_level TEXT, description TEXT, image_provided INTEGER,
        status TEXT, confidence REAL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sos_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT, location TEXT, lat REAL, lng REAL,
        people INTEGER, type TEXT, status TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS vulnerability_data (
        zone_id TEXT PRIMARY KEY, zone TEXT, flood_risk TEXT, population INTEGER,
        vulnerability TEXT, hospitals INTEGER, schools INTEGER,
        elderly_pct INTEGER, children_pct INTEGER
    );
    CREATE TABLE IF NOT EXISTS flood_predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, rainfall REAL, river_level REAL,
        soil_moisture REAL, elevation REAL, slope REAL, urbanization REAL,
        risk_score REAL, risk_level TEXT, risk_window TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS simulation_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT, params TEXT, result TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)
    conn.commit()

    if fresh:
        _seed(conn)
        print("[FloodGuard] Database created and seeded with demo scenario data.")
    conn.close()


def _seed(conn):
    cur = conn.cursor()

    for loc in sd.LOCATIONS:
        cur.execute("INSERT OR IGNORE INTO locations VALUES (?,?,?,?)",
                    (loc["id"], loc["name"], loc["lat"], loc["lng"]))

    for z in sd.ZONES:
        cur.execute("INSERT OR IGNORE INTO zones VALUES (?,?,?,?,?,?,?,?,?,?)",
                    (z["id"], z["name"], z["lat"], z["lng"], z["risk"], z["population"],
                     z["vulnerability"], z["hospitals"], z["schools"], z["houses"]))

    for r in sd.ROADS:
        cur.execute("INSERT OR IGNORE INTO roads VALUES (?,?,?,?,?)",
                    (r["id"], r["name"], r["status"], r["risk"], json.dumps(r["path"])))

    for s in sd.SHELTERS:
        cur.execute("INSERT OR IGNORE INTO shelters VALUES (?,?,?,?,?,?,?,?)",
                    (s["id"], s["name"], s["lat"], s["lng"], s["capacity"],
                     s["occupied"], s["accessibility"], s["road_condition"]))

    for h in sd.HOSPITALS:
        cur.execute("INSERT OR IGNORE INTO hospitals VALUES (?,?,?,?)",
                    (h["id"], h["name"], h["lat"], h["lng"]))

    for sc in sd.SCHOOLS:
        cur.execute("INSERT OR IGNORE INTO schools VALUES (?,?,?,?)",
                    (sc["id"], sc["name"], sc["lat"], sc["lng"]))

    for name, r in sd.RESOURCES.items():
        cur.execute("INSERT OR IGNORE INTO resources VALUES (?,?,?)",
                    (name, r["total"], r["available"]))

    for rep in sd.CITIZEN_REPORTS:
        cur.execute("""INSERT INTO citizen_reports
            (location, lat, lng, water_level, description, image_provided, status, confidence)
            VALUES (?,?,?,?,?,?,?,?)""",
            (rep["location"], rep["lat"], rep["lng"], rep["water_level"],
             rep["description"], 1, rep["status"], rep["confidence"]))

    for req in sd.SOS_REQUESTS:
        cur.execute("""INSERT INTO sos_requests (location, lat, lng, people, type, status)
            VALUES (?,?,?,?,?,?)""",
            (req["location"], req["lat"], req["lng"], req["people"], req["type"], req["status"]))

    for v in sd.VULNERABILITY:
        cur.execute("INSERT OR IGNORE INTO vulnerability_data VALUES (?,?,?,?,?,?,?,?,?)",
                    (v["zone_id"], v["zone"], v["flood_risk"], v["population"], v["vulnerability"],
                     v["hospitals"], v["schools"], v["elderly_pct"], v["children_pct"]))

    conn.commit()


def dict_from_row(row):
    return {k: row[k] for k in row.keys()} if row else None
