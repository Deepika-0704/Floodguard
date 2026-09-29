"""
FloodGuard AI - Prototype multilingual assistant.
Rule-based (keyword) responses generated from live application data,
so it works fully offline without requiring a paid LLM API.
Supports English and Hindi (Latin-script / Hinglish) keywords.
"""

from services.logic import get_safe_route, get_shelters
from database.db import get_conn, dict_from_row


def _nearest_shelter():
    shelters = get_shelters()
    available = [s for s in shelters if s["accessibility"] == "AVAILABLE"]
    available.sort(key=lambda s: s["capacity"] - s["occupied"], reverse=True)
    return available[0] if available else shelters[0]


def _top_risk_zone():
    conn = get_conn()
    row = conn.execute("SELECT * FROM zones ORDER BY CASE risk "
                        "WHEN 'VERY HIGH' THEN 4 WHEN 'HIGH' THEN 3 "
                        "WHEN 'MODERATE' THEN 2 ELSE 1 END DESC LIMIT 1").fetchone()
    conn.close()
    return dict_from_row(row)


def get_assistant_reply(message: str, lang: str = "en"):
    msg = message.lower()

    route_keywords = ["route", "safe route", "kaunsa", "raasta", "rasta", "way"]
    shelter_keywords = ["shelter", "camp", "kahan jau", "kahan jaaun", "relief"]
    risk_keywords = ["risk", "khatra", "flood", "baadh", "status"]
    sos_keywords = ["help", "sos", "madad", "emergency", "bachao"]

    if any(k in msg for k in sos_keywords):
        if lang == "hi":
            return "Agar aap emergency mein hain, turant SOS button dabaayein. Aapki location aur zaroorat rescue team tak bhej di jaayegi."
        return "If this is an emergency, please tap the SOS button immediately. Your location and needs will be sent to the rescue team."

    if any(k in msg for k in route_keywords):
        route_info = get_safe_route("Your location", "Nearest Shelter")
        safe = next(r for r in route_info["routes"] if r["safe"])
        if lang == "hi":
            return f"Available flood-risk data ke according {safe['route']} currently safer option hai, via {safe['via']}. Estimated time: {safe['estimated_time_min']} minutes."
        return f"Based on available flood-risk data, {safe['route']} (via {safe['via']}) is currently the safer option. Estimated time: {safe['estimated_time_min']} minutes."

    if any(k in msg for k in shelter_keywords):
        s = _nearest_shelter()
        if lang == "hi":
            return f"Nearest designated shelter '{s['name']}' hai, jahan {s['capacity'] - s['occupied']} jagah available hai."
        return f"The nearest designated shelter is '{s['name']}', with {s['capacity'] - s['occupied']} spaces currently available."

    if any(k in msg for k in risk_keywords):
        z = _top_risk_zone()
        if lang == "hi":
            return f"Sabse zyada risk wala zone abhi '{z['name']}' hai, jiska risk level {z['risk']} hai. Kripya alerts par nazar rakhein."
        return f"The highest-risk zone right now is '{z['name']}' at {z['risk']} risk. Please keep an eye on alerts for updates."

    if lang == "hi":
        return "Main FloodGuard AI assistant hoon. Aap mujhse safe route, shelter, ya current flood risk ke baare mein pooch sakte hain."
    return "I'm the FloodGuard AI assistant. You can ask me about the safe route, nearest shelter, or the current flood risk in your area."
