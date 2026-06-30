import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/utils/supabase";
import { validateSession } from "@/app/api/auth/route";
import defaultKeys from "@/data/config-default.json";
import fs from "fs";
import path from "path";

// Path to local config fallback
const LOCAL_CONFIG_PATH = path.join(process.cwd(), "src/data/config-default.json");

// Cache config in memory for local fallback
let localMemoryCache: any = null;

const getLocalConfig = () => {
  if (localMemoryCache) return localMemoryCache;
  try {
    if (fs.existsSync(LOCAL_CONFIG_PATH)) {
      const fileData = fs.readFileSync(LOCAL_CONFIG_PATH, "utf8");
      localMemoryCache = JSON.parse(fileData);
      return localMemoryCache;
    }
  } catch (e) {
    console.error("Failed to read local config, using memory default", e);
  }
  return defaultKeys;
};

const saveLocalConfig = (newConfig: any) => {
  localMemoryCache = newConfig;
  try {
    fs.writeFileSync(LOCAL_CONFIG_PATH, JSON.stringify(newConfig, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write local config", e);
    return false;
  }
};

// ─── Validation: ensure config payload has expected structure ───
function isValidConfig(config: unknown): boolean {
  if (!config || typeof config !== "object") return false;
  const c = config as Record<string, unknown>;
  const requiredKeys = [
    "BUSINESS_CONFIG",
    "ROOM_SERVICES",
    "HOUSE_PACKAGE",
    "KOST_PACKAGE",
    "APARTMENT_PACKAGE",
    "TRANSPORT_ZONES",
    "IRONING_SERVICE",
    "MIN_ORDER_PRICE",
    "WHY_CHOOSE_US",
    "FAQS",
  ];
  return requiredKeys.every((key) => key in c);
}

export async function GET() {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("sapurapi_config")
        .select("value")
        .eq("key", "main_config")
        .single();

      if (error || !data) {
        console.log("Config not found in Supabase, seeding default data...");
        const defaultConfig = getLocalConfig();
        const { error: insertError } = await supabase
          .from("sapurapi_config")
          .upsert({ key: "main_config", value: defaultConfig });

        if (insertError) {
          console.error("Failed to seed config in Supabase:", insertError);
        }
        return NextResponse.json(defaultConfig);
      }

      return NextResponse.json(data.value);
    } else {
      return NextResponse.json(getLocalConfig());
    }
  } catch (e: unknown) {
    console.error("Config GET error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Enforce max payload size (500KB)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 512000) {
      return NextResponse.json({ error: "Payload terlalu besar" }, { status: 413 });
    }

    const body = await request.json();
    const { token, config } = body;

    // Server-side session validation (not just "token exists")
    if (!token || typeof token !== "string" || !validateSession(token)) {
      return NextResponse.json({ error: "Sesi tidak valid. Silakan login ulang." }, { status: 401 });
    }

    // Validate config structure to prevent arbitrary data injection
    if (!isValidConfig(config)) {
      return NextResponse.json({ error: "Format konfigurasi tidak valid" }, { status: 400 });
    }

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from("sapurapi_config")
        .upsert({ key: "main_config", value: config });

      if (error) {
        throw new Error(error.message);
      }
    } else {
      saveLocalConfig(config);
    }

    return NextResponse.json({ success: true, message: "Configuration saved successfully" });
  } catch (e: unknown) {
    console.error("Config POST error:", e);
    return NextResponse.json({ error: "Gagal menyimpan konfigurasi" }, { status: 500 });
  }
}
