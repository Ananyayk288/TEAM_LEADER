"use client";
import { usePortal } from "@/context/PortalContext";
import { MOCK_MISSION, MOCK_TEAM } from "@/lib/mockData";

export default function HeroSection() {
  const { authUser } = usePortal();
  const leaderName = authUser?.teamName ?? MOCK_TEAM.teamName;
  const firstName = authUser?.email?.split("@")[0] ?? "Commander";

  return (
    <div className="hero-section vv-card vv-corners" style={{
      padding: "2.5rem 2rem",
      background: "linear-gradient(135deg, rgba(253,191,21,0.06) 0%, rgba(0,0,0,0) 50%, rgba(233,30,140,0.06) 100%)",
      borderColor: "var(--border-yellow)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Scanline overlay */}
      <div style={{
        position:"absolute",inset:0,
        background:"repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)",
        pointerEvents:"none",zIndex:0,
      }}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.6rem"}}>
          <span style={{
            background:"var(--pink)",color:"#000",
            fontFamily:"var(--font-heading)",fontSize:"0.7rem",
            padding:"0.2rem 0.6rem",letterSpacing:"1px",
          }}>ROUND {MOCK_MISSION.roundNumber}</span>
          <span style={{
            border:"1px solid var(--cyan)",color:"var(--cyan)",
            fontFamily:"var(--font-mono)",fontSize:"0.7rem",
            padding:"0.2rem 0.6rem",letterSpacing:"1px",
          }}>MISSION ACTIVE</span>
        </div>
        <h1 className="text-glow-yellow" style={{
          fontFamily:"var(--font-heading)",
          fontSize:"clamp(2rem,5vw,3.2rem)",
          lineHeight:1.1,marginBottom:"0.5rem",
        }}>
          SQUAD {leaderName}
        </h1>
        <p style={{color:"var(--text-dim)",fontSize:"1rem",marginBottom:"1.4rem",maxWidth:"600px"}}>
          Welcome back, <span style={{color:"var(--primary)",fontFamily:"var(--font-mono)"}}>{firstName.toUpperCase()}</span>. Your mission briefing is live. The clock is ticking — execute with precision.
        </p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"1.5rem"}}>
          {[
            {label:"TEAM ID",    value: MOCK_TEAM.teamId,       color:"var(--primary)"},
            {label:"CATEGORY",   value: MOCK_TEAM.category,     color:"var(--cyan)"},
            {label:"MISSION",    value: MOCK_MISSION.missionName,color:"var(--pink)"},
            {label:"DEADLINE",   value: "OCT 18, 2026",         color:"var(--text-dim)"},
          ].map(item => (
            <div key={item.label}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"1px"}}>{item.label}</div>
              <div style={{fontFamily:"var(--font-heading)",fontSize:"0.95rem",color:item.color}}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}