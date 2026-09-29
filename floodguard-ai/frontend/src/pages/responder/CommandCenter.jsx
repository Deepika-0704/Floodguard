import React, { useEffect, useState } from "react";
import { AlertTriangle, Users, Home, Siren, FileWarning, Truck, Ship, Ambulance } from "lucide-react";
import api from "../../services/api";
import { DarkCard, StatTile, RiskPill } from "../../components/ui";

export default function CommandCenter() {
  const [zones, setZones] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [sosList, setSosList] = useState([]);
  const [reports, setReports] = useState([]);
  const [resources, setResources] = useState([]);
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    (async () => {
      const [z, s, sos, rep, res, imp] = await Promise.all([
        api.floodZones("NOW", { zones: [] }),
        api.shelters([]),
        api.sosList([]),
        api.citizenReports([]),
        api.resources([]),
        api.impact("NOW", null),
      ]);
      setZones(z.zones || z || []);
      setShelters(s || []);
      setSosList(sos || []);
      setReports(rep || []);
      setResources(res || []);
      setImpact(imp);
    })();
  }, []);

  const highRiskZones = zones.filter((z) => z.risk === "HIGH" || z.risk === "VERY HIGH").length;
  const availableShelters = shelters.filter((s) => s.accessibility === "AVAILABLE").length;
  const activeSOS = sosList.filter((s) => s.status !== "RESOLVED").length;
  const resourceMap = Object.fromEntries(resources.map((r) => [r.name, r]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
          🚑 FloodGuard Command Center
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-mono">DEMO / SIMULATED FLOOD SCENARIO — Panipat / Yamuna Belt</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        <StatTile dark tone="coral" label="High-Risk Zones" value={highRiskZones} />
        <StatTile dark tone="amber" label="Population Exposure" value={(impact?.people_potentially_affected ?? 0).toLocaleString()} />
        <StatTile dark label="Houses Affected" value={(impact?.houses_potentially_affected ?? 0).toLocaleString()} />
        <StatTile dark tone="coral" label="Active SOS" value={sosList.length} />
        <StatTile dark label="Citizen Reports" value={reports.length} />
        <StatTile dark tone="moss" label="Shelters Available" value={availableShelters} />
        <StatTile dark tone="cyan" label="Rescue Teams" value={resourceMap["rescue_teams"]?.available ?? "-"} />
        <StatTile dark tone="cyan" label="Ambulances" value={resourceMap["ambulances"]?.available ?? "-"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <DarkCard className="p-4">
          <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-flood-amber" /> Zones by Risk
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {zones.slice(0, 10).map((z) => (
              <div key={z.id} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                <span className="text-slate-300">{z.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">{z.population?.toLocaleString()} pop.</span>
                  <RiskPill level={z.risk} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </DarkCard>

        <DarkCard className="p-4">
          <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
            <Siren className="h-4 w-4 text-flood-coral" /> Live SOS Requests
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {sosList.length === 0 && <p className="text-sm text-slate-500">No active SOS requests.</p>}
            {sosList.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                <div>
                  <div className="text-slate-200 font-medium">{s.type} — {s.people} people</div>
                  <div className="text-xs text-slate-500 font-mono">{s.location || "Unknown location"}</div>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-flood-coral/15 text-flood-coral">{s.status}</span>
              </div>
            ))}
          </div>
        </DarkCard>

        <DarkCard className="p-4">
          <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
            <FileWarning className="h-4 w-4 text-flood-cyan" /> Citizen Reports
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {reports.slice(0, 8).map((r) => (
              <div key={r.id} className="text-sm bg-white/5 rounded-lg px-3 py-2">
                <div className="flex justify-between">
                  <span className="text-slate-200">{r.location}</span>
                  <span className="text-xs font-mono text-flood-moss">{r.status}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{r.description}</div>
              </div>
            ))}
          </div>
        </DarkCard>

        <DarkCard className="p-4">
          <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
            <Truck className="h-4 w-4 text-flood-moss" /> Rescue Resources
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {resources.map((r) => (
              <div key={r.name} className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-slate-500 uppercase tracking-wide">{r.name.replace("_", " ")}</div>
                <div className="text-lg font-display font-semibold text-white">{r.available}/{r.total}</div>
              </div>
            ))}
          </div>
        </DarkCard>
      </div>
    </div>
  );
}
