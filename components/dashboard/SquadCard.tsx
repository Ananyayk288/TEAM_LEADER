"use client";
import { useState, useEffect } from "react";
import { getWorkflowState, type WorkflowState } from "@/lib/services/workflowService";

export default function SquadCard() {
  const [state, setState] = useState<WorkflowState | null>(null);

  useEffect(() => {
    setState(getWorkflowState());
    const handleUpdate = () => setState(getWorkflowState());
    window.addEventListener("vv_workflow_updated", handleUpdate);
    return () => window.removeEventListener("vv_workflow_updated", handleUpdate);
  }, []);

  const members = state?.members || [];
  const teamName = state?.teamName || "SHADOW NINE";
  const college = state?.college || "VVCE Mysuru";

  return (
    <div className="vv-card vv-corners" style={{padding:"1.5rem",height:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
        <h2 style={{fontFamily:"var(--font-heading)",fontSize:"1.1rem",color:"var(--primary)",letterSpacing:"1px"}}>SQUAD ROSTER</h2>
        <span style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"#9AA8C0",border:"1px solid rgba(255,255,255,0.12)",padding:"0.25rem 0.65rem"}}>
          {members.length} REGISTERED
        </span>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"0.9rem",marginBottom:"1.2rem"}}>
        {members.map(m => (
          <div key={m.id} style={{
            display:"flex",alignItems:"center",gap:"0.9rem",
            padding:"0.75rem",background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{
              width:"38px",height:"38px",borderRadius:"50%",flexShrink:0,
              background:"rgba(0,0,0,0.5)",border:`2px solid ${m.accentColor || "var(--cyan)"}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"var(--font-heading)",fontSize:"0.85rem",color:m.accentColor || "var(--cyan)",
              boxShadow:`0 0 12px ${(m.accentColor || "var(--cyan)")}55`,
            }}>{m.initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"var(--font-body)",fontWeight:600,fontSize:"0.95rem",color:"#FFFFFF",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {m.name} {m.isLeader && <span style={{fontSize:"0.75rem",color:"var(--primary)",fontFamily:"var(--font-mono)",marginLeft:"0.3rem"}}>★ LEAD</span>}
              </div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:"0.78rem",color:"#9AA8C0"}}>{m.role} · {m.branch}</div>
            </div>
            <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#00FF88",boxShadow:"0 0 8px #00FF88",flexShrink:0}}/>
          </div>
        ))}
      </div>

      <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"0.9rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
        <div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"#9AA8C0",letterSpacing:"1px"}}>TEAM</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"0.95rem",color:"var(--primary)"}}>{teamName}</div>
        </div>
        <div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"#9AA8C0",letterSpacing:"1px"}}>INSTITUTION</div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.78rem",color:"#C5CEDF"}}>{college}</div>
        </div>
      </div>
    </div>
  );
}