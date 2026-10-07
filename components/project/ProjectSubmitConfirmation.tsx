"use client";
import React, { useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface ProjectSubmitConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  projectName: string;
}

export default function ProjectSubmitConfirmation({
  onConfirm,
  onCancel,
  isSubmitting,
  projectName,
}: ProjectSubmitConfirmationProps) {
  // Trap focus and handle Escape key
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isSubmitting, onCancel]);

  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "vv-fade-in 0.2s ease both",
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onCancel(); }}
    >
      {/* Modal card */}
      <div
        className="vv-card vv-corners"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "2.5rem 2rem",
          background: "#0F0F0F",
          border: "1px solid rgba(233,30,140,0.3)",
          animation: "vv-slide-up 0.3s cubic-bezier(0.16,1,0.3,1) both",
          position: "relative",
        }}
      >
        {/* Close button */}
        {!isSubmitting && (
          <button
            onClick={onCancel}
            aria-label="Close modal"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-main)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <X size={16} />
          </button>
        )}

        {/* Warning icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(233,30,140,0.08)",
            border: "1px solid rgba(233,30,140,0.25)",
            margin: "0 auto 1.5rem",
          }}
        >
          <AlertTriangle size={24} style={{ color: "var(--pink)" }} />
        </div>

        {/* Heading */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            color: "var(--text-muted)",
            letterSpacing: "3px",
            textAlign: "center",
            marginBottom: "0.4rem",
          }}
        >
          FINAL CONFIRMATION
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.3rem",
            color: "var(--pink)",
            textAlign: "center",
            marginBottom: "1rem",
            letterSpacing: "1px",
          }}
        >
          SUBMIT PROJECT?
        </h2>

        {/* Project name */}
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "rgba(253,191,21,0.05)",
            border: "1px solid rgba(253,191,21,0.15)",
            marginBottom: "1.25rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              color: "var(--text-muted)",
              letterSpacing: "1px",
              marginBottom: "0.25rem",
            }}
          >
            PROJECT
          </div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              color: "var(--primary)",
              letterSpacing: "1px",
            }}
          >
            {projectName || "UNNAMED PROJECT"}
          </div>
        </div>

        {/* Warning message */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Are you sure you want to submit your project? Once submitted,
          editing may be restricted by the Event Admin.
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
          {/* Confirm submit */}
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            id="project-submit-confirm-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              width: "100%",
              padding: "1rem",
              background: isSubmitting ? "rgba(233,30,140,0.4)" : "var(--pink)",
              color: "#fff",
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              letterSpacing: "2px",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = "#c2176e";
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = "var(--pink)";
            }}
          >
            {isSubmitting ? (
              <>
                <div className="vv-spinner" style={{ width: "16px", height: "16px", borderTopColor: "#fff" }} />
                TRANSMITTING...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                CONFIRM SUBMISSION
              </>
            )}
          </button>

          {/* Cancel */}
          {!isSubmitting && (
            <button
              ref={cancelRef}
              onClick={onCancel}
              id="project-submit-cancel-btn"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text-dim)",
                fontFamily: "var(--font-heading)",
                fontSize: "0.8rem",
                letterSpacing: "1px",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.color = "var(--text-main)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "var(--text-dim)";
              }}
            >
              CANCEL — GO BACK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
