import { useState, useRef } from "react";

interface FlyerDesign {
  title: string;
  description: string;
  date: string;
  location: string;
  price: string;
  theme: "futuristic" | "elegant" | "vibrant" | "minimal";
  colorScheme: "blue" | "purple" | "green" | "red" | "orange";
}

export default function AIFlyerDesigner() {
  const [design, setDesign] = useState<FlyerDesign>({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    theme: "futuristic",
    colorScheme: "blue"
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlyer, setGeneratedFlyer] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // AI-powered design suggestions
  const generateAISuggestions = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const suggestions = [
        "🎨 Try a neon glow effect for the title",
        "✨ Add floating geometric shapes in the background",
        "🌟 Use gradient text for better visual impact",
        "💫 Consider adding particle effects",
        "🎭 Include a QR code for digital engagement"
      ];
      setAiSuggestions(suggestions);
      setIsGenerating(false);
    }, 2000);
  };

  // Generate flyer design
  const generateFlyer = () => {
    if (!canvasRef.current) return;
    
    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get color scheme
    const colors = getColorScheme(design.colorScheme);
    
    // Create background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add theme-specific elements
    addThemeElements(ctx, design.theme, colors, canvas);

    // Add text content
    addTextContent(ctx, design, colors, canvas);

    // Convert to data URL
    const dataURL = canvas.toDataURL("image/png");
    setGeneratedFlyer(dataURL);
    setIsGenerating(false);
  };

  const getColorScheme = (scheme: string) => {
    const schemes = {
      blue: { primary: "#1e3a8a", secondary: "#3b82f6", accent: "#60a5fa" },
      purple: { primary: "#581c87", secondary: "#8b5cf6", accent: "#a78bfa" },
      green: { primary: "#166534", secondary: "#22c55e", accent: "#4ade80" },
      red: { primary: "#991b1b", secondary: "#ef4444", accent: "#f87171" },
      orange: { primary: "#9a3412", secondary: "#f97316", accent: "#fb923c" }
    };
    return schemes[scheme as keyof typeof schemes] || schemes.blue;
  };

  const addThemeElements = (ctx: CanvasRenderingContext2D, theme: string, colors: any, canvas: HTMLCanvasElement) => {
    switch (theme) {
      case "futuristic":
        // Add geometric shapes
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(100 + i * 120, 100);
          ctx.lineTo(150 + i * 120, 150);
          ctx.lineTo(100 + i * 120, 200);
          ctx.closePath();
          ctx.stroke();
        }
        break;
      case "elegant":
        // Add decorative borders
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        break;
      case "vibrant":
        // Add colorful circles
        ctx.fillStyle = colors.accent;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.arc(100 + i * 80, 80, 20, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case "minimal":
        // Add subtle lines
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(700, 100);
        ctx.moveTo(100, 500);
        ctx.lineTo(700, 500);
        ctx.stroke();
        break;
    }
  };

  const addTextContent = (ctx: CanvasRenderingContext2D, design: FlyerDesign, colors: any, canvas: HTMLCanvasElement) => {
    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(design.title, canvas.width / 2, 150);

    // Description
    ctx.font = "24px Arial";
    ctx.fillText(design.description, canvas.width / 2, 200);

    // Date and Location
    ctx.font = "20px Arial";
    ctx.fillText(`📅 ${design.date}`, canvas.width / 2, 250);
    ctx.fillText(`📍 ${design.location}`, canvas.width / 2, 280);

    // Price
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = colors.accent;
    ctx.fillText(`$${design.price}`, canvas.width / 2, 350);

    // Footer
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Generated by FlyerXpress AI", canvas.width / 2, 550);
  };

  const downloadFlyer = () => {
    if (!generatedFlyer) return;
    
    const link = document.createElement("a");
    link.download = `flyer-${design.title.replace(/\s+/g, "-")}.png`;
    link.href = generatedFlyer;
    link.click();
  };

  const handleInputChange = (field: keyof FlyerDesign, value: string) => {
    setDesign(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🎨 AI Flyer Designer</h1>
        <p style={subtitleStyle}>Create stunning event flyers with AI assistance</p>
      </div>

      <div style={contentStyle}>
        {/* Design Form */}
        <div style={formSectionStyle}>
          <h2 style={sectionTitleStyle}>Design Your Flyer</h2>
          
          <div style={formGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Event Title</label>
                              <input
                  type="text"
                  value={design.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("title", e.currentTarget.value)}
                  placeholder="Enter event title"
                  style={inputStyle}
                />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Description</label>
                              <textarea
                  value={design.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.currentTarget.value)}
                  placeholder="Describe your event"
                  style={textareaStyle}
                  rows={3}
                />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Date & Time</label>
                              <input
                  type="text"
                  value={design.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("date", e.currentTarget.value)}
                  placeholder="e.g., December 25, 2024 at 6:00 PM"
                  style={inputStyle}
                />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Location</label>
                              <input
                  type="text"
                  value={design.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("location", e.currentTarget.value)}
                  placeholder="Event venue"
                  style={inputStyle}
                />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Price</label>
                              <input
                  type="text"
                  value={design.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("price", e.currentTarget.value)}
                  placeholder="e.g., $25.00"
                  style={inputStyle}
                />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Theme</label>
              <select
                value={design.theme}
                                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("theme", e.currentTarget.value as any)}
                style={selectStyle}
              >
                <option value="futuristic">🚀 Futuristic</option>
                <option value="elegant">✨ Elegant</option>
                <option value="vibrant">🎨 Vibrant</option>
                <option value="minimal">⚪ Minimal</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Color Scheme</label>
              <select
                value={design.colorScheme}
                                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("colorScheme", e.currentTarget.value as any)}
                style={selectStyle}
              >
                <option value="blue">🔵 Blue</option>
                <option value="purple">🟣 Purple</option>
                <option value="green">🟢 Green</option>
                <option value="red">🔴 Red</option>
                <option value="orange">🟠 Orange</option>
              </select>
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button
              onClick={generateAISuggestions}
              disabled={isGenerating}
              style={secondaryButtonStyle}
            >
              🤖 Get AI Suggestions
            </button>
            
            <button
              onClick={generateFlyer}
              disabled={isGenerating || !design.title}
              style={primaryButtonStyle}
            >
              {isGenerating ? "🎨 Generating..." : "🎨 Generate Flyer"}
            </button>
          </div>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div style={suggestionsSectionStyle}>
            <h3 style={sectionTitleStyle}>🤖 AI Design Suggestions</h3>
            <div style={suggestionsListStyle}>
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} style={suggestionItemStyle}>
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Flyer */}
        {generatedFlyer && (
          <div style={flyerSectionStyle}>
            <h3 style={sectionTitleStyle}>✨ Your Generated Flyer</h3>
            <div style={flyerContainerStyle}>
              <canvas
                ref={canvasRef}
                style={canvasStyle}
                width={800}
                height={600}
              />
              <div style={flyerActionsStyle}>
                <button
                  onClick={downloadFlyer}
                  style={downloadButtonStyle}
                >
                  📥 Download Flyer
                </button>
                <button
                  onClick={() => setGeneratedFlyer(null)}
                  style={secondaryButtonStyle}
                >
                  🔄 Generate New
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Futuristic Styles
const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
  color: "#ffffff",
  padding: "2rem",
  fontFamily: "'Orbitron', 'Rajdhani', sans-serif"
};

const headerStyle = {
  textAlign: "center" as const,
  marginBottom: "3rem"
};

const titleStyle = {
  fontSize: "3rem",
  fontWeight: "bold",
  background: "linear-gradient(45deg, #00d4ff, #ff6b6b, #4ecdc4)",
  backgroundClip: "text" as const,
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent",
  margin: "0 0 1rem 0",
  animation: "gradientShift 3s ease-in-out infinite"
};

const subtitleStyle = {
  fontSize: "1.2rem",
  color: "#a0a0a0",
  margin: 0
};

const contentStyle = {
  maxWidth: "1200px",
  margin: "0 auto"
};

const formSectionStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  marginBottom: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const sectionTitleStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  margin: "0 0 1.5rem 0",
  color: "#00d4ff"
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem"
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column" as const
};

