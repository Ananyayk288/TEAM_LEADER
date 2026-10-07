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
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            letterSpacing: "2px",
            marginBottom: "0.4rem",
          }}
        >
          // PROJECT
        </div>
        <h1
          className="text-glow-pink"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            marginBottom: "0.4rem",
          }}
        >
          PROJECT BRIEF
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            letterSpacing: "1px",
          }}
        >
          FINAL SUBMISSION MODULE · TEAM LEADER PORTAL
        </p>
      </div>

      {/* Locked card */}
      <div
        className="vv-card vv-corners"
        style={{
          maxWidth: "640px",
          padding: "3rem 2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #141414 0%, #0f0f0f 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Scanlines overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)",
            pointerEvents: "none",
          }}
        />

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
            background: "radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)",
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
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(233,30,140,0.07)",
              marginBottom: "1.75rem",
              boxShadow: "0 0 30px rgba(233,30,140,0.12)",
            }}
          >
            <Lock size={30} style={{ color: "var(--pink)", opacity: 0.85 }} />
          </div>

          {/* Section label */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "var(--text-muted)",
              letterSpacing: "3px",
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
              padding: "0.35rem 1rem",
              border: "1px solid rgba(233,30,140,0.3)",
              background: "rgba(233,30,140,0.06)",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--pink)",
                opacity: 0.7,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1rem",
                color: "var(--pink)",
                letterSpacing: "3px",
              }}
            >
              LOCKED
            </span>
          </div>

          {/* Main message */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              marginBottom: "2rem",
              maxWidth: "380px",
              margin: "0 auto 2rem",
            }}
          >
            Project submission is not open yet. The final window will be
            announced by the Event Admin.
          </p>

          {/* Divider */}
          <div
            style={{
              width: "80px",
              height: "1px",
              background: "rgba(255,255,255,0.07)",
              margin: "0 auto 1.5rem",
            }}
          />

          {/* Info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              maxWidth: "360px",
              margin: "0 auto",
            }}
          >
            {[
              { label: "WINDOW STATUS", value: "CLOSED", color: "var(--pink)" },
              { label: "CONTROLLED BY", value: "ADMIN", color: "var(--text-dim)" },
              { label: "FORM ACCESS", value: "RESTRICTED", color: "rgba(255,255,255,0.3)" },
              { label: "ANNOUNCEMENT", value: "PENDING", color: "var(--primary)" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "0.85rem",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5rem",
                    color: "var(--text-muted)",
                    letterSpacing: "1.5px",
                    marginBottom: "0.3rem",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.75rem",
                    color: item.color,
                    letterSpacing: "1px",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom notice */}
          <div
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1rem",
              border: "1px solid rgba(253,191,21,0.15)",
              background: "rgba(253,191,21,0.04)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "rgba(253,191,21,0.6)",
              letterSpacing: "1px",
              lineHeight: 1.6,
            }}
          >
            ⚡ FINAL WINDOW WILL BE ANNOUNCED BY EVENT ADMIN
            <br />
            Complete your team setup and domain selection in the meantime.
          </div>
        </div>
      </div>
    </div>
  );
}
