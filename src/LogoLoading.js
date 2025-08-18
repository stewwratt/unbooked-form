import React, { useState, useEffect } from "react";

const sizeClasses = {
  small: { width: "32px", height: "32px" },
  medium: { width: "48px", height: "48px" },
  large: { width: "64px", height: "64px" },
};

const fallbackSizeClasses = {
  small: { width: "16px", height: "16px" },
  medium: { width: "24px", height: "24px" },
  large: { width: "32px", height: "32px" },
};

export function LogoLoading({
  size = "medium",
  animation = "pulse",
  message,
  fullPage = false,
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  // Monitor image loading status
  useEffect(() => {
    console.log("🌟 Logo loading component mounted");
  }, []);

  const logoStyle = {
    ...sizeClasses[size],
    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
    animation:
      animation === "pulse"
        ? "logo-pulse 2s ease-in-out infinite"
        : "logo-breathe 3s ease-in-out infinite",
  };

  const fallbackStyle = {
    ...fallbackSizeClasses[size],
    background: "linear-gradient(135deg, #5e8bf4 0%, #61baff 100%)",
    borderRadius: "50%",
    animation:
      animation === "pulse"
        ? "logo-pulse 2s ease-in-out infinite"
        : "logo-breathe 3s ease-in-out infinite",
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!imageError ? (
        <img
          src="/black-small.png"
          alt="Loading..."
          style={logoStyle}
          className={className}
          onError={(e) => {
            console.log("🚫 Logo image failed to load, trying fallback");
            // Try fallback image first
            if (e.target.src.includes("black-small.png")) {
              e.target.src = "/full-black-transparent-bg.png";
            } else {
              console.log("🚫 Fallback image also failed, using dot");
              setImageError(true);
            }
          }}
        />
      ) : (
        // Fallback: Blue breathing/pulsing dot (smaller than logo)
        <div style={fallbackStyle} className={className} />
      )}
      {message && (
        <p
          style={{
            marginTop: "16px",
            color: "#666",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 0",
      }}
    >
      {content}
    </div>
  );
}

// Specific preset components for common use cases
export function FullPageLogoLoader() {
  return <LogoLoading size="large" fullPage />;
}

export function CenteredLogoLoader({ size = "medium" }) {
  return <LogoLoading size={size} />;
}

export function InlineLogoLoader({ size = "small" }) {
  return <LogoLoading size={size} className="inline-block" />;
}

// For backwards compatibility with loading buttons
export function LoadingButton({
  children,
  loading = false,
  className = "",
  disabled = false,
  style = {},
  ...props
}) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <InlineLogoLoader size="small" />}
      <span style={{ marginLeft: loading ? "8px" : "0" }}>{children}</span>
    </button>
  );
}
