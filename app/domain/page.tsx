"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DomainPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-deep)" }}>
      <div style={{ textAlign: "center" }}>
        <div className="vv-spinner" style={{ margin: "0 auto 1rem" }} />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "2px" }}>
          REDIRECTING TO DASHBOARD...
        </div>
      </div>
    </div>
  );
}