"use client";
import { MOCK_TEAM } from "@/lib/mockData";

export default function SquadCard() {
  const { members, teamName, teamId, college, memberCount, maxMembers } = MOCK_TEAM;
  return (
    <div className="vv-card vv-corners" style={{padding:"1.5rem",height:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
        <h2 style={{fontFamily:"var(--font-heading)",fontSize:"1.1rem",color:"var(--primary)",letterSpacing:"1px"}}>SQUAD ROSTER</h2>
        <span style={{fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"var(--text-muted)",border:"1px solid var(--border-light)",padding:"0.2rem 0.5rem"}}>
          {memberCount}/{maxMembers} AGENTS
        </span>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"0.9rem",marginBottom:"1.2rem"}}>
        {members.map(m => (
          <div key={m.id} style={{
            display:"flex",alignItems:"center",gap:"0.9rem",
            padding:"0.75rem",background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              width:"38px",height:"38px",borderRadius:"50%",flexShrink:0,
              background:"rgba(0,0,0,0.5)",border:`2px solid ${m.accentColor}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"var(--font-heading)",fontSize:"0.8rem",color:m.accentColor,
              boxShadow:`0 0 12px ${m.accentColor}55`,
            }}>{m.initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"var(--font-body)",fontWeight:600,fontSize:"0.9rem",color:"var(--text-main)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {m.name} {m.isLeader && <span style={{fontSize:"0.65rem",color:"var(--primary)",fontFamily:"var(--font-mono)",marginLeft:"0.3rem"}}>★ LEAD</span>}
              </div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"var(--text-muted)"}}>{m.role} · {m.branch}</div>
            </div>
            <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 8px #00ff88",flexShrink:0}}/>
          </div>
        ))}
      </div>

      <div style={{borderTop:"1px solid var(--border-light)",paddingTop:"0.9rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
        <div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",letterSpacing:"1px"}}>TEAM</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"0.85rem",color:"var(--primary)"}}>{teamName}</div>
        </div>
        <div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",letterSpacing:"1px"}}>COLLEGE</div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"var(--text-dim)"}}>{college}</div>
        </div>
      </div>
    </div>
  );
}