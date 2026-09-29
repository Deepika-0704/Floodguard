import React, { useState } from "react";
import { ArrowRight, X, Check } from "lucide-react";
import api from "../../services/api";
import FloodMap from "../../components/FloodMap";
import { Card, Button, Disclaimer } from "../../components/ui";

const FALLBACK_ROUTES = {
  start: "Home", destination: "Nearest Shelter",
  routes: [
    { route: "Route A", status: "POTENTIALLY AFFECTED", via: "Riverside Road", estimated_time_min: 18, safe: false },
    { route: "Route B", status: "SAFER AVAILABLE ROUTE", via: "NH-44 Bypass", estimated_time_min: 24, safe: true },
  ],
  disclaimer: "Route recommendation is based on available prototype flood-risk and road-condition data.",
};

// Illustrative demo coordinates for the two routes on the map
const ROUTE_A_PATH = [[29.393, 76.968], [29.395, 76.965], [29.397, 76.972]];
const ROUTE_B_PATH = [[29.393, 76.968], [29.388, 76.960], [29.397, 76.972]];

export default function SafeRoute() {
  const [start, setStart] = useState("Home");
  const [destination, setDestination] = useState("Nearest Shelter");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function findRoute() {
    setLoading(true);
    const res = await api.route({ start, destination }, FALLBACK_ROUTES);
    setResult(res);
    setLoading(false);
  }

  const mapRoutes = result ? result.routes.map((r, i) => ({
    positions: i === 0 ? ROUTE_A_PATH : ROUTE_B_PATH,
    safe: r.safe,
    label: r.route,
  })) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-semibold">🛣️ Flood-Aware Routing</h2>

      <Card className="p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Start Location</label>
            <input value={start} onChange={(e) => setStart(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flood-teal/40" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Destination / Shelter</label>
            <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flood-teal/40" />
          </div>
        </div>
        <Button className="mt-4" onClick={findRoute} disabled={loading}>
          Find Safer Route <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>

      {result && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            {result.routes.map((r) => (
              <Card key={r.route} className={`p-4 border-2 ${r.safe ? "border-flood-moss/40" : "border-flood-coral/40"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{r.route}</span>
                  {r.safe ? <Check className="h-4 w-4 text-flood-moss" /> : <X className="h-4 w-4 text-flood-coral" />}
                </div>
                <div className={`text-sm font-medium ${r.safe ? "text-flood-moss" : "text-flood-coral"}`}>{r.status}</div>
                <div className="text-xs text-slate-500 mt-2">Via {r.via} · ~{r.estimated_time_min} min</div>
              </Card>
            ))}
          </div>
          <Card className="p-2 h-[420px]">
            <FloodMap center={[29.393, 76.967]} zoom={13} routes={mapRoutes} height="100%" />
          </Card>
          <Disclaimer>{result.disclaimer}</Disclaimer>
        </>
      )}
    </div>
  );
}
