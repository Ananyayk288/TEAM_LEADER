"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Download,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  Terminal,
  Cpu,
  Lock,
} from "lucide-react";

interface TeamQRCardProps {
  teamId: string;
  squadCode: string;
  teamName: string;
  leaderName: string;
  clearanceLevel: number;
  ed25519Signature?: string;
  isLocked: boolean;
}

export default function TeamQRCard({
  teamId,
  squadCode,
  teamName,
  leaderName,
  clearanceLevel,
  ed25519Signature = "ed25519:7f89b91c49ae0221efc0a6b73819c9e84712bc90a1f28b7e",
  isLocked,
}: TeamQRCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [tokenNonce, setTokenNonce] = useState<string>("89A-0042-NX");

  // Construct structured tactical payload
  const qrPayload = JSON.stringify({
    protocol: "SYN-TAC-V4",
    tId: teamId,
    sqCode: squadCode,
    alias: teamName,
    cdr: leaderName,
    secClr: clearanceLevel,
    sig: ed25519Signature,
    nonce: tokenNonce,
    timestamp: new Date().toISOString(),
    status: isLocked ? "ROSTER_SEALED" : "ROSTER_PROVISIONAL",
  });

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Generate Data URL for image display
      const dataUrl = await QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: "#00eefc",
          light: "#121722",
        },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(dataUrl);

      // Also generate SVG for crisp vector download
      const svg = await QRCode.toString(qrPayload, {
        type: "svg",
        margin: 2,
        color: {
          dark: "#00eefc",
          light: "#121722",
        },
        errorCorrectionLevel: "H",
      });
      setSvgString(svg);
    } catch (err) {
      console.error("QR Code Generation Error:", err);
    } finally {
      setTimeout(() => setIsGenerating(false), 300);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [teamId, squadCode, teamName, isLocked, tokenNonce]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `TACTICAL_PASS_${squadCode}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySignature = () => {
    navigator.clipboard.writeText(ed25519Signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCycleNonce = () => {
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    setTokenNonce(`SYN-${randomHex}-X`);
  };

  return (
    <div className="relative rounded-lg border border-cyber-border bg-cyber-card/90 p-5 shadow-hud-card backdrop-blur-md hud-corner">
      {/* Top telemetry banner */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-neon-cyan"></span>
          </div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyber-neon-cyan flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyber-neon-cyan" />
            ED25519 Encrypted Pass
          </h2>
        </div>
        <span className="font-mono text-[10px] tracking-wider text-cyber-pale/70 border border-cyber-border px-2 py-0.5 rounded bg-cyber-surface">
          SEC-LVL: 0{clearanceLevel}
        </span>
      </div>

      {/* QR Code Presentation Box */}
      <div className="flex flex-col items-center">
        <div className="relative group p-3 bg-cyber-surface border border-cyber-neon-cyan/40 rounded-lg shadow-neon-cyan transition-all duration-300">
          {/* Subtle neon scanline effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 animate-scanline" />

          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="ED25519 Secure Team Access Pass"
              className={`w-52 h-52 object-contain transition-all duration-300 ${
                isGenerating ? "opacity-30 blur-xs scale-95" : "opacity-100 scale-100"
              }`}
            />
          ) : (
            <div className="w-52 h-52 flex flex-col items-center justify-center text-cyber-pale/40 font-mono text-xs">
              <Cpu className="w-8 h-8 animate-spin mb-2 text-cyber-neon-cyan" />
              SYNTHESIZING QR MATRIX...
            </div>
          )}

          {/* Corner brackets */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyber-neon-cyan pointer-events-none" />
          <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyber-neon-cyan pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyber-neon-green pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyber-neon-green pointer-events-none" />
        </div>

        {/* Tactical Badges below QR */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 ${
              isLocked
                ? "border-cyber-neon-green text-cyber-neon-green bg-cyber-neon-green/10"
                : "border-cyber-neon-amber text-cyber-neon-amber bg-cyber-neon-amber/10"
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3 h-3" /> ROSTER ENCRYPTED & LOCKED
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" /> PROVISIONAL PASS
              </>
            )}
          </span>
          <span className="font-mono text-[10px] text-cyber-muted px-2 py-0.5 border border-cyber-border rounded bg-cyber-surface">
            HASH: {squadCode}
          </span>
        </div>
      </div>

      {/* Signature & Cryptographic Telemetry */}
      <div className="mt-4 p-3 bg-cyber-surface/80 rounded border border-cyber-border font-mono text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-cyber-muted">
          <span className="flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-cyber-neon-cyan" />
            ED25519 Fingerprint:
          </span>
          <button
            onClick={handleCopySignature}
            className="text-cyber-neon-cyan hover:text-cyber-pale transition-colors flex items-center gap-1 text-[10px]"
            title="Copy cryptographic signature"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-cyber-neon-green" /> COPIED
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> COPY
              </>
            )}
          </button>
        </div>
        <p className="truncate text-cyber-pale font-mono tracking-tight bg-cyber-bg/60 p-1.5 rounded border border-cyber-border/50 text-[10px]">
          {ed25519Signature}
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-cyber-muted">
          <div>
            <span className="text-cyber-pale/60">NONCE:</span>{" "}
            <span className="text-cyber-neon-cyan font-bold">{tokenNonce}</span>
          </div>
          <div className="text-right">
            <span className="text-cyber-pale/60">CIPHER:</span>{" "}
            <span className="text-cyber-pale">CURVE25519</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={handleDownload}
          className="cyber-btn flex items-center justify-center gap-1.5 py-2 px-3 bg-cyber-neon-cyan text-cyber-bg font-mono font-bold text-xs uppercase tracking-wider rounded transition-all hover:bg-cyber-pale hover:shadow-neon-cyan active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Download Pass
        </button>

        <button
          onClick={handleCycleNonce}
          disabled={isGenerating}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-cyber-surface border border-cyber-border text-cyber-pale font-mono text-xs uppercase tracking-wider rounded hover:border-cyber-neon-cyan hover:text-cyber-neon-cyan transition-all active:scale-95"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin text-cyber-neon-cyan" : ""}`}
          />
          Re-Sign Nonce
        </button>
      </div>
    </div>
  );
}
