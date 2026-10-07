"use client";
import { useEffect, useState, useCallback } from "react";
import { usePortal } from "@/context/PortalContext";
import {
  getTeamRegistration, validateTeamForSubmission, submitTeamRegistration,
  type TeamRegistration,
} from "@/lib/services/submissionService";

type PagePhase = "LOADING"|"NOT_READY"|"REVIEW"|"CONFIRMING"|"SUCCESS"|"ALREADY_SUBMITTED";

function RegistrationStrip({ reg }: { reg: TeamRegistration }) {
  const items = [
    { label:"TEAM REQUIREMENTS", ok:reg.teamComplete,   value:reg.teamComplete   ?"COMPLETE":"INCOMPLETE" },
    { label:"DOMAIN",            ok:reg.domainSelected, value:reg.domainSelected ?"SELECTED":"NOT SELECTED" },
    { label:"SUBMISSION",        ok:true,               value:"READY" },
  ];
  return (
    <div style={{background:"var(--bg-card)",border:"1px solid var(--border-yellow)",padding:"1.25rem 1.75rem",marginBottom:"2rem",display:"flex",flexWrap:"wrap",gap:"2.5rem",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)",pointerEvents:"none"}}/>
      <span style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",letterSpacing:"2px",alignSelf:"center",position:"relative"}}>// SQUAD STATUS</span>
      {items.map(it=>(
        <div key={it.label} style={{position:"relative"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.58rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.2rem"}}>{it.label}</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"0.9rem",color:it.ok?"#00ff88":"var(--pink)",textShadow:it.ok?"0 0 12px rgba(0,255,136,0.5)":"0 0 12px rgba(233,30,140,0.5)"}}>{it.value}</div>
        </div>
      ))}
      <div style={{marginLeft:"auto",alignSelf:"center",display:"flex",alignItems:"center",gap:"0.5rem",background:"rgba(0,255,136,0.08)",border:"1px solid rgba(0,255,136,0.3)",padding:"0.4rem 0.9rem",position:"relative"}}>
        <div style={{width:"7px",height:"7px",borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 8px #00ff88"}}/>
        <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"#00ff88",letterSpacing:"1px"}}>READY TO SUBMIT</span>
      </div>
    </div>
  );
}
function SquadCard({ reg }: { reg: TeamRegistration }) {
  return (
    <div className="vv-card vv-corners" style={{padding:"1.75rem",height:"100%"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--pink)",letterSpacing:"2px",marginBottom:"1rem"}}>// YOUR SQUAD</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1.5rem"}}>
        {([{k:"TEAM NAME",v:reg.teamName,c:"var(--primary)"},{k:"TEAM ID",v:reg.teamId,c:"var(--cyan)"},{k:"COLLEGE",v:reg.college,c:"var(--text-dim)"},{k:"MEMBERS",v:`${reg.memberCount} / ${reg.requiredMembers}`,c:"var(--text-main)"}] as {k:string;v:string;c:string}[]).map(r=>(
          <div key={r.k} style={{padding:"0.65rem",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.55rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.2rem"}}>{r.k}</div>
            <div style={{fontFamily:"var(--font-heading)",fontSize:"0.82rem",color:r.c}}>{r.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1.5rem",border:"1px solid rgba(0,255,136,0.3)",padding:"0.5rem 0.75rem",background:"rgba(0,255,136,0.05)"}}>
        <div style={{width:"7px",height:"7px",borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 8px #00ff88",flexShrink:0}}/>
        <span style={{fontFamily:"var(--font-heading)",fontSize:"0.78rem",color:"#00ff88",letterSpacing:"0.5px"}}>REQUIREMENTS COMPLETE</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
        {reg.members.map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:"0.85rem",padding:"0.75rem",background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{width:"36px",height:"36px",borderRadius:"50%",flexShrink:0,border:`2px solid ${m.accentColor}`,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontSize:"0.75rem",color:m.accentColor,boxShadow:`0 0 10px ${m.accentColor}55`}}>{m.initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"var(--font-body)",fontWeight:600,fontSize:"0.88rem",color:"var(--text-main)",display:"flex",alignItems:"center",gap:"0.4rem"}}>
                {m.name}{m.isLeader&&<span style={{fontSize:"0.6rem",fontFamily:"var(--font-mono)",color:"var(--primary)"}}>★ LEAD</span>}
              </div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:"0.68rem",color:"var(--text-muted)"}}>{m.branch} · {m.role}</div>
            </div>
            <div style={{width:"7px",height:"7px",borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 7px #00ff88",flexShrink:0}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function DomainCard({ reg }: { reg: TeamRegistration }) {
  const d = reg.domain;
  const isLocked = reg.status==="PAYMENT_PENDING"||reg.status==="SUBMITTED";
  return (
    <div className="vv-card vv-corners" style={{padding:"1.75rem",height:"100%",borderColor:d?(d.accentColor+"66"):"var(--border-yellow)"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--cyan)",letterSpacing:"2px",marginBottom:"1rem"}}>{isLocked?"// MISSION LOCKED":"// SELECTED MISSION"}</div>
      {d ? (
        <>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem"}}>
            <span style={{fontSize:"2rem"}}>{d.icon}</span>
            <div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:"0.58rem",color:"var(--text-muted)",letterSpacing:"1px"}}>DOMAIN</div>
              <div style={{fontFamily:"var(--font-heading)",fontSize:"1.4rem",color:d.accentColor,lineHeight:1.1}}>{d.name}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"1rem"}}>
            {([{k:"SHORT CODE",v:d.shortCode,c:"var(--text-main)"},{k:"STATUS",v:"SELECTED",c:"#00ff88"}] as {k:string;v:string;c:string}[]).map(r=>(
              <div key={r.k} style={{padding:"0.6rem",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:"0.55rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.2rem"}}>{r.k}</div>
                <div style={{fontFamily:"var(--font-heading)",fontSize:"0.82rem",color:r.c}}>{r.v}</div>
              </div>
            ))}
          </div>
          <p style={{fontFamily:"var(--font-body)",fontSize:"0.82rem",color:"var(--text-dim)",lineHeight:1.65,marginBottom:"1.25rem"}}>{d.description}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1rem"}}>
            {d.tags.map(t=><span key={t} style={{fontFamily:"var(--font-mono)",fontSize:"0.58rem",color:d.accentColor,border:`1px solid ${d.accentColor}44`,padding:"0.12rem 0.45rem"}}>{t}</span>)}
          </div>
          {!isLocked&&<a href="/domain" style={{display:"inline-block",fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",borderBottom:"1px solid rgba(255,255,255,0.15)",textDecoration:"none",paddingBottom:"1px",letterSpacing:"0.5px"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--primary)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--text-muted)"}>← CHANGE DOMAIN</a>}
        </>
      ) : (
        <div style={{textAlign:"center",padding:"2rem 0"}}>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"1rem",color:"var(--pink)",marginBottom:"0.75rem"}}>NO DOMAIN SELECTED</div>
          <a href="/domain" style={{display:"inline-block",fontFamily:"var(--font-heading)",fontSize:"0.8rem",color:"var(--primary)",border:"1px solid var(--primary)",padding:"0.5rem 1.25rem",textDecoration:"none",letterSpacing:"1px"}}>SELECT DOMAIN</a>
        </div>
      )}
    </div>
  );
}
function PreflightCheck({ reg }: { reg: TeamRegistration }) {
  const checks = [
    {ok:reg.teamComplete,  label:"Team requirements complete",              color:"var(--primary)"},
    {ok:reg.memberCount>=reg.requiredMembers,label:`${reg.requiredMembers} required members added`,color:"var(--cyan)"},
    {ok:reg.domainSelected,label:"Competition domain selected",             color:"var(--pink)"},
    {ok:!!reg.teamName,    label:"Team information complete",               color:"var(--primary)"},
    {ok:reg.teamComplete&&reg.domainSelected,label:"Registration ready for submission",color:"#00ff88"},
  ];
  return (
    <div className="vv-card vv-corners" style={{padding:"1.75rem"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--primary)",letterSpacing:"2px",marginBottom:"1.25rem"}}>// PRE-FLIGHT CHECK</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {checks.map((c,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:"1rem",padding:"0.65rem 0.85rem",background:c.ok?"rgba(255,255,255,0.025)":"rgba(233,30,140,0.04)",border:`1px solid ${c.ok?"rgba(255,255,255,0.07)":"rgba(233,30,140,0.15)"}`,borderLeft:`3px solid ${c.ok?c.color:"var(--pink)"}`}}>
            <div style={{width:"22px",height:"22px",borderRadius:"50%",flexShrink:0,border:`2px solid ${c.ok?c.color:"var(--pink)"}`,background:c.ok?`${c.color}22`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontSize:"0.7rem",color:c.ok?c.color:"var(--pink)"}}>{c.ok?"✓":"✕"}</div>
            <span style={{fontFamily:"var(--font-body)",fontSize:"0.85rem",color:c.ok?"var(--text-main)":"var(--text-muted)"}}>{c.label}</span>
            {c.ok&&<div style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:c.color,letterSpacing:"1px"}}>OK</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoPanel() {
  return (
    <div style={{background:"rgba(253,191,21,0.04)",border:"1px solid rgba(253,191,21,0.25)",borderLeft:"4px solid var(--primary)",padding:"1.25rem 1.5rem"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--primary)",letterSpacing:"2px",marginBottom:"0.75rem"}}>// BEFORE YOU SUBMIT</div>
      <p style={{fontFamily:"var(--font-body)",fontSize:"0.88rem",color:"var(--text-dim)",lineHeight:1.7,marginBottom:"0.65rem"}}>
        Submitting your team will finalize the current team registration and move your squad to the <strong style={{color:"var(--primary)"}}>payment stage</strong>.
      </p>
      <p style={{fontFamily:"var(--font-body)",fontSize:"0.88rem",color:"var(--pink)",lineHeight:1.7,margin:0}}>
        Your team will <strong>NOT</strong> be confirmed until the payment process is completed successfully.
      </p>
    </div>
  );
}

function ConfirmModal({reg,onConfirm,onBack,isProcessing}:{reg:TeamRegistration;onConfirm:()=>void;onBack:()=>void;isProcessing:boolean}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div className="animate-slide-up" style={{background:"var(--bg-card)",border:"1px solid var(--border-yellow)",maxWidth:"540px",width:"100%",padding:"2.5rem",position:"relative",boxShadow:"0 0 60px rgba(253,191,21,0.12)"}}>
        <div style={{position:"absolute",top:0,left:0,width:"20px",height:"20px",borderTop:"2px solid var(--primary)",borderLeft:"2px solid var(--primary)"}}/>
        <div style={{position:"absolute",bottom:0,right:0,width:"20px",height:"20px",borderBottom:"2px solid var(--primary)",borderRight:"2px solid var(--primary)"}}/>
        <div style={{fontFamily:"var(--font-mono)",fontSize:"0.62rem",color:"var(--primary)",letterSpacing:"2px",marginBottom:"0.5rem"}}>// FINAL MISSION CHECK</div>
        <h2 style={{fontFamily:"var(--font-heading)",fontSize:"1.6rem",color:"var(--text-main)",marginBottom:"1.5rem",lineHeight:1}}>ARE YOU READY<br/><span style={{color:"var(--primary)"}}>TO SUBMIT?</span></h2>
        <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.5rem"}}>
          {([{k:"TEAM",v:reg.teamName,c:"var(--primary)"},{k:"DOMAIN",v:reg.domain?.name??"—",c:reg.domain?.accentColor??"var(--text-dim)"},{k:"MEMBERS",v:`${reg.memberCount} / ${reg.requiredMembers}`,c:"var(--text-main)"}] as {k:string;v:string;c:string}[]).map(r=>(
            <div key={r.k} style={{display:"flex",justifyContent:"space-between",padding:"0.6rem 0",borderBottom:"1px solid var(--border-light)"}}>
              <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"1px"}}>{r.k}</span>
              <span style={{fontFamily:"var(--font-heading)",fontSize:"0.85rem",color:r.c}}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{background:"rgba(233,30,140,0.07)",border:"1px solid rgba(233,30,140,0.25)",padding:"0.9rem 1rem",marginBottom:"1.75rem"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--pink)",letterSpacing:"1px",marginBottom:"0.4rem"}}>NOTICE</div>
          <p style={{fontFamily:"var(--font-body)",fontSize:"0.8rem",color:"var(--text-dim)",lineHeight:1.6,margin:0}}>Once submitted, your team moves to the <strong style={{color:"var(--primary)"}}>payment stage</strong>. Registration is NOT confirmed until payment is completed.</p>
        </div>
        <div style={{display:"flex",gap:"0.75rem"}}>
          <button onClick={onConfirm} disabled={isProcessing} style={{flex:1,fontFamily:"var(--font-heading)",fontSize:"0.95rem",letterSpacing:"1px",background:"var(--primary)",color:"#000",border:"none",padding:"0.9rem",cursor:isProcessing?"not-allowed":"pointer",opacity:isProcessing?0.7:1}}>
            {isProcessing?(<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}><span style={{width:"13px",height:"13px",border:"2px solid rgba(0,0,0,0.3)",borderTop:"2px solid #000",borderRadius:"50%",animation:"vv-spin 0.8s linear infinite",display:"inline-block"}}/>SUBMITTING...</span>):"CONFIRM SUBMISSION"}
          </button>
          <button onClick={onBack} disabled={isProcessing} style={{flex:1,fontFamily:"var(--font-heading)",fontSize:"0.85rem",letterSpacing:"1px",background:"transparent",color:"var(--text-dim)",border:"1px solid rgba(255,255,255,0.15)",padding:"0.9rem",cursor:"pointer"}}>GO BACK</button>
        </div>
      </div>
    </div>
  );
}
function AlreadySubmittedView({ reg }: { reg: TeamRegistration }) {
  return (
    <div className="vv-card vv-corners animate-slide-up" style={{padding:"3rem",textAlign:"center",borderColor:"var(--primary)",background:"rgba(253,191,21,0.03)"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--primary)",letterSpacing:"3px",marginBottom:"1rem"}}>// REGISTRATION LOCKED</div>
      <div style={{fontFamily:"var(--font-heading)",fontSize:"2rem",color:"var(--primary)",marginBottom:"0.5rem"}} className="text-glow-yellow">SUBMISSION RECEIVED</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",marginBottom:"2rem"}}>
        <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"var(--primary)",boxShadow:"0 0 10px var(--primary)"}}/>
        <span style={{fontFamily:"var(--font-heading)",fontSize:"0.9rem",color:"var(--primary)",letterSpacing:"1px"}}>PAYMENT PENDING</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"2rem",textAlign:"left"}}>
        {([{k:"TEAM",v:reg.teamName,c:"var(--primary)"},{k:"DOMAIN",v:reg.domain?.name??"—",c:reg.domain?.accentColor??"var(--cyan)"},{k:"REF",v:reg.registrationRef??"—",c:"var(--cyan)"},{k:"STATUS",v:"PAYMENT PENDING",c:"var(--primary)"}] as {k:string;v:string;c:string}[]).map(r=>(
          <div key={r.k} style={{padding:"0.75rem",background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.58rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.25rem"}}>{r.k}</div>
            <div style={{fontFamily:"var(--font-heading)",fontSize:"0.85rem",color:r.c,wordBreak:"break-all"}}>{r.v}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(253,191,21,0.06)",border:"1px solid rgba(253,191,21,0.2)",padding:"1rem",marginBottom:"2rem"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--primary)",letterSpacing:"1px",marginBottom:"0.4rem"}}>NEXT OBJECTIVE</div>
        <p style={{fontFamily:"var(--font-body)",fontSize:"0.85rem",color:"var(--text-dim)",lineHeight:1.6,margin:0}}>Complete payment to confirm your squad registration. Your slot is reserved pending payment verification.</p>
      </div>
      <div style={{display:"flex",gap:"0.75rem",justifyContent:"center",flexWrap:"wrap"}}>
        <a href="/payment" style={{fontFamily:"var(--font-heading)",fontSize:"1rem",letterSpacing:"1px",background:"var(--primary)",color:"#000",padding:"0.85rem 2.5rem",textDecoration:"none"}}>PROCEED TO PAYMENT</a>
        <a href="/dashboard" style={{fontFamily:"var(--font-heading)",fontSize:"0.85rem",letterSpacing:"1px",background:"transparent",color:"var(--text-dim)",border:"1px solid rgba(255,255,255,0.15)",padding:"0.85rem 1.5rem",textDecoration:"none"}}>DASHBOARD</a>
      </div>
    </div>
  );
}

function SuccessView({ reg, regRef }: { reg: TeamRegistration; regRef: string }) {
  return (
    <div className="animate-slide-up" style={{maxWidth:"700px",margin:"0 auto",textAlign:"center",paddingTop:"1rem"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"#00ff88",letterSpacing:"3px",marginBottom:"1rem"}}>// REGISTRATION SUBMITTED</div>
      <div style={{position:"relative",width:"100%",paddingBottom:"28%",overflow:"hidden",marginBottom:"2rem",border:"1px solid var(--border-yellow)",background:"#0B0B0B"}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {[1,2,3].map(i=>(
            <div key={i} style={{position:"absolute",width:`${i*180}px`,height:`${i*90}px`,borderRadius:"50%",border:`1px solid ${i===1?"var(--primary)":i===2?"var(--pink)":"var(--cyan)"}`,opacity:0.15+i*0.1,animation:`vv-spin ${5+i*4}s linear infinite`}}/>
          ))}
          <div style={{fontFamily:"var(--font-heading)",fontSize:"1.3rem",color:"#00ff88",letterSpacing:"3px",textShadow:"0 0 30px rgba(0,255,136,0.6)",position:"relative",zIndex:1}}>TRANSMISSION COMPLETE</div>
        </div>
        <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 3px,rgba(0,0,0,0.1) 3px,rgba(0,0,0,0.1) 4px)",pointerEvents:"none"}}/>
      </div>
      <div style={{fontFamily:"var(--font-heading)",fontSize:"1.8rem",color:"#00ff88",marginBottom:"0.5rem",textShadow:"0 0 20px rgba(0,255,136,0.5)"}}>YOUR SQUAD HAS BEEN REGISTERED.</div>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"var(--text-muted)",marginBottom:"2rem",letterSpacing:"1px"}}>{regRef}</div>
      <div className="vv-card vv-corners" style={{padding:"1.5rem",marginBottom:"1.5rem",textAlign:"left"}}>
        {([{k:"TEAM",v:reg.teamName,c:"var(--primary)"},{k:"DOMAIN",v:reg.domain?.name??"—",c:reg.domain?.accentColor??"var(--cyan)"},{k:"STATUS",v:"PAYMENT PENDING",c:"var(--primary)"}] as {k:string;v:string;c:string}[]).map(r=>(
          <div key={r.k} style={{display:"flex",justifyContent:"space-between",padding:"0.65rem 0",borderBottom:"1px solid var(--border-light)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"1px"}}>{r.k}</span>
            <span style={{fontFamily:"var(--font-heading)",fontSize:"0.9rem",color:r.c}}>{r.v}</span>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(253,191,21,0.06)",border:"1px solid rgba(253,191,21,0.25)",padding:"1rem",marginBottom:"2rem"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--primary)",letterSpacing:"1px",marginBottom:"0.4rem"}}>NEXT OBJECTIVE</div>
        <p style={{fontFamily:"var(--font-body)",fontSize:"0.85rem",color:"var(--text-dim)",lineHeight:1.6,margin:0}}>Complete payment to confirm your team. Your slot is reserved pending payment verification.</p>
      </div>
      <div style={{display:"flex",gap:"0.75rem",justifyContent:"center",flexWrap:"wrap"}}>
        <a href="/payment" style={{fontFamily:"var(--font-heading)",fontSize:"1rem",letterSpacing:"1px",background:"var(--primary)",color:"#000",padding:"0.9rem 2.5rem",textDecoration:"none"}}>PROCEED TO PAYMENT</a>
        <a href="/dashboard" style={{fontFamily:"var(--font-heading)",fontSize:"0.85rem",letterSpacing:"1px",background:"transparent",color:"var(--text-dim)",border:"1px solid rgba(255,255,255,0.15)",padding:"0.9rem 1.5rem",textDecoration:"none"}}>RETURN TO DASHBOARD</a>
      </div>
    </div>
  );
}
function PageHeader() {
  return (
    <div style={{marginBottom:"2rem"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--pink)",letterSpacing:"3px",marginBottom:"0.5rem"}}>// FINAL MISSION CHECK</div>
      <h1 className="text-glow-yellow" style={{fontFamily:"var(--font-heading)",fontSize:"clamp(2.2rem,6vw,3.8rem)",lineHeight:1,marginBottom:"0.5rem"}}>TEAM SUBMISSION</h1>
      <p style={{fontFamily:"var(--font-mono)",fontSize:"0.8rem",color:"var(--text-muted)",letterSpacing:"1px"}}>Review your squad details before submitting your registration.</p>
    </div>
  );
}

export default function SubmitPage() {
  const { authUser } = usePortal();
  const [phase,  setPhase]  = useState<PagePhase>("LOADING");
  const [reg,    setReg]    = useState<TeamRegistration|null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [regRef, setRegRef] = useState("");
  const [isProc, setIsProc] = useState(false);

  const load = useCallback(async () => {
    const r = await getTeamRegistration();
    setReg(r);
    if (r.status==="PAYMENT_PENDING"||r.status==="SUBMITTED") { setPhase("ALREADY_SUBMITTED"); return; }
    const v = await validateTeamForSubmission(r);
    if (!v.valid) { setErrors(v.errors); setPhase("NOT_READY"); return; }
    setPhase("REVIEW");
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleConfirm = async () => {
    if (!reg) return;
    setIsProc(true);
    const result = await submitTeamRegistration(reg.teamId);
    setIsProc(false);
    if (result.success) { setRegRef(result.registrationRef??""); setPhase("SUCCESS"); }
  };

  const BG = (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-20%",right:"-5%",width:"600px",height:"600px",borderRadius:"50%",background:"radial-gradient(circle,rgba(253,191,21,0.07) 0%,transparent 70%)"}}/>
      <div style={{position:"absolute",bottom:"-10%",left:"-5%",width:"500px",height:"500px",borderRadius:"50%",background:"radial-gradient(circle,rgba(233,30,140,0.06) 0%,transparent 70%)"}}/>
      <div style={{position:"absolute",top:"50%",right:"30%",width:"350px",height:"350px",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%)"}}/>
    </div>
  );

  if (phase==="LOADING") return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}><div className="vv-spinner" style={{margin:"0 auto 1rem"}}/><div style={{fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"var(--text-muted)",letterSpacing:"2px"}}>LOADING REGISTRATION DATA...</div></div>
    </main>
  );

  if (phase==="NOT_READY") return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"2rem 1.5rem",position:"relative"}}>
      {BG}
      <div style={{position:"relative",zIndex:1,maxWidth:"900px",margin:"0 auto"}}>
        <PageHeader />
        <div className="vv-card vv-corners animate-slide-up" style={{padding:"3rem",textAlign:"center",borderColor:"var(--pink)"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--pink)",letterSpacing:"3px",marginBottom:"1rem"}}>// MISSION NOT READY</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"1.6rem",color:"var(--text-dim)",marginBottom:"1.5rem"}}>COMPLETE YOUR SQUAD REQUIREMENTS FIRST</div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.65rem",marginBottom:"2rem",textAlign:"left",maxWidth:"500px",margin:"0 auto 2rem"}}>
            {errors.map((e,i)=>(
              <div key={i} style={{display:"flex",gap:"0.75rem",alignItems:"flex-start",padding:"0.65rem",background:"rgba(233,30,140,0.06)",border:"1px solid rgba(233,30,140,0.2)"}}>
                <span style={{color:"var(--pink)",fontFamily:"var(--font-heading)",fontSize:"0.9rem",lineHeight:1,flexShrink:0}}>✕</span>
                <span style={{fontFamily:"var(--font-body)",fontSize:"0.82rem",color:"var(--text-dim)"}}>{e}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"0.75rem",justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/team"    style={{display:"inline-block",fontFamily:"var(--font-heading)",fontSize:"0.9rem",letterSpacing:"1px",background:"var(--cyan)",color:"#000",padding:"0.75rem 2rem",textDecoration:"none"}}>MANAGE SQUAD</a>
            <a href="/domain"  style={{display:"inline-block",fontFamily:"var(--font-heading)",fontSize:"0.9rem",letterSpacing:"1px",background:"var(--pink)",color:"#000",padding:"0.75rem 2rem",textDecoration:"none"}}>SELECT DOMAIN</a>
            <a href="/dashboard" style={{display:"inline-block",fontFamily:"var(--font-heading)",fontSize:"0.85rem",letterSpacing:"1px",background:"transparent",color:"var(--text-dim)",border:"1px solid rgba(255,255,255,0.15)",padding:"0.75rem 1.5rem",textDecoration:"none"}}>DASHBOARD</a>
          </div>
        </div>
      </div>
    </main>
  );

  if (phase==="ALREADY_SUBMITTED"&&reg) return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"2rem 1.5rem",position:"relative"}}>
      {BG}<div style={{position:"relative",zIndex:1,maxWidth:"900px",margin:"0 auto"}}><PageHeader /><AlreadySubmittedView reg={reg} /></div>
    </main>
  );

  if (phase==="SUCCESS"&&reg) return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"2rem 1.5rem",position:"relative"}}>
      {BG}<div style={{position:"relative",zIndex:1,maxWidth:"1100px",margin:"0 auto"}}><SuccessView reg={reg} regRef={regRef} /></div>
    </main>
  );

  return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"2rem 1.5rem",position:"relative"}}>
      {BG}
      <div style={{position:"relative",zIndex:1,maxWidth:"1300px",margin:"0 auto"}}>
        <PageHeader />
        {reg&&<RegistrationStrip reg={reg} />}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"1.25rem",marginBottom:"1.25rem",alignItems:"stretch"}}>
          <div className="animate-slide-up" style={{animationDelay:"0.05s"}}>{reg&&<SquadCard reg={reg} />}</div>
          <div className="animate-slide-up" style={{animationDelay:"0.1s"}}>{reg&&<DomainCard reg={reg} />}</div>
        </div>
        <div className="animate-slide-up" style={{animationDelay:"0.15s",marginBottom:"1.25rem"}}>{reg&&<PreflightCheck reg={reg} />}</div>
        <div className="animate-slide-up" style={{animationDelay:"0.2s",marginBottom:"2rem"}}><InfoPanel /></div>
        <div className="animate-slide-up" style={{animationDelay:"0.25s",textAlign:"center",marginBottom:"3rem"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",letterSpacing:"2px",marginBottom:"0.75rem"}}>// FINALIZE REGISTRATION</div>
          <button onClick={()=>setPhase("CONFIRMING")} className="vv-button" style={{maxWidth:"380px",fontSize:"1.2rem"}}>SUBMIT TEAM</button>
          <div style={{marginTop:"0.75rem",fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"1px"}}>You will be asked to confirm before submission.</div>
        </div>
        <div style={{textAlign:"center",paddingTop:"1.5rem",borderTop:"1px solid var(--border-light)"}}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"2px"}}>VICEVERSE IDEATHON · TEAM SUBMISSION · IVC CLUB VVCE</span>
        </div>
      </div>
      {phase==="CONFIRMING"&&reg&&(
        <ConfirmModal reg={reg} onConfirm={handleConfirm} onBack={()=>setPhase("REVIEW")} isProcessing={isProc} />
      )}
    </main>
  );
}