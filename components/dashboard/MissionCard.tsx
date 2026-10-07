"use client";
import { MOCK_MISSION } from "@/lib/mockData";

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:    { label: "ACTIVE",    color: "#00ff88", bg: "rgba(0,255,136,0.1)"  },
  PENDING:   { label: "PENDING",   color: "var(--primary)", bg: "var(--primary-dim)" },
  COMPLETED: { label: "COMPLETED", color: "var(--cyan)",    bg: "var(--cyan-dim)"    },
  LOCKED:    { label: "LOCKED",    color: "var(--text-muted)", bg: "rgba(255,255,255,0.04)" },
};

export default function MissionCard() {
  const m = MOCK_MISSION;
  const st = STATUS_STYLE[m.status] || STATUS_STYLE.PENDING;
  return (
    <div className="vv-card vv-corners" style={{padding:"1.5rem",height:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
        <h2 style={{fontFamily:"var(--font-heading)",fontSize:"1.1rem",color:"var(--pink)",letterSpacing:"1px"}}>MISSION BRIEFING</h2>
        <span style={{
          fontFamily:"var(--font-mono)",fontSize:"0.65rem",padding:"0.2rem 0.55rem",
          color:st.color,background:st.bg,border:`1px solid ${st.color}55`,letterSpacing:"1px",flexShrink:0,
        }}>{st.label}</span>
      </div>

      <div style={{
        border:"1px solid var(--border-yellow)",padding:"0.1rem 0.6rem",marginBottom:"1rem",display:"inline-block",
        fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"var(--primary)",letterSpacing:"1px",
      }}>
        RND {String(m.roundNumber).padStart(2,"0")} · {m.category.toUpperCase()}
      </div>

      <h3 className="text-glow-pink" style={{fontFamily:"var(--font-heading)",fontSize:"1.5rem",marginBottom:"0.9rem",lineHeight:1.2}}>
        {m.missionName}
      </h3>

      <p style={{color:"var(--text-dim)",fontSize:"0.88rem",lineHeight:1.7,marginBottom:"1.2rem"}}>
        {m.description}
      </p>

      <div style={{
        borderTop:"1px solid var(--border-light)",paddingTop:"1rem",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem",
      }}>
        <div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.2rem"}}>DEADLINE</div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.8rem",color:"var(--primary)"}}>{m.deadline}</div>
        </div>
        <a href="/project" style={{
          display:"inline-flex",alignItems:"center",gap:"0.4rem",
          fontFamily:"var(--font-heading)",fontSize:"0.8rem",
          color:"var(--pink)",border:"1px solid var(--pink)",
          padding:"0.4rem 1rem",textDecoration:"none",letterSpacing:"1px",
          transition:"var(--transition)",
        }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--pink)";(e.currentTarget as HTMLElement).style.color="#000";}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="var(--pink)";}}>
          VIEW DETAILS ▶
        </a>
      </div>
    </div>
  );
}