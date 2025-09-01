import { useState } from "react";

interface AIEventRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  relevance: number;
  reason: string;
}

interface AISearchAssistantProps {
  onSearch: (query: string) => void;
}

export default function AISearchAssistant({ onSearch }: AISearchAssistantProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIEventRecommendation[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const popularSearches = [
    "Music Festival",
    "Tech Conference", 
    "Business Networking",
    "Art Exhibition",
    "Sports Event",
    "Workshop",
    "Concert",
    "Seminar"
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchHistory(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getAIRecommendations = async () => {
    setAiLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const recommendations: AIEventRecommendation[] = [
        {
          id: "1",
          title: "Lusaka Innovation Summit",
          description: "Based on your interest in technology and business events",
          category: "Technology",
          relevance: 0.95,
          reason: "High match with your search history and preferences"
        },
        {
          id: "2", 
          title: "Zambian Art & Culture Festival",
          description: "Cultural events that align with your interests",
          category: "Culture",
          relevance: 0.88,
          reason: "Matches your cultural event preferences"
        },
        {
          id: "3",
          title: "Startup Networking Mixer",
          description: "Business networking opportunities in your area",
          category: "Business",
          relevance: 0.82,
          reason: "Based on your business event searches"
        }
      ];
      
      setAiRecommendations(recommendations);
      setShowAIRecommendations(true);
    } catch (error) {
      console.error("AI recommendations error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const useRecommendation = (recommendation: AIEventRecommendation) => {
    setSearchQuery(recommendation.title);
    onSearch(recommendation.title);
    setShowAIRecommendations(false);
  };

  return (
    <div style={searchContainerStyle}>
      {/* AI-Powered Search Bar */}
      <div style={searchBarContainerStyle}>
        <div style={searchInputWrapperStyle}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search events with AI assistance..."
            style={searchInputStyle}
            className="futuristic-input"
          />
          <button 
            onClick={handleSearch}
            style={searchButtonStyle}
            className="futuristic-button"
          >
            <span style={searchIconStyle}>🔍</span>
            Search
          </button>
        </div>
        
        <button 
          onClick={getAIRecommendations}
          disabled={aiLoading}
          style={aiRecommendationButtonStyle}
        >
          {aiLoading ? (
            <div style={loadingSpinnerStyle}></div>
          ) : (
            <span style={aiIconStyle}>🤖</span>
          )}
          AI Recommendations
        </button>
      </div>

      {/* Popular Searches */}
      <div style={popularSearchesStyle}>
        <span style={popularLabelStyle}>Popular:</span>
        {popularSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => {
              setSearchQuery(search);
              onSearch(search);
            }}
            style={popularSearchButtonStyle}
          >
            {search}
          </button>
        ))}
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div style={searchHistoryStyle}>
          <span style={historyLabelStyle}>Recent:</span>
          {searchHistory.map((search, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(search);
                onSearch(search);
              }}
              style={historyButtonStyle}
            >
              {search}
            </button>
          ))}
        </div>
      )}

      {/* AI Recommendations Panel */}
      {showAIRecommendations && aiRecommendations.length > 0 && (
        <div style={recommendationsPanelStyle}>
          <div style={recommendationsHeaderStyle}>
            <h4 style={recommendationsTitleStyle}>
              <span style={aiIconStyle}>🤖</span>
              AI-Powered Recommendations
            </h4>
            <button 
              onClick={() => setShowAIRecommendations(false)}
              style={closeButtonStyle}
            >
              ✕
            </button>
          </div>
          
          <div style={recommendationsListStyle}>
            {aiRecommendations.map((recommendation) => (
              <div key={recommendation.id} style={recommendationCardStyle}>
                <div style={recommendationHeaderStyle}>
                  <h5 style={recommendationTitleStyle}>{recommendation.title}</h5>
                  <span style={relevanceBadgeStyle}>
                    {Math.round(recommendation.relevance * 100)}% Match
                  </span>
                </div>
                <p style={recommendationDescriptionStyle}>{recommendation.description}</p>
                <div style={recommendationMetaStyle}>
                  <span style={categoryStyle}>{recommendation.category}</span>
                  <span style={reasonStyle}>{recommendation.reason}</span>
                </div>
                <button 
                  onClick={() => useRecommendation(recommendation)}
                  style={useRecommendationButtonStyle}
                >
                  Try This Search
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Futuristic Styles
const searchContainerStyle = {
  marginBottom: "2rem"
};

const searchBarContainerStyle = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1rem",
  flexWrap: "wrap" as const
};

const searchInputWrapperStyle = {
  flex: "1",
  minWidth: "300px",
  display: "flex",
  gap: "0.5rem"
};

const searchInputStyle = {
  flex: "1",
  padding: "1rem",
  fontSize: "1.1rem",
  border: "2px solid rgba(0, 255, 255, 0.3)",
  borderRadius: "12px",
  background: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  outline: "none",
  transition: "all 0.3s ease"
};

const searchButtonStyle = {
  padding: "1rem 1.5rem",
  background: "linear-gradient(45deg, #00ffff, #ff00ff)",
  color: "#000",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "all 0.3s ease"
};

const searchIconStyle = {
  fontSize: "1.2rem"
};

const aiRecommendationButtonStyle = {
  padding: "1rem 1.5rem",
  background: "rgba(0, 255, 255, 0.2)",
  color: "#00ffff",
  border: "1px solid rgba(0, 255, 255, 0.3)",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "all 0.3s ease",
  minWidth: "180px",
  justifyContent: "center"
};

const aiIconStyle = {
  fontSize: "1.2rem",
  filter: "drop-shadow(0 0 8px rgba(0, 255, 255, 0.5))"
};

const loadingSpinnerStyle = {
  width: "20px",
  height: "20px",
  border: "2px solid rgba(0, 255, 255, 0.3)",
  borderTop: "2px solid #00ffff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const popularSearchesStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "1rem",
  flexWrap: "wrap" as const
};

const popularLabelStyle = {
  fontSize: "0.9rem",
  color: "#888",
  fontWeight: "500"
};

const popularSearchButtonStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.3s ease"
};

const searchHistoryStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "1rem",
  flexWrap: "wrap" as const
};

const historyLabelStyle = {
  fontSize: "0.9rem",
  color: "#888",
  fontWeight: "500"
};

const historyButtonStyle = {
  background: "rgba(0, 255, 255, 0.1)",
  color: "#00ffff",
  border: "1px solid rgba(0, 255, 255, 0.2)",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.3s ease"
};

const recommendationsPanelStyle = {
  background: "rgba(0, 255, 255, 0.05)",
  border: "1px solid rgba(0, 255, 255, 0.2)",
  borderRadius: "15px",
  padding: "1.5rem",
  marginTop: "1rem"
};

const recommendationsHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem"
};

const recommendationsTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "#00ffff"
};

const closeButtonStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "0.5rem",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "1rem",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const recommendationsListStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1rem"
};

const recommendationCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(0, 255, 255, 0.2)",
  borderRadius: "12px",
  padding: "1rem",
  transition: "all 0.3s ease"
};

const recommendationHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "0.5rem"
};

const recommendationTitleStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  margin: 0,
  color: "#fff",
  flex: "1"
};

const relevanceBadgeStyle = {
  fontSize: "0.8rem",
  color: "#00ff00",
  background: "rgba(0, 255, 0, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "10px",
  marginLeft: "0.5rem"
};

const recommendationDescriptionStyle = {
  fontSize: "0.9rem",
  color: "#ccc",
  marginBottom: "1rem",
  lineHeight: "1.4"
};

const recommendationMetaStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.3rem",
  marginBottom: "1rem"
};

const categoryStyle = {
  fontSize: "0.8rem",
  color: "#00ffff",
  background: "rgba(0, 255, 255, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "8px",
  alignSelf: "flex-start"
};

const reasonStyle = {
  fontSize: "0.8rem",
  color: "#888",
  fontStyle: "italic"
};

const useRecommendationButtonStyle = {
  width: "100%",
  background: "rgba(0, 255, 255, 0.2)",
  color: "#00ffff",
  border: "1px solid rgba(0, 255, 255, 0.3)",
  padding: "0.5rem",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.3s ease"
};
