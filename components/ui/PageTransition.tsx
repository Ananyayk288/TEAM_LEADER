"use client";

import React from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="animate-slide-up"
      style={{
        width: "100%",
        animationDuration: "250ms",
        animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
