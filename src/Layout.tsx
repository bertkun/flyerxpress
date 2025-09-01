import { Link, Outlet, useNavigate } from "react-router-dom";

function useApp() {
  // Minimal local fallback for the context hook to avoid module-not-found errors.
  // Replace this with the real context implementation at "src/context/AppContext" when available.
  return {
    currentRole: null as null | "buyer" | "seller",
    logout: () => {},
  };
}

export default function Layout() {
  const { currentRole, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {/* Header (persistent) */}
      <header
        style={{
          padding: "1rem",
          background: "#1a1a1a",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            FlyerXpress Zambia
          </Link>
        </h1>
        <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Home
          </Link>
          {currentRole === "seller" && (
            <Link to="/seller" style={{ color: "#fff", textDecoration: "none" }}>
              Seller
            </Link>
          )}
          {currentRole === "buyer" && (
            <Link to="/buyer" style={{ color: "#fff", textDecoration: "none" }}>
              Buyer
            </Link>
          )}
          {currentRole ? (
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid #fff",
                padding: "0.4rem 0.8rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
              Login
            </Link>
          )}
        </nav>
      </header>

      {/* Routed page content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
