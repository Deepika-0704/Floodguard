// Fallback / bootstrap demo data — used only if the backend API is
// unreachable, so the prototype UI never shows a blank/broken screen.
// Clearly "Prototype / Simulated Data" per project scope.

export const LOCATIONS = [
  { id: 1, name: "Panipat", lat: 29.3909, lng: 76.9635 },
  { id: 2, name: "Delhi", lat: 28.6667, lng: 77.2410 },
  { id: 3, name: "Gurugram", lat: 28.4595, lng: 77.0266 },
  { id: 4, name: "Yamuna Zone", lat: 29.2000, lng: 77.3000 },
  { id: 5, name: "Demo Flood Zone", lat: 29.3500, lng: 77.0500 },
];

export const CONTRIBUTING_FACTORS = [
  { factor: "Rainfall", contribution_pct: 35 },
  { factor: "River Level", contribution_pct: 25 },
  { factor: "Soil Moisture", contribution_pct: 20 },
  { factor: "Urbanization", contribution_pct: 12 },
  { factor: "Terrain / Slope", contribution_pct: 8 },
];

export const ALERTS = [
  { level: "normal", icon: "cloud", text: "Rain is expected today. Keep an umbrella handy." },
  { level: "rising", icon: "trending-up", text: "Your area's flood risk is increasing." },
  { level: "high", icon: "alert-triangle", text: "Your area is entering HIGH flood risk." },
  { level: "emergency", icon: "siren", text: "EMERGENCY FLOOD ALERT — Your area is at high risk. Check designated safer routes and shelters." },
];
