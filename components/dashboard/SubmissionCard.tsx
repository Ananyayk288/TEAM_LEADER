"use client";
import { MOCK_SUBMISSION } from "@/lib/mockData";

const CONFIG = {
  NOT_SUBMITTED: { label:"NOT SUBMITTED", color:"var(--pink)",    bg:"var(--pink-dim)",    icon:"⊘", cta:"SUBMIT NOW" },
  SUBMITTED:     { label:"SUBMITTED",     color:"#00ff88",         bg:"rgba(0,255,136,0.1)", icon:"✓", cta:"VIEW SUBMISSION" },
  UNDER_REVIEW:  { label:"UNDER REVIEW",  color:"var(--cyan)",     bg:"var(--cyan-dim)",     icon:"⊙", cta:"VIEW SUBMISSION" },
  EVALUATED:     { label:"EVALUATED",     color:"var(--primary)",  bg:"var(--primary-dim)",  icon:"★", cta:"VIEW RESULTS" },
};

export default function SubmissionCard() {
  const s = MOCK_SUBMISSION;
  const cfg = CONFIG[s.status];
  return (
    <div className="vv-card vv-corners" style={{padding:"1.5rem",height:"100%",display:"flex",flexDirection:"column"}}>
      <h2 style={{fontFamily:"var(--font-heading)",fontSize:"1.1rem",color:"var(--primary)",letterSpacing:"1px",marginBottom:"1.2rem"}}>
        SUBMISSION STATUS
      </h2>

      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:"1rem"}}>
        <div style={{
          width:"72px",height:"72px",borderRadius:"50%",
          border:`2px solid ${cfg.color}`,background:cfg.bg,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"2rem",color:cfg.color,
          boxShadow:`0 0 24px ${cfg.color}55`,
        }}>{cfg.icon}</div>

        <div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"1.2rem",color:cfg.color,letterSpacing:"1px"}}>{cfg.label}</div>
          {s.submittedAt && (
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"var(--text-muted)",marginTop:"0.3rem"}}>{s.submittedAt}</div>
          )}
          {s.fileName && (
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"var(--cyan)",marginTop:"0.3rem"}}>📎 {s.fileName}</div>
          )}
        </div>

        <div style={{textAlign:"left",width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid var(--border-light)",padding:"0.75rem"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.25rem"}}>DEADLINE</div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.8rem",color:"var(--primary)"}}>{s.deadline}</div>
        </div>
      </div>

      <a href="/project" style={{
        display:"block",marginTop:"1.2rem",textAlign:"center",
        background: s.status === "NOT_SUBMITTED" ? "var(--primary)" : "transparent",
        border:`1px solid ${s.status === "NOT_SUBMITTED" ? "var(--primary)" : cfg.color}`,
        color: s.status === "NOT_SUBMITTED" ? "#000" : cfg.color,
        padding:"0.75rem",fontFamily:"var(--font-heading)",fontSize:"0.9rem",
        letterSpacing:"1px",textDecoration:"none",transition:"var(--transition)",
      }}>{cfg.cta} ▶</a>
    </div>
  );
}