"use client";

import React, { useState, useCallback } from "react";
import { Check, AlertCircle } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  successText?: string;
  errorText?: string;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({
  children,
  isLoading = false,
  isSuccess = false,
  isError = false,
  successText = "Done ✓",
  loadingText,
  disabled,
  onClick,
  style,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled || isSuccess) return;
      if (onClick) onClick(e);
    },
    [isLoading, disabled, isSuccess, onClick]
  );

  let bgStyle: React.CSSProperties = {};
  if (variant === "primary") {
    bgStyle = { background: "var(--primary)", color: "#fff" };
  } else if (variant === "secondary") {
    bgStyle = { background: "var(--bg-elevated)", border: "1px solid var(--border-blue)", color: "var(--cyan)" };
  } else if (variant === "danger") {
    bgStyle = { background: "var(--pink)", color: "#fff" };
  } else if (variant === "ghost") {
    bgStyle = { background: "transparent", border: "1px solid var(--border-light)", color: "var(--text-main)" };
  }

  if (isSuccess) {
    bgStyle = { background: "#00ff88", color: "#000", border: "none" };
  } else if (isError) {
    bgStyle = { background: "var(--pink)", color: "#fff", border: "none" };
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled || isLoading}
      className={`vv-button ${isPressed ? "vv-button-pressed" : ""} ${isSuccess ? "vv-button-success" : ""} ${isError ? "vv-button-error" : ""} ${className}`}
      style={{
        ...bgStyle,
        position: "relative",
        transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
        opacity: disabled && !isLoading ? 0.55 : 1,
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {isLoading ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: "14px",
              height: "14px",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid #fff",
              borderRadius: "50%",
              animation: "vv-spin 0.7s linear infinite",
              display: "inline-block",
            }}
          />
          {loadingText || "Processing..."}
        </span>
      ) : isSuccess ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <Check size={16} /> {successText}
        </span>
      ) : isError ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <AlertCircle size={16} /> Failed
        </span>
      ) : (
        children
      )}
    </button>
  );
}
