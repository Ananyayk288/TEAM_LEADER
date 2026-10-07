"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { usePortal } from "@/context/PortalContext";
import {
  getAvailableDomains, getTeamStatus, submitTeam,
  type Domain, type TeamStatus,
} from "@/lib/services/domainService";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Phase =
  | "LOADING"
  | "INCOMPLETE"   // team not ready
  | "SELECT"       // show domain cards
  | "DETAIL"       // domain selected, show detail + confirm btn
  | "CONFIRM"      // confirmation modal open
  | "SUBMIT"       // domain confirmed, ready to submit team
  | "FINALIZE"     // final confirmation modal
  | "COMPLETE"     // registration done
  | "LOCKED";      // already submitted

// ─── SQUAD STATUS PANEL ──────────────────────────────────────────────────────
function SquadStatusPanel({ status }: { status: TeamStatus }) {
  const complete = status.isComplete;
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border-yellow)",
      padding: "1.25rem 1.5rem", marginBottom: "2rem",
      display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* scanlines */}
      <div style={{ position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)",pointerEvents:"none" }}/>

      <div style={{ fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"2px",position:"relative",minWidth:"60px" }}>
        // SQUAD STATUS
      </div>

      {[
        { label:"TEAM",    value: status.teamName,  color:"var(--primary)" },
        { label:"MEMBERS", value: `${status.memberCount} / ${status.requiredMembers}`, color:"var(--text-main)" },
        { label:"STATUS",  value: complete ? "TEAM COMPLETE" : "INCOMPLETE",
          color: complete ? "#00ff88" : "var(--pink)" },
      ].map(r => (
        <div key={r.label} style={{position:"relative"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.58rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.2rem"}}>{r.label}</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"0.95rem",color:r.color,
            textShadow: complete && r.label==="STATUS" ? "0 0 12px rgba(0,255,136,0.5)" : "none",
          }}>{r.value}</div>
        </div>
      ))}

      {complete && (
        <div style={{
          marginLeft:"auto",display:"flex",alignItems:"center",gap:"0.5rem",
          background:"rgba(0,255,136,0.08)",border:"1px solid rgba(0,255,136,0.3)",
          padding:"0.4rem 0.9rem",position:"relative",
        }}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 10px #00ff88"}}/>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"0.68rem",color:"#00ff88",letterSpacing:"1px"}}>READY TO SELECT MISSION</span>
        </div>
      )}
    </div>
  );
}

