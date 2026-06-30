"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useConfig } from "@/context/ConfigContext";
import { sha256, DEFAULT_USERNAME } from "@/utils/crypto";
import {
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  LogOut,
  Save,
  Plus,
  Trash2,
  Settings,
  Sparkles,
  Building,
  Home,
  Shirt,
  MapPin,
  Clock,
  Phone,
  HelpCircle,
  ShieldCheck,
  Check,
  BarChart3,
  Users,
  Globe,
  Menu,
  X
} from "lucide-react";

type VisitorStats = {
  totalVisits: number;
  todayVisits: number;
  dailyHistory: { date: string; visits: number }[];
  recentVisitors: { timestamp: string; page: string; referrer: string; userAgent: string }[];
};

export default function AdminPage() {
  const { config, refreshConfig } = useConfig();
  
  // Auth state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState("visitors");
  const [draftConfig, setDraftConfig] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Visitor tracking state
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Fetch visitor stats
  const fetchVisitorStats = useCallback(async (token: string) => {
    setIsLoadingStats(true);
    try {
      const response = await fetch(`/api/track?token=${encodeURIComponent(token)}`);
      if (response.ok) {
        const data = await response.json();
        setVisitorStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch visitor stats", e);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    const session = localStorage.getItem("sapurapi_admin_session");
    const token = localStorage.getItem("sapurapi_admin_token");
    if (session === "true" && token) {
      setIsLoggedIn(true);
      setAuthToken(token);
      fetchVisitorStats(token);
    }
  }, [fetchVisitorStats]);

  // Initialize draft config when main config is loaded
  useEffect(() => {
    if (config && !draftConfig) {
      setDraftConfig(JSON.parse(JSON.stringify(config)));
    }
  }, [config, draftConfig]);

  // Refresh stats when visitor tab is opened
  useEffect(() => {
    if (activeTab === "visitors" && authToken) {
      fetchVisitorStats(authToken);
    }
  }, [activeTab, authToken, fetchVisitorStats]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthLoading(true);

    try {
      const hashed = await sha256(password);
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username,
          passwordHash: hashed
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("sapurapi_admin_session", "true");
        localStorage.setItem("sapurapi_admin_token", data.token);
        setAuthToken(data.token);
        setIsLoggedIn(true);
      } else {
        setAuthError(data.error || "Gagal masuk!");
      }
    } catch (e: any) {
      setAuthError("Koneksi gagal atau database bermasalah.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("sapurapi_admin_session");
    localStorage.removeItem("sapurapi_admin_token");
    setIsLoggedIn(false);
    setAuthToken("");
    setUsername("");
    setPassword("");
  };

  // Update specific key in draft config
  const updateDraft = (path: string[], value: any) => {
    if (!draftConfig) return;
    const newConfig = { ...draftConfig };
    let current = newConfig;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setDraftConfig(newConfig);
  };

  // Save changes to API
  const handleSaveConfig = async () => {
    if (!draftConfig) return;
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: authToken,
          config: draftConfig
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSaveStatus({ success: true, message: "Konfigurasi berhasil disimpan!" });
        await refreshConfig();
      } else {
        setSaveStatus({ success: false, message: data.error || "Gagal menyimpan konfigurasi" });
      }
    } catch (e) {
      setSaveStatus({ success: false, message: "Koneksi gagal saat menyimpan." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: "Konfirmasi password tidak cocok!" });
      return;
    }

    try {
      const currentHashed = await sha256(currentPassword);
      const newHashed = await sha256(newPassword);

      // Verify current password first
      const verifyResponse = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username: DEFAULT_USERNAME,
          passwordHash: currentHashed
        })
      });

      if (!verifyResponse.ok) {
        setPasswordStatus({ success: false, message: "Password lama salah!" });
        return;
      }

      // Update password
      const updateResponse = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_password",
          newPasswordHash: newHashed,
          token: authToken
        })
      });

      const data = await updateResponse.json();
      if (updateResponse.ok && data.success) {
        setPasswordStatus({ success: true, message: "Password berhasil diganti!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordStatus({ success: false, message: data.error || "Gagal mengupdate password" });
      }
    } catch (e) {
      setPasswordStatus({ success: false, message: "Terjadi kesalahan koneksi." });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md rounded-[32px] border border-zinc-200/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/40 relative z-10">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-inner">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
              SapuRapi Admin Portal
            </h1>
            <p className="text-xs font-semibold text-zinc-400 mt-1">
              Masukkan kredensial untuk mengelola website
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
                ⚠️ {authError}
              </div>
            )}

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white/50 py-3.5 pl-11 pr-4 text-sm font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white/50 py-3.5 pl-11 pr-11 text-sm font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full rounded-full bg-blue-600 hover:bg-blue-700 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
            >
              {isAuthLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-zinc-650 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              ← Kembali ke Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fallback loading state if draftConfig is not populated yet
  if (!draftConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      {/* Admin Navbar — fully responsive */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/50 bg-white/80 dark:border-zinc-900/60 dark:bg-black/80 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-9 w-9 rounded-xl border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Settings className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
              SapuRapi Dashboard
            </h1>
            <p className="text-[10px] font-bold text-zinc-400">
              Pengaturan & Pembaruan Konten
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="/"
            className="hidden sm:flex rounded-full border border-zinc-200/60 bg-white/50 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/20 dark:hover:bg-zinc-900 px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-300 items-center gap-2 transition-all"
          >
            Lihat Website
          </a>

          <button
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/10 flex items-center gap-1.5 sm:gap-2 transition-all"
          >
            <span className="hidden sm:inline">{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            <span className="sm:hidden">{isSaving ? "..." : "Simpan"}</span>
            <Save className="h-4 w-4" />
          </button>

          <button
            onClick={handleLogout}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-zinc-200/60 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-rose-500 transition-colors shrink-0"
            title="Keluar"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid gap-4 sm:gap-6 md:grid-cols-12">
        {/* Float Save Status Alerts */}
        {saveStatus && (
          <div
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3 sm:p-4 rounded-2xl border shadow-xl flex items-center gap-2 sm:gap-3 animate-scaleIn ${
              saveStatus.success
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-rose-500/10 border-rose-500/20 text-rose-500"
            }`}
          >
            {saveStatus.success ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <span>⚠️</span>}
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{saveStatus.message}</span>
          </div>
        )}

        {/* Left Sidebar Navigation — responsive overlay on mobile */}
        <aside className={`md:col-span-3 space-y-2 ${
          mobileMenuOpen
            ? "fixed inset-0 top-[57px] z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 overflow-y-auto"
            : "hidden md:block"
        }`}>
          {[
            { id: "visitors", label: "Statistik Pengunjung", icon: BarChart3 },
            { id: "profile", label: "Profil Bisnis", icon: Building },
            { id: "pricing", label: "Tarif Paket", icon: Home },
            { id: "rooms", label: "Daftar Ruangan", icon: Building },
            { id: "zones", label: "Ongkir & Jarak", icon: MapPin },
            { id: "ironing", label: "Tarif Setrika", icon: Shirt },
            { id: "features", label: "Keunggulan", icon: ShieldCheck },
            { id: "faqs", label: "FAQ Tanya Jawab", icon: HelpCircle },
            { id: "account", label: "Keamanan Sandi", icon: Lock }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPasswordStatus(null);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "border-blue-500 bg-blue-500/5 text-blue-600 dark:border-blue-400 dark:bg-blue-400/5"
                    : "border-zinc-200/50 bg-white/50 hover:bg-zinc-50 dark:border-zinc-900/60 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <IconComponent className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}

          {/* Mobile-only: Back to website link */}
          <a
            href="/"
            className="md:hidden w-full text-left flex items-center gap-3 p-3 rounded-2xl border border-zinc-200/50 bg-white/50 dark:border-zinc-900/60 dark:bg-zinc-950/20 text-zinc-500 dark:text-zinc-400 text-xs font-bold transition-all hover:bg-zinc-50"
          >
            <Globe className="h-4 w-4 shrink-0" />
            Lihat Website
          </a>
        </aside>

        {/* Right Dashboard Sheet (9 Cols) */}
        <main className="md:col-span-9 rounded-[24px] sm:rounded-[32px] border border-zinc-200/50 bg-white/70 p-4 sm:p-6 md:p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/20 space-y-6 sm:space-y-8 min-h-[400px] sm:min-h-[500px]">
          
          {/* TAB 0: VISITOR STATS */}
          {activeTab === "visitors" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  Statistik Pengunjung Website
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                  Pantau jumlah pengunjung harian dan total kunjungan website Anda.
                </p>
              </div>

              {isLoadingStats ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : visitorStats ? (
                <>
                  {/* Stats Cards */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-zinc-200/50 bg-gradient-to-br from-blue-500/5 to-blue-600/10 p-5 dark:border-zinc-800/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                          <Globe className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Kunjungan</span>
                      </div>
                      <p className="text-3xl font-black text-zinc-900 dark:text-white">
                        {visitorStats.totalVisits.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-zinc-200/50 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 p-5 dark:border-zinc-800/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                          <Users className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Hari Ini</span>
                      </div>
                      <p className="text-3xl font-black text-zinc-900 dark:text-white">
                        {visitorStats.todayVisits.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Daily Chart (simple bar visualization) */}
                  {visitorStats.dailyHistory.length > 0 && (
                    <div className="rounded-[20px] border border-zinc-200/50 bg-white/40 dark:border-zinc-800/50 dark:bg-zinc-950/20 p-5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        Grafik Kunjungan 7 Hari Terakhir
                      </h3>
                      <div className="flex items-end gap-2 h-32">
                        {visitorStats.dailyHistory.map((day) => {
                          const maxVisits = Math.max(...visitorStats.dailyHistory.map((d) => d.visits), 1);
                          const heightPercent = (day.visits / maxVisits) * 100;
                          return (
                            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[9px] font-bold text-zinc-400">{day.visits}</span>
                              <div
                                className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500 min-h-[4px]"
                                style={{ height: `${Math.max(heightPercent, 3)}%` }}
                              />
                              <span className="text-[8px] font-bold text-zinc-400 truncate w-full text-center">
                                {day.date.slice(5)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recent Visitors Table */}
                  {visitorStats.recentVisitors.length > 0 && (
                    <div className="rounded-[20px] border border-zinc-200/50 bg-white/40 dark:border-zinc-800/50 dark:bg-zinc-950/20 p-5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                        <Users className="h-4 w-4 text-emerald-500" />
                        Pengunjung Terakhir
                      </h3>
                      <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-[10px] font-bold">
                          <thead>
                            <tr className="text-zinc-400 uppercase tracking-wider border-b border-zinc-200/40 dark:border-zinc-800/40">
                              <th className="text-left p-2">Waktu</th>
                              <th className="text-left p-2">Halaman</th>
                              <th className="text-left p-2 hidden sm:table-cell">Sumber</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visitorStats.recentVisitors.slice(0, 15).map((v, i) => (
                              <tr key={i} className="border-b border-zinc-100/40 dark:border-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                                <td className="p-2 whitespace-nowrap">
                                  {new Date(v.timestamp).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                                </td>
                                <td className="p-2">{v.page || "/"}</td>
                                <td className="p-2 hidden sm:table-cell truncate max-w-[200px]">{v.referrer || "Langsung"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <BarChart3 className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-400">Belum ada data pengunjung</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: PROFIL BISNIS */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  Profil & Kontak Bisnis
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                  Kelola nama brand, deskripsi layanan, jam buka, dan sosmed.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Nama Bisnis / Brand
                  </label>
                  <input
                    type="text"
                    value={draftConfig.BUSINESS_CONFIG.name}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "name"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={draftConfig.BUSINESS_CONFIG.workingHours}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "workingHours"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Tagline Bisnis
                  </label>
                  <input
                    type="text"
                    value={draftConfig.BUSINESS_CONFIG.tagline}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "tagline"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Deskripsi Singkat (Hero)
                  </label>
                  <textarea
                    rows={3}
                    value={draftConfig.BUSINESS_CONFIG.description}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "description"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Nomor WhatsApp Admin (Kode Negara 62)
                  </label>
                  <input
                    type="text"
                    value={draftConfig.BUSINESS_CONFIG.phone}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "phone"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Contoh: 628123456789"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Area Layanan
                  </label>
                  <input
                    type="text"
                    value={draftConfig.BUSINESS_CONFIG.area}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "area"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Username Instagram
                  </label>
                  <input
                    type="text"
                    value={draftConfig.BUSINESS_CONFIG.instagram}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "instagram"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Username TikTok
                  </label>
                  <input
                    type="text"
                    value={draftConfig.BUSINESS_CONFIG.tiktok}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "tiktok"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Link Google Maps
                  </label>
                  <input
                    type="text"
                    value={draftConfig.BUSINESS_CONFIG.googleMapsLink}
                    onChange={(e) => updateDraft(["BUSINESS_CONFIG", "googleMapsLink"], e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TARIF PAKET HUNIAN */}
          {activeTab === "pricing" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  Tarif Layanan Hunian
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                  Atur tarif pembersihan rumah per m², flat rate kost, apartemen, serta batas minimal order.
                </p>
              </div>

              {/* 1. Paket Rumah */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                  <Home className="h-4 w-4 text-blue-500" />
                  Tarif Pembersihan Rumah (m²)
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                      Reguler (Alat Pribadi) / m²
                    </label>
                    <input
                      type="number"
                      value={draftConfig.HOUSE_PACKAGE.regulerPribadiPerM2}
                      onChange={(e) => updateDraft(["HOUSE_PACKAGE", "regulerPribadiPerM2"], Number(e.target.value))}
                      className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                      Reguler (Alat Mitra) / m²
                    </label>
                    <input
                      type="number"
                      value={draftConfig.HOUSE_PACKAGE.regulerMitraPerM2}
                      onChange={(e) => updateDraft(["HOUSE_PACKAGE", "regulerMitraPerM2"], Number(e.target.value))}
                      className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                      Deep Clean (Alat Mitra) / m²
                    </label>
                    <input
                      type="number"
                      value={draftConfig.HOUSE_PACKAGE.deepMitraPerM2}
                      onChange={(e) => updateDraft(["HOUSE_PACKAGE", "deepMitraPerM2"], Number(e.target.value))}
                      className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-zinc-200/50 dark:border-zinc-800/40" />

              {/* 2. Paket Kost & Apartemen */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Kost */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                    <Building className="h-4 w-4 text-emerald-500" />
                    Tarif Flat Kost (3x4m)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                        Reguler (Alat Pribadi)
                      </label>
                      <input
                        type="number"
                        value={draftConfig.KOST_PACKAGE.regulerPribadi}
                        onChange={(e) => updateDraft(["KOST_PACKAGE", "regulerPribadi"], Number(e.target.value))}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                        Reguler (Alat Mitra)
                      </label>
                      <input
                        type="number"
                        value={draftConfig.KOST_PACKAGE.regulerMitra}
                        onChange={(e) => updateDraft(["KOST_PACKAGE", "regulerMitra"], Number(e.target.value))}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                        Deep Clean (Alat Mitra)
                      </label>
                      <input
                        type="number"
                        value={draftConfig.KOST_PACKAGE.deepMitra}
                        onChange={(e) => updateDraft(["KOST_PACKAGE", "deepMitra"], Number(e.target.value))}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Apartemen */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    Tarif Flat Apartemen
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                        Reguler (Alat Pribadi)
                      </label>
                      <input
                        type="number"
                        value={draftConfig.APARTMENT_PACKAGE.regulerPribadi}
                        onChange={(e) => updateDraft(["APARTMENT_PACKAGE", "regulerPribadi"], Number(e.target.value))}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                        Reguler (Alat Mitra)
                      </label>
                      <input
                        type="number"
                        value={draftConfig.APARTMENT_PACKAGE.regulerMitra}
                        onChange={(e) => updateDraft(["APARTMENT_PACKAGE", "regulerMitra"], Number(e.target.value))}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                        Deep Clean (Alat Mitra)
                      </label>
                      <input
                        type="number"
                        value={draftConfig.APARTMENT_PACKAGE.deepMitra}
                        onChange={(e) => updateDraft(["APARTMENT_PACKAGE", "deepMitra"], Number(e.target.value))}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-zinc-200/50 dark:border-zinc-800/40" />

              {/* 3. Batas Minimal Order Global */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
                  Batas Minimal Pembelian Sekali Panggil (Rp)
                </h3>
                <div className="max-w-xs">
                  <input
                    type="number"
                    value={draftConfig.MIN_ORDER_PRICE}
                    onChange={(e) => updateDraft(["MIN_ORDER_PRICE"], Number(e.target.value))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                  />
                  <p className="text-[10px] font-semibold text-zinc-400 mt-2">
                    Untuk menutup operasional bensin mitra. Dibulatkan otomatis jika pesanan kurang dari batas ini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DAFTAR RUANGAN SATUAN (CRUD) */}
          {activeTab === "rooms" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                    Pengaturan Paket Ruangan Satuan
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                    Tambahkan, edit, atau hapus jenis ruangan satuan untuk Tab 3 kalkulator.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newId = `room_${Date.now()}`;
                    const newRooms = [
                      ...draftConfig.ROOM_SERVICES,
                      { id: newId, name: "Ruangan Baru", regulerPrice: 30000, deepPrice: 60000 }
                    ];
                    updateDraft(["ROOM_SERVICES"], newRooms);
                  }}
                  className="rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5"
                >
                  Tambah Ruang
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                {draftConfig.ROOM_SERVICES.map((room: any, index: number) => (
                  <div
                    key={room.id}
                    className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-zinc-200/50 bg-white/40 dark:border-zinc-850 dark:bg-zinc-950/20"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                        Nama Ruangan
                      </label>
                      <input
                        type="text"
                        value={room.name}
                        onChange={(e) => {
                          const updated = [...draftConfig.ROOM_SERVICES];
                          updated[index].name = e.target.value;
                          updateDraft(["ROOM_SERVICES"], updated);
                        }}
                        className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                      />
                    </div>
                    
                    <div className="w-28">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                        Tarif Reguler
                      </label>
                      <input
                        type="number"
                        value={room.regulerPrice}
                        onChange={(e) => {
                          const updated = [...draftConfig.ROOM_SERVICES];
                          updated[index].regulerPrice = Number(e.target.value);
                          updateDraft(["ROOM_SERVICES"], updated);
                        }}
                        className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="w-28">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                        Tarif Deep Clean
                      </label>
                      <input
                        type="number"
                        value={room.deepPrice}
                        onChange={(e) => {
                          const updated = [...draftConfig.ROOM_SERVICES];
                          updated[index].deepPrice = Number(e.target.value);
                          updateDraft(["ROOM_SERVICES"], updated);
                        }}
                        className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = draftConfig.ROOM_SERVICES.filter((r: any) => r.id !== room.id);
                        updateDraft(["ROOM_SERVICES"], updated);
                      }}
                      className="mt-5 h-9 w-9 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white dark:border-rose-950 dark:text-rose-400 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors"
                      title="Hapus Ruangan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JARAK & ONGKOS KIRIM (CRUD) */}
          {activeTab === "zones" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                    Ketentuan Ongkir & Wilayah Radius
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                    CRUD tarif pengiriman luar kota Bandung untuk kalkulator.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newId = `zona${draftConfig.TRANSPORT_ZONES.length + 1}`;
                    const newZones = [
                      ...draftConfig.TRANSPORT_ZONES,
                      { id: newId, name: `Zona ${draftConfig.TRANSPORT_ZONES.length + 1}: Baru`, fee: 15000, desc: "Ongkir Rp 15.000" }
                    ];
                    updateDraft(["TRANSPORT_ZONES"], newZones);
                  }}
                  className="rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5"
                >
                  Tambah Zona
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                {draftConfig.TRANSPORT_ZONES.map((zone: any, index: number) => (
                  <div
                    key={zone.id}
                    className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-zinc-200/50 bg-white/40 dark:border-zinc-850 dark:bg-zinc-950/20"
                  >
                    <div className="w-20">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                        ID Zona
                      </label>
                      <input
                        type="text"
                        value={zone.id}
                        disabled
                        className="w-full rounded-xl border border-zinc-200/60 bg-zinc-100/50 px-3 py-2 text-xs font-bold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/30 cursor-not-allowed"
                      />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                        Nama & Keterangan Zona
                      </label>
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => {
                          const updated = [...draftConfig.TRANSPORT_ZONES];
                          updated[index].name = e.target.value;
                          updateDraft(["TRANSPORT_ZONES"], updated);
                        }}
                        className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                      />
                    </div>
                    
                    <div className="w-28">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                        Tarif Ongkos Kirim (Rp)
                      </label>
                      <input
                        type="number"
                        value={zone.fee}
                        onChange={(e) => {
                          const updated = [...draftConfig.TRANSPORT_ZONES];
                          updated[index].fee = Number(e.target.value);
                          updateDraft(["TRANSPORT_ZONES"], updated);
                        }}
                        className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="w-36">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                        Subteks Deskripsi
                      </label>
                      <input
                        type="text"
                        value={zone.desc}
                        onChange={(e) => {
                          const updated = [...draftConfig.TRANSPORT_ZONES];
                          updated[index].desc = e.target.value;
                          updateDraft(["TRANSPORT_ZONES"], updated);
                        }}
                        className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={index === 0} // Lock Zona 1 (Free)
                      onClick={() => {
                        const updated = draftConfig.TRANSPORT_ZONES.filter((z: any) => z.id !== zone.id);
                        updateDraft(["TRANSPORT_ZONES"], updated);
                      }}
                      className="mt-5 h-9 w-9 rounded-xl border border-rose-250 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400 dark:border-rose-950 dark:text-rose-400 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors"
                      title="Hapus Zona"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TARIF JASA SETRIKA */}
          {activeTab === "ironing" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  Tarif Jasa Setrika Pakaian
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                  Atur tarif per jam dan batas minimum jam pengerjaan jasa gosok setrika pakaian.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Tarif Jasa per Jam (Rp)
                  </label>
                  <input
                    type="number"
                    value={draftConfig.IRONING_SERVICE.ratePerHour}
                    onChange={(e) => updateDraft(["IRONING_SERVICE", "ratePerHour"], Number(e.target.value))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Batas Minimal Order Setrika (Jam)
                  </label>
                  <input
                    type="number"
                    value={draftConfig.IRONING_SERVICE.minHours}
                    onChange={(e) => updateDraft(["IRONING_SERVICE", "minHours"], Number(e.target.value))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: KEUNGGULAN (CRUD) */}
          {activeTab === "features" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                    Keunggulan SapuRapi
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                    CRUD poin-poin keunggulan layanan di halaman depan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFeatures = [
                      ...draftConfig.WHY_CHOOSE_US,
                      { title: "Keunggulan Baru", description: "Deskripsi keunggulan baru kami.", icon: "Sparkles" }
                    ];
                    updateDraft(["WHY_CHOOSE_US"], newFeatures);
                  }}
                  className="rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5"
                >
                  Tambah Poin
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {draftConfig.WHY_CHOOSE_US.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="p-5 rounded-[24px] border border-zinc-200/50 bg-white/40 dark:border-zinc-850 dark:bg-zinc-950/20 relative"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const updated = draftConfig.WHY_CHOOSE_US.filter((_: any, idx: number) => idx !== index);
                        updateDraft(["WHY_CHOOSE_US"], updated);
                      }}
                      className="absolute top-4 right-4 h-8 w-8 rounded-full border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white dark:border-rose-950 dark:text-rose-450 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors"
                      title="Hapus Keunggulan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid gap-4 sm:grid-cols-3 pr-8">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                          Icon Lucide (Nama Icon)
                        </label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => {
                            const updated = [...draftConfig.WHY_CHOOSE_US];
                            updated[index].icon = e.target.value;
                            updateDraft(["WHY_CHOOSE_US"], updated);
                          }}
                          className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                          placeholder="e.g. ShieldCheck, Clock, Sparkles"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                          Judul Poin
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...draftConfig.WHY_CHOOSE_US];
                            updated[index].title = e.target.value;
                            updateDraft(["WHY_CHOOSE_US"], updated);
                          }}
                          className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                          Deskripsi Keunggulan
                        </label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...draftConfig.WHY_CHOOSE_US];
                            updated[index].description = e.target.value;
                            updateDraft(["WHY_CHOOSE_US"], updated);
                          }}
                          className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FAQ TANYA JAWAB (CRUD) */}
          {activeTab === "faqs" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                    FAQ Tanya Jawab Accordion
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                    CRUD daftar pertanyaan dan jawaban FAQ accordion di website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFaqs = [
                      ...draftConfig.FAQS,
                      { question: "Pertanyaan Baru?", answer: "Jawaban dari pertanyaan baru kami." }
                    ];
                    updateDraft(["FAQS"], newFaqs);
                  }}
                  className="rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5"
                >
                  Tambah FAQ
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {draftConfig.FAQS.map((faq: any, index: number) => (
                  <div
                    key={index}
                    className="p-5 rounded-[24px] border border-zinc-200/50 bg-white/40 dark:border-zinc-850 dark:bg-zinc-950/20 relative"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const updated = draftConfig.FAQS.filter((_: any, idx: number) => idx !== index);
                        updateDraft(["FAQS"], updated);
                      }}
                      className="absolute top-4 right-4 h-8 w-8 rounded-full border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white dark:border-rose-950 dark:text-rose-450 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors"
                      title="Hapus FAQ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="space-y-4 pr-8">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                          Pertanyaan (Question)
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...draftConfig.FAQS];
                            updated[index].question = e.target.value;
                            updateDraft(["FAQS"], updated);
                          }}
                          className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1 block">
                          Jawaban (Answer)
                        </label>
                        <textarea
                          rows={3}
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...draftConfig.FAQS];
                            updated[index].answer = e.target.value;
                            updateDraft(["FAQS"], updated);
                          }}
                          className="w-full rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: KEAMANAN / UBAH PASSWORD */}
          {activeTab === "account" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  Pengaturan Keamanan
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                  Ubah kata sandi untuk masuk ke Dashboard Admin.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                {passwordStatus && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs font-bold ${
                      passwordStatus.success
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                    }`}
                  >
                    {passwordStatus.success ? "✓" : "⚠️"} {passwordStatus.message}
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/50 p-3.5 text-xs font-bold text-zinc-950 dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/10 transition-all"
                >
                  Ubah Kata Sandi
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
