"""
FloodGuard AI - Prototype demo dataset.
DEMO / SIMULATED FLOOD SCENARIO — Panipat / Yamuna belt, Haryana (fictional).
All data here is synthetic and created for the SIH 2026 demo. It is NOT
live government data.
"""

LOCATIONS = [
    {"id": 1, "name": "Panipat City", "lat": 29.3909, "lng": 76.9635},
    {"id": 2, "name": "Delhi (Yamuna Bank)", "lat": 28.6667, "lng": 77.2410},
    {"id": 3, "name": "Gurugram", "lat": 28.4595, "lng": 77.0266},
    {"id": 4, "name": "Yamuna Zone", "lat": 29.2000, "lng": 77.3000},
    {"id": 5, "name": "Demo Flood Zone", "lat": 29.3500, "lng": 77.0500},
]

# 18 flood risk zones with base (NOW) risk, used by /flood-zones and the Digital Twin
ZONES = [
    {"id": "Z1", "name": "Zone A - Riverside Colony", "lat": 29.3950, "lng": 76.9700, "risk": "HIGH", "population": 8000, "vulnerability": "HIGH", "hospitals": 2, "schools": 3, "houses": 1600},
    {"id": "Z2", "name": "Zone B - Old City Market", "lat": 29.3870, "lng": 76.9550, "risk": "MODERATE", "population": 12500, "vulnerability": "MODERATE", "hospitals": 1, "schools": 4, "houses": 2400},
    {"id": "Z3", "name": "Zone C - Industrial Belt", "lat": 29.4020, "lng": 76.9800, "risk": "LOW", "population": 4200, "vulnerability": "LOW", "hospitals": 0, "schools": 1, "houses": 700},
    {"id": "Z4", "name": "Zone D - Yamuna Ghat", "lat": 29.2050, "lng": 77.3050, "risk": "VERY HIGH", "population": 6100, "vulnerability": "HIGH", "hospitals": 1, "schools": 2, "houses": 1150},
    {"id": "Z5", "name": "Zone E - New Housing Sector 12", "lat": 29.3800, "lng": 76.9900, "risk": "MODERATE", "population": 9800, "vulnerability": "MODERATE", "hospitals": 1, "schools": 3, "houses": 1900},
    {"id": "Z6", "name": "Zone F - Railway Colony", "lat": 29.3980, "lng": 76.9450, "risk": "HIGH", "population": 5400, "vulnerability": "HIGH", "hospitals": 1, "schools": 2, "houses": 1020},
    {"id": "Z7", "name": "Zone G - Agricultural Belt North", "lat": 29.4150, "lng": 76.9600, "risk": "LOW", "population": 2100, "vulnerability": "LOW", "hospitals": 0, "schools": 1, "houses": 400},
    {"id": "Z8", "name": "Zone H - Bus Stand Area", "lat": 29.3900, "lng": 76.9680, "risk": "MODERATE", "population": 7600, "vulnerability": "MODERATE", "hospitals": 1, "schools": 2, "houses": 1450},
    {"id": "Z9", "name": "Zone I - Gurugram Sector 29", "lat": 28.4620, "lng": 77.0500, "risk": "LOW", "population": 15200, "vulnerability": "LOW", "hospitals": 2, "schools": 5, "houses": 3100},
    {"id": "Z10", "name": "Zone J - Delhi Yamuna Bank Slums", "lat": 28.6700, "lng": 77.2450, "risk": "VERY HIGH", "population": 18400, "vulnerability": "HIGH", "hospitals": 1, "schools": 3, "houses": 3600},
    {"id": "Z11", "name": "Zone K - Demo Zone Central", "lat": 29.3500, "lng": 77.0500, "risk": "HIGH", "population": 10200, "vulnerability": "HIGH", "hospitals": 1, "schools": 3, "houses": 2000},
    {"id": "Z12", "name": "Zone L - Demo Zone East", "lat": 29.3600, "lng": 77.0650, "risk": "MODERATE", "population": 5300, "vulnerability": "MODERATE", "hospitals": 0, "schools": 1, "houses": 980},
    {"id": "Z13", "name": "Zone M - Panipat Textile Hub", "lat": 29.3750, "lng": 76.9500, "risk": "LOW", "population": 6700, "vulnerability": "LOW", "hospitals": 1, "schools": 2, "houses": 1300},
    {"id": "Z14", "name": "Zone N - Yamuna Floodplain Farms", "lat": 29.2150, "lng": 77.3150, "risk": "VERY HIGH", "population": 3200, "vulnerability": "HIGH", "hospitals": 0, "schools": 1, "houses": 610},
    {"id": "Z15", "name": "Zone O - Gurugram Cyber Hub", "lat": 28.4950, "lng": 77.0900, "risk": "LOW", "population": 4100, "vulnerability": "LOW", "hospitals": 1, "schools": 1, "houses": 850},
    {"id": "Z16", "name": "Zone P - Panipat Sector 25", "lat": 29.4050, "lng": 76.9750, "risk": "MODERATE", "population": 8900, "vulnerability": "MODERATE", "hospitals": 1, "schools": 3, "houses": 1720},
    {"id": "Z17", "name": "Zone Q - Old Bridge Settlement", "lat": 29.3920, "lng": 76.9620, "risk": "HIGH", "population": 4700, "vulnerability": "HIGH", "hospitals": 0, "schools": 1, "houses": 900},
    {"id": "Z18", "name": "Zone R - Demo Zone West", "lat": 29.3450, "lng": 77.0350, "risk": "MODERATE", "population": 6200, "vulnerability": "MODERATE", "hospitals": 1, "schools": 2, "houses": 1180},
]

