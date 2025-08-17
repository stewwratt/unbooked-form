import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import "./App.css";

function RegisterInterest() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const problemRef = useRef(null);
  const processRef = useRef(null);
  const exampleRef = useRef(null);
  const ctaRef = useRef(null);

  // Intersection Observer for smooth animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const elements = [heroRef, problemRef, processRef, exampleRef, ctaRef];
    elements.forEach((ref) => {
      if (ref.current) {
        ref.current.style.opacity = "0";
        ref.current.style.transform = "translateY(30px)";
        ref.current.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);
    setEmailError(false);

    const payload = {
      email: email,
      source: "register-interest",
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("🚀 Submitting to Airtable:", payload);

      const response = await fetch(
        "https://airtable-proxy.joshuastewart-2810.workers.dev/api/airtable",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Airtable submission successful:", responseData);
      } else {
        const errorData = await response.text();
        console.error(
          "❌ Airtable submission failed:",
          response.status,
          errorData
        );
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("❌ Network/Submission error:", error);
      // Still show success to user - best UX practice
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="main-container"
        style={{ width: "100%", overflowX: "hidden" }}
      >
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
            style={{
              maxWidth: "600px",
              margin: "40px auto",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "40px 30px",
                borderRadius: "16px",
                border: "1px solid #e9ecef",
                marginBottom: "30px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "15px",
                  lineHeight: "1.3",
                }}
              >
                You're on the list!
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  lineHeight: "1.6",
                  marginBottom: "0",
                }}
              >
                Thanks for your interest in Unbooked. We'll keep you updated on
                our progress and let you know when we're ready to transform your
                booking system.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #e9ecef",
                marginBottom: "40px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "15px",
                }}
              >
                What happens next?
              </h3>
              <div
                style={{
                  textAlign: "left",
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                <div
                  style={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#5e8bf4",
                      borderRadius: "50%",
                      marginTop: "8px",
                      flexShrink: 0,
                    }}
                  ></div>
                  <span>
                    We'll send you exclusive updates as we build the platform
                  </span>
                </div>
                <div
                  style={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#5e8bf4",
                      borderRadius: "50%",
                      marginTop: "8px",
                      flexShrink: 0,
                    }}
                  ></div>
                  <span>You'll get early access to our pilot program</span>
                </div>
                <div
                  style={{
                    marginBottom: "0",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#5e8bf4",
                      borderRadius: "50%",
                      marginTop: "8px",
                      flexShrink: 0,
                    }}
                  ></div>
                  <span>
                    We'll reach out when we're ready to help you maximize your
                    revenue
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginBottom: "40px",
              }}
            >
              <a
                href="https://instagram.com/joshlukestewart"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#666",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#5e8bf4")}
                onMouseLeave={(e) => (e.target.style.color = "#666")}
              >
                <img
                  src="/instagram.svg"
                  alt="Instagram"
                  style={{ width: "20px", height: "20px" }}
                />
                Follow Updates
              </a>
              <a
                href="https://www.linkedin.com/company/unbookd/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#666",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#5e8bf4")}
                onMouseLeave={(e) => (e.target.style.color = "#666")}
              >
                <img
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  style={{ width: "20px", height: "20px" }}
                />
                Connect
              </a>
            </div>
          </div>

          {/* Professional Footer */}
          <div
            style={{
              backgroundColor: "#fff",
              borderTop: "1px solid #f0f0f0",
              padding: "24px 16px",
              marginTop: "40px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
                color: "#9ca3af",
              }}
            >
              © 2025 Unbooked
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="main-container"
      style={{ width: "100%", overflowX: "hidden" }}
    >
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
          style={{
            maxWidth: "680px",
            margin: "20px auto",
            padding: "0 16px",
            paddingBottom: "20px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Hero Section */}
          <div
            ref={heroRef}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h1
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.2rem)",
                fontWeight: "700",
                lineHeight: "1.2",
                marginBottom: "20px",
                letterSpacing: "-0.025em",
              }}
            >
              <span style={{ color: "#1f2937" }}>The marketplace booking </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #5e8bf4, #61baff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                revolution
              </span>
            </h1>
            <p
              style={{
                fontSize: "clamp(1rem, 3vw, 1.1rem)",
                color: "#6b7280",
                lineHeight: "1.6",
                marginBottom: "30px",
                maxWidth: "520px",
                margin: "0 auto 30px",
              }}
            >
              The first platform that turns your{" "}
              <strong style={{ color: "#374151" }}>booked appointments</strong>{" "}
              into a marketplace. Finally get paid what you're truly worth.
            </p>

            <div
              style={{
                background: "#f3f4f6",
                color: "#5e8bf4",
                padding: "8px 16px",
                borderRadius: "6px",
                display: "inline-block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "24px",
                border: "1px solid #e5e7eb",
              }}
            >
              Early Access Coming Soon, Register for Updates
            </div>

            {/* Early Email Capture */}
            <form
              onSubmit={handleSubmit}
              style={{
                maxWidth: "350px",
                margin: "0 auto 40px",
                padding: "0 16px",
              }}
            >
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(false);
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  border: emailError
                    ? "2px solid #dc2626"
                    : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (!emailError) e.target.style.borderColor = "#5e8bf4";
                }}
                onBlur={(e) => {
                  if (!emailError) e.target.style.borderColor = "#e5e7eb";
                }}
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  fontWeight: "600",
                  background: isSubmitting
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #5e8bf4, #61baff)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  transform: isSubmitting ? "none" : "translateY(0)",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(94, 139, 244, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>

            {emailError && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "clamp(0.85rem, 2.2vw, 0.9rem)",
                  marginTop: "-30px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* The Problem Section */}
          <div
            ref={problemRef}
            style={{
              backgroundColor: "#fff",
              padding: "clamp(24px, 5vw, 32px)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              marginBottom: "clamp(32px, 6vw, 48px)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.25rem, 4vw, 1.4rem)",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "16px",
                textAlign: "center",
                letterSpacing: "-0.025em",
              }}
            >
              The hidden problem with traditional booking
            </h2>
            <p
              style={{
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "#6b7280",
                lineHeight: "1.6",
                marginBottom: "24px",
                textAlign: "center",
                maxWidth: "480px",
                margin: "0 auto 24px",
              }}
            >
              Every booking platform works the same way: once you're booked, the
              opportunity is closed. But what if someone else values that time
              slot more?
            </p>

            {/* Before/After Comparison */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "16px",
                marginTop: "24px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Traditional Booking */}
              <div
                style={{
                  backgroundColor: "#fafafa",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(0.95rem, 2.5vw, 1rem)",
                    fontWeight: "600",
                    color: "#dc2626",
                    margin: "0 0 12px 0",
                  }}
                >
                  Traditional Booking
                </h3>
                <p
                  style={{
                    fontSize: "clamp(0.85rem, 2.2vw, 0.9rem)",
                    color: "#991b1b",
                    margin: 0,
                    fontStyle: "italic",
                    lineHeight: "1.4",
                  }}
                >
                  "Sorry, I'm fully booked on Tuesday at 2PM."
                </p>
                <p
                  style={{
                    fontSize: "clamp(0.8rem, 2vw, 0.85rem)",
                    color: "#7f1d1d",
                    margin: "8px 0 0",
                    fontWeight: "500",
                  }}
                >
                  Opportunity closed. Money left on the table.
                </p>
              </div>

              {/* Unbooked Marketplace */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(0.95rem, 2.5vw, 1rem)",
                    fontWeight: "600",
                    color: "#0284c7",
                    margin: "0 0 12px 0",
                  }}
                >
                  Unbooked Marketplace
                </h3>
                <p
                  style={{
                    fontSize: "clamp(0.85rem, 2.2vw, 0.9rem)",
                    color: "#075985",
                    margin: 0,
                    fontStyle: "italic",
                    lineHeight: "1.4",
                  }}
                >
                  "I'm booked at 2PM for $50, but I'm open to offers."
                </p>
                <p
                  style={{
                    fontSize: "clamp(0.8rem, 2vw, 0.85rem)",
                    color: "#0c4a6e",
                    margin: "8px 0 0",
                    fontWeight: "500",
                  }}
                >
                  Opportunity multiplied. Maximum value captured.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div
            ref={processRef}
            style={{
              backgroundColor: "#f9fafb",
              padding: "clamp(24px, 5vw, 32px)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              marginBottom: "clamp(32px, 6vw, 48px)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.25rem, 4vw, 1.4rem)",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "12px",
                textAlign: "center",
                letterSpacing: "-0.025em",
              }}
            >
              The four-step process
            </h2>
            <p
              style={{
                fontSize: "clamp(0.9rem, 2.5vw, 0.95rem)",
                color: "#6b7280",
                textAlign: "center",
                marginBottom: "24px",
                maxWidth: "480px",
                margin: "0 auto 24px",
                lineHeight: "1.5",
              }}
            >
              See exactly how "I'm Booked" offers work with original client
              control and 10-minute decision windows
            </p>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                {
                  step: "1",
                  title: "You Get Booked",
                  description:
                    "Client books your 2PM slot for $50. In traditional systems, this closes the opportunity.",
                },
                {
                  step: "2",
                  title: "Offers Start Coming",
                  description:
                    "Other clients see you're booked and can make competing offers. 'I'll pay $100 for that 2PM slot.'",
                },
                {
                  step: "3",
                  title: "Original Client Decides",
                  description:
                    "The original booking holder gets notified and has 10 minutes to accept or decline the offer. They stay in complete control.",
                },
                {
                  step: "4",
                  title: "Everyone Wins",
                  description:
                    "If accepted: Original client gets paid from the surplus, you earn more, new client gets the slot. Win-win-win.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#5e8bf4",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "clamp(1rem, 2.8vw, 1.05rem)",
                        fontWeight: "600",
                        color: "#1f2937",
                        margin: "0 0 6px",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "clamp(0.85rem, 2.3vw, 0.9rem)",
                        color: "#6b7280",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Example Section */}
          <div
            ref={exampleRef}
            style={{
              backgroundColor: "#fff",
              padding: "clamp(24px, 5vw, 32px)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              marginBottom: "clamp(32px, 6vw, 48px)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.25rem, 4vw, 1.4rem)",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "12px",
                textAlign: "center",
                letterSpacing: "-0.025em",
              }}
            >
              Real example: win-win-win
            </h2>
            <p
              style={{
                fontSize: "clamp(0.9rem, 2.5vw, 0.95rem)",
                color: "#6b7280",
                textAlign: "center",
                marginBottom: "24px",
                maxWidth: "480px",
                margin: "0 auto 24px",
                lineHeight: "1.5",
              }}
            >
              See how everyone benefits from the marketplace system
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(1.8rem, 6vw, 2.2rem)",
                    fontWeight: "700",
                    color: "#dc2626",
                    marginBottom: "6px",
                  }}
                >
                  $50
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.8rem, 2.2vw, 0.85rem)",
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  Original Booking - Tuesday 2PM
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(1.8rem, 6vw, 2.2rem)",
                    fontWeight: "700",
                    color: "#16a34a",
                    marginBottom: "6px",
                  }}
                >
                  $100
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.8rem, 2.2vw, 0.85rem)",
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  Competing Offer - Same Tuesday 2PM
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  backgroundColor: "#f0f9ff",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(1.8rem, 6vw, 2.2rem)",
                    fontWeight: "700",
                    color: "#0284c7",
                    marginBottom: "6px",
                  }}
                >
                  +$50
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.8rem, 2.2vw, 0.85rem)",
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  Total Value - 100% increase
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "clamp(0.85rem, 2.3vw, 0.9rem)",
                color: "#6b7280",
                lineHeight: "1.5",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#374151",
                }}
              >
                How the $50 surplus gets distributed:
              </div>
              <ul
                style={{ margin: "0", paddingLeft: "16px", listStyle: "none" }}
              >
                <li style={{ marginBottom: "4px" }}>
                  <strong style={{ color: "#374151" }}>Original Client:</strong>{" "}
                  Gets compensation from surplus
                </li>
                <li style={{ marginBottom: "4px" }}>
                  <strong style={{ color: "#374151" }}>
                    Service Provider:
                  </strong>{" "}
                  Earns significantly more
                </li>
                <li style={{ marginBottom: "0" }}>
                  <strong style={{ color: "#374151" }}>New Client:</strong> Gets
                  the time slot they want
                </li>
              </ul>
            </div>
          </div>

          {/* Email Capture Section */}
          <div
            ref={ctaRef}
            style={{
              backgroundColor: "white",
              padding: "clamp(24px, 5vw, 32px)",
              borderRadius: "12px",
              border: "2px solid #5e8bf4",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.4rem, 4.5vw, 1.6rem)",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "16px",
                letterSpacing: "-0.025em",
              }}
            >
              Ready to stop leaving money on the table?
            </h2>
            <p
              style={{
                fontSize: "clamp(1rem, 3vw, 1.1rem)",
                color: "#6b7280",
                lineHeight: "1.6",
                marginBottom: "24px",
                maxWidth: "480px",
                margin: "0 auto 24px",
              }}
            >
              Join the marketplace where "fully booked" becomes your biggest
              revenue opportunity. Get early access and be among the first to
              get paid what you're truly worth.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                maxWidth: "380px",
                margin: "0 auto",
                padding: "0 16px",
              }}
            >
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(false);
                }}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  border: emailError
                    ? "2px solid #dc2626"
                    : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (!emailError) e.target.style.borderColor = "#5e8bf4";
                }}
                onBlur={(e) => {
                  if (!emailError) e.target.style.borderColor = "#e5e7eb";
                }}
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "clamp(1rem, 2.8vw, 1.1rem)",
                  fontWeight: "600",
                  background: isSubmitting
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #5e8bf4, #61baff)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  transform: isSubmitting ? "none" : "translateY(0)",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(94, 139, 244, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>

            {emailError && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "clamp(0.85rem, 2.2vw, 0.9rem)",
                  marginTop: "8px",
                }}
              >
                Please enter a valid email address
              </p>
            )}

            <p
              style={{
                fontSize: "clamp(0.8rem, 2.1vw, 0.85rem)",
                color: "#9ca3af",
                marginTop: "16px",
                lineHeight: "1.5",
                maxWidth: "400px",
                margin: "16px auto 0",
              }}
            >
              Free to start • Dynamic offers • Maximum value
              <br />
              Join the revolution of service professionals who stopped accepting
              "fully booked" as the end of the opportunity.
            </p>
          </div>
        </div>

        {/* Professional Footer */}
        <div
          style={{
            backgroundColor: "#fff",
            borderTop: "1px solid #f0f0f0",
            padding: "24px 16px",
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
              color: "#9ca3af",
            }}
          >
            © 2025 Unbooked
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterInterest;
