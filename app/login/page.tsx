"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { usePortal } from "@/context/PortalContext";
import { Eye, EyeOff, KeyRound, Mail, HelpCircle } from "lucide-react";
import { getWorkflowState } from "@/lib/services/workflowService";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser } = usePortal();
  const { showToast } = useToast();

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

    if (!cleanEmail || !cleanId) {
      const msg = "Invalid email or ID.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, teamUniqueId: cleanId }),
        credentials: "same-origin",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || "Invalid email or ID.";
        setError(errorMsg);
        showToast(errorMsg, "error");
        setIsLoading(false);
        return;
      }

      loginUser({
        id: data.user.teamId,
        email: data.user.email,
        role: data.user.role,
        teamName: data.user.teamName,
      });

      setSuccess(true);
      showToast("✓ Authenticated — Redirecting to Dashboard...", "success");
      await new Promise((r) => setTimeout(r, 150));
      router.replace("/dashboard");
    } catch {
      const genericMsg = "Invalid email or ID.";
      setError(genericMsg);
      showToast(genericMsg, "error");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", width: "100%", background: "var(--bg-deep)", display: "flex", flexDirection: "column", position: "relative", overflowX: "hidden" }}>
      {/* CINEMATIC BACKGROUND WITH DIM & BLUR */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <div 
          className={mounted ? "animate-pan-bg" : ""} 
          style={{ 
            position: "absolute", 
            top: "-5%", 
            left: "-5%", 
            width: "110%", 
            height: "110%",
            filter: "brightness(0.55) blur(3px)" 
          }}
        >
          <Image src="/login_bg.jpg" alt="ViceVerse City" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        </div>
        {/* DARK GRADIENT OVERLAY */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,11,20,0.85) 0%, rgba(7,11,20,0.75) 50%, rgba(7,11,20,0.92) 100%)" }} />
        {/* SOFT AMBIENT GLOW ORBS */}
        <div className="animate-glow" style={{ position: "absolute", top: "20%", left: "20%", width: "min(400px, 80vw)", height: "min(400px, 80vw)", background: "radial-gradient(circle, rgba(230,16,80,0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "min(400px, 80vw)", height: "min(300px, 60vw)", background: "radial-gradient(circle, rgba(56,225,232,0.12) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
      </div>

      {/* TOP BAR WITH ENLARGED LOGOS IN OPPOSITE CORNERS */}
      <header style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.85rem, 3vw, 2rem)", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(7,11,20,0.8)", backdropFilter: "blur(12px)", flexShrink: 0, width: "100%" }}>
        
        {/* TOP LEFT: IVC LOGO & BADGE */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Image src="/ivc_logo.png" alt="IVC Club" width={48} height={48} priority style={{ objectFit: "contain", height: "clamp(38px, 6vw, 54px)", width: "auto" }} />
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(0.75rem, 2vw, 0.9rem)", fontWeight: 700, color: "var(--primary)", letterSpacing: "1.5px" }}>IVC CLUB</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(0.6rem, 1.5vw, 0.7rem)", color: "#8FA0BA", letterSpacing: "1px" }}>VVCE MYSURU</div>
          </div>
        </div>

        {/* TOP RIGHT: VICEVERSE LOGO */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image 
            src="/viceverse_logo.png" 
            alt="ViceVerse Ideathon" 
            width={140} 
            height={58} 
            priority
            style={{ 
              objectFit: "contain",
              height: "clamp(42px, 8vw, 62px)",
              width: "auto",
              filter: "drop-shadow(0 0 16px rgba(230,16,80,0.5)) drop-shadow(0 0 30px rgba(230,16,80,0.25))"
            }} 
          />
        </div>
      </header>

      {/* MAIN CONTENT AREA — RESPONSIVE CENTERED COLUMN */}
      <main style={{ flex: 1, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem clamp(0.75rem, 3vw, 1.5rem)", width: "100%", gap: "0.85rem", overflowY: "auto" }}>

        {/* CENTERED LOGIN CARD */}
        <div style={{ width: "100%", maxWidth: "460px", display: "flex", flexDirection: "column" }}>
          {wasDenied && (
            <div className={mounted ? "animate-slide-up" : ""} style={{ padding: "0.6rem 1rem", background: "rgba(230,16,80,0.12)", border: "1px solid var(--primary)", marginBottom: "0.75rem", borderRadius: "6px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "var(--pink)", letterSpacing: "1.5px" }}>WARNING — TEAM LEADER SESSION REQUIRED</span>
            </div>
          )}

          <div 
            className={`vv-card vv-corners ${mounted ? "animate-slide-up" : ""}`} 
            style={{ 
              padding: "clamp(1.2rem, 4vw, 1.6rem) clamp(1.1rem, 4vw, 1.85rem)", 
              boxShadow: "0 20px 50px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 35px rgba(230,16,80,0.12)", 
              backdropFilter: "blur(16px)", 
              background: "rgba(12, 18, 32, 0.85)", 
              border: "1px solid rgba(255,255,255,0.1)",
              width: "100%" 
            }}
          >

            {/* Card Header */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, color: "#FF0F5A", letterSpacing: "3px", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ display: "inline-block", width: "14px", height: "1px", background: "#FF0F5A" }} />
                AUTHORIZED ACCESS
                <span style={{ display: "inline-block", width: "14px", height: "1px", background: "#FF0F5A" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.35rem, 4vw, 1.7rem)", color: "#FFFFFF", lineHeight: 1.1, marginBottom: "0.3rem" }}>
                TEAM LEADER <span style={{ color: "var(--primary)" }}>LOGIN</span>
              </h2>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#8FA0BA", letterSpacing: "1px" }}>
                ENTER REGISTERED EMAIL & TEAM UNIQUE ID
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* CLEAR RED ERROR BOX */}
              {error && (
                <div style={{ padding: "0.6rem 0.85rem", background: "rgba(230,16,80,0.12)", border: "1px solid rgba(230,16,80,0.6)", borderRadius: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#FF4D4D", letterSpacing: "0.5px" }}>⚠ {error}</span>
                </div>
              )}
              {/* SUCCESS NOTIFICATION */}
              {success && (
                <div style={{ padding: "0.6rem 0.85rem", background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.6)", borderRadius: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "#00FF88", letterSpacing: "1px" }}>✓ AUTHENTICATED — REDIRECTING...</span>
                </div>
              )}

              {/* EMAIL ID FIELD */}
              <div>
                <label htmlFor="login-email" style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "2px", marginBottom: "0.35rem", textTransform: "uppercase" }}>
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
                    style={{ 
                      height: "46px", 
                      background: "#0E1626", 
                      border: "1px solid rgba(255,255,255,0.14)", 
                      color: "#FFFFFF", 
                      paddingLeft: "2.5rem",
                      borderRadius: "4px",
                      fontSize: "0.9rem" 
                    }}
                  />
                  <Mail size={15} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#8FA0BA" }} />
                </div>
              </div>

              {/* TEAM UNIQUE ID FIELD */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.35rem" }}>
                  <label htmlFor="login-team-id" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "2px", textTransform: "uppercase" }}>
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
                    style={{ 
                      height: "46px", 
                      background: "#0E1626", 
                      border: "1px solid rgba(255,255,255,0.14)", 
                      color: "#FFFFFF", 
                      paddingLeft: "2.5rem", 
                      paddingRight: "2.6rem",
                      borderRadius: "4px",
                      fontSize: "0.9rem" 
                    }}
                  />
                  <KeyRound size={15} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#8FA0BA" }} />
                  <button
                    type="button"
                    onClick={() => setShowId((p) => !p)}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8FA0BA", display: "flex", transition: "color 0.2s", minHeight: "36px", alignItems: "center" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--cyan)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#8FA0BA"; }}
                  >
                    {showId ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* HELPER TEXT */}
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#8FA0BA", marginTop: "0.3rem", letterSpacing: "0.5px" }}>
                  Enter the unique Team ID provided to your team.
                </div>
              </div>

              {/* REMEMBER SESSION CHECKBOX */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minHeight: "36px" }}>
                <div 
                  onClick={() => setRemember((r) => !r)} 
                  style={{ 
                    width: "18px", 
                    height: "18px", 
                    border: `1px solid ${remember ? "var(--primary)" : "rgba(255,255,255,0.25)"}`, 
                    background: remember ? "var(--primary)" : "#0E1626", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    transition: "all 0.2s", 
                    borderRadius: "3px",
                    flexShrink: 0 
                  }}
                >
                  {remember && <span style={{ color: "#000", fontSize: "10px", fontWeight: "bold", lineHeight: 1 }}>✓</span>}
                </div>
                <span onClick={() => setRemember((r) => !r)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#B8C2D6", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}>
                  REMEMBER TEAM SESSION
                </span>
              </div>

              {/* LOADING BAR */}
              {isLoading && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--cyan)", letterSpacing: "1.5px" }}>AUTHENTICATING TEAM CREDENTIALS...</span>
                    <span className="animate-terminal-blink" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--primary)" }}>■</span>
                  </div>
                  <div style={{ height: "3px", width: "100%", background: "rgba(230,16,80,0.15)", overflow: "hidden", borderRadius: "2px" }}>
                    <div className="animate-auth-bar" style={{ height: "100%", background: "linear-gradient(to right, var(--pink), var(--cyan))" }} />
                  </div>
                </div>
              )}

              {/* LOGIN SUBMIT BUTTON */}
              <button 
                id="login-submit" 
                type="submit" 
                className="vv-button" 
                disabled={isLoading || success} 
                style={{ 
                  height: "48px", 
                  background: success ? "#00FF88" : "linear-gradient(135deg, #E61050 0%, #C00A3C 100%)",
                  color: success ? "#000000" : "#FFFFFF",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  borderRadius: "4px",
                  marginTop: "0.2rem"
                }}
              >
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #FFFFFF", borderRadius: "50%", display: "inline-block", animation: "vv-spin 0.8s linear infinite" }} />
                    AUTHENTICATING...
                  </span>
                ) : success ? "✓ ACCESS GRANTED" : "LOGIN ▶"}
              </button>
            </form>
          </div>
        </div>

        {/* COMPACT INSTRUCTIONS BLOCK DIRECTLY BELOW CARD */}
        <div 
          className={mounted ? "animate-fade-in" : ""} 
          style={{ 
            width: "100%", 
            maxWidth: "460px", 
            padding: "0.85rem 1.15rem", 
            background: "rgba(12, 18, 32, 0.75)", 
            backdropFilter: "blur(12px)", 
            border: "1px solid rgba(255, 255, 255, 0.08)", 
            borderRadius: "6px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: "var(--cyan)", letterSpacing: "2px", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <HelpCircle size={14} style={{ color: "var(--cyan)" }} />
            HOW TO LOGIN
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#B8C2D6", lineHeight: 1.4 }}>
            <div><strong style={{ color: "var(--cyan)" }}>1.</strong> Enter your registered <span style={{ color: "#FFFFFF", fontWeight: 600 }}>Email ID</span>.</div>
            <div><strong style={{ color: "var(--pink)" }}>2.</strong> Enter the unique Team ID provided to your team in the <span style={{ color: "#FFFFFF", fontWeight: 600 }}>"Team Unique ID"</span> field.</div>
            <div><strong style={{ color: "var(--primary)" }}>3.</strong> Click <span style={{ color: "var(--primary)", fontWeight: 700 }}>LOGIN ▶</span> to open your Team Leader portal.</div>
          </div>

          <div style={{ marginTop: "0.45rem", paddingTop: "0.45rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#8FA0BA", lineHeight: 1.35 }}>
            Note: Only pre-registered Team Leaders can sign in. Facing issues? Contact IVC Club organizers.
          </div>
        </div>

      </main>

      {/* BOTTOM BAR FOOTER WITH PORTAL ONLINE STATUS */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(7,11,20,0.85)", backdropFilter: "blur(12px)", padding: "0.6rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", flexShrink: 0, width: "100%" }}>
        
        {/* PORTAL ONLINE STATUS */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, color: "var(--cyan)", letterSpacing: "1.5px" }}>PORTAL ONLINE</span>
        </div>

        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#8FA0BA", letterSpacing: "1px" }}>
          VICEVERSE IDEATHON · AUTHORIZED TEAM LEADER ACCESS ONLY
        </span>

        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#8FA0BA", letterSpacing: "1px" }}>
          IVC CLUB · VVCE MYSURU
        </span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#070B14", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="vv-spinner" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}