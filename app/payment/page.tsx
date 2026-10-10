"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/confirmed");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <div className="vv-spinner" style={{ margin: "0 auto 1rem", borderTopColor: "var(--primary)" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
          REDIRECTING TO TEAM, EVENT STATUS &amp; QR...
        </p>
      </div>
    </div>
  );
}