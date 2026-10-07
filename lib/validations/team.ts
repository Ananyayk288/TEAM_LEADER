import { z } from "zod";

export const OperativeRoleSchema = z.enum([
  "COMMANDER",
  "NETRUNNER",
  "INFILTRATOR",
  "TECH_SPECIALIST",
  "CYBER_ANALYST",
  "COMBAT_MEDIC",
]);

export type OperativeRole = z.infer<typeof OperativeRoleSchema>;

export const OperativeStatusSchema = z.enum([
  "ACTIVE",
  "STANDBY",
  "VERIFIED",
  "UNVERIFIED",
  "FLAGGED",
]);

export type OperativeStatus = z.infer<typeof OperativeStatusSchema>;

export const TeamMemberSchema = z.object({
  id: z.string().uuid().or(z.string().regex(/^[A-Z0-9_-]{4,20}$/)),
  name: z.string().min(2, "Operative name must have at least 2 characters").max(50),
  callsign: z.string().min(2, "Callsign required").max(20),
  role: OperativeRoleSchema,
  clearanceLevel: z.number().int().min(1).max(5).default(1),
  email: z.string().email("Invalid encrypted comms address"),
  commsFrequency: z.string().regex(/^[\d.]{3,7}\s*MHz$/i, "Frequency must match e.g. '142.8 MHz'").optional(),
  status: OperativeStatusSchema.default("ACTIVE"),
  ed25519KeyFingerprint: z.string().min(16, "Cryptographic fingerprint must be at least 16 hex chars"),
  biometricVerified: z.boolean().default(false),
  avatarUrl: z.string().optional(),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const TeamRosterSchema = z.object({
  teamId: z.string().min(3),
  teamName: z.string().min(3, "Team designation must be at least 3 characters").max(30),
  squadCode: z.string().regex(/^[A-Z]{3}-\d{4}$/, "Must follow format like 'SYN-9042'"),
  division: z.string().min(2),
  deploymentStatus: z.enum(["STANDBY", "DEPLOYED", "STAND_DOWN", "ENGAGED"]).default("STANDBY"),
  isRosterLocked: z.boolean().default(false),
  lockedTimestamp: z.string().nullable().optional(),
  maxCapacity: z.number().int().min(2).max(8).default(4),
  members: z.array(TeamMemberSchema).min(1, "Squad must have at least 1 member").max(8),
  spocId: z.string(),
});

export type TeamRoster = z.infer<typeof TeamRosterSchema>;

export const SpocSchema = z.object({
  spocId: z.string(),
  name: z.string(),
  callsign: z.string(),
  division: z.string(),
  directCommsLink: z.string(),
  emergencyChannel: z.string(),
  locationHub: z.string(),
  status: z.enum(["ONLINE", "IN_TRANSIT", "OFFLINE"]),
  encryptionKeyFingerprint: z.string(),
  avatarUrl: z.string().optional(),
  notes: z.string().optional(),
});

export type SpocData = z.infer<typeof SpocSchema>;
