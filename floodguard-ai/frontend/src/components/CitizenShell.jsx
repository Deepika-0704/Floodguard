import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Waves, LayoutDashboard, Map, Route, Home, Camera, Siren, MessageCircle, ShieldAlert } from "lucide-react";

const NAV = [
  { to: "/citizen", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/citizen/map", label: "Flood Map", icon: Map },
  { to: "/citizen/route", label: "Safe Route", icon: Route },
  { to: "/citizen/shelters", label: "Shelters", icon: Home },
  { to: "/citizen/report", label: "Report Flood", icon: Camera },
  { to: "/citizen/sos", label: "SOS", icon: Siren },
  { to: "/citizen/assistant", label: "Assistant", icon: MessageCircle },
];

export default function CitizenShell({ children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="sticky top-0 z-[1000] bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-flood-teal/10 flex items-center justify-center">
              <Waves className="h-5 w-5 text-flood-teal" />
            </div>
            <div>
              <div className="font-display font-semibold text-[15px] leading-none">FloodGuard AI</div>
              <div className="text-[11px] text-slate-400 leading-none mt-0.5">Citizen Mode</div>
            </div>
          </div>
          <button
            onClick={() => navigate("/responder")}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5"
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Switch to Response Mode
          </button>
        </div>
        <nav className="max-w-7xl mx-auto px-2 sm:px-6 flex gap-1 overflow-x-auto scrollbar-thin pb-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${
                  isActive
                    ? "border-flood-teal text-flood-teal"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">{children}</main>
      <button
        onClick={() => navigate("/responder")}
        className="sm:hidden fixed bottom-4 right-4 z-[1000] bg-deep-900 text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5"
      >
        <ShieldAlert className="h-3.5 w-3.5" /> Responder
      </button>
    </div>
  );
}
