import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/utils/supabase";

// ─── In-memory fallback for visitor stats ───
let localVisitorStats = {
  totalVisits: 0,
  todayVisits: 0,
  todayDate: new Date().toISOString().split("T")[0],
  dailyHistory: [] as { date: string; visits: number }[],
  recentVisitors: [] as { timestamp: string; page: string; referrer: string; userAgent: string }[],
};

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

// ─── POST: Record a visit ───
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page = typeof body.page === "string" ? body.page.slice(0, 200) : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "";
    const userAgent = (request.headers.get("user-agent") || "").slice(0, 300);
    const timestamp = new Date().toISOString();
    const today = getTodayStr();

    if (isSupabaseConfigured() && supabase) {
      // Insert visit record into Supabase
      await supabase.from("sapurapi_visits").insert({
        page,
        referrer,
        user_agent: userAgent,
        visited_at: timestamp,
      });

      return NextResponse.json({ success: true });
    } else {
      // Local fallback
      if (localVisitorStats.todayDate !== today) {
        // Archive yesterday and reset today
        if (localVisitorStats.todayVisits > 0) {
          localVisitorStats.dailyHistory.push({
            date: localVisitorStats.todayDate,
            visits: localVisitorStats.todayVisits,
          });
          // Keep only last 30 days
          if (localVisitorStats.dailyHistory.length > 30) {
            localVisitorStats.dailyHistory = localVisitorStats.dailyHistory.slice(-30);
          }
        }
        localVisitorStats.todayDate = today;
        localVisitorStats.todayVisits = 0;
      }

      localVisitorStats.totalVisits++;
      localVisitorStats.todayVisits++;
      localVisitorStats.recentVisitors.unshift({ timestamp, page, referrer, userAgent });
      // Keep only last 50 recent visitors
      if (localVisitorStats.recentVisitors.length > 50) {
        localVisitorStats.recentVisitors = localVisitorStats.recentVisitors.slice(0, 50);
      }

      return NextResponse.json({ success: true });
    }
  } catch (e) {
    console.error("Track error:", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// ─── GET: Retrieve visitor statistics (admin only) ───
export async function GET(request: Request) {
  try {
    // Check admin token from query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dynamic import to avoid circular dependency
    const { validateSession } = await import("@/app/api/auth/route");
    if (!validateSession(token)) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    if (isSupabaseConfigured() && supabase) {
      const today = getTodayStr();

      // Total visits
      const { count: totalCount } = await supabase
        .from("sapurapi_visits")
        .select("*", { count: "exact", head: true });

      // Today visits
      const { count: todayCount } = await supabase
        .from("sapurapi_visits")
        .select("*", { count: "exact", head: true })
        .gte("visited_at", `${today}T00:00:00.000Z`);

      // Last 7 days daily breakdown
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: recentData } = await supabase
        .from("sapurapi_visits")
        .select("visited_at")
        .gte("visited_at", sevenDaysAgo.toISOString())
        .order("visited_at", { ascending: true });

      // Aggregate by day
      const dailyMap = new Map<string, number>();
      (recentData || []).forEach((row: any) => {
        const day = row.visited_at.split("T")[0];
        dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
      });
      const dailyHistory = Array.from(dailyMap.entries()).map(([date, visits]) => ({ date, visits }));

      // Recent 20 visitors
      const { data: recentVisitors } = await supabase
        .from("sapurapi_visits")
        .select("visited_at, page, referrer, user_agent")
        .order("visited_at", { ascending: false })
        .limit(20);

      return NextResponse.json({
        totalVisits: totalCount || 0,
        todayVisits: todayCount || 0,
        dailyHistory,
        recentVisitors: (recentVisitors || []).map((v: any) => ({
          timestamp: v.visited_at,
          page: v.page,
          referrer: v.referrer,
          userAgent: v.user_agent,
        })),
      });
    } else {
      return NextResponse.json(localVisitorStats);
    }
  } catch (e) {
    console.error("Track GET error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
