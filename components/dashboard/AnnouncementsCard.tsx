"use client";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mockData";

const PRIORITY_COLOR: Record<string,string> = {
  HIGH:   "var(--pink)",
  NORMAL: "var(--cyan)",
  LOW:    "var(--text-muted)",
};

export default function AnnouncementsCard() {
  return (
    <div className="vv-card vv-corners" style={{padding:"1.5rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
        <h2 style={{fontFamily:"var(--font-heading)",fontSize:"1.1rem",color:"var(--cyan)",letterSpacing:"1px"}}>INTEL FEED</h2>
        <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--text-muted)",border:"1px solid var(--border-light)",padding:"0.15rem 0.5rem"}}>
          {MOCK_ANNOUNCEMENTS.length} SIGNALS
        </span>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"0.8rem"}}>
        {MOCK_ANNOUNCEMENTS.map((a) => {
          const pc = PRIORITY_COLOR[a.priority];
          return (
            <div key={a.id} style={{
              display:"flex",gap:"1rem",padding:"0.9rem",
              background:"rgba(255,255,255,0.025)",
              border:"1px solid rgba(255,255,255,0.06)",
              borderLeft:`3px solid ${pc}`,
              transition:"var(--transition)",cursor:"default",
            }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.05)"}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.025)"}>
              <div style={{
                fontFamily:"var(--font-heading)",fontSize:"1.3rem",color:pc,
                opacity:0.5,lineHeight:1,flexShrink:0,minWidth:"34px",whiteSpace:"nowrap",textAlign:"center",
              }}>{a.code}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"var(--font-heading)",fontSize:"0.82rem",color:"var(--text-main)",marginBottom:"0.25rem",letterSpacing:"0.5px"}}>
                  {a.title}
                </div>
                <div style={{fontFamily:"var(--font-body)",fontSize:"0.8rem",color:"var(--text-dim)",lineHeight:1.5}}>
                  {a.body}
                </div>
                <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--text-muted)",marginTop:"0.4rem"}}>
                  {a.timestamp} &nbsp;·&nbsp;
                  <span style={{color:pc}}>{a.priority}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}