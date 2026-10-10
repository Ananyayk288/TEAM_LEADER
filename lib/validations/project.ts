// lib/validations/project.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zod schemas for the Project & Final Submission form.
// Ensures PPT / Presentation is a REQUIRED shareable HTTPS URL string (no file upload).
// Accepts ONLY https:// URLs. Rejects http:, javascript:, data:, and other schemes.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

const isStrictHttpsUrl = (url?: string) => {
  if (!url || url.trim() === "") return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:";
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
    .transform((val) => val.trim())
    .refine((val) => val.length >= 300, {
      message: "Problem Statement must be at least 300 characters",
    })
    .refine((val) => val.length <= 1000, {
      message: "Problem Statement must be 1000 characters or fewer",
    }),

  proposedSolution: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 300, {
      message: "Proposed Solution must be at least 300 characters",
    })
    .refine((val) => val.length <= 1000, {
      message: "Proposed Solution must be 1000 characters or fewer",
    }),

  systemArchitectureLink: z
    .string({ required_error: "System Architecture Link is required." })
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "System Architecture Link is required.",
    })
    .refine((val) => {
      try {
        const u = new URL(val);
        return u.protocol === "https:" || u.protocol === "http:";
      } catch {
        return false;
      }
    }, {
      message: "Please enter a valid System Architecture URL (e.g., https://drive.google.com/...)",
    }),

  domain: z
    .string()
    .min(1, "Domain is required"),

  technologiesUsed: z
    .string()
    .min(2, "Technologies used is required")
    .max(500, "Technologies used must be 500 characters or fewer"),

  // PPT / PRESENTATION LINK — REQUIRED (Strictly https:// URLs only)
  pptUrl: z
    .string()
    .min(1, "PPT / Presentation Link is required")
    .refine((val) => {
      try {
        const u = new URL(val.trim());
        return u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Please enter a valid presentation URL starting with https:// (e.g., https://drive.google.com/..., https://canva.com/...)"),

  // OPTIONAL LINKS — Strictly https:// URLs only if provided
  githubUrl: z
    .string()
    .optional()
    .refine(isStrictHttpsUrl, "GitHub Repository URL must start with https://"),

  demoUrl: z
    .string()
    .optional()
    .refine(isStrictHttpsUrl, "Prototype / Demo URL must start with https://"),

  additionalMaterialUrl: z
    .string()
    .optional()
    .refine(isStrictHttpsUrl, "Additional Material URL must start with https://"),

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
