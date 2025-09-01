import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useState, useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={containerStyle}>
      {/* Animated Background */}
      <div style={animatedBackgroundStyle}>
        <div style={floatingOrbStyle(mousePosition.x, mousePosition.y)} />
        <div style={gridPatternStyle} />
      </div>

      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={logoContainerStyle}>
            <div style={logoIconStyle}>🎫</div>
            <h1 style={logoTextStyle}>FlyerXpress</h1>
            <span style={versionStyle}>v2.0</span>
          </div>
          <div style={timeDisplayStyle}>
            <div style={timeTextStyle}>{currentTime.toLocaleTimeString()}</div>
            <div style={dateTextStyle}>{currentTime.toLocaleDateString()}</div>
          </div>
        </div>
        <nav style={navStyle}>
          <Link to="/" style={navLinkStyle}>
            <span style={navIconStyle}>🏠</span>
            Home
          </Link>
          <Link to="/login" style={navLinkStyle}>
            <span style={navIconStyle}>🔐</span>
            Login
          </Link>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <span style={navIconStyle}>🚪</span>
            Logout
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroContentStyle}>
          <div style={heroTextContainerStyle}>
            <h2 style={heroTitleStyle}>
              <span style={gradientTextStyle}>Design it.</span>
              <br />
              <span style={gradientTextStyle}>Promote it.</span>
              <br />
              <span style={gradientTextStyle}>Sell it.</span>
            </h2>
            <p style={heroSubtitleStyle}>
              The future of event management is here. AI-powered flyer creation, 
              smart event discovery, and blockchain-secured ticketing.
            </p>
            <div style={heroStatsStyle}>
              <div style={statItemStyle}>
                <span style={statNumberStyle}>10K+</span>
                <span style={statLabelStyle}>Events Created</span>
              </div>
              <div style={statItemStyle}>
                <span style={statNumberStyle}>50K+</span>
                <span style={statLabelStyle}>Tickets Sold</span>
              </div>
              <div style={statItemStyle}>
                <span style={statNumberStyle}>99.9%</span>
                <span style={statLabelStyle}>Uptime</span>
              </div>
            </div>
            <Link to="/login" style={ctaButtonStyle}>
              <span style={ctaIconStyle}>🚀</span>
              Launch Platform
            </Link>
          </div>
          <div style={heroVisualStyle}>
            <div style={floatingCardStyle}>
              <div style={cardContentStyle}>
                <div style={cardHeaderStyle}>
                  <span style={cardIconStyle}>🎵</span>
                  <span style={cardBadgeStyle}>AI Generated</span>
                </div>
                <h3 style={cardTitleStyle}>Lusaka Music Festival</h3>
                <p style={cardDescStyle}>AI-curated lineup featuring the best Zambian artists</p>
                <div style={cardMetaStyle}>
                  <span style={metaItemStyle}>📅 Dec 25, 2024</span>
                  <span style={metaItemStyle}>📍 Showgrounds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={aiIconStyle}>🤖</span>
            AI-Powered Features
          </h2>
          <p style={sectionSubtitleStyle}>
            Experience the future of event management with cutting-edge AI technology
          </p>
        </div>
        <div style={featuresGridStyle}>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>🎨</div>
            <h3 style={featureTitleStyle}>AI Flyer Designer</h3>
            <p style={featureDescStyle}>
              Generate stunning event flyers in seconds with our advanced AI design engine
            </p>
            <div style={featureBadgeStyle}>Beta</div>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>🔍</div>
            <h3 style={featureTitleStyle}>Smart Event Discovery</h3>
            <p style={featureDescStyle}>
              AI-powered recommendations based on your interests and location
            </p>
            <div style={featureBadgeStyle}>Live</div>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>📊</div>
            <h3 style={featureTitleStyle}>Predictive Analytics</h3>
            <p style={featureDescStyle}>
              Forecast event success and optimize pricing with machine learning
            </p>
            <div style={featureBadgeStyle}>Coming Soon</div>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>🎯</div>
            <h3 style={featureTitleStyle}>Target Audience AI</h3>
            <p style={featureDescStyle}>
              Automatically identify and reach your ideal event audience
            </p>
            <div style={featureBadgeStyle}>Live</div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section style={securitySectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={securityIconStyle}>🛡️</span>
            Next-Gen Security
          </h2>
          <p style={sectionSubtitleStyle}>
            Blockchain-powered security with AI fraud detection
          </p>
        </div>
        <div style={securityGridStyle}>
          <div style={securityCardStyle}>
            <div style={securityIconContainerStyle}>
              <span style={securityIconStyle}>🔐</span>
            </div>
            <h3 style={securityTitleStyle}>Blockchain Verification</h3>
            <p style={securityDescStyle}>
              Every ticket is cryptographically secured on the blockchain
            </p>
          </div>
          <div style={securityCardStyle}>
            <div style={securityIconContainerStyle}>
              <span style={securityIconStyle}>🤖</span>
            </div>
            <h3 style={securityTitleStyle}>AI Fraud Detection</h3>
            <p style={securityDescStyle}>
              Machine learning algorithms detect and prevent fraudulent activities
            </p>
          </div>
          <div style={securityCardStyle}>
            <div style={securityIconContainerStyle}>
              <span style={securityIconStyle}>📱</span>
            </div>
            <h3 style={securityTitleStyle}>Biometric Authentication</h3>
            <p style={securityDescStyle}>
              Face ID and fingerprint verification for secure access
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={ctaSectionStyle}>
        <div style={ctaContentStyle}>
          <h2 style={ctaTitleStyle}>Ready to Experience the Future?</h2>
          <p style={ctaSubtitleStyle}>
            Join thousands of event organizers already using AI-powered event management
          </p>
          <div style={ctaButtonsStyle}>
            <Link to="/login" style={primaryCtaButtonStyle}>
              <span style={ctaIconStyle}>🚀</span>
              Get Started Free
            </Link>
            <button style={secondaryCtaButtonStyle}>
              <span style={ctaIconStyle}>📺</span>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerContentStyle}>
          <div style={footerSectionStyle}>
            <h3 style={footerTitleStyle}>FlyerXpress Zambia</h3>
            <p style={footerDescStyle}>
              Pioneering the future of event management with AI and blockchain technology
            </p>
          </div>
          <div style={footerSectionStyle}>
            <h4 style={footerSubtitleStyle}>Technology</h4>
            <ul style={footerListStyle}>
              <li>AI/ML Engine</li>
              <li>Blockchain Security</li>
              <li>Cloud Infrastructure</li>
              <li>Mobile-First Design</li>
            </ul>
          </div>
          <div style={footerSectionStyle}>
            <h4 style={footerSubtitleStyle}>Support</h4>
            <ul style={footerListStyle}>
              <li>24/7 AI Assistant</li>
              <li>Developer Docs</li>
              <li>Community Forum</li>
              <li>Video Tutorials</li>
            </ul>
          </div>
        </div>
        <div style={footerBottomStyle}>
          <p>© {new Date().getFullYear()} FlyerXpress Zambia. Built with AI & ❤️</p>
        </div>
      </footer>
    </div>
  );
}

