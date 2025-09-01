import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useApp } from "./AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleOAuthLogin = async (selectedRole: "buyer" | "seller") => {
    try {
      setLoading(true);
      setError("");
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/${selectedRole}`
        }
      });
      
      if (error) {
        setError("Login failed: " + error.message);
        console.error("Login error:", error.message);
      } else {
        login(selectedRole);
        navigate(`/${selectedRole}`);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    login(role);
    navigate(role === "seller" ? "/seller" : "/buyer");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div style={containerStyle}>
      <div style={loginCardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Welcome to FlyerXpress</h1>
          <p style={subtitleStyle}>Choose your role to continue</p>
        </div>

        <div style={roleSelectorStyle}>
          <label style={labelStyle}>I want to:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.currentTarget.value as "buyer" | "seller")}
            style={selectStyle}
            disabled={loading}
          >
            <option value="buyer">Browse and Buy Event Tickets</option>
            <option value="seller">Create and Sell Event Flyers</option>
          </select>
        </div>

        <div style={buttonContainerStyle}>
          <button
            onClick={handleContinue}
            disabled={loading}
            style={primaryButtonStyle}
          >
            Continue as {role === "buyer" ? "Buyer" : "Seller"}
          </button>
          
          <div style={dividerStyle}>
            <span style={dividerTextStyle}>or</span>
          </div>

          <button
            onClick={() => handleOAuthLogin(role)}
            disabled={loading}
            style={googleButtonStyle}
          >
            {loading ? "Signing in..." : `Sign in with Google as ${role === "buyer" ? "Buyer" : "Seller"}`}
          </button>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <button
          onClick={handleBackToHome}
          style={backButtonStyle}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "1rem"
};

const loginCardStyle = {
  background: "#fff",
  padding: "3rem",
  borderRadius: "12px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  maxWidth: "450px",
  width: "100%",
  textAlign: "center" as const
};

const headerStyle = {
  marginBottom: "2rem"
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 0.5rem 0"
};

const subtitleStyle = {
  fontSize: "1.1rem",
  color: "#666",
  margin: "0"
};

const roleSelectorStyle = {
  marginBottom: "2rem",
  textAlign: "left" as const
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "600",
  color: "#333"
};

const selectStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "2px solid #e1e5e9",
  borderRadius: "8px",
  fontSize: "1rem",
  backgroundColor: "#fff",
  cursor: "pointer"
};

const buttonContainerStyle = {
  marginBottom: "2rem"
};

const primaryButtonStyle = {
  width: "100%",
  padding: "1rem",
  background: "#1a1a1a",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1.1rem",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "1rem",
  transition: "background-color 0.2s"
};

const dividerStyle = {
  position: "relative" as const,
  textAlign: "center" as const,
  margin: "1.5rem 0"
};

const dividerTextStyle = {
  background: "#fff",
  padding: "0 1rem",
  color: "#666",
  fontSize: "0.9rem"
};

const googleButtonStyle = {
  width: "100%",
  padding: "1rem",
  background: "#fff",
  color: "#333",
  border: "2px solid #e1e5e9",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "border-color 0.2s"
};

const errorStyle = {
  background: "#fee",
  color: "#c33",
  padding: "1rem",
  borderRadius: "8px",
  marginBottom: "1rem",
  border: "1px solid #fcc"
};

const backButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#666",
  cursor: "pointer",
  fontSize: "0.9rem",
  textDecoration: "underline"
};
