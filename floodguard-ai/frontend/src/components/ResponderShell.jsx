import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Radio, LayoutGrid, Map, SlidersHorizontal, Truck, Users } from "lucide-react";

const NAV = [
  { to: "/responder", label: "Command Center", icon: LayoutGrid, end: true },
  { to: "/responder/map", label: "Vulnerability Map", icon: Map },
  { to: "/responder/twin", label: "Digital Flood Twin", icon: Radio },
  { to: "/responder/whatif", label: "What-If Simulator", icon: SlidersHorizontal },
  { to: "/responder/resources", label: "Resource Planning", icon: Truck },
];

export default function ResponderShell({ children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-deep-950 text-slate-100 flex">
      <aside className="hidden md:flex w-60 flex-col border-r border-white/10 bg-deep-900/60">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10">
          <div className="h-9 w-9 rounded-lg bg-flood-cyan/10 flex items-center justify-center">
            <Radio className="h-5 w-5 text-flood-cyan" />
          </div>
          <div>
            <div className="font-display font-semibold text-[14px] leading-none">FloodGuard</div>
            <div className="text-[10px] text-slate-500 leading-none mt-0.5 font-mono tracking-wide">COMMAND CENTER</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-flood-cyan/10 text-flood-cyan" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => navigate("/citizen")}
          className="m-3 flex items-center gap-2 justify-center text-xs font-medium text-slate-400 hover:text-white border border-white/10 rounded-lg px-3 py-2"
        >
          <Users className="h-3.5 w-3.5" /> Switch to Citizen Mode
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 flex items-center justify-between px-4 border-b border-white/10 bg-deep-900/60">
          <div className="font-display font-semibold text-sm">FloodGuard Command Center</div>
          <button onClick={() => navigate("/citizen")} className="text-xs text-flood-cyan">Citizen Mode</button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        <nav className="md:hidden flex justify-around border-t border-white/10 bg-deep-900/80 py-2">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] ${isActive ? "text-flood-cyan" : "text-slate-500"}`}>
              <item.icon className="h-4 w-4" />
              {item.label.split(" ")[0]}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
