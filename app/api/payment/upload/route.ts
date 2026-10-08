// app/api/payment/upload/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Secure Payment Proof File Upload API
// Validates MIME type, file extension, and file size (max 5MB).
// Saves file with a randomly generated UUID filename.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import fs from "fs";
import path from "path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Session
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const user = await verifySessionToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized — Valid session required" }, { status: 401 });
    }

    // 2. CSRF Check
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: "Forbidden — Invalid request origin" }, { status: 403 });
    }

    // 3. Extract File from FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided for upload" }, { status: 400 });
    }

    // 4. File Size Check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 5MB size limit. Please upload a smaller image or PDF." },
        { status: 400 }
      );
    }

    // 5. MIME Type Check
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed." },
        { status: 400 }
      );
    }

    // 6. Extension Check
    const origExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(origExt)) {
      return NextResponse.json(
        { error: "Invalid file extension. Only .jpg, .jpeg, .png, .webp, and .pdf are allowed." },
        { status: 400 }
      );
    }

    // 7. Save file with random UUID filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeExt = origExt === ".jpeg" ? ".jpg" : origExt;
    const randomFileName = `proof_${crypto.randomUUID()}${safeExt}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, randomFileName);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${randomFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process file upload. Please try again." },
      { status: 500 }
    );
  }
}
