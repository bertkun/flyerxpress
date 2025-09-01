import { useState } from "react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  processingTime: string;
  fees: string;
}

interface TicketDetails {
  eventId: number;
  eventTitle: string;
  quantity: number;
  pricePerTicket: number;
  totalAmount: number;
}

interface PaymentDetails {
  method: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  mobileNumber?: string;
  pin?: string;
  email?: string;
}

interface SecurePaymentGatewayProps {
  ticketDetails: TicketDetails;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentFailure: (error: string) => void;
  onCancel: () => void;
}

export default function SecurePaymentGateway({ 
  ticketDetails, 
  onPaymentSuccess, 
  onPaymentFailure, 
  onCancel 
}: SecurePaymentGatewayProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({} as PaymentDetails);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<"method" | "details" | "verification" | "success">("method");
  const [verificationCode, setVerificationCode] = useState("");
  
  const paymentMethods: PaymentMethod[] = [
    {
      id: "mobile_money",
      name: "Mobile Money",
      icon: "📱",
      description: "Pay with Airtel Money, MTN Mobile Money, or Zamtel",
      processingTime: "Instant",
      fees: "K2.50"
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Visa, Mastercard, or American Express",
      processingTime: "2-3 minutes",
      fees: "K5.00"
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: "🏦",
      description: "Direct bank transfer to your account",
      processingTime: "1-2 hours",
      fees: "K1.00"
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: "₿",
      description: "Pay with Bitcoin, Ethereum, or USDT",
      processingTime: "5-10 minutes",
      fees: "K3.00"
    }
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setCurrentStep("details");
  };

  const handleInputChange = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails({
      ...paymentDetails,
      [field]: value
    });
  };

  const validatePaymentDetails = (): boolean => {
    if (!selectedPaymentMethod) return false;
    
    switch (selectedPaymentMethod) {
      case "mobile_money":
        return !!(paymentDetails.mobileNumber && paymentDetails.pin);
      case "card":
        return !!(paymentDetails.cardNumber && paymentDetails.expiryDate && paymentDetails.cvv);
      case "bank_transfer":
        return !!(paymentDetails.email);
      case "crypto":
        return true; // Crypto payments are handled differently
      default:
        return false;
    }
  };

  const processPayment = async () => {
    if (!validatePaymentDetails()) {
      onPaymentFailure("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate verification requirement
      if (selectedPaymentMethod === "mobile_money" || selectedPaymentMethod === "card") {
        setCurrentStep("verification");
        return;
      }
      
      // For other methods, proceed directly
      await completePayment();
    } catch (error) {
      onPaymentFailure("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      onPaymentFailure("Please enter a valid 6-digit verification code");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      await completePayment();
    } catch (error) {
      onPaymentFailure("Verification failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const completePayment = async () => {
    try {
      // Generate transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Simulate final processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep("success");
      setTimeout(() => {
        onPaymentSuccess(transactionId);
      }, 2000);
    } catch (error) {
      onPaymentFailure("Payment completion failed");
    }
  };

  const getFees = () => {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    return method ? parseFloat(method.fees.replace('K', '')) : 0;
  };

  const getTotalWithFees = () => {
    return ticketDetails.totalAmount + getFees();
  };

  const renderPaymentDetailsForm = () => {
    switch (selectedPaymentMethod) {
      case "mobile_money":
        return (
          <div style={formSectionStyle}>
            <h4 style={formTitleStyle}>Mobile Money Details</h4>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Mobile Number</label>
              <input
                type="tel"
                value={paymentDetails.mobileNumber || ""}
                onChange={(e) => handleInputChange("mobileNumber", e.currentTarget.value)}
                placeholder="Enter mobile number"
                style={inputStyle}
                className="futuristic-input"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>PIN</label>
              <input
                type="password"
                value={paymentDetails.pin || ""}
                onChange={(e) => handleInputChange("pin", e.currentTarget.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                style={inputStyle}
                className="futuristic-input"
              />
            </div>
          </div>
        );
      
      case "card":
        return (
          <div style={formSectionStyle}>
            <h4 style={formTitleStyle}>Card Details</h4>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Card Number</label>
              <input
                type="text"
                value={paymentDetails.cardNumber || ""}
                onChange={(e) => handleInputChange("cardNumber", e.currentTarget.value)}
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
                  value={paymentDetails.expiryDate || ""}
                  onChange={(e) => handleInputChange("expiryDate", e.currentTarget.value)}
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
                  value={paymentDetails.cvv || ""}
                  onChange={(e) => handleInputChange("cvv", e.currentTarget.value)}
                  placeholder="123"
                  maxLength={4}
                  style={inputStyle}
                  className="futuristic-input"
                />
              </div>
            </div>
          </div>
        );
      
      case "bank_transfer":
        return (
          <div style={formSectionStyle}>
            <h4 style={formTitleStyle}>Bank Transfer Details</h4>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={paymentDetails.email || ""}
                onChange={(e) => handleInputChange("email", e.currentTarget.value)}
                placeholder="Enter email for transfer details"
                style={inputStyle}
                className="futuristic-input"
              />
            </div>
            <div style={infoBoxStyle}>
              <p style={infoTextStyle}>
                You will receive bank transfer details via email. 
                Please complete the transfer within 24 hours.
              </p>
            </div>
          </div>
        );
      
      case "crypto":
        return (
          <div style={formSectionStyle}>
            <h4 style={formTitleStyle}>Cryptocurrency Payment</h4>
            <div style={cryptoInfoStyle}>
              <div style={cryptoOptionStyle}>
                <span style={cryptoIconStyle}>₿</span>
                <div style={cryptoDetailsStyle}>
                  <h5 style={cryptoNameStyle}>Bitcoin (BTC)</h5>
                  <p style={cryptoAmountStyle}>
                    {((getTotalWithFees() / 45000) * 100000000).toFixed(0)} sats
                  </p>
                </div>
              </div>
              <div style={cryptoOptionStyle}>
                <span style={cryptoIconStyle}>Ξ</span>
                <div style={cryptoDetailsStyle}>
                  <h5 style={cryptoNameStyle}>Ethereum (ETH)</h5>
                  <p style={cryptoAmountStyle}>
                    {(getTotalWithFees() / 2500).toFixed(4)} ETH
                  </p>
                </div>
              </div>
              <div style={cryptoOptionStyle}>
                <span style={cryptoIconStyle}>💎</span>
                <div style={cryptoDetailsStyle}>
                  <h5 style={cryptoNameStyle}>USDT (Tether)</h5>
                  <p style={cryptoAmountStyle}>
                    ${getTotalWithFees().toFixed(2)} USDT
                  </p>
                </div>
              </div>
            </div>
            <div style={infoBoxStyle}>
              <p style={infoTextStyle}>
                Select your preferred cryptocurrency. You'll receive a payment address 
                and QR code to complete the transaction.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (currentStep === "success") {
    return (
      <div style={successContainerStyle}>
        <div style={successIconStyle}>✅</div>
        <h3 style={successTitleStyle}>Payment Successful!</h3>
        <p style={successTextStyle}>
          Your tickets have been purchased successfully. 
          You will receive a confirmation email shortly.
        </p>
        <div style={successDetailsStyle}>
          <p>Event: {ticketDetails.eventTitle}</p>
          <p>Quantity: {ticketDetails.quantity} tickets</p>
          <p>Total: K{getTotalWithFees().toFixed(2)}</p>
        </div>
      </div>
    );
  }

  if (currentStep === "verification") {
    return (
      <div style={verificationContainerStyle}>
        <h3 style={verificationTitleStyle}>Verification Required</h3>
        <p style={verificationTextStyle}>
          Please enter the verification code sent to your {selectedPaymentMethod === "mobile_money" ? "mobile number" : "email"}
        </p>
        <div style={verificationInputStyle}>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.currentTarget.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            style={verificationCodeInputStyle}
            className="futuristic-input"
          />
        </div>
        <div style={verificationButtonsStyle}>
          <button
            onClick={verifyPayment}
            disabled={isProcessing}
            style={verifyButtonStyle}
            className="futuristic-button"
          >
            {isProcessing ? (
              <div style={loadingSpinnerStyle}></div>
            ) : (
              <span style={buttonIconStyle}>🔐</span>
            )}
            {isProcessing ? "Verifying..." : "Verify & Complete"}
          </button>
          <button
            onClick={() => setCurrentStep("details")}
            style={backButtonStyle}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={headerTitleStyle}>
          <span style={securityIconStyle}>🔒</span>
          Secure Payment Gateway
        </h3>
        <p style={headerSubtitleStyle}>
          Your payment information is encrypted and secure
        </p>
      </div>

      {/* Ticket Summary */}
      <div style={ticketSummaryStyle}>
        <h4 style={summaryTitleStyle}>Ticket Summary</h4>
        <div style={summaryContentStyle}>
          <div style={summaryRowStyle}>
            <span>Event:</span>
            <span style={summaryValueStyle}>{ticketDetails.eventTitle}</span>
          </div>
          <div style={summaryRowStyle}>
            <span>Quantity:</span>
            <span style={summaryValueStyle}>{ticketDetails.quantity} tickets</span>
          </div>
          <div style={summaryRowStyle}>
            <span>Price per ticket:</span>
            <span style={summaryValueStyle}>K{ticketDetails.pricePerTicket}</span>
          </div>
          <div style={summaryRowStyle}>
            <span>Subtotal:</span>
            <span style={summaryValueStyle}>K{ticketDetails.totalAmount}</span>
          </div>
          {selectedPaymentMethod && (
            <div style={summaryRowStyle}>
              <span>Processing fees:</span>
              <span style={summaryValueStyle}>K{getFees()}</span>
            </div>
          )}
          <div style={summaryTotalStyle}>
            <span>Total:</span>
            <span style={totalAmountStyle}>
              K{selectedPaymentMethod ? getTotalWithFees() : ticketDetails.totalAmount}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      {currentStep === "method" && (
        <div style={methodsSectionStyle}>
          <h4 style={sectionTitleStyle}>Select Payment Method</h4>
          <div style={methodsGridStyle}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                style={methodCardStyle}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <div style={methodIconStyle}>{method.icon}</div>
                <h5 style={methodNameStyle}>{method.name}</h5>
                <p style={methodDescriptionStyle}>{method.description}</p>
                <div style={methodMetaStyle}>
                  <span style={metaItemStyle}>⏱️ {method.processingTime}</span>
                  <span style={metaItemStyle}>💰 {method.fees}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Details Form */}
      {currentStep === "details" && (
        <div style={detailsSectionStyle}>
          <div style={sectionHeaderStyle}>
            <h4 style={sectionTitleStyle}>
              {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name} Payment
            </h4>
            <button
              onClick={() => setCurrentStep("method")}
              style={backButtonStyle}
            >
              ← Change Method
            </button>
          </div>
          
          {renderPaymentDetailsForm()}
          
          <div style={actionButtonsStyle}>
            <button
              onClick={processPayment}
              disabled={isProcessing || !validatePaymentDetails()}
              style={payButtonStyle}
              className="futuristic-button"
            >
              {isProcessing ? (
                <div style={loadingSpinnerStyle}></div>
              ) : (
                <span style={buttonIconStyle}>💳</span>
              )}
              {isProcessing ? "Processing..." : `Pay K${getTotalWithFees().toFixed(2)}`}
            </button>
            
            <button
              onClick={onCancel}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div style={securityBadgeStyle}>
        <span style={securityIconStyle}>🛡️</span>
        <span style={securityTextStyle}>
          SSL Encrypted • PCI Compliant • 256-bit Security
        </span>
      </div>
    </div>
  );
}

// Futuristic Styles
const containerStyle = {
  background: "rgba(0, 255, 0, 0.05)",
  border: "1px solid rgba(0, 255, 0, 0.2)",
  borderRadius: "20px",
  padding: "2rem",
  maxWidth: "600px",
  margin: "0 auto"
};

const headerStyle = {
  textAlign: "center" as const,
  marginBottom: "2rem"
};

const headerTitleStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  margin: "0 0 0.5rem 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  color: "#00ff00"
};

const securityIconStyle = {
  fontSize: "1.8rem",
  filter: "drop-shadow(0 0 10px rgba(0, 255, 0, 0.5))"
};

const headerSubtitleStyle = {
  fontSize: "1rem",
  color: "#ccc",
  margin: 0
};

const ticketSummaryStyle = {
  background: "rgba(255, 255, 255, 0.05)",
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

const summaryContentStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.8rem"
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const summaryValueStyle = {
  fontWeight: "600",
  color: "#00ff00"
};

const summaryTotalStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "1rem",
  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  marginTop: "0.5rem"
};

const totalAmountStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#00ff00"
};

const methodsSectionStyle = {
  marginBottom: "2rem"
};

const sectionTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  margin: "0 0 1.5rem 0",
  color: "#fff"
};

const methodsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1rem"
};

const methodCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "15px",
  padding: "1.5rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "center" as const
};

const methodIconStyle = {
  fontSize: "3rem",
  marginBottom: "1rem"
};

const methodNameStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  margin: "0 0 0.5rem 0",
  color: "#fff"
};

const methodDescriptionStyle = {
  fontSize: "0.9rem",
  color: "#ccc",
  marginBottom: "1rem",
  lineHeight: "1.4"
};

const methodMetaStyle = {
  display: "flex",
  justifyContent: "space-around",
  gap: "0.5rem"
};

const metaItemStyle = {
  fontSize: "0.8rem",
  color: "#888",
  background: "rgba(0, 255, 0, 0.1)",
  padding: "0.2rem 0.5rem",
  borderRadius: "8px"
};

const detailsSectionStyle = {
  marginBottom: "2rem"
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem"
};

const formSectionStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "15px",
  padding: "1.5rem",
  marginBottom: "1.5rem"
};

const formTitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#fff"
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

const formRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem"
};

const infoBoxStyle = {
  background: "rgba(0, 255, 0, 0.1)",
  border: "1px solid rgba(0, 255, 0, 0.2)",
  borderRadius: "10px",
  padding: "1rem",
  marginTop: "1rem"
};

const infoTextStyle = {
  fontSize: "0.9rem",
  color: "#ccc",
  margin: 0,
  lineHeight: "1.4"
};

const cryptoInfoStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "1rem"
};

const cryptoOptionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

const cryptoIconStyle = {
  fontSize: "2rem"
};

const cryptoDetailsStyle = {
  flex: "1"
};

const cryptoNameStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  margin: "0 0 0.3rem 0",
  color: "#fff"
};

const cryptoAmountStyle = {
  fontSize: "0.9rem",
  color: "#00ff00",
  margin: 0
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

const backButtonStyle = {
  padding: "0.5rem 1rem",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "15px",
  cursor: "pointer",
  fontSize: "0.9rem",
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

const verificationContainerStyle = {
  textAlign: "center" as const,
  padding: "2rem"
};

const verificationTitleStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#00ff00"
};

const verificationTextStyle = {
  fontSize: "1.1rem",
  color: "#ccc",
  marginBottom: "2rem"
};

const verificationInputStyle = {
  marginBottom: "2rem"
};

const verificationCodeInputStyle = {
  width: "200px",
  padding: "1rem",
  fontSize: "1.5rem",
  textAlign: "center" as const,
  border: "2px solid rgba(0, 255, 0, 0.3)",
  borderRadius: "15px",
  background: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  letterSpacing: "0.5rem"
};

const verificationButtonsStyle = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center"
};

const verifyButtonStyle = {
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

const successContainerStyle = {
  textAlign: "center" as const,
  padding: "3rem 2rem"
};

const successIconStyle = {
  fontSize: "4rem",
  marginBottom: "1rem"
};

const successTitleStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  margin: "0 0 1rem 0",
  color: "#00ff00"
};

const successTextStyle = {
  fontSize: "1.1rem",
  color: "#ccc",
  marginBottom: "2rem",
  lineHeight: "1.6"
};

const successDetailsStyle = {
  background: "rgba(0, 255, 0, 0.1)",
  border: "1px solid rgba(0, 255, 0, 0.2)",
  borderRadius: "10px",
  padding: "1.5rem",
  textAlign: "left" as const
};

const securityBadgeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  background: "rgba(0, 255, 0, 0.1)",
  border: "1px solid rgba(0, 255, 0, 0.2)",
  borderRadius: "15px",
  padding: "1rem",
  marginTop: "2rem"
};

const securityTextStyle = {
  fontSize: "0.9rem",
  color: "#00ff00",
  fontWeight: "500"
};
