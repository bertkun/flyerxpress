import { useState } from "react";

interface AIEventSuggestion {
  title: string;
  description: string;
  category: string;
  suggestedPrice: number;
  confidence: number;
}

interface AIEventAssistantProps {
  onUseSuggestion: (suggestion: AIEventSuggestion) => void;
}

export default function AIEventAssistant({ onUseSuggestion }: AIEventAssistantProps) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIEventSuggestion[]>([]);
  const [aiInsights, setAiInsights] = useState("");

  // AI-Powered Event Suggestions
  const generateAIEventSuggestions = async () => {
    setAiLoading(true);
    try {
      // Simulate AI processing with realistic delays
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions: AIEventSuggestion[] = [
        {
          title: "Lusaka Tech Summit 2024",
          description: "Join industry leaders for the biggest technology conference in Zambia. Featuring AI workshops, startup pitches, and networking opportunities.",
          category: "Technology & Innovation",
          suggestedPrice: 150,
          confidence: 0.95
        },
        {
          title: "Zambian Music Festival",
          description: "Celebrate the rich musical heritage of Zambia with live performances, traditional dances, and contemporary fusion.",
          category: "Music & Entertainment",
          suggestedPrice: 75,
          confidence: 0.88
        },
        {
          title: "Business Networking Mixer",
          description: "Connect with entrepreneurs, investors, and professionals in a relaxed networking environment with refreshments.",
          category: "Business & Networking",
          suggestedPrice: 25,
          confidence: 0.82
        }
      ];
      
      setAiSuggestions(suggestions);
      setAiInsights("AI analysis suggests these event types have high engagement potential in your area. Consider seasonal trends and local interests.");
    } catch (error) {
      console.error("AI suggestion error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={aiPanelStyle}>
      <div style={aiPanelHeaderStyle}>
        <h3 style={aiPanelTitleStyle}>
          <span style={aiIconStyle}>🤖</span>
          AI Event Assistant
        </h3>
        <button 
          onClick={generateAIEventSuggestions}
          disabled={aiLoading}
          style={aiActionButtonStyle}
        >
          {aiLoading ? (
            <div style={loadingSpinnerStyle}></div>
          ) : (
            <span style={buttonIconStyle}>💡</span>
          )}
          Get AI Suggestions
        </button>
      </div>
      
      {aiSuggestions.length > 0 && (
        <div style={aiPanelContentStyle}>
          <h4 style={suggestionsTitleStyle}>AI Event Suggestions</h4>
          <div style={suggestionsGridStyle}>
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} style={suggestionCardStyle}>
                <div style={suggestionHeaderStyle}>
                  <span style={suggestionCategoryStyle}>{suggestion.category}</span>
                  <span style={confidenceBadgeStyle}>
                    {Math.round(suggestion.confidence * 100)}% Match
                  </span>
                </div>
                <h5 style={suggestionTitleStyle}>{suggestion.title}</h5>
                <p style={suggestionDescStyle}>{suggestion.description}</p>
                <div style={suggestionMetaStyle}>
                  <span style={priceStyle}>K{suggestion.suggestedPrice}</span>
                  <button 
                    onClick={() => onUseSuggestion(suggestion)}
                    style={useSuggestionButtonStyle}
                  >
                    Use This
                  </button>
                </div>
              </div>
            ))}
          </div>
          {aiInsights && (
            <div style={insightsStyle}>
              <span style={insightsIconStyle}>🧠</span>
              {aiInsights}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Futuristic Styles
const aiPanelStyle = {
  background: "rgba(0, 255, 255, 0.05)",
  border: "1px solid rgba(0, 255, 255, 0.2)",
  borderRadius: "20px",
  marginBottom: "2rem",
  overflow: "hidden"
};

const aiPanelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1.5rem",
  background: "rgba(0, 255, 255, 0.1)",
  borderBottom: "1px solid rgba(0, 255, 255, 0.2)"
};

const aiPanelTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const aiIconStyle = {
  fontSize: "1.5rem",
  filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))"
};

const aiActionButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "linear-gradient(45deg, #00ffff, #ff00ff)",
  color: "#000",
  border: "none",
  padding: "0.75rem 1.5rem",
  borderRadius: "25px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease"
};

const buttonIconStyle = {
  fontSize: "1.2rem"
};

const loadingSpinnerStyle = {
  width: "20px",
  height: "20px",
  border: "2px solid rgba(0, 0, 0, 0.3)",
  borderTop: "2px solid #000",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const aiPanelContentStyle = {
  padding: "1.5rem"
};

const suggestionsTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  color: "#00ffff"
};

const suggestionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1rem",
  marginBottom: "1rem"
};

const suggestionCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(0, 255, 255, 0.2)",
  borderRadius: "15px",
  padding: "1rem",
  transition: "all 0.3s ease"
};

const suggestionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.5rem"
};

const suggestionCategoryStyle = {
  fontSize: "0.8rem",
  color: "#00ffff",
  background: "rgba(0, 255, 255, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "10px"
};

const confidenceBadgeStyle = {
  fontSize: "0.8rem",
  color: "#00ff00",
  background: "rgba(0, 255, 0, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "10px"
};

const suggestionTitleStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  margin: "0 0 0.5rem 0",
  color: "#fff"
};

const suggestionDescStyle = {
  fontSize: "0.9rem",
  color: "#ccc",
  marginBottom: "1rem",
  lineHeight: "1.4"
};

const suggestionMetaStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const priceStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  color: "#00ff00"
};

const useSuggestionButtonStyle = {
  background: "rgba(0, 255, 255, 0.2)",
  color: "#00ffff",
  border: "1px solid rgba(0, 255, 255, 0.3)",
  padding: "0.3rem 0.8rem",
  borderRadius: "15px",
  cursor: "pointer",
  fontSize: "0.8rem"
};

const insightsStyle = {
  background: "rgba(0, 255, 255, 0.1)",
  border: "1px solid rgba(0, 255, 255, 0.2)",
  borderRadius: "10px",
  padding: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const insightsIconStyle = {
  fontSize: "1.2rem"
};
