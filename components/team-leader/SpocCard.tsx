"use client";

import React, { useState } from "react";
import {
  Radio,
  UserCheck,
  Shield,
  PhoneCall,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";
import { SpocData } from "@/lib/validations/team";

interface SpocCardProps {
  spoc: SpocData;
}

export default function SpocCard({ spoc }: SpocCardProps) {
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [copiedFreq, setCopiedFreq] = useState(false);
  const [commsInput, setCommsInput] = useState("");
  const [commsLog, setCommsLog] = useState<string[]>([
    "SPOC VORTEX uplink established on channel SEC-9.",
    "Mission parameters acknowledged. Sector clear.",
  ]);

  const handleSendPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
      setCommsLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] PING ACK: SPOC received telemetry packet.`,
      ]);
      setTimeout(() => setPingSuccess(false), 3000);
    }, 1200);
  };

  const handleCopyChannel = () => {
    navigator.clipboard.writeText(spoc.directCommsLink);
    setCopiedFreq(true);
    setTimeout(() => setCopiedFreq(false), 2000);
  };

  const handleSendTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commsInput.trim()) return;
    setCommsLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] LEAD -> SPOC: ${commsInput.trim()}`,
    ]);
    setCommsInput("");
  };

  return (
    <div className="relative rounded-lg border border-cyber-border bg-cyber-card/90 p-5 shadow-hud-card backdrop-blur-md hud-corner">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyber-neon-green animate-pulse" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyber-neon-green flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyber-neon-green" />
            Tactical SPOC // Mentor Uplink
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 ${
              spoc.status === "ONLINE"
                ? "border-cyber-neon-green text-cyber-neon-green bg-cyber-neon-green/10"
                : spoc.status === "IN_TRANSIT"
                ? "border-cyber-neon-amber text-cyber-neon-amber bg-cyber-neon-amber/10"
                : "border-cyber-muted text-cyber-muted bg-cyber-surface"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            {spoc.status}
          </span>
        </div>
      </div>

      {/* SPOC Identity Profile */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded border-2 border-cyber-neon-green/60 bg-cyber-surface flex items-center justify-center overflow-hidden shadow-neon-green">
            {spoc.avatarUrl ? (
              <img
                src={spoc.avatarUrl}
                alt={spoc.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCheck className="w-8 h-8 text-cyber-neon-green" />
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 bg-cyber-bg border border-cyber-neon-cyan text-cyber-neon-cyan font-mono text-[9px] px-1 rounded">
            LVL 5
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="font-mono text-base font-bold text-cyber-pale truncate">
              {spoc.name}
            </h3>
            <span className="font-mono text-xs text-cyber-neon-cyan uppercase">
              "{spoc.callsign}"
            </span>
          </div>
          <p className="font-mono text-xs text-cyber-muted truncate">{spoc.division}</p>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-cyber-pale/70">
            <MapPin className="w-3 h-3 text-cyber-neon-cyan" />
            <span className="truncate">{spoc.locationHub}</span>
          </div>
        </div>
      </div>

      {/* Comms Telemetry Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div className="p-2.5 rounded bg-cyber-surface border border-cyber-border/80">
          <span className="text-cyber-muted text-[10px] block">DIRECT FREQ</span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-cyber-neon-cyan font-bold truncate">
              {spoc.directCommsLink}
            </span>
            <button
              onClick={handleCopyChannel}
              className="text-cyber-muted hover:text-cyber-neon-cyan transition-colors"
              title="Copy Comms Channel"
            >
              {copiedFreq ? (
                <Check className="w-3 h-3 text-cyber-neon-green" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded bg-cyber-surface border border-cyber-border/80">
          <span className="text-cyber-muted text-[10px] block">PRIORITY CHANNEL</span>
          <span className="text-cyber-neon-green font-bold block mt-0.5 truncate">
            {spoc.emergencyChannel}
          </span>
        </div>
      </div>

      {/* Public Key Fingerprint */}
      <div className="mt-2 p-2 bg-cyber-surface/60 rounded border border-cyber-border font-mono text-[10px] flex items-center justify-between text-cyber-muted">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-cyber-neon-green" /> KEY HASH:
        </span>
        <span className="truncate text-cyber-pale/80 max-w-[200px]">
          {spoc.encryptionKeyFingerprint}
        </span>
      </div>

      {/* Quick Interactive Terminal Message Dispatch */}
      <div className="mt-4 pt-3 border-t border-cyber-border">
        <div className="font-mono text-[10px] text-cyber-muted uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-cyber-neon-cyan" /> Secure Comms Log
          </span>
          <span className="text-cyber-neon-green font-bold">256-BIT AES-GCM</span>
        </div>

        {/* Mini transmission display */}
        <div className="h-20 overflow-y-auto bg-cyber-bg/90 rounded border border-cyber-border p-2 space-y-1 font-mono text-[10px]">
          {commsLog.map((log, index) => (
            <div
              key={index}
              className={`leading-relaxed ${
                log.includes("LEAD ->")
                  ? "text-cyber-neon-cyan"
                  : log.includes("PING ACK")
                  ? "text-cyber-neon-green"
                  : "text-cyber-pale/70"
              }`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Transmission Input */}
        <form onSubmit={handleSendTransmission} className="mt-2 flex gap-1.5">
          <input
            type="text"
            value={commsInput}
            onChange={(e) => setCommsInput(e.target.value)}
            placeholder="Transmit encrypted priority ping..."
            className="flex-1 bg-cyber-surface border border-cyber-border rounded px-2.5 py-1.5 font-mono text-xs text-cyber-pale placeholder:text-cyber-muted/50 focus:outline-none focus:border-cyber-neon-green"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-cyber-surface border border-cyber-neon-green/60 text-cyber-neon-green hover:bg-cyber-neon-green hover:text-cyber-bg font-mono text-xs rounded transition-all active:scale-95 flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* Ping Beacon Action Button */}
      <div className="mt-3">
        <button
          onClick={handleSendPing}
          disabled={isPinging}
          className={`w-full cyber-btn flex items-center justify-center gap-2 py-2 px-3 font-mono text-xs uppercase tracking-wider rounded font-bold transition-all ${
            pingSuccess
              ? "bg-cyber-neon-green text-cyber-bg shadow-neon-green"
              : "bg-cyber-surface border border-cyber-neon-green/80 text-cyber-neon-green hover:bg-cyber-neon-green/10"
          }`}
        >
          {isPinging ? (
            <>
              <Radio className="w-3.5 h-3.5 animate-spin text-cyber-neon-green" />
              BROADCASTING UPLINK PACKET...
            </>
          ) : pingSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              TELEMETRY ACKNOWLEDGED BY SPOC
            </>
          ) : (
            <>
              <PhoneCall className="w-3.5 h-3.5" />
              Dispatch Tactical Mentor Ping
            </>
          )}
        </button>
      </div>
    </div>
  );
}
