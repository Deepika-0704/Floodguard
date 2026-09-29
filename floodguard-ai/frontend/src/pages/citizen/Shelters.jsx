import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import api from "../../services/api";
import { Card, Button, SimBadge } from "../../components/ui";

const ACCESS_STYLE = {
  AVAILABLE: "text-flood-moss bg-flood-moss/10",
  "NEARLY FULL": "text-flood-amber bg-flood-amber/10",
  INACCESSIBLE: "text-flood-coral bg-flood-coral/10",
};

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.shelters([]).then(setShelters);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold">🏠 Emergency Shelters</h2>
        <SimBadge />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shelters.map((s) => {
          const available = s.capacity - s.occupied;
          const pct = Math.round((s.occupied / s.capacity) * 100);
          return (
            <Card key={s.id} className="p-4 flex flex-col">
              <div className="font-semibold text-slate-800">{s.name}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="h-3 w-3" /> Road: {s.road_condition?.toLowerCase()}
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Occupied {s.occupied}/{s.capacity}</span>
                  <span>{available} available</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${pct > 85 ? "bg-flood-coral" : pct > 60 ? "bg-flood-amber" : "bg-flood-moss"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              <span className={`mt-3 inline-block w-fit px-2 py-1 rounded-md text-xs font-semibold ${ACCESS_STYLE[s.accessibility] || "bg-slate-100 text-slate-600"}`}>
                {s.accessibility}
              </span>

              <Button variant="outline" className="mt-4" onClick={() => navigate("/citizen/route")}>
                <Users className="h-4 w-4" /> Get Safer Route
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
