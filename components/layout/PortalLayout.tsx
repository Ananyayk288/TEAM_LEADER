"use client";
import React, { useState, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { usePortal } from "@/context/PortalContext";
import {
  LayoutDashboard, Users, CreditCard, User, FolderOpen,
  Trophy, LogOut, ChevronRight, CheckCircle
} from "lucide-react";
import AdminControlPanel from "./AdminControlPanel";

const navItems = [
  { path:"/dashboard", name:"DASHBOARD",       icon:LayoutDashboard, code:"01", badge:"ACTIVE",  badgeColor:"var(--cyan)"    },
  { path:"/team",      name:"TEAM INFO",       icon:Users,           code:"02", badge:"ROSTER",  badgeColor:"var(--primary)" },
  { path:"/payment",   name:"PAYMENT",         icon:CreditCard,      code:"03", badge:"PAY",     badgeColor:"var(--pink)"    },
  { path:"/confirmed", name:"EVENT & TEAM QR", icon:CheckCircle,     code:"04", badge:"READY",   badgeColor:"#00ff88"       },
  { path:"/spoc",      name:"SPOC DETAILS",    icon:User,            code:"05", badge:"INFO",    badgeColor:"var(--cyan)"    },
  { path:"/project",   name:"PROJECT DATA",    icon:FolderOpen,      code:"06", badge:"FINAL",   badgeColor:"var(--pink)"    },
  { path:"/results",   name:"RESULTS & SCORE", icon:Trophy,          code:"07", badge:"VIEW",    badgeColor:"var(--primary)" },
];

// ─── ISOLATED CLOCK WIDGET ──────────────────────────────────────────────────
const ClockWidget = memo(function ClockWidget() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  useEffect(() => {
    setMounted(true);
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{mounted ? time : ""}</span>;
});

// ─── TOP-LEVEL NAV CONTENT COMPONENT ─────────────────────────────────────────
interface NavContentProps {
  pathname: string;
  authUser: ReturnType<typeof usePortal>["authUser"];
  onNavigate?: () => void;
  onLogout?: () => void;
}

function NavContent({ pathname, authUser, onNavigate, onLogout }: NavContentProps) {
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", width:"100%" }}>
      {/* Brand Header */}
      <div style={{ padding:"1.25rem 1rem", borderBottom:"1px solid var(--border-blue)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.85rem" }}>
          <Image src="/ivc_logo.png" alt="IVC" width={44} height={44} style={{ objectFit:"contain", flexShrink:0 }} priority />
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:"var(--font-heading)", fontSize:"0.85rem", color:"var(--primary)", letterSpacing:"2px", fontWeight:700 }}>TEAM LEADER</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize: "0.75rem", color:"var(--text-muted)", letterSpacing:"1px" }}>PORTAL // VICEVERSE</div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", padding:"0.4rem 0 0.8rem" }}>
          <Image src="/viceverse_logo.png" alt="ViceVerse" width={130} height={40} style={{ width:"130px", height:"auto", objectFit:"contain" }} priority />
        </div>
        {authUser && (
          <div style={{ padding:"0.6rem 0.75rem", background:"var(--primary-dim)", border:"1px solid var(--border-yellow)", borderRadius:"4px" }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.7rem", color:"var(--text-muted)", letterSpacing:"1px" }}>OPERATIVE</div>
            <div style={{ fontFamily:"var(--font-heading)", fontSize:"0.88rem", color:"var(--primary)", marginTop:"0.15rem", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{authUser.teamName}</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.7rem", color:"var(--text-muted)" }}>{authUser.id}</div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav style={{ flex:1, padding:"0.85rem 0", overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
        <div style={{ padding:"0 0.85rem 0.5rem", fontFamily:"var(--font-mono)", fontSize:"0.7rem", color:"var(--text-muted)", letterSpacing:"1.5px" }}>
          // COMMAND NAVIGATION
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === "/dashboard" && pathname === "/");
          return (
            <Link key={item.path} href={item.path} className={`vv-nav-item ${isActive ? "active" : ""}`} onClick={onNavigate}>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.75rem", color:isActive?"var(--primary)":"var(--text-muted)", minWidth:"22px", whiteSpace:"nowrap" }}>{item.code}</span>
              <Icon size={16} style={{ color:isActive?"var(--primary)":"var(--text-muted)", flexShrink:0 }} />
              <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</span>
              {isActive && <ChevronRight size={14} style={{ color:"var(--primary)", flexShrink:0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Mobile Logout */}
      <div style={{ padding:"0.85rem 1rem", borderTop:"1px solid var(--border-blue)", flexShrink:0, display:"flex", flexDirection:"column", gap:"0.75rem" }}>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.7rem", color:"var(--text-muted)", letterSpacing:"1px" }}>
          <span style={{ color:"var(--cyan)" }}>&#9679;</span>&#160; GRID ONLINE &middot; <ClockWidget />
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              gap:"0.5rem",
              width:"100%",
              minHeight:"44px",
              padding:"0.6rem",
              background:"var(--primary)",
              border:"none",
              borderRadius:"4px",
              color:"#fff",
              fontFamily:"var(--font-heading)",
              fontSize:"0.8rem",
              letterSpacing:"1px",
              fontWeight:700,
              cursor:"pointer",
            }}
          >
            <LogOut size={15} />
            <span>LOGOUT PORTAL</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authUser, logout } = usePortal();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div style={{ display:"flex", minHeight:"100dvh", width:"100%", background:"var(--bg-deep)", overflowX:"hidden" }}>
      {/* Desktop Sidebar (>=1024px) */}
      <aside style={{ width:"240px", flexShrink:0, background:"var(--bg-secondary)", borderRight:"1px solid var(--border-blue)", display:"flex", flexDirection:"column" }} className="hidden lg:flex">
        <NavContent pathname={pathname} authUser={authUser} onLogout={handleLogout} />
      </aside>

      {/* Main Container */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, width:"100%" }}>
        {/* Sticky Top Navigation Header */}
        <header 
          style={{ 
            height:"58px", 
            flexShrink:0, 
            background:"#070B14", 
            borderBottom:"1px solid var(--border-blue)", 
            display:"flex", 
            alignItems:"center", 
            justifyContent:"space-between",
            padding:"0 1rem", 
            position:"sticky", 
            top:0, 
            zIndex:30,
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:"0.65rem", minWidth:0 }}>
            <div className="lg:hidden" style={{ display:"flex", alignItems:"center", gap:"0.4rem", minWidth:0 }}>
              <Image src="/viceverse_logo.png" alt="ViceVerse" width={28} height={28} style={{ objectFit:"contain", flexShrink:0 }} priority />
              <span style={{ fontFamily:"var(--font-heading)", fontSize:"0.75rem", color:"var(--primary)", letterSpacing:"1.5px", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                TEAM LEADER PORTAL
              </span>
            </div>

            <div className="hidden lg:flex" style={{ fontFamily:"var(--font-mono)", fontSize:"0.75rem", color:"var(--text-muted)", letterSpacing:"1px" }}>
              <span style={{ color:"var(--cyan)" }}>&#9632;</span>&#160; <ClockWidget /> &nbsp;&middot;&nbsp; GRID: ONLINE
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:"0.65rem", flexShrink:0 }}>
            {authUser && (
              <div className="hidden sm:flex" style={{ alignItems:"center", gap:"0.4rem", padding:"0.3rem 0.65rem", border:"1px solid var(--border-blue)", background:"var(--bg-elevated)", borderRadius:"4px" }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"var(--cyan)", boxShadow:"0 0 6px var(--cyan)" }} />
                <span style={{ fontFamily:"var(--font-heading)", fontSize: "0.75rem", color:"var(--text-main)", letterSpacing:"1px", fontWeight:600 }}>{authUser.teamName}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              id="top-header-logout-btn"
              style={{
                display:"flex",
                alignItems:"center",
                gap:"0.35rem",
                padding:"0.4rem 0.85rem",
                minHeight:"38px",
                background:"var(--primary)",
                border:"none",
                borderRadius:"4px",
                color:"#fff",
                fontFamily:"var(--font-heading)",
                fontSize:"0.78rem",
                letterSpacing:"1px",
                fontWeight:700,
                cursor:"pointer",
                transition:"all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--pink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
              }}
            >
              <LogOut size={14} />
              <span>LOGOUT</span>
            </button>
          </div>
        </header>

        {/* Horizontal Navigation Bar for mobile/tablet screens */}
        <div 
          className="lg:hidden" 
          style={{ 
            background: "#0D131F", 
            borderBottom: "1px solid var(--border-blue)", 
            overflowX: "auto", 
            display: "flex", 
            alignItems: "center", 
            padding: "0.5rem 0.75rem", 
            gap: "0.5rem",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path === "/dashboard" && pathname === "/");
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 0.75rem",
                  background: isActive ? "rgba(253,191,21,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "var(--primary)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "4px",
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.72rem",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  flexShrink: 0,
                  minHeight: "36px",
                }}
              >
                <Icon size={14} style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <main className="vv-main-container" style={{ flex:1, width:"100%" }}>
          {children}
        </main>
      </div>

      {/* Admin Simulator Floating Controls */}
      <AdminControlPanel />
    </div>
  );
}