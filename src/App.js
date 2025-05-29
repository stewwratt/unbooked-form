import React, { useState, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Logo from './Logo';
import PhoneInput from './PhoneInput';
import './FormRedesign.module.css'; // Only for marble background, not for layout
import './App.css'; // For pulse animation

function App() {
  const [step, setStep] = useState(1);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [volumeError, setVolumeError] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    currentPrice: '', // Changed from 50 to empty string
    weeklyVolume: '', // Changed from 50 to empty string
    priceIncrease: 10, // Keep this as number since it's slider-controlled
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
    const price = parseFloat(formData.currentPrice) || 0;
    const volume = parseFloat(formData.weeklyVolume) || 0;
    if (price <= 0 || volume <= 0) return 0;
    return Math.round(price * volume * 52);
  };

  const calculateNewAnnual = () => {
    const price = parseFloat(formData.currentPrice) || 0;
    const volume = parseFloat(formData.weeklyVolume) || 0;
    const priceIncrease = parseFloat(formData.priceIncrease) || 0;
    const retention = parseFloat(formData.retention) || 90;

    if (price <= 0 || volume <= 0) return 0;

    const newPrice = price + priceIncrease;
    const retentionDecimal = retention / 100;
    return Math.round(newPrice * (volume * retentionDecimal) * 52);
  };

  const calculateUplift = () => {
    const currentAnnual = calculateCurrentAnnual();
    const newAnnual = calculateNewAnnual();
    return Math.max(0, newAnnual - currentAnnual);
  };

  // Retention prediction heuristic
  const predictRetention = (priceIncrease, currentPrice) => {
    if (!currentPrice || currentPrice <= 0) return 90; // Default if no price set
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
      await fetch(
        "https://airtable-proxy.joshuastewart-2810.workers.dev/api/airtable",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
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

    if (step === 2) {
      const price = parseFloat(formData.currentPrice);
      if (!price || price <= 0) {
        setPriceError(true);
        return;
      }
      // Submit price data
      submitProgressiveData(2);
    }

    if (step === 3) {
      const volume = parseFloat(formData.weeklyVolume);
      if (!volume || volume <= 0) {
        setVolumeError(true);
        return;
      }
      // Submit volume data
      submitProgressiveData(3);
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
    const currentPrice = parseFloat(formData.currentPrice) || 0;
    const predictedRetention = predictRetention(newIncrease, currentPrice);
    setFormData({
      ...formData,
      priceIncrease: newIncrease,
      retention: Math.round(predictedRetention)
    });
  };

  // New helper function to post data and show loading indicator
  const submitForm = async () => {
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
      await fetch(
        "https://airtable-proxy.joshuastewart-2810.workers.dev/api/airtable",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      // Removed console.log for security
      setStep(10); // Updated from 9 to 10
    } catch (error) {
      // Removed console.error for security - consider implementing proper error tracking
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
    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  // Common styling for step content containers
  const stepContainerStyle = {
    margin: "0 auto",
    marginTop: "40px",
    maxWidth: "600px",
    textAlign: "left",
    padding: "0 20px",
    paddingBottom: window.innerWidth <= 768 ? "100px" : "20px",
  };

  const stepTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "30px",
  };

  const inputUnderlineStyle = {
    fontSize: "1rem",
    border: "none",
    borderBottom: "2px solid #aaa",
    borderRadius: "0",
    outline: "none",
    background: "transparent",
    width: "100%",
    padding: "15px 8px",
    marginBottom: "40px",
  };

  const errorStyle = { ...inputUnderlineStyle, borderBottomColor: "red" };

  // Right-align the button row with a gap
  const buttonRowStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginBottom: "60px",
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
    cursor: "pointer",
    WebkitAppearance: "none",
    appearance: "none",
    position: "relative",
    // Create larger invisible hit area with pseudo-elements
    boxSizing: "border-box"
  };

  // Slider thumb styles for blue color
  const sliderThumbStyle = `
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5e8bf4, #61baff);
      cursor: pointer;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    input[type="range"]::-moz-range-thumb {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5e8bf4, #61baff);
      cursor: pointer;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    /* Larger invisible hit area */
    input[type="range"]:before {
      content: '';
      position: absolute;
      top: -10px;
      bottom: -10px;
      left: 0;
      right: 0;
    }
  `;

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
            <div style={{ ...stepTitleStyle, fontSize: "1.4rem", marginBottom: "35px" }}>
              Discover Your Revenue Potential
            </div>

            {/* Hero Statement */}
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "25px",
              borderRadius: "8px",
              marginBottom: "30px",
              border: "2px solid #e3f2fd"
            }}>
              <div style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#5e8bf4",
                marginBottom: "15px",
                textAlign: "center"
              }}>
                See exactly how much extra revenue you could generate
              </div>
              <div style={{
                fontSize: "0.95rem",
                color: "#333",
                textAlign: "center",
                lineHeight: "1.5"
              }}>
                Our calculator reveals your financial impact in <strong>under 60 seconds</strong>
              </div>
            </div>

            {/* Unbooked Philosophy */}
            <div style={{ marginBottom: "25px", fontSize: "0.95rem", color: "#555", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "20px" }}>
                <strong>Unbooked's mission:</strong> Help service providers be recognised for what they're worth.
                We believe your time, expertise, and craft deserve premium pricing and we've built the tools to make that reality.
              </p>
            </div>

            {/* Value Propositions */}
            <div style={{ marginBottom: "30px" }}>
              <div style={{
                display: "grid",
                gap: "15px",
                marginBottom: "25px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "0.95rem"
                }}>
                  <div style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#5e8bf4",
                    borderRadius: "50%",
                    flexShrink: 0
                  }}></div>
                  <span><strong>Strategic pricing insights</strong> - Find your optimal price point</span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "0.95rem"
                }}>
                  <div style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#5e8bf4",
                    borderRadius: "50%",
                    flexShrink: 0
                  }}></div>
                  <span><strong>Revenue projections</strong> - See your annual uplift potential</span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "0.95rem"
                }}>
                  <div style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#61baff",
                    borderRadius: "50%",
                    flexShrink: 0
                  }}></div>
                  <span><strong>Pilot program access</strong> - Join our exclusive early adopter community with priority onboarding, advanced features, and direct founder access</span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "6px",
              marginBottom: "25px",
              border: "1px solid #ddd",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}>
              {/* Pulsing blue dot */}
              <div style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#5e8bf4",
                borderRadius: "50%",
                animation: "pulse 2s infinite ease-in-out",
                flexShrink: 0
              }}></div>
              <div style={{
                fontSize: "0.9rem",
                color: "#333",
                textAlign: "center",
                fontWeight: "500"
              }}>
                Enter your email to unlock your personalised revenue calculator
              </div>
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
              style={{
                ...(emailError ? errorStyle : inputUnderlineStyle),
                fontSize: "1.1rem",
                padding: "18px 10px"
              }}
              required
            />
            <div style={buttonRowStyle}>
              <button type="button" onClick={handleNext} style={{
                ...buttonStyle,
                background: "linear-gradient(135deg, #5e8bf4, #61baff)",
                fontSize: "1rem",
                fontWeight: "600",
                padding: "12px 20px",
                border: "none"
              }}>
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
                placeholder=""
                value={formData.currentPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, currentPrice: value });
                  if (priceError) setPriceError(false);
                  if (value && Number(value) > 0) triggerHapticFeedback();
                }}
                onKeyDown={handleKeyDown}
                style={{
                  ...inputUnderlineStyle,
                  fontSize: "1.2rem",
                  textAlign: "center",
                  padding: "18px 0",
                  transition: "border-bottom-color 0.2s ease",
                  borderRadius: "0",
                  borderBottomColor: priceError ? "red" : "#aaa"
                }}
                min="1"
                max="1000"
                onFocus={(e) => {
                  e.target.style.borderBottomColor = priceError ? "red" : "#5e8bf4";
                  e.target.style.borderRadius = "0";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = priceError ? "red" : "#aaa";
                  e.target.style.borderRadius = "0";
                }}
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
                placeholder=""
                value={formData.weeklyVolume}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, weeklyVolume: value });
                  if (volumeError) setVolumeError(false);
                  if (value && Number(value) > 0) triggerHapticFeedback();
                }}
                onKeyDown={handleKeyDown}
                style={{
                  ...inputUnderlineStyle,
                  fontSize: "1.1rem",
                  textAlign: "center",
                  padding: "16px 0",
                  transition: "border-bottom-color 0.2s ease",
                  borderRadius: "0",
                  borderBottomColor: volumeError ? "red" : "#aaa"
                }}
                min="1"
                max="200"
                onFocus={(e) => {
                  e.target.style.borderBottomColor = volumeError ? "red" : "#5e8bf4";
                  e.target.style.borderRadius = "0";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = volumeError ? "red" : "#aaa";
                  e.target.style.borderRadius = "0";
                }}
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
            <style dangerouslySetInnerHTML={{ __html: sliderThumbStyle }} />
            <div style={{ marginBottom: "30px" }}>
              <div style={{ marginBottom: "15px" }}>
                <strong>Price increase: ${formData.priceIncrease}</strong>
              </div>
              <div style={{ position: "relative", padding: "10px 0" }}>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={formData.priceIncrease}
                  onChange={(e) => handlePriceIncreaseChange(Number(e.target.value))}
                  style={sliderStyle}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666" }}>
                <span>$5</span>
                <span>$50</span>
              </div>
              <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#666" }}>
                New price: ${(Number(formData.currentPrice) || 0) + formData.priceIncrease} per service
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
              <button type="button" onClick={handleNext} style={{
                ...buttonStyle,
                background: "linear-gradient(135deg, #5e8bf4, #61baff)",
                border: "none"
              }}>
                See Results
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>5. Your Revenue Potential</div>
            <style dangerouslySetInnerHTML={{ __html: sliderThumbStyle }} />
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
                <div style={{ position: "relative", padding: "10px 0" }}>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={formData.retention}
                    onChange={(e) => setFormData({ ...formData, retention: Number(e.target.value) })}
                    style={sliderStyle}
                  />
                </div>
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
            <div style={stepTitleStyle}>6. See if you qualify for our Unbooked pilot program</div>
            <div style={{ marginBottom: "20px", fontSize: "0.95rem", color: "#555", lineHeight: "1.5" }}>
              <p style={{ marginBottom: "15px" }}>
                Based on your revenue potential, you may qualify for early access to our pilot program.
              </p>
              <p style={{ marginBottom: "15px" }}>
                <strong>Unbooked is a revolutionary booking system under active development</strong> designed to help service providers like you be recognised for what you're worth. Our platform uses dynamic pricing, smart scheduling, and client insights to maximise your revenue while reducing no-shows.
              </p>
              <p style={{ marginBottom: "15px" }}>
                <strong>Pilot program includes:</strong> Early access to our booking platform, advanced dynamic pricing tools, priority support, exclusive community access, and direct collaboration with our founding team.
              </p>
              <p style={{ marginBottom: "0" }}>
                Enter your mobile number to check your eligibility and secure your spot in shaping the future of service booking.
              </p>
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
              <button type="button" onClick={handleNext} style={{
                ...buttonStyle,
                background: "linear-gradient(135deg, #5e8bf4, #61baff)",
                border: "none"
              }}>
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
            <div style={{ marginBottom: "40px" }}>
              {["Service Provider", "Client", "Both"].map((option) => (
                <div
                  key={option}
                  style={{
                    backgroundColor: formData.clientOrSP === option ? "#f0f7ff" : "#fff",
                    border: formData.clientOrSP === option ? "2px solid #5e8bf4" : "2px solid #e9ecef",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                  }}
                  onClick={() => setFormData({ ...formData, clientOrSP: option })}
                  onMouseEnter={(e) => {
                    if (formData.clientOrSP !== option) {
                      e.target.style.borderColor = "#c1d7f0";
                      e.target.style.backgroundColor = "#fafbfc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.clientOrSP !== option) {
                      e.target.style.borderColor = "#e9ecef";
                      e.target.style.backgroundColor = "#fff";
                    }
                  }}
                >
                  {/* Custom radio button */}
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "2px solid " + (formData.clientOrSP === option ? "#5e8bf4" : "#ccc"),
                    backgroundColor: formData.clientOrSP === option ? "#5e8bf4" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {formData.clientOrSP === option && (
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#fff"
                      }}></div>
                    )}
                  </div>

                  {/* Option text */}
                  <div style={{
                    fontSize: "1rem",
                    fontWeight: formData.clientOrSP === option ? "600" : "400",
                    color: formData.clientOrSP === option ? "#333" : "#555"
                  }}>
                    {option}
                  </div>
                </div>
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
              style={{
                ...inputUnderlineStyle,
                fontSize: "1.1rem",
                padding: "18px 10px"
              }}
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
              style={{
                ...inputUnderlineStyle,
                fontSize: "1.1rem",
                padding: "18px 10px"
              }}
            />
            <div style={buttonRowStyle}>
              <button
                type="button"
                onClick={handlePrev}
                style={{ ...buttonStyle, backgroundColor: "#888" }}
              >
                Previous
              </button>
              <button type="submit" style={{
                ...buttonStyle,
                background: "linear-gradient(135deg, #5e8bf4, #61baff)",
                border: "none"
              }}>
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
            marginTop: "30px",
            marginBottom: "10px"
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
