"use client";
import { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import { getWorkflowState, type WorkflowState } from "@/lib/services/workflowService";
import CopyButton from "@/components/ui/CopyButton";

export default function HeroSection() {
  const { authUser } = usePortal();
  const [state, setState] = useState<WorkflowState | null>(null);

  useEffect(() => {
    setState(getWorkflowState());
    const handleUpdate = () => setState(getWorkflowState());
    window.addEventListener("vv_workflow_updated", handleUpdate);
    return () => window.removeEventListener("vv_workflow_updated", handleUpdate);
  }, []);

  const teamName = state?.teamName || authUser?.teamName || "SHADOW NINE";
  const teamId = state?.teamId || authUser?.id || "VV-2026-X89K";
  const domainName = state?.selectedDomainName || "CYBER SECURITY";
  const leaderName = state?.leaderName || authUser?.email?.split("@")[0]?.toUpperCase() || "TEAM LEADER";

  return (
    <div className="hero-section vv-card vv-corners" style={{
      padding: "2.25rem 2rem",
      background: "linear-gradient(135deg, rgba(230,16,80,0.08) 0%, rgba(7,11,20,0.95) 50%, rgba(56,225,232,0.08) 100%)",
      border: "1px solid rgba(255,255,255,0.1)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:"repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)",
        pointerEvents:"none",zIndex:0,
      }}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem",flexWrap:"wrap"}}>
          <span style={{
            background:"var(--primary)",color:"#FFFFFF",
            fontFamily:"var(--font-heading)",fontSize:"0.75rem",fontWeight:700,
            padding:"0.25rem 0.75rem",letterSpacing:"1px",borderRadius:"3px"
          }}>PRE-REGISTERED TEAM</span>
          <span style={{
            border:"1px solid var(--cyan)",color:"var(--cyan)",
            fontFamily:"var(--font-mono)",fontSize:"0.75rem",fontWeight:600,
            padding:"0.25rem 0.75rem",letterSpacing:"1px",borderRadius:"3px"
          }}>PORTAL ACTIVE</span>
        </div>
        
        <h1 className="text-glow-yellow" style={{
          fontFamily:"var(--font-heading)",
          fontWeight:800,
          fontSize:"clamp(2rem,4.5vw,3rem)",
          lineHeight:1.1,marginBottom:"0.5rem",color:"#FFFFFF"
        }}>
          SQUAD {teamName}
        </h1>

        <p style={{color:"#C5CEDF",fontSize:"0.95rem",marginBottom:"1.5rem",maxWidth:"650px",lineHeight:1.65}}>
          Welcome back, <span style={{color:"var(--primary)",fontFamily:"var(--font-mono)",fontWeight:700}}>{leaderName}</span>. Your team roster, selected domain, and portal tools are synchronized and ready.
        </p>

        <div style={{display:"flex",flexWrap:"wrap",gap:"1.75rem",paddingTop:"0.5rem",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"#9AA8C0",letterSpacing:"1px",marginBottom:"0.25rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
              TEAM ID <CopyButton value={teamId} label="COPY" toastMessage={`Copied Team ID: ${teamId}`} />
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"1rem",fontWeight:700,color:"var(--cyan)"}}>{teamId}</div>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"#9AA8C0",letterSpacing:"1px",marginBottom:"0.25rem"}}>SELECTED DOMAIN</div>
            <div style={{fontFamily:"var(--font-heading)",fontSize: "1rem",fontWeight:700,color:"#FF0F5A"}}>{domainName}</div>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"#9AA8C0",letterSpacing:"1px",marginBottom:"0.25rem"}}>INSTITUTION</div>
            <div style={{fontFamily:"var(--font-body)",fontSize:"0.95rem",fontWeight:600,color:"#C5CEDF"}}>{state?.college || "VVCE Mysuru"}</div>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"#9AA8C0",letterSpacing:"1px",marginBottom:"0.25rem"}}>STATUS</div>
            <div style={{
              fontFamily:"var(--font-heading)",fontSize:"0.95rem",fontWeight:700,
              color: state?.paymentStatus === "APPROVED"
                ? "#00FF88"
                : state?.paymentStatus === "PENDING"
                ? "var(--primary)"
                : "var(--pink)"
            }}>
              {state?.paymentStatus === "APPROVED"
                ? "CONFIRMED ✓"
                : state?.paymentStatus === "PENDING"
                ? "VERIFICATION PENDING"
                : state?.paymentStatus === "REJECTED"
                ? "PAYMENT REJECTED"
                : "PAYMENT UNPAID"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}