import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";

import CitizenShell from "./components/CitizenShell.jsx";
import CitizenDashboard from "./pages/citizen/Dashboard.jsx";
import FloodMapPage from "./pages/citizen/FloodMapPage.jsx";
import SafeRoute from "./pages/citizen/SafeRoute.jsx";
import Shelters from "./pages/citizen/Shelters.jsx";
import ReportFlood from "./pages/citizen/ReportFlood.jsx";
import SOS from "./pages/citizen/SOS.jsx";
import Assistant from "./pages/citizen/Assistant.jsx";

import ResponderShell from "./components/ResponderShell.jsx";
import CommandCenter from "./pages/responder/CommandCenter.jsx";
import VulnerabilityMap from "./pages/responder/VulnerabilityMap.jsx";
import WhatIfSimulator from "./pages/responder/WhatIfSimulator.jsx";
import ResourcePlanning from "./pages/responder/ResourcePlanning.jsx";

import DigitalTwin from "./pages/shared/DigitalTwin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Citizen Mode */}
      <Route path="/citizen" element={<CitizenShell><CitizenDashboard /></CitizenShell>} />
      <Route path="/citizen/map" element={<CitizenShell><FloodMapPage /></CitizenShell>} />
      <Route path="/citizen/route" element={<CitizenShell><SafeRoute /></CitizenShell>} />
      <Route path="/citizen/shelters" element={<CitizenShell><Shelters /></CitizenShell>} />
      <Route path="/citizen/report" element={<CitizenShell><ReportFlood /></CitizenShell>} />
      <Route path="/citizen/sos" element={<CitizenShell><SOS /></CitizenShell>} />
      <Route path="/citizen/assistant" element={<CitizenShell><Assistant /></CitizenShell>} />
      <Route path="/citizen/twin" element={<CitizenShell><DigitalTwin dark={false} /></CitizenShell>} />

      {/* Response Mode */}
      <Route path="/responder" element={<ResponderShell><CommandCenter /></ResponderShell>} />
      <Route path="/responder/map" element={<ResponderShell><VulnerabilityMap /></ResponderShell>} />
      <Route path="/responder/twin" element={<ResponderShell><DigitalTwin dark={true} /></ResponderShell>} />
      <Route path="/responder/whatif" element={<ResponderShell><WhatIfSimulator /></ResponderShell>} />
      <Route path="/responder/resources" element={<ResponderShell><ResourcePlanning /></ResponderShell>} />

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
