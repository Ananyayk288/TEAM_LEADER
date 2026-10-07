// lib/validations/project.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zod schemas for the Project & Final Submission form.
// Ensures PPT / Presentation is a REQUIRED shareable URL string (no file upload).
// Optional links: GitHub, Pitch Deck, Prototype/Demo, Additional Material.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

const isValidUrl = (url?: string) => {
  if (!url || url.trim() === "") return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const ProjectDataSchema = z.object({
  projectName: z
    .string()
    .min(3, "Project title must be at least 3 characters")
    .max(100, "Project title must be 100 characters or fewer"),

  problemStatement: z
    .string()
    .min(20, "Problem statement must be at least 20 characters")
    .max(1000, "Problem statement must be 1000 characters or fewer"),

  proposedSolution: z
    .string()
    .min(20, "Proposed solution must be at least 20 characters")
    .max(1000, "Proposed solution must be 1000 characters or fewer"),

  projectDescription: z
    .string()
    .min(30, "Project description must be at least 30 characters")
    .max(2000, "Project description must be 2000 characters or fewer"),

  domain: z
    .string()
    .min(1, "Domain is required"),

  technologiesUsed: z
    .string()
    .min(2, "Technologies used is required")
    .max(500, "Technologies used must be 500 characters or fewer"),

  // PPT / PRESENTATION LINK — REQUIRED (URL link only, NO FILE UPLOADS)
  pptUrl: z
    .string()
    .min(1, "PPT / Presentation Link is required")
    .refine((val) => {
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Please enter a valid presentation URL (e.g., https://drive.google.com/..., https://canva.com/...)"),

  // OPTIONAL LINKS
  githubUrl: z
    .string()
    .optional()
    .refine(isValidUrl, "Please enter a valid GitHub Repository URL"),

  pitchDeckUrl: z
    .string()
    .optional()
    .refine(isValidUrl, "Please enter a valid Pitch Deck URL"),

  demoUrl: z
    .string()
    .optional()
    .refine(isValidUrl, "Please enter a valid Prototype / Demo URL"),

  additionalMaterialUrl: z
    .string()
    .optional()
    .refine(isValidUrl, "Please enter a valid Additional Material URL"),

  adminFieldValues: z.record(z.string(), z.string()).optional(),
});

export type ProjectFormData = z.infer<typeof ProjectDataSchema>;

/** Validate the full project form. Returns field-level errors. */
export function validateProjectForm(
  data: unknown
): { valid: boolean; errors: Record<string, string> } {
  const result = ProjectDataSchema.safeParse(data);
  if (result.success) return { valid: true, errors: {} };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString() ?? "unknown";
    errors[key] = issue.message;
  }
  return { valid: false, errors };
}
