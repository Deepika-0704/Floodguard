import React, { useState } from "react";
import { Siren, Wifi, WifiOff, Check } from "lucide-react";
import api from "../../services/api";
import { Card, Button, SimBadge } from "../../components/ui";

const TYPES = ["Medical", "Rescue", "Evacuation", "Other"];

export default function SOS() {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState(1);
  const [type, setType] = useState("Medical");
  const [online, setOnline] = useState(true);
  const [sent, setSent] = useState(null);
  const [loading, setLoading] = useState(false);

  async function sendSOS() {
    setLoading(true);
    const res = await api.sos({
      location: "Current Location (Demo)", lat: 29.395, lng: 76.970,
      people, type, connectivity: online ? "online" : "offline",
    });
    setLoading(false);
    setSent(res || { status: "SOS SENT", sms_fallback_activated: !online, note: "Simulated transmission." });
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      <SimBadge />
      {!open && !sent && (
        <div className="flex flex-col items-center gap-6 py-10">
          <button
            onClick={() => setOpen(true)}
            className="relative h-40 w-40 rounded-full bg-flood-coral text-white text-2xl font-display font-bold shadow-lg flex items-center justify-center pulse-ring"
          >
            <span className="relative z-10 flex flex-col items-center gap-1"><Siren className="h-8 w-8" /> SOS</span>
          </button>
          <p className="text-sm text-slate-500">Tap the button only in a genuine flood emergency.</p>

          <Card className="p-3 flex items-center gap-2 text-sm">
            {online ? <Wifi className="h-4 w-4 text-flood-moss" /> : <WifiOff className="h-4 w-4 text-flood-coral" />}
            Connectivity: <b>{online ? "Internet Available" : "Internet Unavailable"}</b>
            <button onClick={() => setOnline((v) => !v)} className="ml-2 text-xs underline text-slate-400">toggle (demo)</button>
          </Card>
        </div>
      )}

      {open && !sent && (
        <Card className="p-6 text-left space-y-4">
          <h3 className="font-display font-semibold text-lg text-center">Emergency Details</h3>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Number of People</label>
            <input type="number" min={1} max={20} value={people} onChange={(e) => setPeople(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Emergency Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)} className={`py-2 rounded-lg text-sm font-medium border ${type === t ? "bg-flood-coral text-white border-flood-coral" : "border-slate-200 text-slate-600"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button variant="danger" className="w-full" onClick={sendSOS} disabled={loading}>
            {loading ? "Sending..." : "Send SOS"}
          </Button>
        </Card>
      )}

      {sent && (
        <Card className="p-8 space-y-3">
          <div className="h-14 w-14 mx-auto rounded-full bg-flood-moss/10 flex items-center justify-center">
            <Check className="h-7 w-7 text-flood-moss" />
          </div>
          <div className="text-xl font-display font-semibold">SOS SENT</div>
          <p className="text-sm text-slate-500">{sent.note}</p>
          {sent.sms_fallback_activated && (
            <div className="text-xs font-semibold text-flood-amber bg-flood-amber/10 rounded-lg px-3 py-2 inline-block">
              📡 SMS FALLBACK ACTIVATED
            </div>
          )}
          <div className="pt-2">
            <Button variant="ghost" onClick={() => { setSent(null); setOpen(false); }}>Send another</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
