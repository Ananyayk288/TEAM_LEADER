"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  sublabel?: string;
  error?: string;
  isSuccess?: boolean;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  sublabel,
  error,
  isSuccess = false,
  value,
  onChange,
  onBlur,
  icon,
  style,
  id,
  className = "",
  type = "text",
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const isFilled = value !== undefined && value !== null && String(value).length > 0;
  const hasError = !!error && touched;

  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: hasError ? "var(--pink)" : focused ? "var(--cyan)" : "var(--primary)",
            letterSpacing: "1.5px",
            marginBottom: "0.4rem",
            textTransform: "uppercase",
            transition: "color 0.2s ease",
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: "relative", width: "100%" }}>
        {icon && (
          <div
            style={{
              position: "absolute",
              left: "0.85rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? "var(--cyan)" : "var(--text-muted)",
              transition: "color 0.2s ease",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {icon}
          </div>
        )}

        <input
          {...props}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setTouched(true);
            if (onBlur) onBlur(e);
          }}
          aria-invalid={hasError}
          aria-describedby={hasError && id ? `${id}-error` : undefined}
          className={`vv-input ${hasError ? "vv-input-error" : isSuccess ? "vv-input-success" : ""} ${className}`}
          style={{
            paddingLeft: icon ? "2.5rem" : "1rem",
            paddingRight: isSuccess ? "2.5rem" : "1rem",
            color: isFilled ? "var(--text-main)" : "var(--text-dim)",
            ...style,
          }}
        />

        {isSuccess && (
          <CheckCircle2
            size={16}
            style={{
              position: "absolute",
              right: "0.85rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#00ff88",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {sublabel && !hasError && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
          {sublabel}
        </div>
      )}

      {hasError && (
        <div
          id={id ? `${id}-error` : undefined}
          role="alert"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            color: "var(--pink)",
            marginTop: "0.35rem",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            animation: "vv-slide-up 0.2s ease both",
          }}
        >
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