ROADS = [
    {"id": "R1", "name": "NH-44 Panipat Bypass", "status": "OPEN", "risk": "LOW", "path": [[29.390, 76.955], [29.400, 76.970]]},
    {"id": "R2", "name": "Riverside Road", "status": "AFFECTED", "risk": "HIGH", "path": [[29.393, 76.968], [29.397, 76.972]]},
    {"id": "R3", "name": "Old Bridge Road", "status": "BLOCKED", "risk": "VERY HIGH", "path": [[29.391, 76.961], [29.393, 76.964]]},
    {"id": "R4", "name": "Sector 12 Link Road", "status": "OPEN", "risk": "LOW", "path": [[29.379, 76.988], [29.382, 76.992]]},
    {"id": "R5", "name": "Railway Colony Road", "status": "AFFECTED", "risk": "MODERATE", "path": [[29.397, 76.944], [29.399, 76.947]]},
    {"id": "R6", "name": "Yamuna Ghat Approach", "status": "BLOCKED", "risk": "VERY HIGH", "path": [[29.203, 77.303], [29.207, 77.307]]},
    {"id": "R7", "name": "Bus Stand Main Road", "status": "OPEN", "risk": "MODERATE", "path": [[29.389, 76.966], [29.391, 76.970]]},
    {"id": "R8", "name": "Delhi Yamuna Embankment Rd", "status": "BLOCKED", "risk": "VERY HIGH", "path": [[28.668, 77.243], [28.672, 77.247]]},
    {"id": "R9", "name": "Gurugram Sector 29 Road", "status": "OPEN", "risk": "LOW", "path": [[28.461, 77.049], [28.464, 77.052]]},
    {"id": "R10", "name": "Demo Zone Central Ave", "status": "AFFECTED", "risk": "HIGH", "path": [[29.349, 77.049], [29.352, 77.052]]},
    {"id": "R11", "name": "Demo Zone East Link", "status": "OPEN", "risk": "MODERATE", "path": [[29.359, 77.064], [29.362, 77.067]]},
    {"id": "R12", "name": "Textile Hub Access Rd", "status": "OPEN", "risk": "LOW", "path": [[29.374, 76.949], [29.377, 76.952]]},
    {"id": "R13", "name": "Floodplain Farm Track", "status": "BLOCKED", "risk": "VERY HIGH", "path": [[29.214, 77.314], [29.217, 77.317]]},
    {"id": "R14", "name": "Cyber Hub Connector", "status": "OPEN", "risk": "LOW", "path": [[28.494, 77.089], [28.497, 77.092]]},
    {"id": "R15", "name": "Sector 25 Ring Road", "status": "AFFECTED", "risk": "MODERATE", "path": [[29.404, 76.973], [29.407, 76.977]]},
    {"id": "R16", "name": "Old Bridge Settlement Rd", "status": "AFFECTED", "risk": "HIGH", "path": [[29.391, 76.961], [29.394, 76.964]]},
    {"id": "R17", "name": "Demo Zone West Highway", "status": "OPEN", "risk": "LOW", "path": [[29.344, 77.033], [29.347, 77.036]]},
]

