import React, { useState } from "react";
import { SlidersHorizontal, Play } from "lucide-react";
import api from "../../services/api";
import { DarkCard, StatTile, Button } from "../../components/ui";

const FALLBACK_RESULT = {
  severity_score: 0.72,
  additional_high_risk_zones: 3,
  additional_population_exposed: 3200,
  roads_affected_count: 2,
  newly_affected_roads: ["Sector 12 Link Road"],
  shelters_inaccessible: ["Yamuna Relief Camp"],
  recommended_shelter: "Panipat Sports Stadium",
  note: "Prototype rule-based simulation — for SIH 2026 demo purposes.",
};

export default function WhatIfSimulator() {
  const [rainfall, setRainfall] = useState(120);
  const [riverLevel, setRiverLevel] = useState(5);
  const [soilMoisture, setSoilMoisture] = useState(60);
  const [roadStatus, setRoadStatus] = useState("Open");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runSimulation() {
    setLoading(true);
    const res = await api.simulate(
      { rainfall, river_level: riverLevel, soil_moisture: soilMoisture, road_status: roadStatus },
      FALLBACK_RESULT
    );
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-flood-cyan" /> What-If Flood Simulator
      </h2>

      <DarkCard className="p-5 space-y-5">
        <SliderRow label="Rainfall" value={rainfall} min={50} max={250} unit="mm" onChange={setRainfall} />
        <SliderRow label="River Level" value={riverLevel} min={1} max={10} step={0.1} unit="m" onChange={setRiverLevel} />
        <SliderRow label="Soil Moisture" value={soilMoisture} min={20} max={100} unit="%" onChange={setSoilMoisture} />

        <div>
          <label className="text-xs text-slate-400 font-mono mb-1 block">Road Status</label>
          <div className="flex gap-2">
            {["Open", "Blocked"].map((s) => (
              <button
                key={s}
                onClick={() => setRoadStatus(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${roadStatus === s ? "bg-flood-cyan text-deep-950" : "bg-white/5 text-slate-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={runSimulation} disabled={loading} className="w-full sm:w-auto">
          <Play className="h-4 w-4" /> {loading ? "Running..." : "Run Simulation"}
        </Button>
      </DarkCard>

      {result && (
        <DarkCard className="p-5 space-y-4">
          <h3 className="font-display font-semibold text-white">Scenario Result</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile dark tone="coral" label="New High-Risk Zones" value={`+${result.additional_high_risk_zones}`} />
            <StatTile dark tone="amber" label="Additional Exposed" value={`+${result.additional_population_exposed?.toLocaleString()}`} />
            <StatTile dark label="Roads Affected" value={result.roads_affected_count} />
            <StatTile dark tone="cyan" label="Severity Score" value={result.severity_score} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-slate-400 text-xs font-mono mb-1">🚧 Newly Affected Roads</div>
              {result.newly_affected_roads?.length ? result.newly_affected_roads.map((r) => <div key={r} className="text-slate-200">{r}</div>) : <div className="text-slate-500">None</div>}
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-slate-400 text-xs font-mono mb-1">🏠 Shelters Becoming Inaccessible</div>
              {result.shelters_inaccessible?.length ? result.shelters_inaccessible.map((s) => <div key={s} className="text-flood-coral">{s}</div>) : <div className="text-slate-500">None</div>}
            </div>
          </div>

          <div className="bg-flood-moss/10 border border-flood-moss/20 rounded-lg p-3 text-sm text-flood-moss font-medium">
            🏠 Recommended Shelter: {result.recommended_shelter}
          </div>
          <p className="text-xs text-slate-500 italic">{result.note}</p>
        </DarkCard>
      )}
    </div>
  );
}

function SliderRow({ label, value, min, max, step = 1, unit, onChange }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
        <span>{label}</span>
        <span className="text-flood-cyan">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-flood-cyan"
      />
    </div>
  );
}
