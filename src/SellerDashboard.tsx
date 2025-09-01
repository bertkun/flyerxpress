// src/SellerDashboard.tsx
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

interface Flyer {
  id: number;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  price?: number;
  date?: string;
  location?: string;
  image_url?: string;
  ai_generated?: boolean;
  ai_score?: number;
}

interface AIEventSuggestion {
  title: string;
  description: string;
  category: string;
  suggestedPrice: number;
  confidence: number;
}

function SellerDashboard() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIEventSuggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [aiInsights, setAiInsights] = useState("");
  const navigate = useNavigate();

  const eventCategories = [
    "Music & Entertainment",
    "Technology & Innovation",
    "Business & Networking",
    "Arts & Culture",
    "Sports & Fitness",
    "Education & Workshops",
    "Food & Culinary",
    "Health & Wellness",
    "Community & Social",
    "Fashion & Lifestyle"
  ];

  useEffect(() => {
    fetchFlyers();
  }, []);

  const fetchFlyers = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data, error } = await supabase
          .from("flyers")
          .select("*")
          .eq("created_by", userData.user.id)
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          setFlyers(data);
        }
      }
    } catch (error) {
      console.error("Error fetching flyers:", error);
    }
  };

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

  // AI-Powered Content Enhancement
  const enhanceWithAI = async () => {
    if (!title.trim()) {
      setStatus("❌ Please enter an event title first");
      return;
    }

    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate AI content enhancement
      const enhancedDescription = `🚀 ${title} - An extraordinary event that promises to deliver an unforgettable experience! 

✨ What to expect:
• Engaging activities and presentations
• Networking opportunities with industry professionals
• Interactive workshops and demonstrations
• Refreshments and entertainment

🎯 Perfect for: Event enthusiasts, professionals, and anyone looking to expand their network and knowledge.

📍 Don't miss out on this incredible opportunity to connect, learn, and grow!`;

      setDesc(enhancedDescription);
      setStatus("✅ AI has enhanced your event description!");
    } catch (error) {
      setStatus("❌ AI enhancement failed");
    } finally {
      setAiLoading(false);
    }
  };

  // AI-Powered Pricing Optimization
  const optimizePricing = async () => {
    if (!price) {
      setStatus("❌ Please enter a price first");
      return;
    }

    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentPrice = parseFloat(price);
      const optimizedPrice = Math.round(currentPrice * 1.15); // 15% increase
      
      setPrice(optimizedPrice.toString());
      setStatus(`✅ AI suggests optimizing price to K${optimizedPrice} for better market positioning`);
    } catch (error) {
      setStatus("❌ Price optimization failed");
    } finally {
      setAiLoading(false);
    }
  };

  const saveFlyer = async () => {
    if (!title.trim() || !desc.trim()) {
      setStatus("❌ Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        setStatus("❌ User not authenticated");
        return;
      }

      const flyerData = {
        title: title.trim(),
        description: desc.trim(),
        price: price ? parseFloat(price) : null,
        date: date || null,
        location: location || null,
        created_by: userData.user.id,
        ai_generated: false,
        ai_score: Math.random() * 0.3 + 0.7 // Random AI score for demo
      };

      const { error } = await supabase.from("flyers").insert([flyerData]);
      
      if (error) {
        setStatus("❌ Error saving flyer: " + error.message);
        console.error(error);
      } else {
        setStatus("✅ Flyer saved successfully!");
        setTitle("");
        setDesc("");
        setPrice("");
        setDate("");
        setLocation("");
        fetchFlyers();
      }
    } catch (error) {
      setStatus("❌ Unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const useAISuggestion = (suggestion: AIEventSuggestion) => {
    setTitle(suggestion.title);
    setDesc(suggestion.description);
    setSelectedCategory(suggestion.category);
    setPrice(suggestion.suggestedPrice.toString());
    setShowAIPanel(false);
    setStatus("✅ AI suggestion applied!");
  };

  return (
    <div style={containerStyle}>
      {/* Futuristic Header */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={logoContainerStyle}>
            <div style={logoIconStyle}>🤖</div>
            <h1 style={headerTitleStyle}>AI Event Creator</h1>
            <span style={versionStyle}>v2.0</span>
          </div>
          <div style={aiStatusStyle}>
            <div style={statusIndicatorStyle} className="status-online"></div>
            <span style={statusTextStyle}>AI System Online</span>
          </div>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          <span style={buttonIconStyle}>🚪</span>
          Logout
        </button>
      </div>

      <div style={mainContentStyle}>
        {/* AI Assistant Panel */}
        <div style={aiPanelStyle}>
          <div style={aiPanelHeaderStyle}>
            <h3 style={aiPanelTitleStyle}>
              <span style={aiIconStyle}>🤖</span>
              AI Event Assistant
            </h3>
            <div style={aiPanelActionsStyle}>
              <button 
                onClick={() => setShowAIPanel(!showAIPanel)}
                style={toggleButtonStyle}
              >
                {showAIPanel ? "Hide" : "Show"} AI Panel
              </button>
              <button 
                onClick={() => navigate("/ai-flyer-designer")}
                style={aiFlyerButtonStyle}
              >
                🎨 AI Flyer Designer
              </button>
              <button 
                onClick={() => navigate("/ai-analytics")}
                style={aiAnalyticsButtonStyle}
              >
                📊 AI Analytics
              </button>
            </div>
          </div>
          
          {showAIPanel && (
            <div style={aiPanelContentStyle}>
              <div style={aiActionsStyle}>
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
                
                <button 
                  onClick={enhanceWithAI}
                  disabled={aiLoading || !title.trim()}
                  style={aiActionButtonStyle}
                >
                  {aiLoading ? (
                    <div style={loadingSpinnerStyle}></div>
                  ) : (
                    <span style={buttonIconStyle}>✨</span>
                  )}
                  Enhance Description
                </button>
                
                <button 
                  onClick={optimizePricing}
                  disabled={aiLoading || !price}
                  style={aiActionButtonStyle}
                >
                  {aiLoading ? (
                    <div style={loadingSpinnerStyle}></div>
                  ) : (
                    <span style={buttonIconStyle}>💰</span>
                  )}
                  Optimize Pricing
                </button>
              </div>

              {aiSuggestions.length > 0 && (
                <div style={suggestionsContainerStyle}>
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
                            onClick={() => useAISuggestion(suggestion)}
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
          )}
        </div>

        <div style={dashboardLayoutStyle}>
          {/* Create Flyer Form */}
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>
              <span style={sectionIconStyle}>🎨</span>
              Create New Event
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); saveFlyer(); }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Event Title *</label>
                <input
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)}
                  placeholder="Enter your event title..."
                  style={inputStyle}
                  required
                  className="futuristic-input"
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.currentTarget.value)}
                  style={selectStyle}
                  className="futuristic-input"
                >
                  <option value="">Select a category</option>
                  {eventCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Event Description *</label>
                <textarea
                  value={desc}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDesc(e.currentTarget.value)}
                  placeholder="Describe your event in detail..."
                  style={textareaStyle}
                  required
                  className="futuristic-input"
                />
              </div>

              <div style={formRowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Ticket Price (K)</label>
                  <input
                    value={price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.currentTarget.value)}
                    placeholder="0.00"
                    type="number"
                    min="0"
                    step="0.01"
                    style={inputStyle}
                    className="futuristic-input"
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Event Date</label>
                  <input
                    value={date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.currentTarget.value)}
                    type="datetime-local"
                    style={inputStyle}
                    className="futuristic-input"
                  />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Event Location</label>
                <input
                  value={location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.currentTarget.value)}
                  placeholder="Enter event location..."
                  style={inputStyle}
                  className="futuristic-input"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={submitButtonStyle}
                className="futuristic-button"
              >
                {loading ? (
                  <div style={loadingSpinnerStyle}></div>
                ) : (
                  <span style={buttonIconStyle}>🚀</span>
                )}
                {loading ? "Creating Event..." : "Launch Event"}
              </button>
            </form>
            
            {status && (
              <div style={statusContainerStyle}>
                <div style={statusStyle}>{status}</div>
              </div>
            )}
          </div>

          {/* My Events List */}
          <div style={eventsSectionStyle}>
            <h3 style={sectionTitleStyle}>
              <span style={sectionIconStyle}>📋</span>
              My Events
            </h3>
            {flyers.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={emptyIconStyle}>🎯</div>
                <p style={emptyTextStyle}>No events created yet. Create your first one above!</p>
              </div>
            ) : (
              <div style={eventsListStyle}>
                {flyers.map((flyer) => (
                  <div key={flyer.id} style={eventCardStyle}>
                    <div style={eventHeaderStyle}>
                      <h4 style={eventTitleStyle}>{flyer.title}</h4>
                      {flyer.ai_generated && (
                        <span style={aiBadgeStyle}>AI Generated</span>
                      )}
                    </div>
                    <p style={eventDescriptionStyle}>{flyer.description}</p>
                    <div style={eventDetailsStyle}>
                      {flyer.price && (
                        <div style={detailItemStyle}>
                          <span style={detailIconStyle}>💰</span>
                          <span>K{flyer.price}</span>
                        </div>
                      )}
                      {flyer.date && (
                        <div style={detailItemStyle}>
                          <span style={detailIconStyle}>📅</span>
                          <span>{new Date(flyer.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {flyer.location && (
                        <div style={detailItemStyle}>
                          <span style={detailIconStyle}>📍</span>
                          <span>{flyer.location}</span>
                        </div>
                      )}
                    </div>
                    <div style={eventFooterStyle}>
                      <span style={dateStyle}>
                        Created: {new Date(flyer.created_at).toLocaleDateString()}
                      </span>
                      {flyer.ai_score && (
                        <span style={aiScoreStyle}>
                          AI Score: {Math.round(flyer.ai_score * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Futuristic Styles
const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
  color: "#fff",
  position: "relative" as const
};

const headerStyle = {
  background: "rgba(26, 26, 46, 0.9)",
  backdropFilter: "blur(20px)",
  borderBottom: "2px solid rgba(0, 255, 255, 0.3)",
  padding: "1.5rem 2rem",
  position: "sticky" as const,
  top: 0,
  zIndex: 100
};

const headerContentStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "1400px",
  margin: "0 auto"
};

const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem"
};

const logoIconStyle = {
  fontSize: "2.5rem",
  filter: "drop-shadow(0 0 15px rgba(0, 255, 255, 0.5))"
};

const headerTitleStyle = {
  fontSize: "2rem",
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
  padding: "0.3rem 0.6rem",
  borderRadius: "12px",
  border: "1px solid rgba(0, 255, 255, 0.3)"
};

const aiStatusStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const statusIndicatorStyle = {
  width: "12px",
  height: "12px",
  borderRadius: "50%"
};

const statusTextStyle = {
  fontSize: "0.9rem",
  color: "#00ffff"
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

const buttonIconStyle = {
  fontSize: "1.2rem"
};

const mainContentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "2rem"
};

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

const toggleButtonStyle = {
  background: "rgba(0, 255, 255, 0.2)",
  color: "#00ffff",
  border: "1px solid rgba(0, 255, 255, 0.3)",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

const aiPanelActionsStyle = {
  display: "flex",
  gap: "1rem",
  alignItems: "center"
};

const aiFlyerButtonStyle = {
  background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
  color: "#000",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)"
};

const aiAnalyticsButtonStyle = {
  background: "linear-gradient(45deg, #4ecdc4, #00d4ff)",
  color: "#000",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(78, 205, 196, 0.3)"
};

const aiPanelContentStyle = {
  padding: "1.5rem"
};

const aiActionsStyle = {
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
  flexWrap: "wrap" as const
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

const loadingSpinnerStyle = {
  width: "20px",
  height: "20px",
  border: "2px solid rgba(0, 0, 0, 0.3)",
  borderTop: "2px solid #000",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const suggestionsContainerStyle = {
  marginTop: "2rem"
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

const dashboardLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem"
};

const formSectionStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const sectionTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: "0 0 1.5rem 0",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const sectionIconStyle = {
  fontSize: "1.5rem"
};

const inputGroupStyle = {
  marginBottom: "1.5rem"
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "600",
  color: "#00ffff",
  fontSize: "0.9rem"
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid rgba(0, 255, 255, 0.3)",
  borderRadius: "10px",
  fontSize: "1rem",
  background: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  transition: "all 0.3s ease"
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer"
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical" as const
};

const formRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem"
};

const submitButtonStyle = {
  width: "100%",
  padding: "1rem",
  background: "linear-gradient(45deg, #00ffff, #ff00ff)",
  color: "#000",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "1.1rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  transition: "all 0.3s ease"
};

const statusContainerStyle = {
  marginTop: "1rem"
};

const statusStyle = {
  padding: "1rem",
  borderRadius: "10px",
  textAlign: "center" as const,
  fontWeight: "500"
};

const eventsSectionStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const emptyStateStyle = {
  textAlign: "center" as const,
  padding: "3rem"
};

const emptyIconStyle = {
  fontSize: "4rem",
  marginBottom: "1rem",
  opacity: "0.5"
};

const emptyTextStyle = {
  color: "#888",
  fontSize: "1.1rem"
};

const eventsListStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "1rem"
};

const eventCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "15px",
  padding: "1.5rem",
  transition: "all 0.3s ease"
};

const eventHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1rem"
};

const eventTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  margin: 0,
  color: "#fff"
};

const aiBadgeStyle = {
  background: "linear-gradient(45deg, #00ff00, #00ffff)",
  color: "#000",
  padding: "0.3rem 0.6rem",
  borderRadius: "12px",
  fontSize: "0.7rem",
  fontWeight: "bold"
};

const eventDescriptionStyle = {
  color: "#ccc",
  lineHeight: "1.6",
  marginBottom: "1.5rem"
};

const eventDetailsStyle = {
  marginBottom: "1rem"
};

const detailItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
  color: "#888"
};

const detailIconStyle = {
  fontSize: "1rem"
};

const eventFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "1rem",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)"
};

const dateStyle = {
  fontSize: "0.8rem",
  color: "#666"
};

const aiScoreStyle = {
  fontSize: "0.8rem",
  color: "#00ffff",
  background: "rgba(0, 255, 255, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "10px"
};

export default SellerDashboard;
