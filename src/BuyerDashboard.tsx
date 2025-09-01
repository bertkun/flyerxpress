import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import AISearchAssistant from "./AISearchAssistant";

interface Event {
  id: number;
  title: string;
  description: string;
  price?: number;
  date?: string;
  location?: string;
  created_at: string;
}

interface PaymentModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

export default BuyerDashboard;

function PaymentModal({ event, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pin, setPin] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const paymentMethods = [
    { id: "mobile_money", name: "Mobile Money", icon: "📱", description: "Airtel Money, MTN, Zamtel" },
    { id: "card", name: "Credit/Debit Card", icon: "💳", description: "Visa, Mastercard, Amex" },
    { id: "bank_transfer", name: "Bank Transfer", icon: "🏦", description: "Direct bank transfer" }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      onSuccess(transactionId);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = (event.price || 0) * quantity;

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContainerStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>Purchase Tickets</h3>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <div style={modalContentStyle}>
          <div style={eventSummaryStyle}>
            <h4 style={summaryTitleStyle}>{event.title}</h4>
            <div style={summaryDetailsStyle}>
              <span>Price: K{event.price}</span>
              <span>Quantity: {quantity}</span>
              <span style={totalStyle}>Total: K{totalAmount}</span>
            </div>
            <div style={quantityControlStyle}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={quantityButtonStyle}>-</button>
              <span style={quantityDisplayStyle}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={quantityButtonStyle}>+</button>
            </div>
          </div>

          <div style={methodsSectionStyle}>
            <h4 style={modalSectionTitleStyle}>Select Payment Method</h4>
            <div style={methodsGridStyle}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  style={{
                    ...methodCardStyle,
                    border: selectedMethod === method.id ? "2px solid #00ff00" : "1px solid rgba(255, 255, 255, 0.2)"
                  }}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div style={methodIconStyle}>{method.icon}</div>
                  <h5 style={methodNameStyle}>{method.name}</h5>
                  <p style={methodDescriptionStyle}>{method.description}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedMethod && (
            <div style={paymentFormStyle}>
              <h4 style={modalSectionTitleStyle}>Payment Details</h4>
              
              {selectedMethod === "mobile_money" && (
                <div style={formRowStyle}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Mobile Number</label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.currentTarget.value)}
                      placeholder="Enter mobile number"
                      style={inputStyle}
                      className="futuristic-input"
                    />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>PIN</label>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.currentTarget.value)}
                      placeholder="Enter 4-digit PIN"
                      maxLength={4}
                      style={inputStyle}
                      className="futuristic-input"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === "card" && (
                <>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.currentTarget.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      style={inputStyle}
                      className="futuristic-input"
                    />
                  </div>
                  <div style={formRowStyle}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Expiry Date</label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.currentTarget.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        style={inputStyle}
                        className="futuristic-input"
                      />
                    </div>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>CVV</label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.currentTarget.value)}
                        placeholder="123"
                        maxLength={4}
                        style={inputStyle}
                        className="futuristic-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedMethod === "bank_transfer" && (
                <div style={infoBoxStyle}>
                  <p style={infoTextStyle}>
                    You will receive bank transfer details via email. Please complete the transfer within 24 hours.
                  </p>
                </div>
              )}

              <div style={actionButtonsStyle}>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  style={payButtonStyle}
                  className="futuristic-button"
                >
                  {isProcessing ? (
                    <div style={modalLoadingSpinnerStyle}></div>
                  ) : (
                    <span style={buttonIconStyle}>💳</span>
                  )}
                  {isProcessing ? "Processing..." : `Pay K${totalAmount}`}
                </button>
                
                <button onClick={onClose} style={cancelButtonStyle}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BuyerDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlyers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchTerm, events]);

  const fetchFlyers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("flyers").select("*");
      if (!error && data) {
        setEvents(data);
        setFilteredEvents(data);
      } else {
        console.error("Error fetching events:", error);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleBuyTicket = (event: Event) => {
    setSelectedEvent(event);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    alert(`Payment successful! Transaction ID: ${transactionId}`);
    setShowPaymentModal(false);
    setSelectedEvent(null);
  };

  const handleLogout = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingSpinnerStyle}></div>
        <h2 style={loadingTextStyle}>Loading events...</h2>
        <p style={loadingSubtextStyle}>AI is analyzing event data...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={headerTextContainerStyle}>
            <h1 style={headerTitleStyle}>Event Discovery Hub</h1>
            <p style={headerSubtitleStyle}>AI-powered event discovery across Zambia</p>
          </div>
          <div style={headerStatsStyle}>
            <div style={statItemStyle}>
              <span style={statNumberStyle}>{events.length}</span>
              <span style={statLabelStyle}>Events</span>
            </div>
            <div style={statItemStyle}>
              <span style={statNumberStyle}>24/7</span>
              <span style={statLabelStyle}>AI Active</span>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          <span style={buttonIconStyle}>🚪</span>
          Logout
        </button>
      </div>

      <div style={mainContentStyle}>
        <AISearchAssistant onSearch={handleSearch} />

        <div style={eventsContainerStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              <span style={sectionIconStyle}>🎫</span>
              {searchTerm ? `Search Results (${filteredEvents.length})` : "Discover Events"}
            </h2>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={clearSearchButtonStyle}>
                Clear Search
              </button>
            )}
          </div>
          
          {filteredEvents.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>
                {searchTerm ? "🔍" : "🎯"}
              </div>
              <h3 style={emptyTitleStyle}>
                {searchTerm ? "No events match your search" : "No events available"}
              </h3>
              <p style={emptyTextStyle}>
                {searchTerm 
                  ? "Try adjusting your search terms or use AI recommendations"
                  : "Check back later for new events or create your own!"
                }
              </p>
            </div>
          ) : (
            <div style={eventsGridStyle}>
              {filteredEvents.map((event: Event) => (
                <div key={event.id} style={eventCardStyle} className="quantum-state">
                  <div style={eventHeaderStyle}>
                    <h3 style={eventTitleStyle}>{event.title}</h3>
                    {event.price && (
                      <div style={priceTagStyle}>K{event.price}</div>
                    )}
                  </div>

                  <p style={eventDescriptionStyle}>{event.description}</p>

                  <div style={eventDetailsStyle}>
                    {event.date && (
                      <div style={detailItemStyle}>
                        <span style={detailIconStyle}>📅</span>
                        {event.date}
                      </div>
                    )}
                    {event.location && (
                      <div style={detailItemStyle}>
                        <span style={detailIconStyle}>📍</span>
                        {event.location}
                      </div>
                    )}
                  </div>

                  <div style={eventActionsStyle}>
                    <button 
                      onClick={() => handleBuyTicket(event)} 
                      style={buyButtonStyle}
                      className="futuristic-button"
                    >
                      <span style={buttonIconStyle}>🎟️</span>
                      Buy Ticket
                    </button>
                    <div style={qrContainerStyle}>
                      <QRCodeCanvas value={`event-${event.id}`} size={60} />
                      <div style={qrLabelStyle}>Scan for details</div>
                    </div>
                  </div>

                  <div style={eventFooterStyle}>
                    <span style={eventDateStyle}>
                      Posted: {new Date(event.created_at).toLocaleDateString()}
                    </span>
                    <div style={aiAnalysisStyle}>
                      <span style={aiIconStyle}>🤖</span>
                      <span style={aiTextStyle}>AI Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <PaymentModal
          event={selectedEvent}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

// Modal Styles
const modalOverlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(10px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalContainerStyle = {
  background: "rgba(26, 26, 46, 0.95)",
  backdropFilter: "blur(20px)",
  border: "2px solid rgba(0, 255, 255, 0.3)",
  borderRadius: "20px",
  maxWidth: "600px",
  width: "90%",
  maxHeight: "90vh",
  overflow: "auto"
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1.5rem",
  borderBottom: "1px solid rgba(0, 255, 255, 0.2)"
};

const modalTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: 0,
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

const modalContentStyle = {
  padding: "1.5rem"
};

const eventSummaryStyle = {
  background: "rgba(0, 255, 255, 0.05)",
  borderRadius: "15px",
  padding: "1.5rem",
  marginBottom: "2rem"
};

const summaryTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#fff"
};

const summaryDetailsStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem"
};

const totalStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#00ff00"
};

const quantityControlStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  justifyContent: "center"
};

const quantityButtonStyle = {
  background: "rgba(0, 255, 255, 0.2)",
  color: "#00ffff",
  border: "1px solid rgba(0, 255, 255, 0.3)",
  padding: "0.5rem 1rem",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "1.2rem",
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const quantityDisplayStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#fff",
  minWidth: "30px",
  textAlign: "center" as const
};

const methodsSectionStyle = {
  marginBottom: "2rem"
};

const modalSectionTitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#fff"
};

const methodsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "1rem"
};

const methodCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  padding: "1rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "center" as const
};

const methodIconStyle = {
  fontSize: "2rem",
  marginBottom: "0.5rem"
};

const methodNameStyle = {
  fontSize: "1rem",
  fontWeight: "bold",
  margin: "0 0 0.5rem 0",
  color: "#fff"
};

const methodDescriptionStyle = {
  fontSize: "0.8rem",
  color: "#ccc",
  margin: 0
};

const paymentFormStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "15px",
  padding: "1.5rem"
};

const formRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem"
};

const inputGroupStyle = {
  marginBottom: "1.5rem"
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "600",
  color: "#00ff00",
  fontSize: "0.9rem"
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid rgba(0, 255, 0, 0.3)",
  borderRadius: "10px",
  fontSize: "1rem",
  background: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  transition: "all 0.3s ease"
};

const infoBoxStyle = {
  background: "rgba(0, 255, 0, 0.1)",
  border: "1px solid rgba(0, 255, 0, 0.2)",
  borderRadius: "10px",
  padding: "1rem",
  marginBottom: "1.5rem"
};

const infoTextStyle = {
  fontSize: "0.9rem",
  color: "#ccc",
  margin: 0,
  lineHeight: "1.4"
};

const actionButtonsStyle = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center"
};

