"use client";
import React, { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export default function ProjectLockedCard() {
  const [visible, setVisible] = useState(false);

  // entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--pink)",
            letterSpacing: "2px",
            marginBottom: "0.4rem",
          }}
        >
          // PROJECT MODULE
        </div>
        <h1
          className="text-glow-pink"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            marginBottom: "0.4rem",
          }}
        >
          PROJECT BRIEF
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "#9AA8C0",
            letterSpacing: "1px",
          }}
        >
          FINAL SUBMISSION MODULE · TEAM LEADER PORTAL
        </p>
      </div>

      {/* Locked card - Centered horizontally */}
      <div
        className="vv-card vv-corners"
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "3rem 2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "#10172A",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "6px",
        }}
      >
        {/* Ambient glow – pink */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Lock icon */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "1px solid rgba(255,15,90,0.3)",
              background: "rgba(255,15,90,0.1)",
              marginBottom: "1.5rem",
              boxShadow: "0 0 24px rgba(255,15,90,0.2)",
            }}
          >
            <Lock size={36} style={{ color: "var(--pink)" }} />
          </div>

          {/* Section label */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "#9AA8C0",
              letterSpacing: "2px",
              marginBottom: "0.6rem",
            }}
          >
            PROJECT SUBMISSION
          </div>

          {/* Status badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1.2rem",
              border: "1px solid rgba(255,15,90,0.4)",
              background: "rgba(255,15,90,0.1)",
              borderRadius: "4px",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--pink)",
                boxShadow: "0 0 8px var(--pink)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.05rem",
                color: "var(--pink)",
                letterSpacing: "2px",
                fontWeight: 700,
              }}
            >
              LOCKED
            </span>
          </div>

          {/* Main message */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "#C5CEDF",
              lineHeight: 1.7,
              marginBottom: "2rem",
              maxWidth: "440px",
              margin: "0 auto 2rem",
            }}
          >
            Project submission is not open yet. The final submission window will be
            unlocked by the Event Admin during final hours.
          </p>

          {/* Divider */}
          <div
            style={{
              width: "100px",
              height: "1px",
              background: "rgba(255,255,255,0.12)",
              margin: "0 auto 1.5rem",
            }}
          />

          {/* Info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              maxWidth: "440px",
              margin: "0 auto",
            }}
          >
            {[
              { label: "WINDOW STATUS", value: "CLOSED", color: "var(--pink)" },
              { label: "CONTROLLED BY", value: "ADMIN", color: "#C5CEDF" },
              { label: "FORM ACCESS", value: "RESTRICTED", color: "#FF0F5A" },
              { label: "ANNOUNCEMENT", value: "PENDING", color: "var(--primary)" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "0.95rem 1rem",
                  background: "#0B111E",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "4px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "#9AA8C0",
                    letterSpacing: "1px",
                    marginBottom: "0.35rem",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.85rem",
                    color: item.color,
                    letterSpacing: "1px",
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom notice - High readability warning box */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem 1.25rem",
              border: "1px solid rgba(253,191,21,0.3)",
              background: "rgba(253,191,21,0.08)",
              borderRadius: "4px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "#FDE047",
              letterSpacing: "0.5px",
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            ⚡ FINAL WINDOW WILL BE ANNOUNCED BY EVENT ADMIN
            <br />
            Complete your payment and keep your Team QR ready for the event day.
          </div>
        </div>
      </div>
    </div>
  );
}
