import React, { useEffect, useState } from "react";
import api from "../../services/api";
import FloodMap from "../../components/FloodMap";
import { Card, SimBadge } from "../../components/ui";

export default function FloodMapPage() {
  const [zones, setZones] = useState([]);
  const [roads, setRoads] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [schools, setSchools] = useState([]);
  const [reports, setReports] = useState([]);
  const [sos, setSos] = useState([]);

  useEffect(() => {
    (async () => {
      const [z, r, s, h, sc, rep, sosList] = await Promise.all([
        api.floodZones("NOW", { zones: [] }),
        api.roads("NOW", []),
        api.shelters([]),
        api.hospitals([]),
        api.schools([]),
        api.citizenReports([]),
        api.sosList([]),
      ]);
      setZones(z.zones || z || []);
      setRoads(r || []);
      setShelters(s || []);
      setHospitals(h || []);
      setSchools(sc || []);
      setReports(rep || []);
      setSos(sosList || []);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold">🗺️ Interactive Flood Map</h2>
        <SimBadge />
      </div>
      <Card className="p-2 h-[calc(100vh-220px)] min-h-[500px]">
        <FloodMap
          zones={zones}
          roads={roads}
          shelters={shelters}
          hospitals={hospitals}
          schools={schools}
          reports={reports}
          sosRequests={sos}
          height="100%"
        />
      </Card>
      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span>🟢 Low</span><span>🟡 Moderate</span><span>🟠 High</span><span>🔴 Very High</span>
        <span>🏠 Shelters</span><span>🏥 Hospitals</span><span>🏫 Schools</span><span>📍 Reports</span><span>🚨 SOS</span>
      </div>
    </div>
  );
}