const labelStyle = {
  fontSize: "1rem",
  fontWeight: "600",
  marginBottom: "0.5rem",
  color: "#e0e0e0"
};

const inputStyle = {
  padding: "0.75rem",
  border: "2px solid rgba(0, 212, 255, 0.3)",
  borderRadius: "10px",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  color: "#ffffff",
  fontSize: "1rem",
  transition: "all 0.3s ease"
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical" as const,
  minHeight: "80px"
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer"
};

const buttonContainerStyle = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
  flexWrap: "wrap" as const
};

const primaryButtonStyle = {
  padding: "1rem 2rem",
  background: "linear-gradient(45deg, #00d4ff, #0099cc)",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "1.1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)"
};

const secondaryButtonStyle = {
  padding: "1rem 2rem",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "10px",
  fontSize: "1.1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

const suggestionsSectionStyle = {
  background: "rgba(0, 212, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  marginBottom: "2rem",
  border: "1px solid rgba(0, 212, 255, 0.2)"
};

const suggestionsListStyle = {
  display: "grid",
  gap: "1rem"
};

const suggestionItemStyle = {
  padding: "1rem",
  background: "rgba(0, 212, 255, 0.1)",
  borderRadius: "10px",
  border: "1px solid rgba(0, 212, 255, 0.3)",
  fontSize: "1rem"
};

const flyerSectionStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const flyerContainerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: "2rem"
};

const canvasStyle = {
  border: "2px solid rgba(0, 212, 255, 0.5)",
  borderRadius: "15px",
  boxShadow: "0 8px 32px rgba(0, 212, 255, 0.3)",
  maxWidth: "100%",
  height: "auto"
};

const flyerActionsStyle = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap" as const
};

const downloadButtonStyle = {
  ...primaryButtonStyle,
  background: "linear-gradient(45deg, #4ecdc4, #44a08d)"
};
