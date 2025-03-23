import React, { useState, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Logo from './Logo';
import PhoneInput from './PhoneInput';

function App() {
  const [step, setStep] = useState(1);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    mobile: { countryCode: '+61', phoneNumber: '' },
    clientOrSP: '',
    currentSystem: '',
    currentChallenges: '',
    dynamicBookingAppeal: 0,
    revenueSharing: '',
    desiredFeatures: ''
  });

  const totalSteps = 9;
  const nodeRef = useRef(null);

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

  const handleNext = () => {
    if (step === 1) {
      if (!validateEmail(formData.email)) {
        setEmailError(true);
        return;
      }
    }
    if (step === 2) {
      if (!validatePhone(formData.mobile.phoneNumber)) {
        setPhoneError(true);
        return;
      }
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 8) {
        handleNext();
      } else if (step === 8) {
        submitForm();
      }
    }
  };

  // New helper function to post data and advance to step 9
  const submitForm = async () => {
    const payload = {
      email: formData.email,
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
        "https://airtable-proxy.unbooked.me/api/airtable",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await response.json();
      console.log("Airtable proxy response:", json);
      setStep(9);
    } catch (error) {
      console.error("Error posting to Airtable via proxy:", error);
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

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>1. Please enter your email *</div>
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
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>2. Please enter your mobile number *</div>
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
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>
              3. Are you a service provider, a client, or both?
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
      case 4:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>
              4. What system/method do you currently use to book appointments?
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
      case 5:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>
              5. What challenges do you face with your current booking process?
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
      case 6:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>
              6. How appealing is a dynamic booking marketplace?
            </div>
            <div
              style={{
                marginBottom: "40px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {Array.from({ length: 5 }, (_, i) => i + 1).map((val) => (
                <button
                  key={val}
                  type="button"
                  style={{
                    backgroundColor:
                      formData.dynamicBookingAppeal === val ? "#333" : "#ccc",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setFormData({ ...formData, dynamicBookingAppeal: val })
                  }
                >
                  {val}
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
      case 7:
        return (
          <div style={stepContainerStyle}>
            <div style={stepTitleStyle}>
              7. Would you be interested in a revenue-sharing model if your slot is resold?
            </div>
            <div style={{ marginBottom: "40px" }}>
              <label style={{ marginRight: "20px" }}>
                <input
                  type="radio"
                  name="revenueSharing"
                  value="yes"
                  checked={formData.revenueSharing === "yes"}
                  onChange={(e) =>
                    setFormData({ ...formData, revenueSharing: e.target.value })
                  }
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="revenueSharing"
                  value="no"
                  checked={formData.revenueSharing === "no"}
                  onChange={(e) =>
                    setFormData({ ...formData, revenueSharing: e.target.value })
                  }
                />{" "}
                No
              </label>
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
              8. What improvements or features would you like to see?
            </div>
            <input
              type="text"
              placeholder="Your suggestions"
              value={formData.desiredFeatures}
              onChange={(e) =>
                setFormData({ ...formData, desiredFeatures: e.target.value })
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
      case 9:
        return (
          <div style={{ margin: "0 auto", maxWidth: "600px", textAlign: "center" }}>
            <h2>Thanks for joining the waiting list!</h2>
            <p>We appreciate your interest and will be in touch soon.</p>
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
            <div ref={nodeRef} className="card-container" style={{ textAlign: "left" }}>
              {step < 9 ? (
                <form onSubmit={handleSubmit}>{getStepContent()}</form>
              ) : (
                getStepContent()
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );
}

export default App;