SHELTERS = [
    {"id": "S1", "name": "Government School A (Sector 12)", "lat": 29.3820, "lng": 76.9910, "capacity": 500, "occupied": 320, "accessibility": "AVAILABLE", "road_condition": "ACCESSIBLE"},
    {"id": "S2", "name": "Community Hall - Old City", "lat": 29.3860, "lng": 76.9560, "capacity": 350, "occupied": 340, "accessibility": "NEARLY FULL", "road_condition": "ACCESSIBLE"},
    {"id": "S3", "name": "Panipat Sports Stadium", "lat": 29.4000, "lng": 76.9720, "capacity": 1200, "occupied": 410, "accessibility": "AVAILABLE", "road_condition": "ACCESSIBLE"},
    {"id": "S4", "name": "Govt Senior Secondary School B", "lat": 29.3970, "lng": 76.9460, "capacity": 400, "occupied": 180, "accessibility": "AVAILABLE", "road_condition": "AFFECTED ROAD NEARBY"},
    {"id": "S5", "name": "Yamuna Relief Camp", "lat": 29.2100, "lng": 77.3100, "capacity": 600, "occupied": 590, "accessibility": "NEARLY FULL", "road_condition": "BLOCKED ROAD NEARBY"},
    {"id": "S6", "name": "Gurugram Sector 29 Community Center", "lat": 28.4640, "lng": 77.0520, "capacity": 450, "occupied": 90, "accessibility": "AVAILABLE", "road_condition": "ACCESSIBLE"},
    {"id": "S7", "name": "Demo Zone Central Relief Shelter", "lat": 29.3520, "lng": 77.0520, "capacity": 550, "occupied": 260, "accessibility": "AVAILABLE", "road_condition": "ACCESSIBLE"},
    {"id": "S8", "name": "Textile Hub Vocational Institute", "lat": 29.3770, "lng": 76.9520, "capacity": 300, "occupied": 60, "accessibility": "AVAILABLE", "road_condition": "ACCESSIBLE"},
    {"id": "S9", "name": "Delhi Yamuna Bank Relief Center", "lat": 28.6720, "lng": 77.2470, "capacity": 800, "occupied": 720, "accessibility": "NEARLY FULL", "road_condition": "BLOCKED ROAD NEARBY"},
]

HOSPITALS = [
    {"id": "H1", "name": "Panipat Civil Hospital", "lat": 29.3880, "lng": 76.9680},
    {"id": "H2", "name": "Yamuna Community Health Center", "lat": 29.2080, "lng": 77.3080},
    {"id": "H3", "name": "Gurugram District Hospital", "lat": 28.4610, "lng": 77.0480},
    {"id": "H4", "name": "Sector 12 Multi-Specialty Clinic", "lat": 29.3830, "lng": 76.9930},
    {"id": "H5", "name": "Delhi Yamuna Bank PHC", "lat": 28.6680, "lng": 77.2430},
]

SCHOOLS = [
    {"id": "SC1", "name": "Govt Primary School, Riverside", "lat": 29.3945, "lng": 76.9695},
    {"id": "SC2", "name": "DAV Public School, Panipat", "lat": 29.3900, "lng": 76.9600},
    {"id": "SC3", "name": "Sector 12 Model School", "lat": 29.3815, "lng": 76.9905},
    {"id": "SC4", "name": "Yamuna Ghat Govt School", "lat": 29.2060, "lng": 77.3060},
    {"id": "SC5", "name": "Gurugram Sector 29 School", "lat": 28.4615, "lng": 77.0495},
]

