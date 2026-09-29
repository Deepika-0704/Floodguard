import React from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Users, ShieldAlert, ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-deep-950 text-white flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-flood-cyan/10 flex items-center justify-center mb-6">
          <Waves className="h-8 w-8 text-flood-cyan" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold">FloodGuard AI</h1>
        <p className="text-slate-400 mt-3 max-w-xl mx-auto">
          AI-powered flood intelligence, prediction & emergency response — Smart India Hackathon 2026 prototype.
          Sense → Predict → Explain → Simulate → Verify → Guide → Prioritize → Respond.
        </p>
        <p className="text-xs text-slate-500 mt-2 font-mono">DEMO / SIMULATED FLOOD SCENARIO — not live government data</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          <button
            onClick={() => navigate("/citizen")}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left transition"
          >
            <Users className="h-6 w-6 text-flood-teal mb-3" />
            <div className="font-display font-semibold text-lg flex items-center gap-1.5">
              Citizen Mode <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <p className="text-sm text-slate-400 mt-1">Risk alerts, safe routes, shelters, reporting & SOS.</p>
          </button>

          <button
            onClick={() => navigate("/responder")}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left transition"
          >
            <ShieldAlert className="h-6 w-6 text-flood-coral mb-3" />
            <div className="font-display font-semibold text-lg flex items-center gap-1.5">
              Response Mode <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <p className="text-sm text-slate-400 mt-1">Command center, digital twin, what-if simulation, resources.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
