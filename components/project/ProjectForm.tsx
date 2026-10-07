"use client";
import React, { useState, useCallback } from "react";
import {
  Save,
  Send,
  CheckCircle,
  ChevronRight,
  Globe,
  FileText,
  Github,
  Video,
  ExternalLink,
  Layers,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type { ProjectData, AdminField, ProjectStatus } from "@/lib/services/projectService";
import { validateProjectForm } from "@/lib/validations/project";
import ProjectSubmitConfirmation from "./ProjectSubmitConfirmation";

interface ProjectFormProps {
  initialData: ProjectData | null;
  domain: string;
  adminFields: AdminField[];
  currentStatus: ProjectStatus;
  onSaveDraft: (data: ProjectData) => Promise<void>;
  onSubmitProject: (data: ProjectData) => Promise<void>;
  isSaving: boolean;
  isSubmittingFinal: boolean;
  draftSaved: boolean;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.62rem",
        color: "var(--pink)",
        marginTop: "0.45rem",
        letterSpacing: "0.5px",
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
      }}
    >
      <span>⚠</span> {msg}
    </div>
  );
}

function SectionHeader({ code, title, subtitle }: { code: string; title: string; subtitle?: string }) {
  return (
    <div
      style={{
        marginBottom: "1.5rem",
        paddingBottom: "0.85rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            color: "var(--primary)",
            background: "rgba(253,191,21,0.08)",
            border: "1px solid rgba(253,191,21,0.25)",
            padding: "0.2rem 0.5rem",
            letterSpacing: "1px",
          }}
        >
          {code}
        </span>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1rem",
            color: "var(--text-main)",
            letterSpacing: "2px",
          }}
        >
          {title}
        </span>
      </div>
      {subtitle && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", margin: 0, marginTop: "0.35rem" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FormField({
  id,
  label,
  sublabel,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 4,
  error,
  readOnly = false,
  required = false,
  accentColor = "var(--cyan)",
  icon,
}: {
  id: string;
  label: string;
  sublabel?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  error?: string;
  readOnly?: boolean;
  required?: boolean;
  accentColor?: string;
  icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? "var(--pink)"
    : focused
    ? accentColor
    : "rgba(255,255,255,0.12)";
  const boxShadow = focused
    ? error
      ? "0 0 0 2px rgba(233,30,140,0.2)"
      : `0 0 0 2px rgba(0,212,255,0.15), 0 0 16px rgba(0,212,255,0.08)`
    : "none";

  const sharedStyle: React.CSSProperties = {
    width: "100%",
    background: readOnly ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.5)",
    border: `1px solid ${borderColor}`,
    color: readOnly ? "var(--text-dim)" : "var(--text-main)",
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    padding: icon ? "0.85rem 1rem 0.85rem 2.5rem" : "0.85rem 1rem",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow,
    resize: textarea ? "vertical" : undefined,
    cursor: readOnly ? "default" : "text",
    lineHeight: 1.6,
  };

  return (
    <div style={{ marginBottom: "1.6rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.45rem" }}>
        <label
          htmlFor={id}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            color: error ? "var(--pink)" : "var(--text-main)",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          {label}
          {required ? (
            <span style={{ color: "var(--pink)", fontWeight: "bold" }}>*</span>
          ) : (
            <span style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>(OPTIONAL)</span>
          )}
        </label>
      </div>

      {sublabel && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.63rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.55rem" }}>
          {sublabel}
        </p>
      )}

      <div style={{ position: "relative" }}>
        {icon && (
          <div
            style={{
              position: "absolute",
              left: "0.85rem",
              top: textarea ? "1rem" : "50%",
              transform: textarea ? "none" : "translateY(-50%)",
              pointerEvents: "none",
              color: focused ? accentColor : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
        )}

        {textarea ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={sharedStyle}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={sharedStyle}
          />
        )}
      </div>

      <FieldError msg={error} />
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ProjectForm({
  initialData,
  domain,
  adminFields,
  currentStatus,
  onSaveDraft,
  onSubmitProject,
  isSaving,
  isSubmittingFinal,
  draftSaved,
}: ProjectFormProps) {
  const isSubmitted = currentStatus === "SUBMITTED";

  // Form State
  const [projectName, setProjectName] = useState(initialData?.projectName ?? "");
  const [problemStatement, setProblemStatement] = useState(initialData?.problemStatement ?? "");
  const [proposedSolution, setProposedSolution] = useState(initialData?.proposedSolution ?? "");
  const [projectDescription, setProjectDescription] = useState(initialData?.projectDescription ?? "");
  const [technologiesUsed, setTechnologiesUsed] = useState(initialData?.technologiesUsed ?? "");

  // Submission Links State (Strictly URLs — NO FILE UPLOADS)
  const [pptUrl, setPptUrl] = useState(initialData?.pptUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl ?? "");
  const [pitchDeckUrl, setPitchDeckUrl] = useState(initialData?.pitchDeckUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl ?? "");
  const [additionalMaterialUrl, setAdditionalMaterialUrl] = useState(initialData?.additionalMaterialUrl ?? "");

  const [adminValues, setAdminValues] = useState<Record<string, string>>(
    initialData?.adminFieldValues ?? {}
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const buildData = useCallback((): ProjectData => ({
    projectName,
    problemStatement,
    proposedSolution,
    projectDescription,
    domain,
    technologiesUsed,
    pptUrl,
    githubUrl: githubUrl.trim() || undefined,
    pitchDeckUrl: pitchDeckUrl.trim() || undefined,
    demoUrl: demoUrl.trim() || undefined,
    additionalMaterialUrl: additionalMaterialUrl.trim() || undefined,
    adminFieldValues: adminValues,
  }), [
    projectName,
    problemStatement,
    proposedSolution,
    projectDescription,
    domain,
    technologiesUsed,
    pptUrl,
    githubUrl,
    pitchDeckUrl,
    demoUrl,
    additionalMaterialUrl,
    adminValues,
  ]);

  const handleSaveDraft = async () => {
    setErrors({});
    await onSaveDraft(buildData());
  };

  const handleOpenConfirm = () => {
    const { valid, errors: errs } = validateProjectForm(buildData());
    if (!valid) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setShowConfirm(true);
  };

  const handleFinalSubmit = async () => {
    await onSubmitProject(buildData());
    setShowConfirm(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* ─── READ-ONLY NOTICE FOR SUBMITTED PROJECTS ─── */}
      {isSubmitted && (
        <div
          style={{
            background: "rgba(0,255,136,0.06)",
            border: "1px solid rgba(0,255,136,0.3)",
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
          }}
        >
          <CheckCircle size={20} style={{ color: "#00ff88", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", color: "#00ff88", letterSpacing: "1px" }}>
              PROJECT SUBMITTED & LOCKED
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "rgba(0,255,136,0.8)", marginTop: "0.15rem" }}>
              Your final submission is recorded and under evaluation. Contact event admins if changes are needed.
            </div>
          </div>
        </div>
      )}

      {/* ─── VALIDATION ERROR SUMMARY ─── */}
      {Object.keys(errors).length > 0 && (
        <div
          style={{
            background: "rgba(233,30,140,0.08)",
            border: "1px solid rgba(233,30,140,0.3)",
            borderLeft: "4px solid var(--pink)",
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", letterSpacing: "2px", marginBottom: "0.4rem" }}>
            // SUBMISSION ERROR
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-main)", margin: 0, marginBottom: "0.5rem" }}>
            Please correct the following fields before submitting:
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--pink)" }}>
            {Object.entries(errors).map(([field, msg]) => (
              <li key={field} style={{ marginBottom: "0.2rem" }}>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── SECTION 01: PROJECT IDENTITY ─── */}
      <div className="vv-card vv-corners" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <SectionHeader
          code="01"
          title="PROJECT IDENTITY & DOMAIN"
          subtitle="Basic identification details for your squad's project"
        />

        {/* Selected Domain Badge */}
        <div style={{ marginBottom: "1.6rem" }}>
          <label
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              color: "var(--text-main)",
              letterSpacing: "1.5px",
              marginBottom: "0.45rem",
            }}
          >
            SELECTED DOMAIN <span style={{ color: "var(--cyan)" }}>(ASSIGNED)</span>
          </label>
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--cyan)", letterSpacing: "1px" }}>
              {domain || "NO DOMAIN SELECTED"}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
              LOCKED FROM REGISTRATION
            </span>
          </div>
        </div>

        {/* Project Title */}
        <FormField
          id="projectName"
          label="Project Title"
          sublabel="Enter the official name or title of your hackathon project"
          value={projectName}
          onChange={setProjectName}
          placeholder="e.g. CyberGuard AI — Autonomous Threat Neutralizer"
          error={errors.projectName}
          readOnly={isSubmitted}
          required={true}
          accentColor="var(--primary)"
          icon={<Sparkles size={14} />}
        />
      </div>

      {/* ─── SECTION 02: PROBLEM & SOLUTION ─── */}
      <div className="vv-card vv-corners" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <SectionHeader
          code="02"
          title="PROBLEM & PROPOSED SOLUTION"
          subtitle="Define the core challenge and your squad's innovative response"
        />

        <FormField
          id="problemStatement"
          label="Problem Statement"
          sublabel="Describe the specific problem or pain point your project addresses (minimum 20 characters)"
          value={problemStatement}
          onChange={setProblemStatement}
          placeholder="Describe the exact problem, affected target audience, and existing limitations..."
          textarea={true}
          rows={4}
          error={errors.problemStatement}
          readOnly={isSubmitted}
          required={true}
          accentColor="var(--pink)"
        />

        <FormField
          id="proposedSolution"
          label="Proposed Solution"
          sublabel="Detail your solution, key features, and how it effectively solves the problem (minimum 20 characters)"
          value={proposedSolution}
          onChange={setProposedSolution}
          placeholder="Explain your technical solution, core workflow, unique features, and expected outcomes..."
          textarea={true}
          rows={4}
          error={errors.proposedSolution}
          readOnly={isSubmitted}
          required={true}
          accentColor="var(--cyan)"
        />
      </div>

      {/* ─── SECTION 03: TECHNICAL DETAILS ─── */}
      <div className="vv-card vv-corners" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <SectionHeader
          code="03"
          title="TECHNICAL DETAILS & ARCHITECTURE"
          subtitle="Provide full technical documentation and stack overview"
        />

        <FormField
          id="projectDescription"
          label="Detailed Project Description"
          sublabel="Provide a thorough breakdown of system architecture, data flow, and implementation specifics (minimum 30 characters)"
          value={projectDescription}
          onChange={setProjectDescription}
          placeholder="Detailed breakdown of components, system design, API integrations, and key algorithms..."
          textarea={true}
          rows={5}
          error={errors.projectDescription}
          readOnly={isSubmitted}
          required={true}
          accentColor="var(--primary)"
        />

        <FormField
          id="technologiesUsed"
          label="Technologies & Tools Stack"
          sublabel="List all frameworks, languages, APIs, databases, and hardware used"
          value={technologiesUsed}
          onChange={setTechnologiesUsed}
          placeholder="e.g. Next.js, TypeScript, Python, PyTorch, Supabase, TailwindCSS"
          error={errors.technologiesUsed}
          readOnly={isSubmitted}
          required={true}
          accentColor="var(--cyan)"
          icon={<Layers size={14} />}
        />
      </div>

      {/* ─── SECTION 04: FINAL SUBMISSION & MATERIAL LINKS (STRICTLY LINK-BASED) ─── */}
      <div
        className="vv-card vv-corners"
        style={{
          padding: "1.75rem",
          marginBottom: "2.5rem",
          border: "1px solid rgba(253,191,21,0.3)",
          background: "rgba(253,191,21,0.02)",
        }}
      >
        <SectionHeader
          code="04"
          title="FINAL SUBMISSION — PRESENTATION & MATERIAL LINKS"
          subtitle="Submit accessible shareable links for your evaluation. NO FILE UPLOAD REQUIRED."
        />

        {/* Banner Notice explaining Link Submission */}
        <div
          style={{
            padding: "0.85rem 1.1rem",
            background: "rgba(0,212,255,0.06)",
            border: "1px solid rgba(0,212,255,0.25)",
            borderLeft: "3px solid var(--cyan)",
            marginBottom: "1.75rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <Globe size={18} style={{ color: "var(--cyan)", marginTop: "0.15rem", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "var(--cyan)", letterSpacing: "1px" }}>
              ONLINE LINK SUBMISSION ONLY
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "0.2rem", lineHeight: 1.5 }}>
              Submit a shareable link to your project presentation. Make sure the link is accessible to the evaluators (e.g. view access enabled on Google Drive, Canva, or OneDrive).
            </div>
          </div>
        </div>

        {/* 1. REQUIRED: PPT / Presentation Link */}
        <FormField
          id="pptUrl"
          label="PPT / PRESENTATION LINK"
          sublabel="Submit a shareable link to your project presentation. Make sure the link is accessible to the evaluators."
          value={pptUrl}
          onChange={setPptUrl}
          placeholder="https://drive.google.com/file/d/... or https://canva.com/design/... or https://docs.google.com/presentation/..."
          error={errors.pptUrl}
          readOnly={isSubmitted}
          required={true}
          accentColor="var(--primary)"
          icon={<FileText size={14} />}
        />

        {/* 2. OPTIONAL: GitHub Repository Link */}
        <FormField
          id="githubUrl"
          label="GitHub Repository Link"
          sublabel="Link to your public or accessible project source code repository"
          value={githubUrl}
          onChange={setGithubUrl}
          placeholder="https://github.com/your-team/project-repo"
          error={errors.githubUrl}
          readOnly={isSubmitted}
          required={false}
          accentColor="var(--cyan)"
          icon={<Github size={14} />}
        />

        {/* 3. OPTIONAL: Pitch Deck Link */}
        <FormField
          id="pitchDeckUrl"
          label="Pitch Deck Link"
          sublabel="Link to your pitch deck slides or PDF document stored online"
          value={pitchDeckUrl}
          onChange={setPitchDeckUrl}
          placeholder="https://drive.google.com/..."
          error={errors.pitchDeckUrl}
          readOnly={isSubmitted}
          required={false}
          accentColor="var(--pink)"
          icon={<ExternalLink size={14} />}
        />

        {/* 4. OPTIONAL: Prototype / Demo Link */}
        <FormField
          id="demoUrl"
          label="Prototype / Demo Link"
          sublabel="Link to live deployed application, web demo, or video demonstration"
          value={demoUrl}
          onChange={setDemoUrl}
          placeholder="https://your-app.vercel.app or https://youtube.com/watch?v=..."
          error={errors.demoUrl}
          readOnly={isSubmitted}
          required={false}
          accentColor="var(--cyan)"
          icon={<Video size={14} />}
        />

        {/* 5. OPTIONAL: Additional Material Link */}
        <FormField
          id="additionalMaterialUrl"
          label="Additional Material Link"
          sublabel="Link to design mockups, Figma, research papers, or dataset links"
          value={additionalMaterialUrl}
          onChange={setAdditionalMaterialUrl}
          placeholder="https://figma.com/file/... or https://drive.google.com/..."
          error={errors.additionalMaterialUrl}
          readOnly={isSubmitted}
          required={false}
          accentColor="var(--primary)"
          icon={<ExternalLink size={14} />}
        />
      </div>

      {/* ─── ACTION BUTTONS ─── */}
      {!isSubmitted && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            padding: "1.5rem",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Save Draft button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmittingFinal}
            id="project-save-draft-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.75rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: draftSaved ? "#00ff88" : "var(--text-main)",
              fontFamily: "var(--font-heading)",
              fontSize: "0.85rem",
              letterSpacing: "1.5px",
              cursor: isSaving ? "wait" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {isSaving ? (
              <>
                <div className="vv-spinner" style={{ width: "14px", height: "14px" }} />
                SAVING DRAFT...
              </>
            ) : draftSaved ? (
              <>
                <CheckCircle size={15} style={{ color: "#00ff88" }} />
                DRAFT SAVED ✓
              </>
            ) : (
              <>
                <Save size={15} />
                SAVE DRAFT
              </>
            )}
          </button>

          {/* Final Submit button */}
          <button
            type="button"
            onClick={handleOpenConfirm}
            disabled={isSaving || isSubmittingFinal}
            id="project-final-submit-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 2.25rem",
              background: "var(--pink)",
              border: "none",
              color: "#fff",
              fontFamily: "var(--font-heading)",
              fontSize: "0.9rem",
              letterSpacing: "2px",
              cursor: isSubmittingFinal ? "wait" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 0 20px rgba(233,30,140,0.35)",
            }}
          >
            {isSubmittingFinal ? (
              <>
                <div className="vv-spinner" style={{ width: "14px", height: "14px", borderTopColor: "#fff" }} />
                SUBMITTING...
              </>
            ) : (
              <>
                <Send size={15} />
                SUBMIT FINAL PROJECT
              </>
            )}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <ProjectSubmitConfirmation
          projectName={projectName}
          isSubmitting={isSubmittingFinal}
          onConfirm={handleFinalSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
