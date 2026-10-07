"use client";
import React from "react";
import { CheckCircle, Clock, FileEdit } from "lucide-react";
import type { ProjectStatus } from "@/lib/services/projectService";

interface ProjectStatusBannerProps {
  status: ProjectStatus;
  submittedAt?: string;
  submissionRef?: string;
}

const CONFIG: Record<
  ProjectStatus,
  { label: string; sublabel: string; color: string; borderColor: string; bgColor: string; icon: React.ReactNode; dotColor: string }
> = {
  LOCKED: {
    label: "SUBMISSION LOCKED",
    sublabel: "Final window not yet open",
    color: "var(--pink)",
    borderColor: "rgba(233,30,140,0.3)",
    bgColor: "rgba(233,30,140,0.05)",
    dotColor: "var(--pink)",
    icon: <Clock size={14} />,
  },
  OPEN: {
    label: "WINDOW OPEN",
    sublabel: "Project submission is now available",
    color: "var(--cyan)",
    borderColor: "rgba(0,212,255,0.3)",
    bgColor: "rgba(0,212,255,0.05)",
    dotColor: "var(--cyan)",
    icon: <FileEdit size={14} />,
  },
  DRAFT: {
    label: "DRAFT SAVED",
    sublabel: "Project saved — not yet submitted",
    color: "var(--primary)",
    borderColor: "rgba(253,191,21,0.3)",
    bgColor: "rgba(253,191,21,0.05)",
    dotColor: "var(--primary)",
    icon: <FileEdit size={14} />,
  },
  SUBMITTED: {
    label: "PROJECT SUBMITTED",
    sublabel: "Final submission received",
    color: "#00ff88",
    borderColor: "rgba(0,255,136,0.3)",
    bgColor: "rgba(0,255,136,0.05)",
    dotColor: "#00ff88",
    icon: <CheckCircle size={14} />,
  },
};

export default function ProjectStatusBanner({
  status,
  submittedAt,
  submissionRef,
}: ProjectStatusBannerProps) {
  const cfg = CONFIG[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.5rem",
        padding: "1rem 1.25rem",
        border: `1px solid ${cfg.borderColor}`,
        background: cfg.bgColor,
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Status dot + label */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", position: "relative" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: cfg.dotColor,
            boxShadow: `0 0 8px ${cfg.dotColor}`,
            flexShrink: 0,
          }}
        />
        <div style={{ color: cfg.color }}>{cfg.icon}</div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.85rem",
              color: cfg.color,
              letterSpacing: "1px",
            }}
          >
            {cfg.label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              color: "var(--text-muted)",
              letterSpacing: "1px",
            }}
          >
            {cfg.sublabel}
          </div>
        </div>
      </div>

      {/* Meta info */}
      {(submittedAt || submissionRef) && (
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            marginLeft: "auto",
            position: "relative",
          }}
        >
          {submissionRef && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5rem",
                  color: "var(--text-muted)",
                  letterSpacing: "1px",
                }}
              >
                SUBMISSION REF
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: cfg.color,
                  letterSpacing: "1px",
                }}
              >
                {submissionRef}
              </div>
            </div>
          )}
          {submittedAt && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5rem",
                  color: "var(--text-muted)",
                  letterSpacing: "1px",
                }}
              >
                SUBMITTED AT
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                }}
              >
                {submittedAt}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
