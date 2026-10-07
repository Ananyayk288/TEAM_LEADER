// lib/services/domainService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Service layer for Domain Selection.
// Enforces EXACTLY 3 members required for team completion.
// Instant non-blocking execution without artificial delays.
// ─────────────────────────────────────────────────────────────────────────────

import { getWorkflowState, updateWorkflowState } from "./workflowService";

export interface Domain {
  id: string;
  name: string;
  shortCode: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  accentColor: string;
  glowColor: string;
  available: boolean;
  tags: string[];
}

export interface TeamStatus {
  teamId: string;
  teamName: string;
  memberCount: number;
  requiredMembers: number;
  isComplete: boolean;
  isSubmitted: boolean;
  selectedDomainId: string | null;
}

export interface SubmitResult {
  success: boolean;
  message: string;
  registrationId?: string;
}

const MOCK_DOMAINS: Domain[] = [
  {
    id: "agentic-ai",
    name: "AGENTIC AI",
    shortCode: "AAI",
    description: "Build autonomous intelligent systems that perceive, decide, and act.",
    longDescription: "Design and develop AI agents capable of autonomous decision-making, multi-step reasoning, and goal-directed action. Solutions may involve LLM-based agents, multi-agent frameworks, reinforcement learning, or planning systems applied to real-world problems.",
    icon: "🤖",
    image: "/domains/agentic-ai.jpg",
    accentColor: "#E91E8C",
    glowColor: "rgba(233,30,140,0.5)",
    available: true,
    tags: ["AI", "Agents", "LLM", "Autonomy"],
  },
  {
    id: "cyber-security",
    name: "CYBER SECURITY",
    shortCode: "SEC",
    description: "Defend digital infrastructure with next-generation security architectures.",
    longDescription: "Develop innovative solutions to protect systems, networks, and data from cyber threats. Areas include threat detection, zero-trust frameworks, cryptographic protocols, vulnerability analysis, and privacy-preserving technologies in modern infrastructure.",
    icon: "🛡️",
    image: "/domains/cyber-security.jpg",
    accentColor: "#00D4FF",
    glowColor: "rgba(0,212,255,0.5)",
    available: true,
    tags: ["Security", "Cryptography", "Zero-Trust", "Threat Detection"],
  },
  {
    id: "computer-vision",
    name: "COMPUTER VISION",
    shortCode: "CV",
    description: "Teach machines to see, understand, and interpret visual information.",
    longDescription: "Create solutions leveraging visual AI — from real-time object detection and scene understanding to medical imaging, autonomous navigation, and industrial inspection. Combine deep learning with practical computer vision pipelines.",
    icon: "👁️",
    image: "/domains/computer-vision.jpg",
    accentColor: "#FDBF15",
    glowColor: "rgba(253,191,21,0.5)",
    available: true,
    tags: ["Vision", "Deep Learning", "Detection", "Imaging"],
  },
  {
    id: "robotics-drones",
    name: "ROBOTICS & DRONES",
    shortCode: "RD",
    description: "Engineer physical intelligence — machines that move, fly, and interact.",
    longDescription: "Build robotic systems or drone platforms that operate autonomously or collaboratively. Topics include motion planning, SLAM, swarm intelligence, human-robot interaction, aerial robotics, and real-time embedded control for physical systems.",
    icon: "🚁",
    image: "/domains/robotics-drones.jpg",
    accentColor: "#E91E8C",
    glowColor: "rgba(233,30,140,0.5)",
    available: true,
    tags: ["Robotics", "Drones", "Autonomy", "Swarm"],
  },
  {
    id: "embedded-cognitive-tech",
    name: "EMBEDDED & COGNITIVE TECH",
    shortCode: "ECT",
    description: "Bring intelligence to the edge — smart hardware that thinks in real time.",
    longDescription: "Design cognitive systems that run on constrained hardware. Combine embedded systems, microcontrollers, FPGAs, and edge AI to create intelligent devices. Focus on real-time processing, low-power AI inference, and sensor fusion for smart applications.",
    icon: "⚡",
    image: "/domains/embedded-tech.jpg",
    accentColor: "#00D4FF",
    glowColor: "rgba(0,212,255,0.5)",
    available: true,
    tags: ["Embedded", "Edge AI", "FPGA", "IoT"],
  },
  {
    id: "vlsi-systems",
    name: "VLSI SYSTEMS",
    shortCode: "VLSI",
    description: "Design the silicon that powers the future — from gate to chip.",
    longDescription: "Explore VLSI design, digital circuit architecture, and semiconductor systems. Create optimized RTL designs, custom processor units, memory architectures, or mixed-signal circuits. Focus on power efficiency, performance, and area optimization.",
    icon: "🔬",
    image: "/domains/vlsi-systems.jpg",
    accentColor: "#FDBF15",
    glowColor: "rgba(253,191,21,0.5)",
    available: true,
    tags: ["VLSI", "RTL", "Silicon", "Digital Design"],
  },
];

// ─── SERVICE FUNCTIONS ───────────────────────────────────────────────────────

export async function getAvailableDomains(): Promise<Domain[]> {
  return MOCK_DOMAINS.filter(d => d.available);
}

export async function getTeamStatus(teamId?: string): Promise<TeamStatus> {
  const wf = getWorkflowState();
  const membersCount = wf.members.length;
  const isComplete = membersCount === 3;

  let selectedDomainId: string | null = wf.selectedDomainId;
  let isSubmitted = wf.teamSubmitted;

  try {
    const stored = localStorage.getItem("vv_domain_selection");
    if (stored) {
      const parsed = JSON.parse(stored);
      selectedDomainId = parsed.domainId ?? selectedDomainId;
      isSubmitted = parsed.submitted ?? isSubmitted;
    }
  } catch { /* ignore */ }

  return {
    teamId: teamId ?? wf.teamId,
    teamName: wf.teamName,
    memberCount: membersCount,
    requiredMembers: 3,
    isComplete,
    isSubmitted,
    selectedDomainId,
  };
}

export async function selectDomain(teamId: string, domainId: string): Promise<{ success: boolean; message?: string }> {
  const wf = getWorkflowState();
  if (wf.members.length !== 3) {
    return { success: false, message: "Team must have exactly 3 members before selecting a domain." };
  }

  const domain = getDomainById(domainId);
  updateWorkflowState((prev) => ({
    ...prev,
    selectedDomainId: domainId,
    selectedDomainName: domain?.name ?? domainId,
  }));

  try {
    localStorage.setItem("vv_domain_selection", JSON.stringify({ domainId, submitted: false }));
  } catch { /* ignore */ }

  return { success: true };
}

export async function submitTeam(teamId: string, domainId: string): Promise<SubmitResult> {
  const wf = getWorkflowState();
  if (wf.members.length !== 3) {
    return { success: false, message: "Cannot submit: Team must have exactly 3 members." };
  }

  const domain = getDomainById(domainId);
  updateWorkflowState((prev) => ({
    ...prev,
    selectedDomainId: domainId,
    selectedDomainName: domain?.name ?? domainId,
    teamSubmitted: true,
  }));

  try {
    localStorage.setItem("vv_domain_selection", JSON.stringify({ domainId, submitted: true }));
  } catch { /* ignore */ }

  return {
    success: true,
    message: "REGISTRATION COMPLETE",
    registrationId: "REG-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  };
}

export function getDomainById(id: string): Domain | undefined {
  return MOCK_DOMAINS.find(d => d.id === id);
}