RESOURCES = {
    "boats": {"total": 5, "available": 5},
    "ambulances": {"total": 8, "available": 8},
    "rescue_teams": {"total": 6, "available": 6},
    "medical_units": {"total": 3, "available": 3},
}

CITIZEN_REPORTS = [
    {"id": 1, "location": "Zone A - Riverside Colony", "lat": 29.3948, "lng": 76.9702, "water_level": "Knee-deep (~0.5m)", "description": "Water entering ground floor homes near the river bank.", "status": "LIKELY VERIFIED", "confidence": 91},
    {"id": 2, "location": "Zone D - Yamuna Ghat", "lat": 29.2055, "lng": 77.3055, "water_level": "Waist-deep (~1.1m)", "description": "Ghat area fully submerged, families evacuating.", "status": "LIKELY VERIFIED", "confidence": 88},
    {"id": 3, "location": "Zone Q - Old Bridge Settlement", "lat": 29.3922, "lng": 76.9618, "water_level": "Ankle-deep (~0.2m)", "description": "Water rising slowly near the old bridge.", "status": "UNCERTAIN", "confidence": 62},
]

SOS_REQUESTS = [
    {"id": 1, "location": "Zone A - Riverside Colony", "lat": 29.3951, "lng": 76.9705, "people": 4, "type": "EVACUATION", "status": "PENDING"},
    {"id": 2, "location": "Zone D - Yamuna Ghat", "lat": 29.2058, "lng": 77.3058, "people": 2, "type": "MEDICAL", "status": "PENDING"},
]

VULNERABILITY = [
    {"zone_id": "Z1", "zone": "Zone A - Riverside Colony", "flood_risk": "HIGH", "population": 8000, "vulnerability": "HIGH", "hospitals": 2, "schools": 3, "elderly_pct": 14, "children_pct": 22},
    {"zone_id": "Z4", "zone": "Zone D - Yamuna Ghat", "flood_risk": "VERY HIGH", "population": 6100, "vulnerability": "HIGH", "hospitals": 1, "schools": 2, "elderly_pct": 18, "children_pct": 20},
    {"zone_id": "Z10", "zone": "Zone J - Delhi Yamuna Bank Slums", "flood_risk": "VERY HIGH", "population": 18400, "vulnerability": "HIGH", "hospitals": 1, "schools": 3, "elderly_pct": 12, "children_pct": 28},
    {"zone_id": "Z11", "zone": "Zone K - Demo Zone Central", "flood_risk": "HIGH", "population": 10200, "vulnerability": "HIGH", "hospitals": 1, "schools": 3, "elderly_pct": 15, "children_pct": 19},
    {"zone_id": "Z14", "zone": "Zone N - Yamuna Floodplain Farms", "flood_risk": "VERY HIGH", "population": 3200, "vulnerability": "HIGH", "hospitals": 0, "schools": 1, "elderly_pct": 20, "children_pct": 17},
]

# Digital Twin timeline scenario — how zone risk / impact escalates over time
TWIN_TIMELINE = {
    "NOW": {"risk_multiplier": 1.0, "population_multiplier": 1.0, "label": "Moderate risk building along the Yamuna belt", "additional_blocked_roads": []},
    "+2HR": {"risk_multiplier": 1.15, "population_multiplier": 1.2, "label": "High risk — river level rising, low-lying zones affected", "additional_blocked_roads": ["R2", "R5"]},
    "+4HR": {"risk_multiplier": 1.35, "population_multiplier": 1.5, "label": "Very high risk — flooding reaching residential colonies", "additional_blocked_roads": ["R2", "R5", "R10", "R15"]},
    "+6HR": {"risk_multiplier": 1.55, "population_multiplier": 1.8, "label": "Critical — multiple zones inundated, shelters nearing capacity", "additional_blocked_roads": ["R2", "R5", "R10", "R15", "R16"]},
    "+12HR": {"risk_multiplier": 1.75, "population_multiplier": 2.1, "label": "Critical — peak flood extent projected across the demo scenario", "additional_blocked_roads": ["R2", "R5", "R10", "R15", "R16", "R7"]},
}
