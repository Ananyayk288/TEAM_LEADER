"use client";

import React from "react";

export function SkeletonText({ width = "100%", height = "1rem", style }: { width?: string; height?: string; style?: React.CSSProperties }) {
  return (
    <div
      className="vv-skeleton"
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
}

export function SkeletonAvatar({ size = "42px", style }: { size?: string; style?: React.CSSProperties }) {
  return (
    <div
      className="vv-skeleton"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export function SkeletonCard({ height = "160px", style }: { height?: string; style?: React.CSSProperties }) {
  return (
    <div
      className="vv-card vv-corners"
      style={{
        padding: "1.5rem",
        height,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        ...style,
      }}
    >
      <SkeletonText width="40%" height="0.8rem" />
      <SkeletonText width="80%" height="1.4rem" />
      <SkeletonText width="60%" height="0.9rem" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="vv-card"
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <SkeletonAvatar size="40px" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <SkeletonText width="50%" height="1rem" />
            <SkeletonText width="30%" height="0.75rem" />
          </div>
        </div>
      ))}
    </div>
  );
}
