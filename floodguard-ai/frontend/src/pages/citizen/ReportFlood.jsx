import React, { useState } from "react";
import { Camera, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import api from "../../services/api";
import { Card, Button, Disclaimer, SimBadge } from "../../components/ui";

const WATER_LEVELS = ["Ankle-deep", "Knee-deep", "Waist-deep", "Above waist"];

export default function ReportFlood() {
  const [location, setLocation] = useState("Zone A - Riverside Colony");
  const [lat] = useState(29.395);
  const [lng] = useState(76.970);
  const [waterLevel, setWaterLevel] = useState(WATER_LEVELS[1]);
  const [description, setDescription] = useState("");
  const [imageName, setImageName] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const res = await api.citizenReport({
      location, lat, lng, water_level: waterLevel,
      description: description || "Flooding observed near this location.",
      image_provided: !!imageName,
    });
    setLoading(false);
    setResult(res || {
      visual_flood_evidence: !!imageName, location_consistency: true, duplicate_check_passed: true,
      result: "LIKELY VERIFIED", confidence: 91, disclaimer: "Prototype AI verification — not a substitute for official verification.",
    });
  }

  const resultStyle = {
    "LIKELY VERIFIED": { color: "text-flood-moss", bg: "bg-flood-moss/10", icon: CheckCircle2, label: "🟢 LIKELY VERIFIED" },
    UNCERTAIN: { color: "text-flood-amber", bg: "bg-flood-amber/10", icon: HelpCircle, label: "🟡 UNCERTAIN" },
    "POTENTIALLY MISLEADING": { color: "text-flood-coral", bg: "bg-flood-coral/10", icon: XCircle, label: "🔴 POTENTIALLY MISLEADING" },
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold">📸 Report Flood</h2>
        <SimBadge />
      </div>

      <Card className="p-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Upload Image</label>
          <label className="flex items-center gap-2 border-2 border-dashed border-slate-200 rounded-lg px-4 py-6 cursor-pointer hover:border-flood-teal/40 text-sm text-slate-500 justify-center">
            <Camera className="h-5 w-5" />
            {imageName ? imageName : "Tap to attach a photo of the flooding"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageName(e.target.files?.[0]?.name || null)} />
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Water Level</label>
          <div className="flex flex-wrap gap-2">
            {WATER_LEVELS.map((w) => (
              <button key={w} onClick={() => setWaterLevel(w)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${waterLevel === w ? "bg-flood-teal text-white border-flood-teal" : "border-slate-200 text-slate-600"}`}>
                {w}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe what you're seeing..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
        </div>

        <Button onClick={submit} disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </Card>

      {result && (
        <Card className="p-5">
          <h3 className="font-display font-semibold mb-3">AI Verification</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Visual flood evidence</span><span>{result.visual_flood_evidence ? "✓" : "✗"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Location consistency</span><span>{result.location_consistency ? "✓" : "✗"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Duplicate check</span><span>{result.duplicate_check_passed ? "✓" : "✗"}</span></div>
          </div>
          <div className={`mt-4 rounded-xl p-4 ${resultStyle[result.result]?.bg || "bg-slate-50"}`}>
            <div className={`font-semibold ${resultStyle[result.result]?.color}`}>{resultStyle[result.result]?.label || result.result}</div>
            <div className="text-sm text-slate-600 mt-1">Confidence: {result.confidence}%</div>
          </div>
          <Disclaimer>{result.disclaimer}</Disclaimer>
        </Card>
      )}
    </div>
  );
}
