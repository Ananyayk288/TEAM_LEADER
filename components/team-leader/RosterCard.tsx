"use client";

import React, { useState } from "react";
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  UserPlus,
  Fingerprint,
  Radio,
  CheckCircle,
  XCircle,
  AlertCircle,
  Terminal,
  Activity,
  Trash2,
  Scan,
} from "lucide-react";
import {
  TeamMember,
  TeamMemberSchema,
  OperativeRole,
  OperativeRoleSchema,
} from "@/lib/validations/team";

interface RosterCardProps {
  members: TeamMember[];
  isLocked: boolean;
  onToggleLock: () => void;
  onAddMember: (member: TeamMember) => void;
  onRemoveMember: (id: string) => void;
  onToggleVerification: (id: string) => void;
  maxCapacity?: number;
}

export default function RosterCard({
  members,
  isLocked,
  onToggleLock,
  onAddMember,
  onRemoveMember,
  onToggleVerification,
  maxCapacity = 6,
}: RosterCardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [scanningId, setScanningId] = useState<string | null>(null);

  // Form State for new operative
  const [formName, setFormName] = useState("");
  const [formCallsign, setFormCallsign] = useState("");
  const [formRole, setFormRole] = useState<OperativeRole>("NETRUNNER");
  const [formEmail, setFormEmail] = useState("");
  const [formClearance, setFormClearance] = useState<number>(3);
  const [formFrequency, setFormFrequency] = useState("142.4 MHz");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const verifiedCount = members.filter((m) => m.biometricVerified).length;
  const readinessPercent = Math.round((verifiedCount / Math.max(members.length, 1)) * 100);

  const filteredMembers = members.filter((m) => {
    if (filterRole === "ALL") return true;
    return m.role === filterRole;
  });

  const handleSimulateScan = (id: string) => {
    if (isLocked) return;
    setScanningId(id);
    setTimeout(() => {
      onToggleVerification(id);
      setScanningId(null);
    }, 1000);
  };

  const handleCreateOperative = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const newCandidate = {
      id: `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formName.trim(),
      callsign: formCallsign.trim().toUpperCase(),
      role: formRole,
      clearanceLevel: Number(formClearance),
      email: formEmail.trim(),
      commsFrequency: formFrequency.trim(),
      status: "ACTIVE" as const,
      ed25519KeyFingerprint: `0x${Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`,
      biometricVerified: true,
    };

    // Zod validation
    const result = TeamMemberSchema.safeParse(newCandidate);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errMap[path] = issue.message;
      });
      setValidationErrors(errMap);
      return;
    }

    onAddMember(result.data);
    setShowAddModal(false);
    // Reset fields
    setFormName("");
    setFormCallsign("");
    setFormEmail("");
    setFormClearance(3);
    setValidationErrors({});
  };

  const getRoleBadgeStyle = (role: OperativeRole) => {
    switch (role) {
      case "COMMANDER":
        return "border-cyber-neon-green text-cyber-neon-green bg-cyber-neon-green/10";
      case "NETRUNNER":
        return "border-cyber-neon-cyan text-cyber-neon-cyan bg-cyber-neon-cyan/10";
      case "INFILTRATOR":
        return "border-purple-400 text-purple-400 bg-purple-400/10";
      case "TECH_SPECIALIST":
        return "border-cyber-neon-amber text-cyber-neon-amber bg-cyber-neon-amber/10";
      case "CYBER_ANALYST":
        return "border-blue-400 text-blue-400 bg-blue-400/10";
      case "COMBAT_MEDIC":
        return "border-cyber-neon-red text-cyber-neon-red bg-cyber-neon-red/10";
      default:
        return "border-cyber-border text-cyber-pale bg-cyber-surface";
    }
  };

  return (
    <div className="relative rounded-lg border border-cyber-border bg-cyber-card/90 p-5 shadow-hud-card backdrop-blur-md hud-corner">
      {/* Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyber-border pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyber-neon-cyan" />
            <h2 className="font-mono text-sm uppercase tracking-wider text-cyber-pale font-bold flex items-center gap-2">
              Tactical Operative Roster
              <span className="text-[11px] font-normal text-cyber-muted">
                [{members.length}/{maxCapacity} SLOTS]
              </span>
            </h2>
          </div>
          <p className="font-mono text-[11px] text-cyber-muted mt-0.5">
            Real-time telemetry, biometric integrity, and role deployment
          </p>
        </div>

        {/* Lock State Toggle & Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleLock}
            className={`font-mono text-xs uppercase px-3 py-1.5 rounded border transition-all flex items-center gap-1.5 font-bold ${
              isLocked
                ? "border-cyber-neon-red text-cyber-neon-red bg-cyber-neon-red/10 hover:bg-cyber-neon-red/20 shadow-neon-red"
                : "border-cyber-neon-green text-cyber-neon-green bg-cyber-neon-green/10 hover:bg-cyber-neon-green/20 shadow-neon-green"
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" /> ROSTER SEALED
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" /> ROSTER UNLOCKED
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            disabled={isLocked || members.length >= maxCapacity}
            className="cyber-btn flex items-center gap-1.5 px-3 py-1.5 bg-cyber-neon-cyan text-cyber-bg font-mono font-bold text-xs uppercase tracking-wider rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyber-pale hover:shadow-neon-cyan transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Deploy Operative
          </button>
        </div>
      </div>

      {/* Squad Readiness Metric Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 bg-cyber-surface/70 rounded border border-cyber-border font-mono text-xs">
        <div>
          <span className="text-[10px] text-cyber-muted uppercase tracking-wider block">
            Biometric Sync Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
              <div
                className="h-full bg-gradient-to-r from-cyber-neon-cyan to-cyber-neon-green transition-all duration-500"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <span className="font-bold text-cyber-neon-green text-xs">
              {readinessPercent}%
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-cyber-muted uppercase tracking-wider block">
            Verified Operatives
          </span>
          <span className="text-cyber-pale font-bold mt-1 block">
            {verifiedCount} of {members.length} Clear for Deployment
          </span>
        </div>

        <div>
          <span className="text-[10px] text-cyber-muted uppercase tracking-wider block">
            Security Status
          </span>
          <span
            className={`font-bold mt-1 block ${
              isLocked ? "text-cyber-neon-green" : "text-cyber-neon-amber"
            }`}
          >
            {isLocked ? "SEALED // ENCRYPTED" : "MODIFIABLE // OPEN"}
          </span>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 font-mono text-[11px]">
        {["ALL", "COMMANDER", "NETRUNNER", "INFILTRATOR", "TECH_SPECIALIST", "CYBER_ANALYST", "COMBAT_MEDIC"].map(
          (role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap border ${
                filterRole === role
                  ? "bg-cyber-neon-cyan/20 border-cyber-neon-cyan text-cyber-neon-cyan font-bold"
                  : "bg-cyber-surface/60 border-cyber-border text-cyber-muted hover:text-cyber-pale"
              }`}
            >
              {role}
            </button>
          )
        )}
      </div>

      {/* Operative Cards List */}
      <div className="space-y-2.5">
        {filteredMembers.map((member) => {
          const isScanning = scanningId === member.id;

          return (
            <div
              key={member.id}
              className="group relative p-3.5 bg-cyber-surface/80 rounded border border-cyber-border hover:border-cyber-neon-cyan/60 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Operative Header Info */}
                <div className="flex items-start gap-3">
                  <div className="relative mt-0.5">
                    <div className="w-10 h-10 rounded border border-cyber-border bg-cyber-bg flex items-center justify-center font-mono font-bold text-cyber-neon-cyan text-sm">
                      {member.callsign.substring(0, 2)}
                    </div>
                    {member.biometricVerified ? (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyber-neon-green border-2 border-cyber-bg flex items-center justify-center text-[8px] text-cyber-bg font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyber-neon-red border-2 border-cyber-bg animate-pulse" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono font-bold text-cyber-pale text-sm">
                        {member.name}
                      </h4>
                      <span className="font-mono text-xs text-cyber-neon-cyan font-semibold">
                        "{member.callsign}"
                      </span>
                      <span
                        className={`font-mono text-[9px] px-2 py-0.2 rounded border uppercase font-bold ${getRoleBadgeStyle(
                          member.role
                        )}`}
                      >
                        {member.role.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1 font-mono text-[11px] text-cyber-muted">
                      <span>ID: {member.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-cyber-pale/70" />
                        {member.commsFrequency || "142.0 MHz"}
                      </span>
                      <span>•</span>
                      <span>
                        CLEARANCE:{" "}
                        <span className="text-cyber-neon-cyan font-bold">
                          LVL-0{member.clearanceLevel}
                        </span>
                      </span>
                    </div>

                    <div className="font-mono text-[10px] text-cyber-muted/80 truncate max-w-sm mt-0.5">
                      KEY: {member.ed25519KeyFingerprint}
                    </div>
                  </div>
                </div>

                {/* Status & Interactive Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center font-mono">
                  {/* Verification button */}
                  <button
                    onClick={() => handleSimulateScan(member.id)}
                    disabled={isLocked || isScanning}
                    className={`px-2.5 py-1 rounded text-xs border flex items-center gap-1.5 transition-all ${
                      member.biometricVerified
                        ? "border-cyber-neon-green/40 text-cyber-neon-green bg-cyber-neon-green/10 hover:border-cyber-neon-green"
                        : "border-cyber-neon-amber/50 text-cyber-neon-amber bg-cyber-neon-amber/10 hover:border-cyber-neon-amber"
                    } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                    title={
                      isLocked
                        ? "Roster is sealed"
                        : "Click to run biometric verification"
                    }
                  >
                    {isScanning ? (
                      <>
                        <Scan className="w-3 h-3 animate-spin text-cyber-neon-cyan" />
                        SCANNING...
                      </>
                    ) : member.biometricVerified ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        VERIFIED
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                        PENDING SCAN
                      </>
                    )}
                  </button>

                  {/* Remove Operative button */}
                  {!isLocked && (
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="p-1.5 text-cyber-muted hover:text-cyber-neon-red hover:bg-cyber-neon-red/10 rounded transition-colors"
                      title="Decommission Operative"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="p-8 text-center border border-dashed border-cyber-border rounded font-mono text-xs text-cyber-muted">
            NO OPERATIVES FOUND UNDER FILTER // SQUAD CAPACITY AVAILABLE
          </div>
        )}
      </div>

      {/* Add Operative Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-cyber-surface border border-cyber-neon-cyan rounded-lg p-6 shadow-neon-cyan hud-corner">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
              <h3 className="font-mono text-sm uppercase font-bold text-cyber-neon-cyan flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Deploy New Squad Operative
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-cyber-muted hover:text-cyber-pale font-mono text-xs"
              >
                [ESC // CLOSE]
              </button>
            </div>

            <form onSubmit={handleCreateOperative} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-cyber-muted mb-1 uppercase tracking-wider text-[10px]">
                  Operative Real Designation / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Chen"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-cyber-card border border-cyber-border rounded px-3 py-2 text-cyber-pale focus:outline-none focus:border-cyber-neon-cyan"
                />
                {validationErrors.name && (
                  <p className="text-cyber-neon-red text-[10px] mt-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-cyber-muted mb-1 uppercase tracking-wider text-[10px]">
                    Tactical Callsign *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPECTRE"
                    value={formCallsign}
                    onChange={(e) => setFormCallsign(e.target.value)}
                    className="w-full bg-cyber-card border border-cyber-border rounded px-3 py-2 text-cyber-pale focus:outline-none focus:border-cyber-neon-cyan uppercase"
                  />
                  {validationErrors.callsign && (
                    <p className="text-cyber-neon-red text-[10px] mt-1">
                      {validationErrors.callsign}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-cyber-muted mb-1 uppercase tracking-wider text-[10px]">
                    Role Specialization *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as OperativeRole)}
                    className="w-full bg-cyber-card border border-cyber-border rounded px-3 py-2 text-cyber-pale focus:outline-none focus:border-cyber-neon-cyan"
                  >
                    {OperativeRoleSchema.options.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-cyber-muted mb-1 uppercase tracking-wider text-[10px]">
                  Encrypted Comms Address (Email) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="operative@syndicate.net"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-cyber-card border border-cyber-border rounded px-3 py-2 text-cyber-pale focus:outline-none focus:border-cyber-neon-cyan"
                />
                {validationErrors.email && (
                  <p className="text-cyber-neon-red text-[10px] mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-cyber-muted mb-1 uppercase tracking-wider text-[10px]">
                    Security Clearance (1-5)
                  </label>
                  <select
                    value={formClearance}
                    onChange={(e) => setFormClearance(Number(e.target.value))}
                    className="w-full bg-cyber-card border border-cyber-border rounded px-3 py-2 text-cyber-pale focus:outline-none focus:border-cyber-neon-cyan"
                  >
                    <option value={1}>Level 1 - Provisional</option>
                    <option value={2}>Level 2 - Operative</option>
                    <option value={3}>Level 3 - Tactical</option>
                    <option value={4}>Level 4 - Special Recon</option>
                    <option value={5}>Level 5 - Black Ops</option>
                  </select>
                </div>

                <div>
                  <label className="block text-cyber-muted mb-1 uppercase tracking-wider text-[10px]">
                    Radio Frequency
                  </label>
                  <input
                    type="text"
                    placeholder="142.8 MHz"
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value)}
                    className="w-full bg-cyber-card border border-cyber-border rounded px-3 py-2 text-cyber-pale focus:outline-none focus:border-cyber-neon-cyan"
                  />
                  {validationErrors.commsFrequency && (
                    <p className="text-cyber-neon-red text-[10px] mt-1">
                      {validationErrors.commsFrequency}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-cyber-card border border-cyber-border rounded text-cyber-muted hover:text-cyber-pale"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cyber-btn px-4 py-2 bg-cyber-neon-cyan text-cyber-bg font-bold uppercase rounded hover:bg-cyber-pale transition-all"
                >
                  Confirm Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
