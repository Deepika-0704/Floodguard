import React, { useEffect, useState } from "react";
import { Truck, Ship, Ambulance, Stethoscope, Users2 } from "lucide-react";
import api from "../../services/api";
import { DarkCard, StatTile } from "../../components/ui";

const ICONS = { boats: Ship, ambulances: Ambulance, rescue_teams: Users2, medical_units: Stethoscope };

export default function ResourcePlanning() {
  const [resources, setResources] = useState([]);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    (async () => {
      const [res, rec] = await Promise.all([
        api.resources([]),
        api.resourceRecommend(null),
      ]);
      setResources(res || []);
      setRecommendation(rec);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
        <Truck className="h-5 w-5 text-flood-moss" /> Rescue Resource Planning
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {resources.map((r) => {
          const Icon = ICONS[r.name] || Truck;
          return (
            <DarkCard key={r.name} className="p-4">
              <Icon className="h-5 w-5 text-flood-cyan mb-2" />
              <div className="text-xs text-slate-400 uppercase tracking-wide">{r.name.replace("_", " ")}</div>
              <div className="text-2xl font-display font-semibold text-white">{r.available}<span className="text-sm text-slate-500">/{r.total}</span></div>
            </DarkCard>
          );
        })}
      </div>

      {recommendation && (
        <DarkCard className="p-5">
          <h3 className="font-display font-semibold text-white mb-4">AI-Assisted Recommendation</h3>
          <div className="space-y-3">
            {recommendation.recommendations?.map((r) => (
              <div key={r.zone} className="bg-white/5 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-slate-200 font-medium">{r.zone}</div>
                  <div className="text-xs text-slate-500 font-mono">{r.risk} risk · {r.population?.toLocaleString()} population</div>
                </div>
                <div className="flex gap-4 text-sm font-mono">
                  <span className="text-flood-cyan">🚤 {r.boats} boats</span>
                  <span className="text-flood-amber">🚑 {r.ambulances} ambulances</span>
                  <span className="text-flood-moss">🧑‍🚒 {r.rescue_teams} teams</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 italic mt-4">{recommendation.note}</p>
        </DarkCard>
      )}
    </div>
  );
}
