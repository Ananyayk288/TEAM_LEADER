"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { usePortal } from "@/context/PortalContext";
import { Eye, EyeOff, ShieldCheck, KeyRound, Mail } from "lucide-react";
import { getWorkflowState } from "@/lib/services/workflowService";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = usePortal();

  const [email, setEmail] = useState("");
  const [teamUniqueId, setTeamUniqueId] = useState("");
  const [showId, setShowId] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const wasDenied = searchParams.get("denied") === "1";
  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanId = teamUniqueId.trim();

    // Basic format checks
    if (!cleanEmail || !cleanId) {
      setError("Invalid Email ID or Team Unique ID.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Invalid Email ID or Team Unique ID.");
      return;
    }

    if (cleanId.length < 4) {
      setError("Invalid Email ID or Team Unique ID.");
      return;
    }

    setIsLoading(true);

    // Fast login transition
    await new Promise((r) => setTimeout(r, 100));

    const wf = getWorkflowState();
    const mockTeamName = wf.teamName || "SHADOW NINE";

    // Authenticate and set session
    login({
      id: cleanId.toUpperCase(),
      email: cleanEmail,
      role: "TEAM_LEADER",
      teamName: mockTeamName,
    });

    setSuccess(true);
    await new Promise((r) => setTimeout(r, 100));
    router.replace("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0B0B0B", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* CINEMATIC BACKGROUND */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <div className={mounted ? "animate-pan-bg" : ""} style={{ position: "absolute", top: "-5%", left: "-5%", width: "110%", height: "110%" }}>
          <Image src="/login_bg.jpg" alt="ViceVerse City" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.97) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.5) 100%)" }} />
        <div className="animate-glow" style={{ position: "absolute", top: "15%", left: "10%", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(233,30,140,0.18) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "35%", width: "350px", height: "250px", background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)", pointerEvents: "none" }} />
      </div>

      {/* TOP BAR */}
      <header style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid rgba(253,191,21,0.1)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Image src="/ivc_logo.png" alt="IVC Club" width={40} height={40} style={{ objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", color: "var(--primary)", letterSpacing: "2px" }}>IVC CLUB</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>VVCE MYSURU</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "0.5rem" }}>
          <Image src="/viceverse_logo.png" alt="ViceVerse Ideathon" width={90} height={90} style={{ objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", letterSpacing: "2px" }}>PORTAL ONLINE</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", padding: "1.5rem 1rem", gap: "2rem" }}>

        {/* LEFT — Cinematic Title Panel */}
        <div className={mounted ? "animate-fade-in" : ""} style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "1rem", maxWidth: "560px", width: "100%" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--cyan)", letterSpacing: "4px", marginBottom: "1.25rem" }}>
            // AUTHORIZED TEAM LEADER ACCESS
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem,5vw,5.5rem)", lineHeight: 0.9, color: "#FFFFFF", marginBottom: "0.75rem" }} className="text-glow-yellow">
            VICEVERSE<br />
            <span style={{ color: "var(--primary)" }}>TEAM LEADER</span><br />
            PORTAL
          </h1>
          <div style={{ width: "70px", height: "3px", background: "var(--pink)", margin: "1.25rem 0", boxShadow: "0 0 10px var(--pink)" }} />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, maxWidth: "400px", marginBottom: "2rem" }}>
            Pre-registered Team Leader authentication portal. Sign in using your registered Email ID and unique Team Unique ID.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[{ label: "PORTAL STATUS", value: "AUTHORIZED ACCESS", color: "var(--cyan)" }, { label: "EVENT SECTOR", value: "VVCE-09", color: "var(--primary)" }].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "0.2rem" }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Login Panel */}
        <div style={{ width: "100%", maxWidth: "430px", flex: "1 1 320px", display: "flex", flexDirection: "column" }}>
          {wasDenied && (
            <div className={mounted ? "animate-slide-up" : ""} style={{ padding: "0.65rem 1rem", background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.4)", marginBottom: "0.75rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", letterSpacing: "2px" }}>WARNING — TEAM LEADER SESSION REQUIRED</span>
            </div>
          )}

          <div className={`vv-card vv-corners ${mounted ? "animate-slide-up" : ""}`} style={{ padding: "2rem 2rem 1.75rem", boxShadow: "0 20px 60px rgba(0,0,0,0.85), 0 0 40px rgba(233,30,140,0.06)", backdropFilter: "blur(14px)", background: "rgba(12,12,12,0.93)" }}>

            {/* Header */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--pink)", letterSpacing: "3px", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ display: "inline-block", width: "12px", height: "1px", background: "var(--pink)" }} />
                AUTHORIZED ACCESS
                <span style={{ display: "inline-block", width: "12px", height: "1px", background: "var(--pink)" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "#FFFFFF", lineHeight: 1, marginBottom: "0.35rem" }}>
                TEAM LEADER<br /><span style={{ color: "var(--primary)" }}>LOGIN</span>
              </h2>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
                ENTER REGISTERED EMAIL & TEAM UNIQUE ID
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {error && (
                <div style={{ padding: "0.7rem 0.85rem", background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.5)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--pink)", letterSpacing: "0.5px" }}>⚠ {error}</span>
                </div>
              )}
              {success && (
                <div style={{ padding: "0.7rem 0.85rem", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.5)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#00ff88", letterSpacing: "1px" }}>✓ AUTHENTICATED — REDIRECTING TO DASHBOARD...</span>
                </div>
              )}

              {/* EMAIL ID FIELD */}
              <div>
                <label htmlFor="login-email" style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--primary)", letterSpacing: "2px", marginBottom: "0.45rem", textTransform: "uppercase" }}>
                  EMAIL ID
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-email"
                    type="email"
                    className="vv-input"
                    placeholder="teamleader@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    autoComplete="email"
                    disabled={isLoading || success}
                    style={{ paddingLeft: "2.4rem" }}
                  />
                  <Mail size={15} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                </div>
              </div>

              {/* TEAM UNIQUE ID FIELD */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.45rem" }}>
                  <label htmlFor="login-team-id" style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--primary)", letterSpacing: "2px", textTransform: "uppercase" }}>
                    TEAM UNIQUE ID
                  </label>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-team-id"
                    type={showId ? "text" : "password"}
                    className="vv-input"
                    placeholder="e.g. TL-VV-2026-001 or VV-2026-X89K"
                    value={teamUniqueId}
                    onChange={(e) => { setTeamUniqueId(e.target.value); setError(null); }}
                    autoComplete="current-password"
                    disabled={isLoading || success}
                    style={{ paddingLeft: "2.4rem", paddingRight: "2.75rem" }}
                  />
                  <KeyRound size={15} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <button
                    type="button"
                    onClick={() => setShowId((p) => !p)}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", transition: "color 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--cyan)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
                  >
                    {showId ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: "0.35rem", letterSpacing: "0.5px" }}>
                  Enter the unique Team ID provided to your team.
                </div>
              </div>

              {/* Remember */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div onClick={() => setRemember((r) => !r)} style={{ width: "15px", height: "15px", border: `1px solid ${remember ? "var(--primary)" : "var(--border-yellow)"}`, background: remember ? "var(--primary)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                  {remember && <span style={{ color: "#000", fontSize: "9px", fontWeight: "bold", lineHeight: 1 }}>✓</span>}
                </div>
                <span onClick={() => setRemember((r) => !r)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>REMEMBER TEAM SESSION</span>
              </div>

              {/* Loading bar */}
              {isLoading && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--cyan)", letterSpacing: "2px" }}>AUTHENTICATING TEAM CREDENTIALS...</span>
                    <span className="animate-terminal-blink" style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--primary)" }}>■</span>
                  </div>
                  <div style={{ height: "2px", width: "100%", background: "rgba(253,191,21,0.1)", overflow: "hidden" }}>
                    <div className="animate-auth-bar" style={{ height: "100%", background: "linear-gradient(to right, var(--pink), var(--cyan))" }} />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button id="login-submit" type="submit" className="vv-button" disabled={isLoading || success} style={{ marginTop: "0.4rem" }}>
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                    <span style={{ width: "15px", height: "15px", border: "2px solid rgba(0,0,0,0.25)", borderTop: "2px solid #000", borderRadius: "50%", display: "inline-block", animation: "vv-spin 0.8s linear infinite" }} />
                    AUTHENTICATING...
                  </span>
                ) : success ? "✓ ACCESS GRANTED" : "LOGIN ▶"}
              </button>
            </form>

            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(253,191,21,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "1px" }}>// AUTHORIZED LEADER SYSTEM</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "1px" }}>VICEVERSE 2026</span>
            </div>
          </div>

          <div style={{ marginTop: "0.75rem", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", letterSpacing: "1px" }}>
            TEAM LEADER PORTAL · IVC CLUB · VVCE · MYSURU
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(253,191,21,0.08)", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "0.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", letterSpacing: "2px" }}>VICEVERSE IDEATHON · AUTHORIZED TEAM LEADER ACCESS ONLY</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 5px var(--cyan)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(0,212,255,0.45)", letterSpacing: "2px" }}>SECURE AUTH</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0B0B0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="vv-spinner" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}