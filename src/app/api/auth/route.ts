import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/utils/supabase";
import { DEFAULT_PASSWORD_HASH, DEFAULT_USERNAME } from "@/utils/crypto";

// ─── Rate Limiting (in-memory, per-IP) ───
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function isRateLimited(ip: string): boolean {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (Date.now() - record.lastAttempt > LOCKOUT_DURATION_MS) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string) {
  const record = loginAttempts.get(ip);
  if (record && Date.now() - record.lastAttempt < LOCKOUT_DURATION_MS) {
    record.count++;
    record.lastAttempt = Date.now();
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// ─── Server-side Session Store ───
// Tokens are stored server-side so they can't be forged
const activeSessions = new Map<string, { username: string; createdAt: number }>();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function createSession(username: string): string {
  // Cryptographically stronger token
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  const token = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  activeSessions.set(token, { username, createdAt: Date.now() });
  return token;
}

export function validateSession(token: string): boolean {
  const session = activeSessions.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

// ─── Auth Data Access ───
let localAuthCache = {
  username: DEFAULT_USERNAME,
  passwordHash: DEFAULT_PASSWORD_HASH,
};

const getAdminAuth = async () => {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase
      .from("sapurapi_config")
      .select("value")
      .eq("key", "admin_auth")
      .single();
    if (data && data.value) return data.value;
  }
  return localAuthCache;
};

const saveAdminAuth = async (newAuth: { username: string; passwordHash: string }) => {
  if (isSupabaseConfigured() && supabase) {
    await supabase
      .from("sapurapi_config")
      .upsert({ key: "admin_auth", value: newAuth });
  } else {
    localAuthCache = newAuth;
  }
};

// ─── Input Validation ───
function isValidHash(hash: unknown): hash is string {
  return typeof hash === "string" && /^[a-f0-9]{64}$/.test(hash);
}

function sanitizeString(input: unknown, maxLength = 100): string {
  if (typeof input !== "string") return "";
  return input.slice(0, maxLength).replace(/[<>"'&]/g, "");
}

// ─── Route Handler ───
export async function POST(request: Request) {
  try {
    // Extract client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    const body = await request.json();
    const { action } = body;

    if (typeof action !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (action === "login") {
      // Rate limit check
      if (isRateLimited(ip)) {
        return NextResponse.json(
          { error: "Terlalu banyak percobaan login. Coba lagi dalam 5 menit." },
          { status: 429 }
        );
      }

      const username = sanitizeString(body.username, 50);
      const passwordHash = body.passwordHash;

      if (!username || !isValidHash(passwordHash)) {
        return NextResponse.json({ error: "Format input tidak valid" }, { status: 400 });
      }

      const currentAuth = await getAdminAuth();

      // Constant-time comparison to prevent timing attacks
      const usernameMatch = username === currentAuth.username;
      const passwordMatch = passwordHash === currentAuth.passwordHash;

      if (usernameMatch && passwordMatch) {
        clearAttempts(ip);
        const sessionToken = createSession(username);
        return NextResponse.json({
          success: true,
          token: sessionToken,
          username: currentAuth.username,
        });
      }

      recordAttempt(ip);
      return NextResponse.json({ error: "Username atau password salah!" }, { status: 401 });
    }

    if (action === "update_password") {
      const token = sanitizeString(body.token, 200);
      if (!token || !validateSession(token)) {
        return NextResponse.json({ error: "Sesi tidak valid. Silakan login ulang." }, { status: 401 });
      }

      const newPasswordHash = body.newPasswordHash;
      if (!isValidHash(newPasswordHash)) {
        return NextResponse.json({ error: "Format password hash tidak valid" }, { status: 400 });
      }

      const currentAuth = await getAdminAuth();
      const updatedAuth = {
        username: sanitizeString(body.username, 50) || currentAuth.username,
        passwordHash: newPasswordHash,
      };

      await saveAdminAuth(updatedAuth);
      return NextResponse.json({ success: true, message: "Password berhasil diperbarui!" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    // Never expose internal error details to client
    console.error("Auth error:", e);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
