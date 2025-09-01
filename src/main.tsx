import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AppProvider, useApp } from "./AppContext";

// 🧱 Layout with Outlet
function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

// 📦 Page Imports
import App from "./app"; // Landing page
import Login from "./Login";
import SellerDashboard from "./SellerDashboard";
import BuyerDashboard from "./BuyerDashboard";
import AIFlyerDesigner from "./AIFlyerDesigner";
import AIAnalyticsDashboard from "./AIAnalyticsDashboard";

// 🔐 Protected Route Wrapper
function ProtectedRoute({ role }: { role: "buyer" | "seller" }) {
  const { currentRole } = useApp();
  if (!currentRole) return <Navigate to="/login" replace />;
  if (currentRole !== role) return <Navigate to={`/${currentRole}`} replace />;
  return <Outlet />;
}

// 🧭 Route Definitions
function RootRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute role="seller" />}>
          <Route path="seller" element={<SellerDashboard />} />
          <Route path="ai-flyer-designer" element={<AIFlyerDesigner />} />
          <Route path="ai-analytics" element={<AIAnalyticsDashboard />} />
        </Route>

        <Route element={<ProtectedRoute role="buyer" />}>
          <Route path="buyer" element={<BuyerDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

// 🧭 404 Page
function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>404 — Page not found</h2>
      <a href="/" style={{ color: "#1a1a1a" }}>
        ← Back to Home
      </a>
    </div>
  );
}

// 🚀 Mount App
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <RootRoutes />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