const payButtonStyle = {
  padding: "1rem 2rem",
  background: "linear-gradient(45deg, #00ff00, #00ffff)",
  color: "#000",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "1.1rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "all 0.3s ease"
};

const cancelButtonStyle = {
  padding: "1rem 2rem",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "all 0.3s ease"
};

const modalLoadingSpinnerStyle = {
  width: "20px",
  height: "20px",
  border: "2px solid rgba(0, 0, 0, 0.3)",
  borderTop: "2px solid #000",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

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
  padding: "2rem 0",
  position: "sticky" as const,
  top: 0,
  zIndex: 100
};

const headerContentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const headerTextContainerStyle = {
  flex: "1"
};

const headerTitleStyle = {
  margin: "0",
  fontSize: "3rem",
  fontWeight: "bold",
  background: "linear-gradient(45deg, #00ffff, #ff00ff)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent",
  textShadow: "0 0 30px rgba(0, 255, 255, 0.3)"
};

const headerSubtitleStyle = {
  margin: "0.5rem 0 0 0",
  fontSize: "1.2rem",
  color: "#ccc",
  opacity: "0.9"
};

const headerStatsStyle = {
  display: "flex",
  gap: "2rem",
  marginRight: "2rem"
};

const statItemStyle = {
  textAlign: "center" as const
};

const statNumberStyle = {
  display: "block",
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#00ffff",
  textShadow: "0 0 15px rgba(0, 255, 255, 0.5)"
};

const statLabelStyle = {
  fontSize: "0.9rem",
  color: "#888",
  textTransform: "uppercase" as const,
  letterSpacing: "1px"
};

const logoutButtonStyle = {
  padding: "0.75rem 1.5rem",
  background: "transparent",
  color: "#fff",
  border: "2px solid #fff",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "all 0.3s ease"
};

const buttonIconStyle = {
  fontSize: "1.2rem"
};

const mainContentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "2rem"
};

const loadingContainerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
  color: "#fff"
};

const loadingSpinnerStyle = {
  width: "60px",
  height: "60px",
  border: "4px solid rgba(0, 255, 255, 0.3)",
  borderTop: "4px solid #00ffff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: "2rem"
};

const loadingTextStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#00ffff"
};

const loadingSubtextStyle = {
  fontSize: "1.1rem",
  color: "#888"
};

const eventsContainerStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem"
};

const sectionTitleStyle = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  color: "#fff"
};

const sectionIconStyle = {
  fontSize: "2.5rem",
  filter: "drop-shadow(0 0 15px rgba(0, 255, 255, 0.5))"
};

const clearSearchButtonStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.3s ease"
};

const emptyStateStyle = {
  textAlign: "center" as const,
  padding: "4rem 2rem"
};

const emptyIconStyle = {
  fontSize: "4rem",
  marginBottom: "1.5rem",
  opacity: "0.7"
};

const emptyTitleStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#fff"
};

const emptyTextStyle = {
  fontSize: "1.1rem",
  color: "#888",
  maxWidth: "400px",
  margin: "0 auto",
  lineHeight: "1.6"
};

const eventsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
  gap: "2rem"
};

const eventCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  padding: "2rem",
  transition: "all 0.3s ease",
  position: "relative" as const,
  overflow: "hidden"
};

const eventHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1.5rem"
};

const eventTitleStyle = {
  margin: "0",
  fontSize: "1.4rem",
  fontWeight: "bold",
  color: "#fff",
  flex: "1",
  lineHeight: "1.3"
};

const priceTagStyle = {
  background: "linear-gradient(45deg, #00ff00, #00ffff)",
  color: "#000",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  fontSize: "1rem",
  fontWeight: "bold",
  marginLeft: "1rem",
  boxShadow: "0 4px 15px rgba(0, 255, 0, 0.3)"
};

const eventDescriptionStyle = {
  color: "#ccc",
  lineHeight: "1.6",
  marginBottom: "1.5rem",
  fontSize: "1rem"
};

const eventDetailsStyle = {
  marginBottom: "1.5rem"
};

const detailItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.8rem",
  fontSize: "0.95rem",
  color: "#aaa"
};

const detailIconStyle = {
  fontSize: "1.1rem"
};

const eventActionsStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem"
};

const buyButtonStyle = {
  padding: "0.75rem 1.5rem",
  background: "linear-gradient(45deg, #00ffff, #ff00ff)",
  color: "#000",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0, 255, 255, 0.3)"
};

const qrContainerStyle = {
  textAlign: "center" as const
};

const qrLabelStyle = {
  fontSize: "0.8rem",
  color: "#666",
  marginTop: "0.5rem"
};

const eventFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "1rem",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)"
};

const eventDateStyle = {
  fontSize: "0.8rem",
  color: "#666"
};

const aiAnalysisStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  background: "rgba(0, 255, 255, 0.1)",
  padding: "0.3rem 0.6rem",
  borderRadius: "15px",
  border: "1px solid rgba(0, 255, 255, 0.2)"
};

const aiIconStyle = {
  fontSize: "0.8rem"
};

const aiTextStyle = {
  fontSize: "0.7rem",
  color: "#00ffff",
  fontWeight: "500"
};
