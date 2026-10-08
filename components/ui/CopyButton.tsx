"use client";

import React, { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "./Toast";

export interface CopyButtonProps {
  value: string;
  label?: string;
  toastMessage?: string;
}

export default function CopyButton({ value, label = "COPY ID", toastMessage }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = useCallback(() => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    showToast(toastMessage || `Copied ${value} to clipboard`, "success");

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }, [value, toastMessage, showToast]);

  return (
    <button
      onClick={handleCopy}
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.75rem",
        background: copied ? "var(--pink-dim)" : "var(--bg-elevated)",
        border: `1px solid ${copied ? "var(--pink)" : "var(--border-blue)"}`,
        borderRadius: "20px",
        color: copied ? "var(--pink)" : "var(--cyan)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.68rem",
        letterSpacing: "1px",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {copied ? (
        <>
          <Check size={12} style={{ color: "var(--pink)" }} />
          <span>✓ COPIED</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
