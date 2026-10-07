"use client";
import HeroSection      from "@/components/dashboard/HeroSection";
import SquadCard        from "@/components/dashboard/SquadCard";
import StatusCard       from "@/components/dashboard/StatusCard";
import MissionCard      from "@/components/dashboard/MissionCard";
import SubmissionCard   from "@/components/dashboard/SubmissionCard";
import AnnouncementsCard from "@/components/dashboard/AnnouncementsCard";
import Link from "next/link";

const NAV_SHORTCUTS = [
  { href:"/team",    label:"SQUAD CONFIG",    icon:"👥", color:"var(--cyan)"    },
  { href:"/domain",  label:"DOMAIN SELECT",   icon:"🎯", color:"var(--pink)"    },
  { href:"/submit",  label:"TEAM SUBMIT",     icon:"🚀", color:"#00ff88"        },
  { href:"/payment", label:"PAYMENT",         icon:"💳", color:"var(--primary)" },
  { href:"/spoc",    label:"SPOC INTEL",      icon:"📡", color:"var(--pink)"    },
  { href:"/project", label:"PROJECT DATA",   icon:"📋", color:"#00ff88"        },
  { href:"/results", label:"RESULTS",         icon:"🏆", color:"var(--primary)" },
];

export default function DashboardPage() {
  return (
    <main style={{minHeight:"100vh",background:"var(--bg-deep)",padding:"0"}}>

      {/* ─── background atmosphere ─── */}
      <div style={{
        position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden",
      }}>
        <div style={{
          position:"absolute",top:"-20%",left:"60%",
          width:"600px",height:"600px",borderRadius:"50%",
          background:"radial-gradient(circle,rgba(233,30,140,0.07) 0%,transparent 70%)",
        }}/>
        <div style={{
          position:"absolute",bottom:"-10%",left:"-10%",
          width:"500px",height:"500px",borderRadius:"50%",
          background:"radial-gradient(circle,rgba(253,191,21,0.06) 0%,transparent 70%)",
        }}/>
        <div style={{
          position:"absolute",top:"40%",right:"-5%",
          width:"400px",height:"400px",borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%)",
        }}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:"1400px",margin:"0 auto",padding:"2rem 1.5rem"}}>

        {/* ── Hero ── */}
        <div className="animate-slide-up" style={{marginBottom:"1.5rem"}}>
          <HeroSection />
        </div>

        {/* ── Quick Nav Shortcuts ── */}
        <div className="animate-slide-up" style={{
          display:"flex",gap:"0.75rem",flexWrap:"wrap",marginBottom:"1.5rem",
        }}>
          {NAV_SHORTCUTS.map(n => (
            <Link key={n.href} href={n.href} style={{
              display:"flex",alignItems:"center",gap:"0.5rem",
              padding:"0.55rem 1.1rem",
              background:"rgba(0,0,0,0.5)",
              border:`1px solid ${n.color}44`,
              color:n.color,
              fontFamily:"var(--font-heading)",fontSize:"0.75rem",letterSpacing:"1px",
              textDecoration:"none",transition:"var(--transition)",
            }}
            onMouseEnter={e=>{
              const el = e.currentTarget as HTMLElement;
              el.style.background=`${n.color}18`;
              el.style.borderColor=n.color;
              el.style.transform="translateY(-2px)";
            }}
            onMouseLeave={e=>{
              const el = e.currentTarget as HTMLElement;
              el.style.background="rgba(0,0,0,0.5)";
              el.style.borderColor=`${n.color}44`;
              el.style.transform="translateY(0)";
            }}>
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
        </div>

        {/* ── Row 1: Squad | Status | Submission (3 cols) ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
          gap:"1.25rem",
          marginBottom:"1.25rem",
          alignItems:"stretch",
        }}>
          <div className="animate-slide-up" style={{animationDelay:"0.05s"}}>
            <SquadCard />
          </div>
          <div className="animate-slide-up" style={{animationDelay:"0.1s"}}>
            <StatusCard />
          </div>
          <div className="animate-slide-up" style={{animationDelay:"0.15s"}}>
            <SubmissionCard />
          </div>
        </div>

        {/* ── Row 2: Mission (wide) | Announcements ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"3fr 2fr",
          gap:"1.25rem",
          alignItems:"stretch",
        }}>
          <div className="animate-slide-up" style={{animationDelay:"0.2s"}}>
            <MissionCard />
          </div>
          <div className="animate-slide-up" style={{animationDelay:"0.25s"}}>
            <AnnouncementsCard />
          </div>
        </div>

        {/* ── Footer stamp ── */}
        <div style={{
          textAlign:"center",marginTop:"2.5rem",paddingTop:"1.5rem",
          borderTop:"1px solid var(--border-light)",
        }}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",letterSpacing:"2px"}}>
            VICEVERSE IDEATHON · TEAM LEADER PORTAL · IVC CLUB VVCE
          </span>
        </div>

      </div>
    </main>
  );
}