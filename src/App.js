import React, { useState, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Logo from './Logo';
import PhoneInput from './PhoneInput';
import './FormRedesign.module.css'; // Only for marble background, not for layout

function App() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    currentPrice: 50, // NEW: Price per service
    weeklyVolume: 50, // NEW: Clients per week - changed from 20 to 50
    priceIncrease: 10, // NEW: Price increase amount
    retention: 90, // NEW: Predicted retention percentage
    mobile: { countryCode: '+61', phoneNumber: '' },
    clientOrSP: '',
    currentSystem: '',
    currentChallenges: '',
    dynamicBookingAppeal: 5,
    revenueSharing: '',
    desiredFeatures: ''
  });

  const totalSteps = 10; // Updated from 9 to 10
  const nodeRef = useRef(null);

  // Revenue calculation functions
  const calculateCurrentAnnual = () => {
    return formData.currentPrice * formData.weeklyVolume * 52;
  };

  const calculateNewAnnual = () => {
    const newPrice = formData.currentPrice + formData.priceIncrease;
    const retentionDecimal = formData.retention / 100;
    return newPrice * (formData.weeklyVolume * retentionDecimal) * 52;
  };

  const calculateUplift = () => {
    return calculateNewAnnual() - calculateCurrentAnnual();
  };

  // Retention prediction heuristic
  const predictRetention = (priceIncrease, currentPrice) => {
    const increasePercentage = (priceIncrease / currentPrice) * 100;
    return Math.max(80, 100 - (increasePercentage * 0.6));
  };

  // Validators
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Valid if phone number contains at least 8 digits (ignoring non-digits)
  const validatePhone = (phoneNumber) => {
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length >= 8;
  };

  // Progressive submission function - posts data after key steps
  const submitProgressiveData = async (stepCompleted) => {
    if (!formData.email) return; // Need email as identifier

    const payload = {
      email: formData.email,
      stepCompleted: stepCompleted,
      // Include all current data
      ...(formData.currentPrice && { currentPrice: formData.currentPrice }),
      ...(formData.weeklyVolume && { weeklyVolume: formData.weeklyVolume }),
      ...(formData.priceIncrease && { priceIncrease: formData.priceIncrease }),
      ...(formData.retention && { retention: formData.retention }),
      ...(formData.currentPrice && formData.weeklyVolume && {
        currentAnnual: calculateCurrentAnnual(),
        newAnnual: calculateNewAnnual(),
        uplift: calculateUplift()
      }),
      ...(formData.mobile.phoneNumber && { mobile: formData.mobile }),
      ...(formData.clientOrSP && { clientOrSP: formData.clientOrSP }),
      ...(formData.currentSystem && { currentSystem: formData.currentSystem }),
      ...(formData.currentChallenges && { currentChallenges: formData.currentChallenges }),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(
        "https://airtable-proxy.joshuastewart-2810.workers.dev/api/airtable",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await response.json();
      // Removed console.log for security
    } catch (error) {
      // Removed console.error for security - consider implementing proper error tracking
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateEmail(formData.email)) {
        setEmailError(true);
        return;
      }
      // Submit email immediately after validation
      submitProgressiveData(1);
    }
    if (step === 6) { // Mobile is now step 6
      if (!validatePhone(formData.mobile.phoneNumber)) {
        setPhoneError(true);
        return;
      }
      // Submit mobile data
      submitProgressiveData(6);
    }

    // Submit progressive data for key steps
    if (step === 2) submitProgressiveData(2); // After price
    if (step === 3) submitProgressiveData(3); // After volume
    if (step === 4) submitProgressiveData(4); // After price increase
    if (step === 5) submitProgressiveData(5); // After results view

    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 9) { // Updated from 8 to 9
        handleNext();
      } else if (step === 9) { // Updated from 8 to 9
        submitForm();
      }
    }
  };

  // Update price increase and auto-calculate retention
  const handlePriceIncreaseChange = (newIncrease) => {
    const predictedRetention = predictRetention(newIncrease, formData.currentPrice);
    setFormData({
      ...formData,
      priceIncrease: newIncrease,
      retention: Math.round(predictedRetention)
    });
  };

  // New helper function to post data and show loading indicator
  const submitForm = async () => {
    setIsSubmitting(true);
    const payload = {
      email: formData.email,
      currentPrice: formData.currentPrice,
      weeklyVolume: formData.weeklyVolume,
      priceIncrease: formData.priceIncrease,
      retention: formData.retention,
      currentAnnual: calculateCurrentAnnual(),
      newAnnual: calculateNewAnnual(),
      uplift: calculateUplift(),
      mobile: formData.mobile,
      clientOrSP: formData.clientOrSP,
      currentSystem: formData.currentSystem,
      currentChallenges: formData.currentChallenges,
      dynamicBookingAppeal: formData.dynamicBookingAppeal,
      revenueSharing: formData.revenueSharing,
      desiredFeatures: formData.desiredFeatures,
    };

    try {
      const response = await fetch(
        "https://airtable-proxy.joshuastewart-2810.workers.dev/api/airtable",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await response.json();
      // Removed console.log for security
      setIsSubmitting(false);
      setStep(10); // Updated from 9 to 10
    } catch (error) {
      // Removed console.error for security - consider implementing proper error tracking
      setIsSubmitting(false);
    }
  };

  // Update handleSubmit to call submitForm
  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  const progress = (step / totalSteps) * 100;
  const progressBarFill = {
    width: `${progress}%`,
    height: "100%",
    backgroundColor: "#000",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  };

  // Common styling for step content containers
  const stepContainerStyle = {
    margin: "0 auto",
    maxWidth: "600px",
    textAlign: "left",
  };

  const stepTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "30px",
  };

  const inputUnderlineStyle = {
    fontSize: "1rem",
    border: "none",
    borderBottom: "1px solid #aaa",
    outline: "none",
    background: "transparent",
    width: "100%",
    marginBottom: "40px",
  };

  const errorStyle = { ...inputUnderlineStyle, borderBottomColor: "red" };

  // Right-align the button row with a gap
  const buttonRowStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginBottom: "40px",
  };

  const buttonStyle = {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "10px 16px",
    cursor: "pointer",
  };

  const sliderStyle = {
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    background: "#ddd",
    outline: "none",
    marginBottom: "20px",
  };

  // Simple haptic feedback function for mobile devices
  const triggerHapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5); // Very short, subtle vibration
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>Discover Your Revenue Potential</div>
            <div style={{
              marginBottom: "25px",
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: "1.6"
            }}>
              <p style={{ marginBottom: "15px" }}>
                <strong>Unbooked</strong> is revolutionising how service providers manage their time and pricing.
                Our dynamic booking marketplace helps you optimise revenue while reducing no-shows.
              </p>
              <p style={{ marginBottom: "20px" }}>
                But first, let's show you something powerful: <strong>exactly how much extra revenue</strong> you could
                generate with strategic price increases. Our calculator reveals the financial impact in seconds.
              </p>
              <p style={{ marginBottom: "0", fontSize: "0.9rem", color: "#666" }}>
                Enter your email to access your personalised pricing calculator →
              </p>
            </div>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (emailError) setEmailError(false);
              }}
              onBlur={() => {
                if (!validateEmail(formData.email)) setEmailError(true);
              }}
              onKeyDown={handleKeyDown}
              style={emailError ? errorStyle : inputUnderlineStyle}
              required
            />
            <div style={buttonRowStyle}>
              <button type="button" onClick={handleNext} style={buttonStyle}>
                Calculate My Revenue Potential
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>2. How much do you charge on average per service?</div>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="number"
                placeholder="50"
                value={formData.currentPrice}
                onChange={(e) => {
                  const newPrice = Number(e.target.value);
                  setFormData({ ...formData, currentPrice: newPrice });
                  if (newPrice > 0) triggerHapticFeedback(); // Subtle feedback on valid input
                }}
                onKeyDown={handleKeyDown}
                style={{
                  ...inputUnderlineStyle,
                  fontSize: "1.2rem",
                  textAlign: "center",
                  padding: "12px 0",
                  transition: "border-bottom-color 0.2s ease"
                }}
                min="1"
                max="1000"
                onFocus={(e) => e.target.style.borderBottomColor = "#007bff"}
                onBlur={(e) => e.target.style.borderBottomColor = "#aaa"}
              />
              <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "-30px", textAlign: "center" }}>
                Average price per haircut/service ($)
              </div>
            </div>
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="button" onClick={handleNext} style={buttonStyle}>
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>3. How many clients on average do you see per week?</div>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="number"
                placeholder="40"
                value={formData.weeklyVolume}
                onChange={(e) => {
                  const newVolume = Number(e.target.value);
                  setFormData({ ...formData, weeklyVolume: newVolume });
                  if (newVolume > 0) triggerHapticFeedback(); // Subtle feedback on valid input
                }}
                onKeyDown={handleKeyDown}
                style={{
                  ...inputUnderlineStyle,
                  fontSize: "1.1rem",
                  textAlign: "center",
                  padding: "10px 0",
                  transition: "border-bottom-color 0.2s ease"
                }}
                min="1"
                max="200"
                onFocus={(e) => e.target.style.borderBottomColor = "#007bff"}
                onBlur={(e) => e.target.style.borderBottomColor = "#aaa"}
              />
              <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "-30px", textAlign: "center" }}>
                Average number of clients per week
              </div>
            </div>
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="button" onClick={handleNext} style={buttonStyle}>
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>4. What if you increased your price?</div>
            <div style={{ marginBottom: "30px" }}>
              <div style={{ marginBottom: "15px" }}>
                <strong>Price increase: ${formData.priceIncrease}</strong>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={formData.priceIncrease}
                onChange={(e) => handlePriceIncreaseChange(Number(e.target.value))}
                style={sliderStyle}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666" }}>
                <span>$5</span>
                <span>$50</span>
              </div>
              <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#666" }}>
                New price: ${formData.currentPrice + formData.priceIncrease} per service
              </div>
            </div>
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="button" onClick={handleNext} style={buttonStyle}>
                See Results
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>5. Your Revenue Potential</div>
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "30px",
              borderRadius: "8px",
              marginBottom: "30px",
              border: "1px solid #e9ecef"
            }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>Current Annual Revenue</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>
                  ${calculateCurrentAnnual().toLocaleString()}
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>Projected Annual Revenue</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#28a745" }}>
                  ${calculateNewAnnual().toLocaleString()}
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>Annual Uplift</div>
                <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#007bff" }}>
                  +${calculateUplift().toLocaleString()}
                </div>
                {/* Minimal weekly breakdown */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "8px",
                  fontSize: "0.85rem",
                  color: "#666"
                }}>
                  +${Math.round(calculateUplift() / 52).toLocaleString()} per week
                </div>
              </div>
              <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "1px solid #dee2e6" }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>
                  Predicted Client Retention: {formData.retention}%
                </div>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={formData.retention}
                  onChange={(e) => setFormData({ ...formData, retention: Number(e.target.value) })}
                  style={sliderStyle}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666" }}>
                  <span>70%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="button" onClick={handleNext} style={buttonStyle}>
                Continue
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>6. See if you qualify for an Unbooked pilot program</div>
            <div style={{ marginBottom: "20px", fontSize: "0.95rem", color: "#555", lineHeight: "1.5" }}>
              Based on your revenue potential, you may qualify for early access to our pilot program.
              Enter your mobile number to see if you're eligible for exclusive beta features and priority onboarding.
            </div>
            <div style={{ marginBottom: "40px" }}>
              <PhoneInput
                value={formData.mobile}
                onChange={(newVal) => {
                  setFormData({ ...formData, mobile: newVal });
                  if (phoneError) setPhoneError(false);
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (!validatePhone(formData.mobile.phoneNumber))
                    setPhoneError(true);
                }}
                error={phoneError}
              />
            </div>
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="button" onClick={handleNext} style={buttonStyle}>
                Check Eligibility
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>
              7. Are you a service provider, a client, or both?
            </div>
            <div
              style={{
                marginBottom: "40px",
                display: "flex",
                gap: "8px",
              }}
            >
              {["Service Provider", "Client", "Both"].map((option) => (
                <button
                  key={option}
                  type="button"
                  style={{
                    backgroundColor:
                      formData.clientOrSP === option ? "#333" : "#ccc",
                    color: "#fff",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setFormData({ ...formData, clientOrSP: option })
                  }
                >
                  {option}
                </button>
              ))}
            </div>
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="button" onClick={handleNext} style={buttonStyle}>
                Next
              </button>
              <button
                type="button"
                onClick={submitForm}
                style={buttonStyle}
              >
                Skip and Submit
              </button>
            </div>
          </div>
        );
      case 8:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>
              8. What system/method do you currently use to book appointments?
            </div>
            <input
              type="text"
              placeholder="Your current booking method"
              value={formData.currentSystem}
              onChange={(e) =>
                setFormData({ ...formData, currentSystem: e.target.value })
              }
              onKeyDown={handleKeyDown}
              style={inputUnderlineStyle}
            />
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="button" onClick={handleNext} style={buttonStyle}>
                Next
              </button>
              <button
                type="button"
                onClick={submitForm}
                style={buttonStyle}
              >
                Skip and Submit
              </button>
            </div>
          </div>
        );
      case 9:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>
              9. What challenges do you face with your current booking process?
            </div>
            <input
              type="text"
              placeholder="Describe your challenges"
              value={formData.currentChallenges}
              onChange={(e) =>
                setFormData({ ...formData, currentChallenges: e.target.value })
              }
              onKeyDown={handleKeyDown}
              style={inputUnderlineStyle}
            />
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="submit" style={buttonStyle}>
                Submit
              </button>
            </div>
          </div>
        );
      case 10:
        return (
          <div style={{ margin: "0 auto", maxWidth: "600px", textAlign: "center" }}>
            <h2>Thanks for joining the waiting list!</h2>
            <p>We appreciate your interest and will be in touch soon.</p>
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "20px",
              marginBottom: "30px"
            }}>
              <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>
                Your potential annual revenue increase:
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#007bff" }}>
                +${calculateUplift().toLocaleString()}
              </div>
            </div>
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <a
                href="https://instagram.com/joshlukestewart"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/instagram.svg"
                  alt="Instagram"
                  style={{ width: "28px", height: "28px" }}
                />
              </a>
              <a
                href="https://linkedin.com/in/joshualukestewart"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  style={{ width: "28px", height: "28px" }}
                />
              </a>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-container" style={{ width: "100%" }}>
      <div className="video-container">
        <img
          src="/vertical-video.gif"
          alt="Vertical Animation"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="content-container">
        <Logo />
        <div
          className="progress-bar-container"
          style={{
            height: "6px",
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#eee",
            borderRadius: "3px",
            marginBottom: "40px",
          }}
        >
          <div style={progressBarFill} />
        </div>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={step}
            nodeRef={nodeRef}
            timeout={500}
            classNames="fade"
            unmountOnExit
            mountOnEnter
          >
            <div ref={nodeRef} className="card-container marble-panel" style={{ textAlign: "left" }}>
              {step < 10 ? (
                <form onSubmit={handleSubmit}>{getStepContent()}</form>
              ) : (
                getStepContent()
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>

        {/* Professional Footer */}
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderTop: "1px solid #f0f0f0",
          padding: "16px 0",
          fontSize: "0.75rem",
          color: "#888",
          zIndex: 1000
        }}>
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>© 2025 Unbooked</div>
            <div>
              Built by{" "}
              <a
                href="https://www.joshlukestewart.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#666",
                  textDecoration: "none",
                  borderBottom: "1px solid transparent",
                  transition: "border-bottom-color 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.borderBottomColor = "#666"}
                onMouseLeave={(e) => e.target.style.borderBottomColor = "transparent"}
              >
                Josh Stewart
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
