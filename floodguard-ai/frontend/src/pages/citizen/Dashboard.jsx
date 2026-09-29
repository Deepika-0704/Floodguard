import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, HelpCircle, CloudRain, Waves, Mountain, Building2, Droplets, ArrowRight, Radio } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import api from "../../services/api";
import { LOCATIONS, CONTRIBUTING_FACTORS, ALERTS } from "../../data/fallback";
import { Card, RiskPill, Button, SimBadge, StatTile } from "../../components/ui";

const FACTOR_ICON = {
  Rainfall: CloudRain,
  "River Level": Waves,
  "Soil Moisture": Droplets,
  Urbanization: Building2,
  Elevation: Mountain,
  "Terrain / Slope": Mountain,
};

const FACTOR_COLOR = ["#0EA5A8", "#22D3EE", "#F5A623", "#7C6CF0", "#F2545B", "#3FB37F"];

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [locations, setLocations] = useState(LOCATIONS);
  const [showWhy, setShowWhy] = useState(false);
  const [scenario, setScenario] = useState({ rainfall: 60, river_level: 3.2, soil_moisture: 55, elevation: 90, slope: 3, urbanization: 60 });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.locations(LOCATIONS).then(setLocations);
  }, []);

  useEffect(() => {
    runPrediction(scenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runPrediction(input) {
    setLoading(true);
    const result = await api.predictRisk(input);
    setLoading(false);
    if (result) {
      setPrediction(result);
    } else {
      // graceful fallback if backend not reachable
      setPrediction({
        risk_score_pct: 42,
        risk_level: "MODERATE",
        risk_window: "8-24 hours",
        contributing_factors: CONTRIBUTING_FACTORS,
        note: "Prototype AI model output — trained on simulated data for SIH 2026 demo. (offline fallback)",
      });
    }
  }

  function simulateWorseningConditions() {
    const worse = { ...scenario, rainfall: 230, river_level: 8.7, soil_moisture: 92, urbanization: 82 };
    setScenario(worse);
    runPrediction(worse);
  }

  const level = prediction?.risk_level || "MODERATE";
  const alertForLevel = level === "VERY HIGH" ? ALERTS[3] : level === "HIGH" ? ALERTS[2] : level === "MODERATE" ? ALERTS[1] : ALERTS[0];

  return (
    <div className="space-y-6">
      {/* Location selector */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="text-lg">📍</span> Selected Location
        </div>
        <div className="relative">
          <select
            value={location.name}
            onChange={(e) => setLocation(locations.find((l) => l.name === e.target.value) || location)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-flood-teal/40"
          >
            {locations.map((l) => (
              <option key={l.id || l.name} value={l.name}>{l.name}</option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </Card>

      {/* Alert banner */}
      <div className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 ${
        alertForLevel.level === "emergency" ? "bg-red-50 text-red-700 border border-red-200" :
        alertForLevel.level === "high" ? "bg-orange-50 text-orange-700 border border-orange-200" :
        alertForLevel.level === "rising" ? "bg-amber-50 text-amber-700 border border-amber-200" :
        "bg-sky-50 text-sky-700 border border-sky-200"
      }`}>
        {alertForLevel.text}
      </div>

      {/* Flood risk card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Current Flood Risk — {location.name}</div>
            <div className="flex items-center gap-3 mb-1">
              <RiskPill level={level} size="md" />
              {loading && <span className="text-xs text-slate-400">updating…</span>}
            </div>
            <div className="text-4xl font-display font-semibold mt-2">{prediction?.risk_score_pct ?? "--"}%</div>
            <div className="text-sm text-slate-500 mt-1">Estimated Risk Window: <b className="text-slate-800">{prediction?.risk_window}</b></div>
          </div>

          <div className="flex flex-col gap-2 min-w-[220px]">
            <Button variant="outline" onClick={() => setShowWhy((v) => !v)}>
              <HelpCircle className="h-4 w-4" /> Why is my risk high?
            </Button>
            <Button variant="ghost" onClick={simulateWorseningConditions}>
              <CloudRain className="h-4 w-4" /> Simulate worsening rainfall
            </Button>
            <Button onClick={() => navigate("/citizen/twin")}>
              <Radio className="h-4 w-4" /> Open Digital Flood Twin
            </Button>
          </div>
        </div>

        {showWhy && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-slate-800">Why is my risk high?</h3>
              <SimBadge>AI explanation / prototype model output</SimBadge>
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prediction?.contributing_factors || CONTRIBUTING_FACTORS} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="factor" type="category" width={110} tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="contribution_pct" radius={[0, 6, 6, 0]}>
                      {(prediction?.contributing_factors || CONTRIBUTING_FACTORS).map((_, i) => (
                        <Cell key={i} fill={FACTOR_COLOR[i % FACTOR_COLOR.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5">
                {(prediction?.contributing_factors || CONTRIBUTING_FACTORS).map((f, i) => {
                  const Icon = FACTOR_ICON[f.factor] || Droplets;
                  return (
                    <div key={f.factor} className="flex items-center gap-3 text-sm">
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 flex-1">{f.factor}</span>
                      <span className="font-semibold text-slate-800">{f.contribution_pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Quick action cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/citizen/map", label: "Flood Map", desc: "View live risk zones, shelters & roads", emoji: "🗺️" },
          { to: "/citizen/route", label: "Safe Route", desc: "Flood-aware navigation to safety", emoji: "🛣️" },
          { to: "/citizen/shelters", label: "Shelters", desc: "Capacity & accessibility near you", emoji: "🏠" },
          { to: "/citizen/report", label: "Report Flood", desc: "Submit a verified flood report", emoji: "📸" },
        ].map((c) => (
          <Card key={c.to} className="p-4 hover:shadow-md transition cursor-pointer group" onClick={() => navigate(c.to)}>
            <div className="text-2xl mb-2">{c.emoji}</div>
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              {c.label} <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="text-xs text-slate-500 mt-1">{c.desc}</div>
          </Card>
        ))}
      </div>

      <SimBadge />
    </div>
  );
}