// ─── DOMAIN CARD ─────────────────────────────────────────────────────────────
function DomainCard({ domain, selected, onClick }: { domain: Domain; selected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${selected ? domain.accentColor : hovered ? domain.accentColor+"88" : "var(--border-yellow)"}`,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered && !selected ? "translateY(-4px) scale(1.01)" : selected ? "scale(1.02)" : "none",
        boxShadow: selected
          ? `0 0 30px ${domain.glowColor}, 0 0 60px ${domain.glowColor}55`
          : hovered ? `0 0 16px ${domain.glowColor}66` : "none",
      }}
    >
      {/* corner accents */}
      <div style={{position:"absolute",top:0,left:0,width:"16px",height:"16px",borderTop:`2px solid ${domain.accentColor}`,borderLeft:`2px solid ${domain.accentColor}`,zIndex:3,transition:"all 0.3s"}}/>
      <div style={{position:"absolute",bottom:0,right:0,width:"16px",height:"16px",borderBottom:`2px solid ${domain.accentColor}`,borderRight:`2px solid ${domain.accentColor}`,zIndex:3,transition:"all 0.3s"}}/>

      {/* SELECTED badge */}
      {selected && (
        <div style={{
          position:"absolute",top:"0.75rem",right:"0.75rem",zIndex:4,
          background: domain.accentColor, color:"#000",
          fontFamily:"var(--font-heading)",fontSize:"0.65rem",letterSpacing:"1px",
          padding:"0.2rem 0.6rem",display:"flex",alignItems:"center",gap:"0.3rem",
        }}>
          ✓ SELECTED
        </div>
      )}

      {/* Image */}
      <div style={{
        position:"relative",width:"100%",paddingBottom:"52%",overflow:"hidden",
        transition:"all 0.35s ease",
      }}>
        <Image
          src={domain.image}
          alt={domain.name}
          fill
          style={{
            objectFit:"cover",
            transform: hovered || selected ? "scale(1.06)" : "scale(1)",
            transition:"transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            filter: selected ? "brightness(0.85)" : hovered ? "brightness(0.8)" : "brightness(0.65)",
          }}
        />
        <div style={{
          position:"absolute",inset:0,
          background:`linear-gradient(to bottom,rgba(0,0,0,0) 40%,rgba(11,11,11,0.95) 100%)`,
        }}/>
        {/* Mission label */}
        <div style={{
          position:"absolute",top:"0.75rem",left:"0.75rem",
          fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:domain.accentColor,
          letterSpacing:"2px",textShadow:`0 0 8px ${domain.accentColor}`,
        }}>// MISSION</div>
        {/* Short code */}
        <div style={{
          position:"absolute",bottom:"0.75rem",right:"0.75rem",
          fontFamily:"var(--font-heading)",fontSize:"1.6rem",
          color:"rgba(255,255,255,0.08)",letterSpacing:"3px",
        }}>{domain.shortCode}</div>
      </div>

      {/* Body */}
      <div style={{padding:"1.25rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.6rem"}}>
          <span style={{fontSize:"1.2rem"}}>{domain.icon}</span>
          <h3 style={{
            fontFamily:"var(--font-heading)",fontSize:"1.05rem",
            color: selected ? domain.accentColor : "var(--text-main)",
            letterSpacing:"0.5px",lineHeight:1.1,
            transition:"color 0.3s",
          }}>{domain.name}</h3>
        </div>

        <p style={{
          fontFamily:"var(--font-body)",fontSize:"0.8rem",
          color:"var(--text-dim)",lineHeight:1.6,marginBottom:"1rem",
        }}>{domain.description}</p>

        <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1rem"}}>
          {domain.tags.map(t => (
            <span key={t} style={{
              fontFamily:"var(--font-mono)",fontSize:"0.58rem",
              color:domain.accentColor,border:`1px solid ${domain.accentColor}44`,
              padding:"0.15rem 0.45rem",letterSpacing:"0.5px",
            }}>{t}</span>
          ))}
        </div>

        <div style={{
          width:"100%",padding:"0.65rem",textAlign:"center",
          fontFamily:"var(--font-heading)",fontSize:"0.85rem",letterSpacing:"1px",
          border:`1px solid ${selected ? domain.accentColor : "rgba(255,255,255,0.15)"}`,
          color: selected ? domain.accentColor : "var(--text-dim)",
          background: selected ? `${domain.accentColor}18` : "transparent",
          transition:"all 0.3s",
        }}>
          {selected ? "✓ MISSION SELECTED" : "SELECT MISSION ▶"}
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL PANEL ────────────────────────────────────────────────────────────
function DomainDetailPanel({ domain, onConfirm, onDeselect }: { domain: Domain; onConfirm: ()=>void; onDeselect: ()=>void }) {
  return (
    <div className="animate-slide-up" style={{
      background:"var(--bg-card)",border:`1px solid ${domain.accentColor}`,
      padding:"2rem",marginBottom:"2rem",position:"relative",overflow:"hidden",
      boxShadow:`0 0 40px ${domain.glowColor}44`,
    }}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at top right,${domain.glowColor}12 0%,transparent 60%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:"0.62rem",color:domain.accentColor,letterSpacing:"2px",marginBottom:"0.75rem"}}>
          // SELECTED MISSION
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem"}}>
          <span style={{fontSize:"2rem"}}>{domain.icon}</span>
          <h2 style={{fontFamily:"var(--font-heading)",fontSize:"1.8rem",color:domain.accentColor,letterSpacing:"1px"}}
              className="text-glow-yellow">{domain.name}</h2>
        </div>
        <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.5rem"}}>MISSION BRIEF</div>
        <p style={{fontFamily:"var(--font-body)",fontSize:"0.9rem",color:"var(--text-dim)",lineHeight:1.75,marginBottom:"1.5rem",maxWidth:"800px"}}>
          {domain.longDescription}
        </p>
        <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
          <button onClick={onConfirm} style={{
            fontFamily:"var(--font-heading)",fontSize:"1rem",letterSpacing:"1px",
            background:domain.accentColor,color:"#000",border:"none",
            padding:"0.85rem 2.5rem",cursor:"pointer",
            boxShadow:`0 0 20px ${domain.glowColor}`,
            transition:"all 0.3s",
          }}
          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform="translateY(-2px)"}
          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform="translateY(0)"}>
            CONFIRM DOMAIN ▶
          </button>
          <button onClick={onDeselect} style={{
            fontFamily:"var(--font-heading)",fontSize:"0.85rem",letterSpacing:"1px",
            background:"transparent",color:"var(--text-muted)",
            border:"1px solid rgba(255,255,255,0.12)",padding:"0.85rem 1.5rem",cursor:"pointer",transition:"all 0.3s",
          }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-main)";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.3)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-muted)";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.12)";}}>
            ← CHOOSE DIFFERENT
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:1000,
      background:"rgba(0,0,0,0.85)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem",
    }}>
      <div className="animate-slide-up" style={{
        background:"var(--bg-card)",border:"1px solid var(--border-yellow)",
        maxWidth:"520px",width:"100%",padding:"2.5rem",position:"relative",
      }}>
        <div style={{position:"absolute",top:0,left:0,width:"20px",height:"20px",borderTop:"2px solid var(--primary)",borderLeft:"2px solid var(--primary)"}}/>
        <div style={{position:"absolute",bottom:0,right:0,width:"20px",height:"20px",borderBottom:"2px solid var(--primary)",borderRight:"2px solid var(--primary)"}}/>
        {children}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function DomainPage() {
  const { authUser } = usePortal();
  const [phase, setPhase]           = useState<Phase>("LOADING");
  const [domains, setDomains]       = useState<Domain[]>([]);
  const [status, setStatus]         = useState<TeamStatus | null>(null);
  const [selected, setSelected]     = useState<Domain | null>(null);
  const [confirmed, setConfirmed]   = useState<Domain | null>(null);
  const [registrationId, setRegId]  = useState<string>("");
  const [isSubmitting, setIsSub]    = useState(false);

  // ── Load data ──
  const loadData = useCallback(async () => {
    try {
      const [ds, ts] = await Promise.all([getAvailableDomains(), getTeamStatus(authUser?.id)]);
      setDomains(ds);
      setStatus(ts);
      if (ts.isSubmitted && ts.selectedDomainId) {
        const d = ds.find(x => x.id === ts.selectedDomainId);
        if (d) { setConfirmed(d); setSelected(d); setPhase("LOCKED"); return; }
      }
      setPhase(ts.isComplete ? "SELECT" : "INCOMPLETE");
    } catch { setPhase("SELECT"); }
  }, [authUser?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Handlers ──
  const handleCardClick = (d: Domain) => {
    if (phase !== "SELECT" && phase !== "DETAIL") return;
    if (selected?.id === d.id) { setSelected(null); setPhase("SELECT"); return; }
    setSelected(d); setPhase("DETAIL");
  };

  const handleConfirmModal = () => setPhase("CONFIRM");
  const handleBackToDetail = () => setPhase("DETAIL");

  const handleConfirmDomain = () => {
    setConfirmed(selected); setPhase("SUBMIT");
  };

  const handleFinalizeModal = () => setPhase("FINALIZE");
  const handleCancelFinalize = () => setPhase("SUBMIT");

  const handleSubmitTeam = async () => {
    if (!confirmed || !status) return;
    setIsSub(true);
    const result = await submitTeam(status.teamId, confirmed.id);
    setIsSub(false);
    if (result.success) { setRegId(result.registrationId ?? ""); setPhase("COMPLETE"); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const BG = (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-15%",right:"-5%",width:"550px",height:"550px",borderRadius:"50%",background:"radial-gradient(circle,rgba(233,30,140,0.06) 0%,transparent 70%)"}}/>
      <div style={{position:"absolute",bottom:"-10%",left:"-5%",width:"450px",height:"450px",borderRadius:"50%",background:"radial-gradient(circle,rgba(253,191,21,0.05) 0%,transparent 70%)"}}/>
    </div>
  );

  // LOADING
  if (phase === "LOADING") return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div className="vv-spinner"/>
    </main>
  );

  // LOCKED
  if (phase === "LOCKED" && confirmed) return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"2rem 1.5rem",position:"relative"}}>
      {BG}
      <div style={{position:"relative",zIndex:1,maxWidth:"900px",margin:"0 auto"}}>
        <PageHeader />
        {status && <SquadStatusPanel status={status} />}
        <div className="vv-card vv-corners animate-slide-up" style={{padding:"3rem",textAlign:"center"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--pink)",letterSpacing:"3px",marginBottom:"1rem"}}>// MISSION LOCKED</div>
          <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>🔒</div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.35rem"}}>SELECTED DOMAIN</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"2.2rem",color:"var(--primary)",marginBottom:"0.5rem"}} className="text-glow-yellow">{confirmed.name}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",marginBottom:"2rem"}}>
            <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 10px #00ff88"}}/>
            <span style={{fontFamily:"var(--font-heading)",fontSize:"1rem",color:"#00ff88"}}>REGISTERED</span>
          </div>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"var(--text-muted)"}}>
            Your squad domain is locked. Contact your SPOC if changes are required.
          </p>
        </div>
      </div>
    </main>
  );

  // INCOMPLETE
  if (phase === "INCOMPLETE") return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"2rem 1.5rem",position:"relative"}}>
      {BG}
      <div style={{position:"relative",zIndex:1,maxWidth:"900px",margin:"0 auto"}}>
        <PageHeader />
        {status && <SquadStatusPanel status={status} />}
        <div className="vv-card vv-corners animate-slide-up" style={{padding:"3rem",textAlign:"center",borderColor:"var(--pink)"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--pink)",letterSpacing:"3px",marginBottom:"1rem"}}>// SQUAD NOT READY</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"1.6rem",color:"var(--text-dim)",marginBottom:"0.75rem"}}>COMPLETE YOUR TEAM FIRST</div>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"0.78rem",color:"var(--text-muted)",marginBottom:"1.5rem"}}>Your squad needs all members before you can select a domain.</p>
          <a href="/team" style={{display:"inline-block",fontFamily:"var(--font-heading)",fontSize:"0.9rem",background:"var(--pink)",color:"#000",padding:"0.75rem 2rem",textDecoration:"none",letterSpacing:"1px"}}>
            MANAGE SQUAD ▶
          </a>
        </div>
      </div>
    </main>
  );

  // COMPLETE
  if (phase === "COMPLETE" && confirmed && status) return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"2rem 1.5rem",position:"relative"}}>
      {BG}
      <div style={{position:"relative",zIndex:1,maxWidth:"900px",margin:"0 auto"}}>
        <div className="animate-slide-up" style={{textAlign:"center",padding:"3rem 1rem"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"#00ff88",letterSpacing:"3px",marginBottom:"1.5rem"}}>// REGISTRATION COMPLETE</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"3rem",color:"#00ff88",marginBottom:"0.5rem",textShadow:"0 0 30px rgba(0,255,136,0.5)"}}>
            YOUR SQUAD IS READY.
          </div>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"var(--text-muted)",marginBottom:"3rem",letterSpacing:"1px"}}>{registrationId}</p>

          <div className="vv-card vv-corners" style={{padding:"2rem",marginBottom:"2rem",textAlign:"left",maxWidth:"500px",margin:"0 auto 2rem"}}>
            {[
              {k:"TEAM",   v: status.teamName,  c:"var(--primary)"},
              {k:"DOMAIN", v: confirmed.name,   c: confirmed.accentColor},
              {k:"MEMBERS",v:`${status.memberCount} / ${status.requiredMembers}`,c:"var(--text-main)"},
              {k:"STATUS", v:"REGISTERED",       c:"#00ff88"},
            ].map(r=>(
              <div key={r.k} style={{display:"flex",justifyContent:"space-between",padding:"0.65rem 0",borderBottom:"1px solid var(--border-light)"}}>
                <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"1px"}}>{r.k}</span>
                <span style={{fontFamily:"var(--font-heading)",fontSize:"0.85rem",color:r.c}}>{r.v}</span>
              </div>
            ))}
          </div>

          <a href="/dashboard" style={{display:"inline-block",fontFamily:"var(--font-heading)",fontSize:"1rem",letterSpacing:"1px",background:"var(--primary)",color:"#000",padding:"0.9rem 2.5rem",textDecoration:"none"}}>
            RETURN TO COMMAND DECK ▶
          </a>
        </div>
      </div>
    </main>
  );

  // ─── MAIN: SELECT / DETAIL / SUBMIT ──────────────────────────────────────
  return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"2rem 1.5rem",position:"relative"}}>
      {BG}
      <div style={{position:"relative",zIndex:1,maxWidth:"1300px",margin:"0 auto"}}>

        <PageHeader />
        {status && <SquadStatusPanel status={status} />}

        {/* Detail panel — shown when a domain is selected */}
        {(phase === "DETAIL" || phase === "SUBMIT") && selected && (
          <DomainDetailPanel
            domain={selected}
            onConfirm={phase === "SUBMIT" ? () => {} : handleConfirmModal}
            onDeselect={() => { setSelected(null); setPhase("SELECT"); }}
          />
        )}

        {/* After confirmation — pre-submit panel */}
        {phase === "SUBMIT" && confirmed && status && (
          <div className="animate-slide-up vv-card vv-corners" style={{
            padding:"2rem",marginBottom:"2rem",
            border:`1px solid var(--primary)`,
            background:"rgba(253,191,21,0.04)",
          }}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.62rem",color:"var(--primary)",letterSpacing:"2px",marginBottom:"1rem"}}>// REGISTRATION READY</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
              {[
                {k:"DOMAIN",  v:confirmed.name,               c:confirmed.accentColor},
                {k:"TEAM",    v:status.teamName,               c:"var(--primary)"},
                {k:"MEMBERS", v:`${status.memberCount} / ${status.requiredMembers}`, c:"var(--text-main)"},
                {k:"STATUS",  v:"READY TO SUBMIT",             c:"#00ff88"},
              ].map(r=>(
                <div key={r.k} style={{padding:"0.75rem",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:"0.58rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.25rem"}}>{r.k}</div>
                  <div style={{fontFamily:"var(--font-heading)",fontSize:"0.9rem",color:r.c}}>{r.v}</div>
                </div>
              ))}
            </div>
            <button onClick={handleFinalizeModal} className="vv-button" style={{maxWidth:"300px"}}>
              SUBMIT TEAM ▶
            </button>
          </div>
        )}

        {/* Domain grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",
          gap:"1.5rem",
        }}>
          {domains.map(d => (
            <div key={d.id} className="animate-slide-up">
              <DomainCard
                domain={d}
                selected={selected?.id === d.id}
                onClick={() => handleCardClick(d)}
              />
            </div>
          ))}
        </div>

        <div style={{textAlign:"center",marginTop:"2.5rem",paddingTop:"1.5rem",borderTop:"1px solid var(--border-light)"}}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"2px"}}>
            VICEVERSE IDEATHON · DOMAIN SELECTION · ONE MISSION PER SQUAD
          </span>
        </div>
      </div>

      {/* ── CONFIRM DOMAIN MODAL ── */}
      {phase === "CONFIRM" && selected && status && (
        <Modal>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.62rem",color:"var(--pink)",letterSpacing:"2px",marginBottom:"1rem"}}>// CONFIRM MISSION</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"0.75rem",color:"var(--text-muted)",letterSpacing:"1px",marginBottom:"0.3rem"}}>YOU ARE SELECTING</div>
          <div style={{fontFamily:"var(--font-heading)",fontSize:"2rem",color:selected.accentColor,marginBottom:"1.25rem",textShadow:`0 0 20px ${selected.glowColor}`}}>
            {selected.icon} {selected.name}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.75rem"}}>
            {[{k:"TEAM",v:status.teamName},{k:"MEMBERS",v:`${status.memberCount}`}].map(r=>(
              <div key={r.k} style={{display:"flex",justifyContent:"space-between",padding:"0.5rem 0",borderBottom:"1px solid var(--border-light)"}}>
                <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"1px"}}>{r.k}</span>
                <span style={{fontFamily:"var(--font-heading)",fontSize:"0.85rem",color:"var(--primary)"}}>{r.v}</span>
              </div>
            ))}
          </div>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"var(--text-muted)",lineHeight:1.6,marginBottom:"1.5rem"}}>
            Once confirmed, this domain will be recorded as part of your squad registration.
          </p>
          <div style={{display:"flex",gap:"0.75rem"}}>
            <button onClick={handleConfirmDomain} style={{
              flex:1,fontFamily:"var(--font-heading)",fontSize:"0.95rem",letterSpacing:"1px",
              background:selected.accentColor,color:"#000",border:"none",padding:"0.85rem",cursor:"pointer",
            }}>CONFIRM ▶</button>
            <button onClick={handleBackToDetail} style={{
              flex:1,fontFamily:"var(--font-heading)",fontSize:"0.85rem",letterSpacing:"1px",
              background:"transparent",color:"var(--text-dim)",border:"1px solid rgba(255,255,255,0.15)",padding:"0.85rem",cursor:"pointer",
            }}>GO BACK</button>
          </div>
        </Modal>
      )}

      {/* ── FINALIZE MODAL ── */}
      {phase === "FINALIZE" && confirmed && status && (
        <Modal>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.62rem",color:"var(--primary)",letterSpacing:"2px",marginBottom:"1rem"}}>// FINALIZE SQUAD</div>
          <p style={{fontFamily:"var(--font-body)",fontSize:"0.88rem",color:"var(--text-dim)",lineHeight:1.7,marginBottom:"1.5rem"}}>
            Once submitted, your team registration and selected domain will be <strong style={{color:"var(--pink)"}}>permanently locked.</strong>
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.75rem"}}>
            {[{k:"TEAM",v:status.teamName},{k:"DOMAIN",v:confirmed.name},{k:"MEMBERS",v:`${status.memberCount}`}].map(r=>(
              <div key={r.k} style={{display:"flex",justifyContent:"space-between",padding:"0.5rem 0",borderBottom:"1px solid var(--border-light)"}}>
                <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"1px"}}>{r.k}</span>
                <span style={{fontFamily:"var(--font-heading)",fontSize:"0.85rem",color:"var(--primary)"}}>{r.v}</span>
              </div>
            ))}
          </div>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"var(--text-muted)",marginBottom:"1.5rem",letterSpacing:"0.5px"}}>
            Are you ready to continue?
          </p>
          <div style={{display:"flex",gap:"0.75rem"}}>
            <button onClick={handleSubmitTeam} disabled={isSubmitting} className="vv-button" style={{flex:1}}>
              {isSubmitting ? (
                <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem"}}>
                  <span style={{width:"14px",height:"14px",border:"2px solid rgba(0,0,0,0.3)",borderTop:"2px solid #000",borderRadius:"50%",animation:"vv-spin 0.8s linear infinite",display:"inline-block"}}/>
                  SUBMITTING...
                </span>
              ) : "FINALIZE TEAM ▶"}
            </button>
            <button onClick={handleCancelFinalize} disabled={isSubmitting} style={{
              flex:1,fontFamily:"var(--font-heading)",fontSize:"0.85rem",letterSpacing:"1px",
              background:"transparent",color:"var(--text-dim)",border:"1px solid rgba(255,255,255,0.15)",padding:"0.85rem",cursor:"pointer",
            }}>CANCEL</button>
          </div>
        </Modal>
      )}
    </main>
  );
}

// ─── PAGE HEADER ─────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div style={{marginBottom:"2rem"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--pink)",letterSpacing:"3px",marginBottom:"0.5rem"}}>
        // MISSION SELECTION
      </div>
      <h1 className="text-glow-yellow" style={{
        fontFamily:"var(--font-heading)",
        fontSize:"clamp(2.2rem,6vw,3.8rem)",
        lineHeight:1,marginBottom:"0.5rem",
      }}>DOMAIN SELECTION</h1>
      <p style={{fontFamily:"var(--font-mono)",fontSize:"0.8rem",color:"var(--text-muted)",letterSpacing:"1px"}}>
        Choose the domain your squad will compete in.
      </p>
    </div>
  );
}