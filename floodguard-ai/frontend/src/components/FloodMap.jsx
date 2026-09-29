import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Polyline, LayersControl, Tooltip } from "react-leaflet";
import L from "leaflet";

const RISK_COLOR = {
  LOW: "#3FB37F",
  MODERATE: "#F5C34D",
  HIGH: "#F5A623",
  "VERY HIGH": "#F2545B",
  CRITICAL: "#B0203A",
};

const iconHtml = (emoji, bg) => L.divIcon({
  html: `<div style="background:${bg};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.35);font-size:14px;border:2px solid white;">${emoji}</div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const shelterIcon = iconHtml("🏠", "#0EA5A8");
const hospitalIcon = iconHtml("🏥", "#F2545B");
const schoolIcon = iconHtml("🏫", "#7C6CF0");
const reportIcon = iconHtml("📍", "#F5A623");
const sosIcon = iconHtml("🚨", "#DC2626");

export default function FloodMap({
  center = [29.39, 76.965],
  zoom = 12,
  zones = [],
  roads = [],
  shelters = [],
  hospitals = [],
  schools = [],
  reports = [],
  sosRequests = [],
  routes = null,
  height = "100%",
}) {
  const roadColor = (status) => {
    if (status === "BLOCKED" || status === "blocked") return "#F2545B";
    if (status === "AFFECTED" || status === "at_risk") return "#F5A623";
    return "#3FB37F";
  };

  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: "100%", borderRadius: "0.75rem" }} scrollWheelZoom={true}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Streets">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="Flood Risk Zones">
          <>
            {zones.map((z, i) => (
              <CircleMarker
                key={z.id || i}
                center={[z.lat, z.lng]}
                radius={10 + (z.population ? Math.min(z.population / 2000, 12) : 0)}
                pathOptions={{
                  color: RISK_COLOR[z.risk] || "#94A3B8",
                  fillColor: RISK_COLOR[z.risk] || "#94A3B8",
                  fillOpacity: 0.45,
                  weight: 2,
                }}
              >
                <Tooltip direction="top">{z.name} — {z.risk}</Tooltip>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{z.name}</div>
                    <div>Risk: <b>{z.risk}</b></div>
                    <div>Population: {z.population_exposed_estimate ?? z.population}</div>
                    {z.vulnerability && <div>Vulnerability: {z.vulnerability}</div>}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </>
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Roads">
          <>
            {roads.map((r, i) => (
              <Polyline
                key={r.id || i}
                positions={r.path}
                pathOptions={{ color: roadColor(r.status), weight: 4, opacity: 0.85, dashArray: r.status === "BLOCKED" ? "6 6" : null }}
              >
                <Tooltip>{r.name} — {r.status}</Tooltip>
              </Polyline>
            ))}
          </>
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Shelters">
          <>
            {shelters.map((s, i) => (
              <Marker key={s.id || i} position={[s.lat, s.lng]} icon={shelterIcon}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{s.name}</div>
                    <div>Capacity: {s.occupied}/{s.capacity}</div>
                    <div>Accessibility: {s.accessibility}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Hospitals">
          <>
            {hospitals.map((h, i) => (
              <Marker key={h.id || i} position={[h.lat, h.lng]} icon={hospitalIcon}>
                <Popup>{h.name}</Popup>
              </Marker>
            ))}
          </>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Schools">
          <>
            {schools.map((s, i) => (
              <Marker key={s.id || i} position={[s.lat, s.lng]} icon={schoolIcon}>
                <Popup>{s.name}</Popup>
              </Marker>
            ))}
          </>
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Citizen Reports">
          <>
            {reports.map((r, i) => (
              <Marker key={r.id || i} position={[r.lat, r.lng]} icon={reportIcon}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{r.status || r.verification_result}</div>
                    <div>{r.description}</div>
                    <div>Water level: {r.water_level}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="SOS Requests">
          <>
            {sosRequests.map((s, i) => (
              <Marker key={s.id || i} position={[s.lat, s.lng]} icon={sosIcon}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">SOS — {s.type}</div>
                    <div>People: {s.people}</div>
                    <div>Status: {s.status}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        </LayersControl.Overlay>
      </LayersControl>

      {routes && routes.map((r, i) => (
        <Polyline
          key={i}
          positions={r.positions}
          pathOptions={{ color: r.safe ? "#3FB37F" : "#F2545B", weight: 5, opacity: 0.9, dashArray: r.safe ? null : "4 8" }}
        >
          <Tooltip permanent direction="center">{r.label}</Tooltip>
        </Polyline>
      ))}
    </MapContainer>
  );
}
