"use client";
import HeroSection      from "@/components/dashboard/HeroSection";
import SquadCard        from "@/components/dashboard/SquadCard";
import StatusCard       from "@/components/dashboard/StatusCard";
import MissionCard      from "@/components/dashboard/MissionCard";
import SubmissionCard   from "@/components/dashboard/SubmissionCard";
import AnnouncementsCard from "@/components/dashboard/AnnouncementsCard";

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

      <div className="vv-main-container" style={{position:"relative",zIndex:1}}>

        {/* ── Hero ── */}
        <div className="animate-slide-up" style={{marginBottom:"1.5rem"}}>
          <HeroSection />
        </div>



        {/* ── Row 1: Squad | Status | Submission (3 cols) ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(min(290px, 100%), 1fr))",
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
          gridTemplateColumns:"repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
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
          <span style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"#9AA8C0",letterSpacing:"2px"}}>
            VICEVERSE IDEATHON · TEAM LEADER PORTAL · IVC CLUB VVCE
          </span>
        </div>

      </div>
    </main>
  );
}