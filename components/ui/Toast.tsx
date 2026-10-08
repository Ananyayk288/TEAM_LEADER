"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          maxWidth: "380px",
          width: "calc(100% - 3rem)",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.85rem 1.1rem",
              background: "var(--bg-card)",
              border: `1px solid ${
                toast.type === "success"
                  ? "#00ff88"
                  : toast.type === "error"
                  ? "var(--pink)"
                  : "var(--cyan)"
              }`,
              borderRadius: "6px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
              animation: "toast-slide-in 0.25s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            {toast.type === "success" && <CheckCircle2 size={18} style={{ color: "#00ff88", flexShrink: 0 }} />}
            {toast.type === "error" && <AlertCircle size={18} style={{ color: "var(--pink)", flexShrink: 0 }} />}
            {toast.type === "info" && <Info size={18} style={{ color: "var(--cyan)", flexShrink: 0 }} />}

            <span
              style={{
                flex: 1,
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                color: "var(--text-main)",
                lineHeight: 1.4,
              }}
            >
              {toast.message}
            </span>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0.2rem",
                display: "flex",
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: () => {} };
  }
  return ctx;
}
