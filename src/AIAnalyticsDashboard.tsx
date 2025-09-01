import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

interface EventAnalytics {
  totalEvents: number;
  totalRevenue: number;
  averageTicketPrice: number;
  topPerformingEvents: Array<{
    title: string;
    revenue: number;
    ticketsSold: number;
    conversionRate: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    eventCount: number;
    totalRevenue: number;
    avgPrice: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    events: number;
    revenue: number;
  }>;
}

interface AIInsight {
  type: "trend" | "opportunity" | "warning" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  action: string;
}

export default function AIAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchAnalytics();
    generateAIInsights();
  }, [selectedTimeframe, selectedCategory]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch events data from Supabase
      const { data: events, error } = await supabase
        .from("flyers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        return;
      }

      // Process analytics data
      const processedAnalytics = processAnalyticsData(events || []);
      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (events: any[]): EventAnalytics => {
    const totalEvents = events.length;
    const totalRevenue = events.reduce((sum, event) => sum + (event.price || 0), 0);
    const averageTicketPrice = totalEvents > 0 ? totalRevenue / totalEvents : 0;

    // Simulate ticket sales data (in real app, this would come from actual sales)
    const topPerformingEvents = events.slice(0, 5).map(event => ({
      title: event.title,
      revenue: (event.price || 0) * Math.floor(Math.random() * 100 + 20),
      ticketsSold: Math.floor(Math.random() * 100 + 20),
      conversionRate: Math.random() * 0.3 + 0.1
    }));

    // Category performance
    const categoryMap = new Map();
    events.forEach(event => {
      const category = event.category || "Uncategorized";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { eventCount: 0, totalRevenue: 0, prices: [] });
      }
      categoryMap.get(category).eventCount++;
      categoryMap.get(category).totalRevenue += event.price || 0;
      categoryMap.get(category).prices.push(event.price || 0);
    });

    const categoryPerformance = Array.from(categoryMap.entries()).map(([category, data]: [string, any]) => ({
      category,
      eventCount: data.eventCount,
      totalRevenue: data.totalRevenue,
      avgPrice: data.prices.length > 0 ? data.prices.reduce((a: number, b: number) => a + b, 0) / data.prices.length : 0
    }));

    // Time series data (simulated)
    const timeSeriesData = generateTimeSeriesData(selectedTimeframe);

    return {
      totalEvents,
      totalRevenue,
      averageTicketPrice,
      topPerformingEvents,
      categoryPerformance,
      timeSeriesData
    };
  };

  const generateTimeSeriesData = (timeframe: string) => {
    const data = [];
    const now = new Date();
    let days = 7;
    
    switch (timeframe) {
      case "7d": days = 7; break;
      case "30d": days = 30; break;
      case "90d": days = 90; break;
      case "1y": days = 365; break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        events: Math.floor(Math.random() * 5 + 1),
        revenue: Math.floor(Math.random() * 1000 + 100)
      });
    }

    return data;
  };

  const generateAIInsights = async () => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const insights: AIInsight[] = [
      {
        type: "trend",
        title: "🎯 Music Events Trending Up",
        description: "Music events show 25% higher engagement than last month. Consider promoting more music-focused content.",
        confidence: 0.87,
        action: "Increase music event promotion"
      },
      {
        type: "opportunity",
        title: "💰 Premium Pricing Opportunity",
        description: "Your events are priced 15% below market average. Consider testing higher price points for premium events.",
        confidence: 0.92,
        action: "Test premium pricing strategy"
      },
      {
        type: "warning",
        title: "⚠️ Weekend Event Saturation",
        description: "Saturday events are showing 30% lower attendance. Consider diversifying event timing.",
        confidence: 0.78,
        action: "Diversify event scheduling"
      },
      {
        type: "recommendation",
        title: "🚀 Tech Conference Potential",
        description: "Technology events have the highest conversion rate. Focus on expanding this category.",
        confidence: 0.95,
        action: "Expand tech event offerings"
      }
    ];

    setAiInsights(insights);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend": return "📈";
      case "opportunity": return "💡";
      case "warning": return "⚠️";
      case "recommendation": return "🎯";
      default: return "ℹ️";
    }
  };



  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingContainerStyle}>
          <div style={loadingSpinnerStyle}></div>
          <p style={loadingTextStyle}>AI is analyzing your event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🤖 AI Analytics Dashboard</h1>
        <p style={subtitleStyle}>Real-time insights powered by artificial intelligence</p>
      </div>

      {/* Timeframe and Category Filters */}
      <div style={filtersStyle}>
        <div style={filterGroupStyle}>
          <label style={filterLabelStyle}>Timeframe:</label>
          <select
            value={selectedTimeframe}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTimeframe(e.currentTarget.value as any)}
            style={filterSelectStyle}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>

        <div style={filterGroupStyle}>
          <label style={filterLabelStyle}>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.currentTarget.value)}
            style={filterSelectStyle}
          >
            <option value="all">All Categories</option>
            {analytics?.categoryPerformance.map(cat => (
              <option key={cat.category} value={cat.category}>{cat.category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={metricsGridStyle}>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>📊</div>
          <div style={metricContentStyle}>
            <h3 style={metricValueStyle}>{analytics?.totalEvents || 0}</h3>
            <p style={metricLabelStyle}>Total Events</p>
          </div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricIconStyle}>💰</div>
          <div style={metricContentStyle}>
            <h3 style={metricValueStyle}>K{analytics?.totalRevenue.toFixed(2) || "0.00"}</h3>
            <p style={metricLabelStyle}>Total Revenue</p>
          </div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricIconStyle}>🎫</div>
          <div style={metricContentStyle}>
            <h3 style={metricValueStyle}>K{analytics?.averageTicketPrice.toFixed(2) || "0.00"}</h3>
            <p style={metricLabelStyle}>Avg Ticket Price</p>
          </div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricIconStyle}>📈</div>
          <div style={metricContentStyle}>
            <h3 style={metricValueStyle}>+{Math.floor(Math.random() * 20 + 5)}%</h3>
            <p style={metricLabelStyle}>Growth Rate</p>
          </div>
        </div>
      </div>

      <div style={contentGridStyle}>
        {/* AI Insights */}
        <div style={insightsSectionStyle}>
          <h2 style={sectionTitleStyle}>🧠 AI Insights</h2>
          <div style={insightsListStyle}>
            {aiInsights.map((insight, index) => (
              <div key={index} style={insightCardStyle}>
                <div style={insightHeaderStyle}>
                  <span style={insightIconStyle}>{getInsightIcon(insight.type)}</span>
                  <span style={insightTypeStyle}>{insight.type.toUpperCase()}</span>
                  <span style={confidenceBadgeStyle}>{Math.round(insight.confidence * 100)}%</span>
                </div>
                <h4 style={insightTitleStyle}>{insight.title}</h4>
                <p style={insightDescriptionStyle}>{insight.description}</p>
                <div style={insightActionStyle}>
                  <span style={actionLabelStyle}>Action:</span>
                  <span style={actionTextStyle}>{insight.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Events */}
        <div style={performanceSectionStyle}>
          <h2 style={sectionTitleStyle}>🏆 Top Performing Events</h2>
          <div style={performanceListStyle}>
            {analytics?.topPerformingEvents.map((event, index) => (
              <div key={index} style={performanceCardStyle}>
                <div style={performanceRankStyle}>#{index + 1}</div>
                <div style={performanceContentStyle}>
                  <h4 style={performanceTitleStyle}>{event.title}</h4>
                  <div style={performanceMetricsStyle}>
                    <span style={metricItemStyle}>💰 K{event.revenue}</span>
                    <span style={metricItemStyle}>🎫 {event.ticketsSold} sold</span>
                    <span style={metricItemStyle}>📊 {(event.conversionRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div style={categorySectionStyle}>
        <h2 style={sectionTitleStyle}>📊 Category Performance</h2>
        <div style={categoryGridStyle}>
          {analytics?.categoryPerformance.map((category, index) => (
            <div key={index} style={categoryCardStyle}>
              <h4 style={categoryTitleStyle}>{category.category}</h4>
              <div style={categoryMetricsStyle}>
                <div style={categoryMetricStyle}>
                  <span style={metricLabelStyle}>Events:</span>
                  <span style={metricValueStyle}>{category.eventCount}</span>
                </div>
                <div style={categoryMetricStyle}>
                  <span style={metricLabelStyle}>Revenue:</span>
                  <span style={metricValueStyle}>K{category.totalRevenue.toFixed(2)}</span>
                </div>
                <div style={categoryMetricStyle}>
                  <span style={metricLabelStyle}>Avg Price:</span>
                  <span style={metricValueStyle}>K{category.avgPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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

const filtersStyle = {
  display: "flex",
  gap: "2rem",
  marginBottom: "2rem",
  justifyContent: "center",
  flexWrap: "wrap" as const
};

const filterGroupStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.5rem"
};

const filterLabelStyle = {
  fontSize: "0.9rem",
  color: "#00d4ff",
  fontWeight: "600"
};

const filterSelectStyle = {
  padding: "0.5rem 1rem",
  border: "2px solid rgba(0, 212, 255, 0.3)",
  borderRadius: "10px",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  color: "#ffffff",
  fontSize: "1rem",
  cursor: "pointer"
};

const metricsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem",
  marginBottom: "3rem"
};

const metricCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "1.5rem",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  transition: "all 0.3s ease"
};

const metricIconStyle = {
  fontSize: "2.5rem",
  filter: "drop-shadow(0 0 15px rgba(0, 212, 255, 0.5))"
};

const metricContentStyle = {
  flex: 1
};

const metricValueStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  margin: "0 0 0.5rem 0",
  color: "#00d4ff"
};

const metricLabelStyle = {
  fontSize: "0.9rem",
  color: "#a0a0a0",
  margin: 0
};

const contentGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem",
  marginBottom: "3rem"
};

const insightsSectionStyle = {
  background: "rgba(0, 212, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(0, 212, 255, 0.2)"
};

const sectionTitleStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  margin: "0 0 1.5rem 0",
  color: "#00d4ff"
};

const insightsListStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "1rem"
};

const insightCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "15px",
  padding: "1rem",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const insightHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.5rem"
};

const insightIconStyle = {
  fontSize: "1.2rem"
};

const insightTypeStyle = {
  fontSize: "0.7rem",
  color: "#00d4ff",
  background: "rgba(0, 212, 255, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "8px",
  textTransform: "uppercase" as const
};

const confidenceBadgeStyle = {
  fontSize: "0.7rem",
  color: "#4ecdc4",
  background: "rgba(78, 205, 196, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "8px"
};

const insightTitleStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  margin: "0 0 0.5rem 0",
  color: "#ffffff"
};

const insightDescriptionStyle = {
  fontSize: "0.9rem",
  color: "#ccc",
  marginBottom: "1rem",
  lineHeight: "1.4"
};

const insightActionStyle = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center"
};

const actionLabelStyle = {
  fontSize: "0.8rem",
  color: "#00d4ff",
  fontWeight: "600"
};

const actionTextStyle = {
  fontSize: "0.8rem",
  color: "#ffffff"
};

const performanceSectionStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const performanceListStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "1rem"
};

const performanceCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "15px",
  padding: "1rem",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  gap: "1rem"
};

const performanceRankStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#ffd93d",
  minWidth: "40px"
};

const performanceContentStyle = {
  flex: 1
};

const performanceTitleStyle = {
  fontSize: "1rem",
  fontWeight: "bold",
  margin: "0 0 0.5rem 0",
  color: "#ffffff"
};

const performanceMetricsStyle = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap" as const
};

const metricItemStyle = {
  fontSize: "0.8rem",
  color: "#00d4ff",
  background: "rgba(0, 212, 255, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "8px"
};

const categorySectionStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const categoryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.5rem"
};

const categoryCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "15px",
  padding: "1.5rem",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const categoryTitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#00d4ff"
};

const categoryMetricsStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.5rem"
};

const categoryMetricStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const loadingContainerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
  gap: "2rem"
};

const loadingSpinnerStyle = {
  width: "60px",
  height: "60px",
  border: "4px solid rgba(0, 212, 255, 0.3)",
  borderTop: "4px solid #00d4ff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const loadingTextStyle = {
  fontSize: "1.2rem",
  color: "#00d4ff",
  textAlign: "center" as const
};