// Futuristic Styles
const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
  color: "#fff",
  position: "relative" as const,
  overflow: "hidden"
};

const animatedBackgroundStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  pointerEvents: "none" as const
};

const floatingOrbStyle = (x: number, y: number) => ({
  position: "absolute" as const,
  width: "300px",
  height: "300px",
  background: "radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)",
  borderRadius: "50%",
  left: `${x - 150}px`,
  top: `${y - 150}px`,
  transition: "all 0.3s ease",
  filter: "blur(40px)"
});

const gridPatternStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
  `,
  backgroundSize: "50px 50px",
  opacity: 0.3
};

const headerStyle = {
  position: "relative" as const,
  zIndex: 10,
  padding: "1.5rem 2rem",
  background: "rgba(26, 26, 46, 0.8)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const headerContentStyle = {
  display: "flex",
  alignItems: "center",
  gap: "2rem"
};

const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const logoIconStyle = {
  fontSize: "2rem",
  filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))"
};

const logoTextStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  background: "linear-gradient(45deg, #00ffff, #ff00ff)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent",
  margin: 0
};

const versionStyle = {
  fontSize: "0.8rem",
  color: "#00ffff",
  background: "rgba(0, 255, 255, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "10px",
  border: "1px solid rgba(0, 255, 255, 0.3)"
};

const timeDisplayStyle = {
  textAlign: "center" as const,
  background: "rgba(0, 255, 255, 0.1)",
  padding: "0.5rem 1rem",
  borderRadius: "10px",
  border: "1px solid rgba(0, 255, 255, 0.2)"
};

const timeTextStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#00ffff"
};

const dateTextStyle = {
  fontSize: "0.9rem",
  color: "#888",
  marginTop: "0.2rem"
};

const navStyle = {
  display: "flex",
  gap: "1rem",
  alignItems: "center"
};

const navLinkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "#fff",
  textDecoration: "none",
  padding: "0.75rem 1.5rem",
  borderRadius: "25px",
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)"
};

const navIconStyle = {
  fontSize: "1.2rem"
};

const logoutButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "rgba(255, 0, 0, 0.2)",
  color: "#ff6b6b",
  border: "1px solid rgba(255, 0, 0, 0.3)",
  padding: "0.75rem 1.5rem",
  borderRadius: "25px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)"
};

const heroSectionStyle = {
  position: "relative" as const,
  zIndex: 5,
  padding: "6rem 2rem",
  minHeight: "80vh",
  display: "flex",
  alignItems: "center"
};

const heroContentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "4rem",
  alignItems: "center"
};

const heroTextContainerStyle = {
  zIndex: 10
};

const heroTitleStyle = {
  fontSize: "4rem",
  fontWeight: "bold",
  lineHeight: "1.1",
  margin: "0 0 2rem 0",
  textShadow: "0 0 30px rgba(0, 255, 255, 0.5)"
};

const gradientTextStyle = {
  background: "linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent",
  backgroundSize: "200% 200%",
  animation: "gradientShift 3s ease infinite"
};

const heroSubtitleStyle = {
  fontSize: "1.3rem",
  lineHeight: "1.6",
  color: "#ccc",
  marginBottom: "3rem",
  maxWidth: "500px"
};

const heroStatsStyle = {
  display: "flex",
  gap: "2rem",
  marginBottom: "3rem"
};

const statItemStyle = {
  textAlign: "center" as const
};

const statNumberStyle = {
  display: "block",
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#00ffff",
  textShadow: "0 0 10px rgba(0, 255, 255, 0.5)"
};

const statLabelStyle = {
  fontSize: "0.9rem",
  color: "#888"
};

const ctaButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1rem 2rem",
  fontSize: "1.2rem",
  fontWeight: "bold",
  background: "linear-gradient(45deg, #00ffff, #ff00ff)",
  color: "#000",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
  textDecoration: "none",
  boxShadow: "0 10px 30px rgba(0, 255, 255, 0.3)",
  transition: "all 0.3s ease",
  transform: "translateY(0)"
};

const ctaIconStyle = {
  fontSize: "1.5rem"
};

const heroVisualStyle = {
  position: "relative" as const,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const floatingCardStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
  animation: "float 6s ease-in-out infinite",
  maxWidth: "400px"
};

const cardContentStyle = {
  textAlign: "center" as const
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem"
};

const cardIconStyle = {
  fontSize: "2rem"
};

const cardBadgeStyle = {
  background: "linear-gradient(45deg, #00ff00, #00ffff)",
  color: "#000",
  padding: "0.3rem 0.8rem",
  borderRadius: "15px",
  fontSize: "0.8rem",
  fontWeight: "bold"
};

const cardTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#fff"
};

const cardDescStyle = {
  color: "#ccc",
  marginBottom: "1.5rem",
  lineHeight: "1.5"
};

const cardMetaStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.5rem"
};

const metaItemStyle = {
  fontSize: "0.9rem",
  color: "#888"
};

const sectionStyle = {
  position: "relative" as const,
  zIndex: 5,
  padding: "6rem 2rem",
  background: "rgba(26, 26, 46, 0.5)"
};

const sectionHeaderStyle = {
  textAlign: "center" as const,
  marginBottom: "4rem"
};

const sectionTitleStyle = {
  fontSize: "3rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem"
};

const aiIconStyle = {
  fontSize: "3rem",
  filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))"
};

const sectionSubtitleStyle = {
  fontSize: "1.2rem",
  color: "#ccc",
  maxWidth: "600px",
  margin: "0 auto"
};

const featuresGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2rem",
  maxWidth: "1200px",
  margin: "0 auto"
};

const featureCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  textAlign: "center" as const,
  transition: "all 0.3s ease",
  position: "relative" as const,
  overflow: "hidden"
};

const featureIconStyle = {
  fontSize: "3rem",
  marginBottom: "1rem",
  filter: "drop-shadow(0 0 15px rgba(0, 255, 255, 0.5))"
};

const featureTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#fff"
};

const featureDescStyle = {
  color: "#ccc",
  lineHeight: "1.6",
  marginBottom: "1.5rem"
};

const featureBadgeStyle = {
  position: "absolute" as const,
  top: "1rem",
  right: "1rem",
  background: "linear-gradient(45deg, #00ff00, #00ffff)",
  color: "#000",
  padding: "0.3rem 0.8rem",
  borderRadius: "15px",
  fontSize: "0.8rem",
  fontWeight: "bold"
};

const securitySectionStyle = {
  position: "relative" as const,
  zIndex: 5,
  padding: "6rem 2rem",
  background: "rgba(0, 0, 0, 0.3)"
};

const securityIconStyle = {
  fontSize: "3rem",
  filter: "drop-shadow(0 0 20px rgba(255, 255, 0, 0.5))"
};

const securityGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2rem",
  maxWidth: "1200px",
  margin: "0 auto"
};

const securityCardStyle = {
  background: "rgba(255, 255, 0, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 0, 0.1)",
  textAlign: "center" as const,
  transition: "all 0.3s ease"
};

const securityIconContainerStyle = {
  width: "80px",
  height: "80px",
  background: "rgba(255, 255, 0, 0.1)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 1.5rem",
  border: "2px solid rgba(255, 255, 0, 0.3)"
};

const securityTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#fff"
};

const securityDescStyle = {
  color: "#ccc",
  lineHeight: "1.6"
};

const ctaSectionStyle = {
  position: "relative" as const,
  zIndex: 5,
  padding: "6rem 2rem",
  background: "linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))"
};

const ctaContentStyle = {
  textAlign: "center" as const,
  maxWidth: "800px",
  margin: "0 auto"
};

const ctaTitleStyle = {
  fontSize: "3rem",
  fontWeight: "bold",
  margin: "0 0 1.5rem 0",
  background: "linear-gradient(45deg, #00ffff, #ff00ff)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent"
};

const ctaSubtitleStyle = {
  fontSize: "1.3rem",
  color: "#ccc",
  marginBottom: "3rem",
  lineHeight: "1.6"
};

const ctaButtonsStyle = {
  display: "flex",
  gap: "2rem",
  justifyContent: "center",
  flexWrap: "wrap" as const
};

const primaryCtaButtonStyle = {
  ...ctaButtonStyle,
  fontSize: "1.3rem",
  padding: "1.2rem 2.5rem"
};

const secondaryCtaButtonStyle = {
  ...ctaButtonStyle,
  background: "transparent",
  color: "#fff",
  border: "2px solid #00ffff",
  boxShadow: "none"
};

const footerStyle = {
  position: "relative" as const,
  zIndex: 5,
  background: "rgba(0, 0, 0, 0.8)",
  padding: "4rem 2rem 2rem",
  borderTop: "1px solid rgba(0, 255, 255, 0.2)"
};

const footerContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "3rem",
  marginBottom: "3rem"
};

const footerSectionStyle = {
  textAlign: "left" as const
};

const footerTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#00ffff"
};

const footerDescStyle = {
  color: "#ccc",
  lineHeight: "1.6"
};

const footerSubtitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#fff"
};

const footerListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

const footerBottomStyle = {
  textAlign: "center" as const,
  paddingTop: "2rem",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#888"
};

export default App;
