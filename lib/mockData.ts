// lib/mockData.ts  –  single source of truth for mock data

export type MissionStatus   = "ACTIVE" | "PENDING" | "COMPLETED" | "LOCKED";
export type SubmissionStatus = "NOT_SUBMITTED" | "SUBMITTED" | "UNDER_REVIEW" | "EVALUATED";

export interface TeamMember  { id:string; name:string; role:string; branch:string; isLeader?:boolean; initials:string; accentColor:string; }
export interface TeamData    { teamName:string; teamId:string; category:string; college:string; memberCount:number; maxMembers:number; members:TeamMember[]; }
export interface MissionData { missionName:string; category:string; description:string; status:MissionStatus; roundNumber:number; deadline:string; }
export interface ProgressData{ overallPercent:number; stages:{label:string;complete:boolean;active:boolean}[]; }
export interface SubmissionData{ status:SubmissionStatus; deadline:string; submittedAt?:string; fileName?:string; }
export interface Announcement  { id:string; code:string; title:string; body:string; timestamp:string; priority:"HIGH"|"NORMAL"|"LOW"; }

export const MOCK_TEAM: TeamData = {
  teamName:"NEXUS", teamId:"VV-024", category:"Cyber Security", college:"VVCE, Mysuru",
  memberCount:2, maxMembers:2,
  members:[
    {id:"m1",name:"Ananya Y K",  role:"Team Leader",branch:"CSE",isLeader:true, initials:"AY",accentColor:"var(--primary)"},
    {id:"m2",name:"Alex D Souza",role:"Member",      branch:"ISE",isLeader:false,initials:"AD",accentColor:"var(--cyan)"},
  ],
};

export const MOCK_MISSION: MissionData = {
  missionName:"SMART CITY SECURITY", category:"Cyber Security",
  description:"Design an AI-powered threat detection framework for smart-city infrastructure. Include real-time anomaly detection, zero-trust architecture, and privacy-preserving data sharing.",
  status:"ACTIVE", roundNumber:1, deadline:"November 2, 2026 — 11:59 PM",
};

export const MOCK_PROGRESS: ProgressData = {
  overallPercent:45,
  stages:[
    {label:"REGISTRATION",    complete:true, active:false},
    {label:"TEAM LOCK",       complete:true, active:false},
    {label:"IDEATION",        complete:false,active:true },
    {label:"PROTOTYPE",       complete:false,active:false},
    {label:"FINAL SUBMISSION",complete:false,active:false},
  ],
};

export const MOCK_SUBMISSION: SubmissionData = {
  status:"NOT_SUBMITTED", deadline:"November 2, 2026 — 11:59 PM",
};

export interface SpocData {
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  officeLocation?: string;
  status?: string;
}

export const MOCK_SPOC: SpocData = {
  name: "Dr. Elena Rostova",
  designation: "Chief Technical Mentor & Systems Security Architect",
  department: "Department of Computer Science & Engineering // IVC Club",
  email: "elena.rostova@vvce.ac.in",
  phone: "+91 98765 01928",
  officeLocation: "Lab Node 04 // VVCE Campus",
  status: "ONLINE // AVAILABLE",
};

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {id:"a1",code:"01",title:"ROUND 1 IS NOW ACTIVE",          body:"All teams should begin working on their assigned mission.",                            timestamp:"Oct 04, 2026",priority:"HIGH"  },
  {id:"a2",code:"02",title:"MENTOR SESSIONS OPEN",            body:"Book a 20-min slot with your assigned mentor via the Intel Contact section.",         timestamp:"Oct 04, 2026",priority:"NORMAL"},
  {id:"a3",code:"03",title:"SUBMISSION PORTAL OPENS NOV 01", body:"The final submission portal opens on November 1 at 9:00 AM.",                          timestamp:"Nov 01, 2026",priority:"NORMAL"},
  {id:"a4",code:"04",title:"VENUE: VVCE SPORTS COMPLEX",     body:"Final presentations will be held at VVCE Sports Complex, Gokulam 3rd Stage, Mysuru.",  timestamp:"Oct 02, 2026",priority:"LOW"  },
];