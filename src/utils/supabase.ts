import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey.includes("TEMPEL_KAN")) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn("Supabase initialization failed, falling back to local database:", e);
    return null;
  }
})();

// Helper to check if Supabase is active
export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};
