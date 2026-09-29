import React, { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import api from "../../services/api";
import FloodMap from "../../components/FloodMap";
import { Card, DarkCard, RiskPill, StatTile, SimBadge } from "../../components/ui";

const STEPS = ["NOW", "+2HR", "+4HR", "+6HR", "+12HR"];

export default function DigitalTwin({ dark = false }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [zones, setZones] = useState([]);
  const [roads, setRoads] = useState([]);
  const [impact, setImpact] = useState(null);
  const [scenarioLabel, setScenarioLabel] = useState("");
  const time = STEPS[stepIdx];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [zRes, rRes, iRes] = await Promise.all([
        api.floodZones(time, { zones: [], scenario: "Demo scenario" }),
        api.roads(time, []),
        api.impact(time, null),
      ]);
      if (cancelled) return;
      setZones(zRes.zones || zRes || []);
      setScenarioLabel(zRes.scenario || "");
      setRoads(rRes || []);
      setImpact(iRes);
    }
    load();
    return () => { cancelled = true; };
  }, [time]);

  const Wrapper = dark ? DarkCard : Card;
  const textMuted = dark ? "text-slate-400" : "text-slate-500";
  const textMain = dark ? "text-white" : "text-slate-900";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`text-xl font-display font-semibold flex items-center gap-2 ${textMain}`}>
            <Radio className="h-5 w-5 text-flood-cyan" /> Flood Digital Twin
          </h2>
          <p className={`text-sm mt-0.5 ${textMuted}`}>{scenarioLabel}</p>
        </div>
        <SimBadge />
      </div>

      {/* Timeline scrubber */}
      <Wrapper className="p-5">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStepIdx(i)}
              className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg mx-0.5 transition ${
                i === stepIdx
                  ? "bg-flood-cyan text-deep-950"
                  : dark ? "text-slate-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-slate-200/30 overflow-hidden">
          <div className="h-full bg-flood-cyan transition-all" style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }} />
        </div>
      </Wrapper>

      {/* Impact stats */}
      {impact && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatTile dark={dark} tone="coral" label="People Affected" value={impact.people_potentially_affected?.toLocaleString()} />
          <StatTile dark={dark} tone="amber" label="Houses Affected" value={impact.houses_potentially_affected?.toLocaleString()} />
          <StatTile dark={dark} label="Schools" value={impact.schools_potentially_affected} />
          <StatTile dark={dark} label="Hospitals" value={impact.hospitals_potentially_affected} />
          <StatTile dark={dark} tone="cyan" label="Roads Affected" value={`${impact.roads_affected_km} km`} />
        </div>
      )}

      {/* Map */}
      <Wrapper className="p-2 h-[480px]">
        <FloodMap zones={zones} roads={roads} height="100%" />
      </Wrapper>

      <p className={`text-xs italic ${textMuted}`}>Potential Exposure Estimate — not guaranteed damage. {impact?.note}</p>
    </div>
  );
}
