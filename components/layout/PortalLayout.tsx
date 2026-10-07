"use client";
import React, { useState, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { usePortal } from "@/context/PortalContext";
import {
  LayoutDashboard, Users, CreditCard, User, FolderOpen,
  Trophy, Menu, X, LogOut, ChevronRight, Target, Upload, CheckCircle
} from "lucide-react";
import AdminControlPanel from "./AdminControlPanel";

const navItems = [
  { path:"/dashboard", name:"COMMAND DECK",    icon:LayoutDashboard, code:"01", badge:"ACTIVE",  badgeColor:"var(--cyan)"    },
  { path:"/team",      name:"SQUAD ROSTER",    icon:Users,           code:"02", badge:"MANAGE",  badgeColor:"var(--primary)" },
  { path:"/domain",    name:"DOMAIN SELECT",   icon:Target,          code:"03", badge:"MISSION", badgeColor:"var(--pink)"    },
  { path:"/submit",    name:"TEAM SUBMIT",     icon:Upload,          code:"04", badge:"SUBMIT",  badgeColor:"#00ff88"       },
  { path:"/payment",   name:"PAYMENT PROOF",   icon:CreditCard,      code:"05", badge:"PENDING", badgeColor:"var(--pink)"    },
  { path:"/confirmed", name:"EVENT & TEAM QR", icon:CheckCircle,     code:"06", badge:"READY",   badgeColor:"#00ff88"       },
  { path:"/spoc",      name:"SPOC DETAILS",    icon:User,            code:"07", badge:"INFO",    badgeColor:"var(--cyan)"    },
  { path:"/project",   name:"PROJECT DATA",    icon:FolderOpen,      code:"08", badge:"FINAL",   badgeColor:"var(--pink)"    },
  { path:"/results",   name:"RESULTS & SCORE", icon:Trophy,          code:"09", badge:"VIEW",    badgeColor:"var(--primary)" },
];

// ─── ISOLATED CLOCK WIDGET (Eliminates full-layout 1s re-renders) ──────────────
const ClockWidget = memo(function ClockWidget() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
});

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authUser, logout } = usePortal();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); router.replace("/login"); };

  const Nav = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Brand */}
      <div style={{ padding:"1.25rem 1rem", borderBottom:"1px solid rgba(253,191,21,0.12)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.75rem" }}>
          <Image src="/ivc_logo.png" alt="IVC" width={34} height={34} style={{ objectFit:"contain" }} priority />
          <div>
            <div style={{ fontFamily:"var(--font-heading)", fontSize:"0.75rem", color:"var(--primary)", letterSpacing:"2px" }}>TEAM LEADER</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"var(--text-muted)", letterSpacing:"1px" }}>PORTAL // VICEVERSE</div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"0.6rem" }}>
          <Image src="/viceverse_logo.png" alt="ViceVerse" width={72} height={72} style={{ objectFit:"contain" }} priority />
        </div>
        {authUser && (
          <div style={{ padding:"0.5rem 0.6rem", background:"var(--primary-dim)", border:"1px solid rgba(253,191,21,0.18)" }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"var(--text-muted)", letterSpacing:"1px" }}>OPERATIVE</div>
            <div style={{ fontFamily:"var(--font-heading)", fontSize:"0.8rem", color:"var(--primary)", marginTop:"0.15rem" }}>{authUser.teamName}</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"var(--text-muted)" }}>{authUser.id}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"0.75rem 0", overflowY:"auto" }}>
        <div style={{ padding:"0 0.75rem 0.4rem", fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"rgba(255,255,255,0.18)", letterSpacing:"2px" }}>
          // TACTICAL WORKFLOW
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === "/dashboard" && pathname === "/");
          return (
            <Link key={item.path} href={item.path} className={`vv-nav-item ${isActive ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:isActive?"var(--primary)":"rgba(255,255,255,0.18)", minWidth:"18px" }}>{item.code}</span>
              <Icon size={13} style={{ color:isActive?"var(--primary)":"rgba(255,255,255,0.35)", flexShrink:0 }} />
              <span style={{ flex:1 }}>{item.name}</span>
              {isActive && <ChevronRight size={11} style={{ color:"var(--primary)" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div style={{ padding:"0.75rem 1rem", borderTop:"1px solid rgba(253,191,21,0.1)" }}>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"var(--text-muted)", letterSpacing:"1px" }}>
          <span style={{ color:"var(--cyan)" }}>&#9679;</span>&#160; GRID ONLINE &middot; <ClockWidget />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg-deep)" }}>
      {/* Desktop sidebar */}
      <aside style={{ width:"230px", flexShrink:0, background:"#0F0F0F", borderRight:"1px solid rgba(253,191,21,0.12)", display:"flex", flexDirection:"column" }} className="hidden lg:flex">
        <Nav />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)" }} />
      )}

      {/* Mobile sidebar */}
      <aside style={{ position:"fixed", left:0, top:0, bottom:0, zIndex:50, width:"230px", background:"#0F0F0F", borderRight:"1px solid rgba(253,191,21,0.12)", display:"flex", flexDirection:"column", transform:mobileOpen?"translateX(0)":"translateX(-100%)", transition:"transform 0.25s cubic-bezier(0.16,1,0.3,1)", willChange:"transform" }} className="lg:hidden">
        <Nav />
      </aside>

      {/* Main Container */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* TOP HEADER WITH EASILY ACCESSIBLE LOGOUT BUTTON */}
        <header style={{ height:"54px", flexShrink:0, background:"rgba(11,11,11,0.96)", borderBottom:"1px solid rgba(253,191,21,0.12)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 1.25rem", position:"sticky", top:0, zIndex:30 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <button onClick={() => setMobileOpen((o)=>!o)} style={{ background:"none", border:"none", color:"var(--primary)", cursor:"pointer", padding:"0.25rem" }} className="lg:hidden" aria-label="Toggle Navigation Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="lg:hidden" style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <Image src="/viceverse_logo.png" alt="ViceVerse" width={28} height={28} style={{ objectFit:"contain" }} priority />
              <span style={{ fontFamily:"var(--font-heading)", fontSize:"0.7rem", color:"var(--primary)", letterSpacing:"2px" }}>TEAM LEADER PORTAL</span>
            </div>
            <div className="hidden lg:flex" style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"var(--text-muted)", letterSpacing:"1px" }}>
              <span style={{ color:"var(--cyan)" }}>&#9632;</span>&#160; <ClockWidget /> &nbsp;&middot;&nbsp; GRID: ONLINE
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:"0.85rem" }}>
            {authUser && (
              <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.25rem 0.6rem", border:"1px solid rgba(253,191,21,0.18)", background:"rgba(253,191,21,0.05)" }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"var(--primary)", boxShadow:"0 0 6px var(--primary)" }} />
                <span style={{ fontFamily:"var(--font-heading)", fontSize: "0.65rem", color:"var(--primary)", letterSpacing:"1px" }}>{authUser.teamName}</span>
              </div>
            )}

            {/* HIGHLY ACCESSIBLE TOP-RIGHT LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              id="top-header-logout-btn"
              style={{
                display:"flex",
                alignItems:"center",
                gap:"0.4rem",
                padding:"0.3rem 0.75rem",
                background:"rgba(233,30,140,0.12)",
                border:"1px solid var(--pink)",
                color:"var(--pink)",
                fontFamily:"var(--font-heading)",
                fontSize:"0.7rem",
                letterSpacing:"1px",
                cursor:"pointer",
                transition:"all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--pink)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(233,30,140,0.12)";
                e.currentTarget.style.color = "var(--pink)";
              }}
            >
              <LogOut size={13} />
              <span>LOGOUT</span>
            </button>
          </div>
        </header>

        <main style={{ flex:1, padding:"2rem 1.5rem", maxWidth:"1200px", width:"100%", margin:"0 auto" }}>
          {children}
        </main>
      </div>

      {/* Admin Simulator Floating Controls */}
      <AdminControlPanel />
    </div>
  );
}