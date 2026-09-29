import React from "react";

export const RISK_STYLES = {
  LOW: { bg: "bg-flood-moss/15", text: "text-flood-moss", ring: "ring-flood-moss/30", dot: "bg-flood-moss" },
  MODERATE: { bg: "bg-amber-400/15", text: "text-amber-500", ring: "ring-amber-400/30", dot: "bg-amber-400" },
  HIGH: { bg: "bg-flood-amber/15", text: "text-flood-amber", ring: "ring-flood-amber/30", dot: "bg-flood-amber" },
  "VERY HIGH": { bg: "bg-flood-coral/15", text: "text-flood-coral", ring: "ring-flood-coral/30", dot: "bg-flood-coral" },
  CRITICAL: { bg: "bg-red-700/15", text: "text-red-600", ring: "ring-red-700/30", dot: "bg-red-700" },
};

export function RiskPill({ level, size = "md" }) {
  const s = RISK_STYLES[level] || RISK_STYLES.MODERATE;
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${s.bg} ${s.text} ring-1 ${s.ring} ${pad} font-semibold`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {level}
    </span>
  );
}

export function Card({ children, className = "", ...rest }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white shadow-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function DarkCard({ children, className = "", ...rest }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-deep-800/60 backdrop-blur-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function StatTile({ label, value, sub, tone = "default", dark = false }) {
  const toneColor = {
    default: dark ? "text-white" : "text-slate-900",
    coral: "text-flood-coral",
    cyan: "text-flood-cyan",
    amber: "text-flood-amber",
    moss: "text-flood-moss",
  }[tone];
  return (
    <div className={`p-4 rounded-xl ${dark ? "bg-white/5 border border-white/10" : "bg-slate-50 border border-slate-200"}`}>
      <div className={`text-[11px] uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"} mb-1`}>{label}</div>
      <div className={`text-2xl font-display font-semibold ${toneColor}`}>{value}</div>
      {sub && <div className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>{sub}</div>}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", className = "", type = "button", disabled }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-medium px-4 py-2.5 text-sm transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-flood-teal text-white hover:bg-teal-600 shadow-sm",
    danger: "bg-flood-coral text-white hover:bg-red-600 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    dark: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Disclaimer({ children }) {
  return (
    <p className="text-xs text-slate-500 italic border-l-2 border-slate-300 pl-2 mt-2">{children}</p>
  );
}

export function SimBadge({ children = "Prototype / Simulated Data" }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
      {children}
    </span>
  );
}
