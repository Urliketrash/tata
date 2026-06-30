"use client";

import React, { useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { Sparkle, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User } from "lucide-react";

export default function Hero() {
  const { config } = useConfig();
  const { BUSINESS_CONFIG } = config;
  // 3D Card Tilt State for the Right Column Widget
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, go: 0 });
  const [clickSplash, setClickSplash] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Cap tilt angle at 12 degrees max
    const rx = -((y - yc) / yc) * 12;
    const ry = ((x - xc) / xc) * 12;
    setTilt({
      rx,
      ry,
      mx: (x / rect.width) * 100,
      my: (y / rect.height) * 100,
      go: 1,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, go: 0 });
  };

  const triggerSplash = () => {
    setClickSplash(true);
    setTimeout(() => setClickSplash(false), 800);
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background Pastel Blobs - Premium floating layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -left-60 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[130px] dark:bg-blue-900/10 animate-blob" />
        <div className="absolute top-40 -right-20 h-[450px] w-[450px] rounded-full bg-emerald-400/15 blur-[120px] dark:bg-emerald-900/10 animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-10 left-1/4 h-[420px] w-[420px] rounded-full bg-purple-400/10 blur-[140px] dark:bg-purple-900/5 animate-blob" style={{ animationDelay: "8s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Headline and Call-to-actions (7 Columns) */}
          <div className="text-center lg:text-left lg:col-span-7 space-y-6">
            
            {/* Luxury Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/10 bg-blue-50/45 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 backdrop-blur-md dark:border-blue-400/10 dark:bg-blue-950/20 dark:text-blue-400">
              <Sparkle className="h-3.5 w-3.5 fill-blue-500/20 text-blue-500 dark:text-blue-400" />
              <span>Premium Home Cleaning Service</span>
            </div>

            {/* Headline */}
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl md:text-6xl dark:text-white leading-[1.1] sm:leading-[1.05]">
              Kost & Rumah Bersih
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-400 bg-clip-text text-transparent dark:from-blue-400 dark:via-sky-400 dark:to-emerald-400 text-specular">
                Tanpa Perlu Angkat Sapu
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-xl mx-auto lg:mx-0 text-sm font-medium text-zinc-500 dark:text-zinc-400 sm:text-base leading-relaxed">
              Layanan kebersihan eksklusif untuk kost dan rumah di wilayah <span className="font-semibold text-zinc-800 dark:text-zinc-200">Bandung</span>. Dikerjakan oleh helper terlatih dengan harga transparan dan pemesanan instan.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#kalkulator"
                className="rounded-full bg-blue-600 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:scale-[1.03] active:scale-[0.97] dark:bg-blue-500 dark:hover:bg-blue-600 inline-flex items-center justify-center gap-2.5"
              >
                Hitung Estimasi Harga
                <ArrowRight className="h-4.5 w-4.5" />
              </a>
              <a
                href="#layanan"
                className="rounded-full border border-zinc-200 bg-white/40 px-8 py-4 text-xs font-bold uppercase tracking-wider text-zinc-600 backdrop-blur-sm transition-all hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-850 dark:bg-black/50 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white inline-flex items-center justify-center gap-2.5"
              >
                Lihat Paket Layanan
              </a>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 pt-6 text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                <span>100% Kepuasan Pelanggan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-blue-500" />
                <span>Helper Terlatih & Terpercaya</span>
              </div>
            </div>

          </div>

          {/* Right Column: Premium 3D interactive widget (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={triggerSplash}
              style={{
                "--rx": `${tilt.rx}deg`,
                "--ry": `${tilt.ry}deg`,
                "--mx": `${tilt.mx}%`,
                "--my": `${tilt.my}%`,
                "--go": tilt.go,
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)`,
              } as React.CSSProperties}
              className="tilt-card cursor-pointer w-full max-w-[340px] aspect-[4/5] rounded-[36px] glass-panel dark:glass-panel-dark border border-white/30 dark:border-white/5 p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group select-none transition-transform duration-200 ease-out"
            >
              {/* Glossy lighting glare overlay */}
              <div className="tilt-card-glare" />

              {/* Hologram Grid Accent */}
              <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-10 pointer-events-none" />

              {/* Widget Header */}
              <div className="flex justify-between items-start z-20">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    SapuRapi Live Status
                  </span>
                </div>
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                  <Sparkles className="h-4 w-4 animate-spin-slow" />
                </div>
              </div>

              {/* Center interactive 3D Isometric Room Progress */}
              <div className="flex flex-col items-center justify-center py-4 z-20 relative w-full">
                
                {/* 3D Room Box */}
                <div className="relative h-44 w-full flex items-center justify-center">
                  
                  {/* Glowing core background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-2xl animate-pulse" />
                  
                  {/* SVG Isometric Room Visualizer */}
                  <svg
                    viewBox="0 0 240 200"
                    className="w-full h-full max-w-[220px] filter drop-shadow-[0_12px_24px_rgba(59,130,246,0.15)] group-hover:scale-105 transition-transform duration-500"
                  >
                    <style dangerouslySetInnerHTML={{ __html: `
                      @keyframes float {
                        0%, 100% { transform: translateY(0px) translateX(0px); }
                        50% { transform: translateY(-3px) translateX(2px); }
                      }
                      @keyframes sweep {
                        0% { transform: translate(-150px, -100px); }
                        100% { transform: translate(150px, 100px); }
                      }
                      @keyframes pulse-glowing {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 0.9; transform: scale(1.05); }
                      }
                      .svg-float {
                        animation: float 4s ease-in-out infinite;
                      }
                      .svg-sweep {
                        animation: sweep 6s linear infinite;
                      }
                      .svg-glow {
                        animation: pulse-glowing 2.5s ease-in-out infinite;
                      }
                    `}} />
                    <defs>
                      {/* Gradients */}
                      <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f4f4f5" className="dark:stop-color-zinc-800" />
                        <stop offset="100%" stopColor="#e4e4e7" className="dark:stop-color-zinc-900" />
                      </linearGradient>
                      <linearGradient id="wallLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
                      </linearGradient>
                      <linearGradient id="wallRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
                      </linearGradient>
                      <linearGradient id="sofaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                        <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.4" />
                        <stop offset="70%" stopColor="#34d399" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Floor (Rhombus) */}
                    <polygon
                      points="120,30 210,75 120,120 30,75"
                      fill="url(#floorGrad)"
                      stroke="#d4d4d8"
                      strokeWidth="1"
                      className="stroke-zinc-300 dark:stroke-zinc-800"
                    />

                    {/* Wall Left */}
                    <polygon
                      points="30,75 120,120 120,175 30,130"
                      fill="url(#wallLeftGrad)"
                      stroke="#d4d4d8"
                      strokeWidth="0.5"
                      className="stroke-zinc-300 dark:stroke-zinc-800"
                    />

                    {/* Wall Right */}
                    <polygon
                      points="120,120 210,75 210,130 120,175"
                      fill="url(#wallRightGrad)"
                      stroke="#d4d4d8"
                      strokeWidth="0.5"
                      className="stroke-zinc-300 dark:stroke-zinc-800"
                    />

                    {/* Grid floor lines (isometric details) */}
                    <line x1="75" y1="52.5" x2="165" y2="97.5" stroke="#d4d4d8" strokeWidth="0.5" className="stroke-zinc-200 dark:stroke-zinc-800" />
                    <line x1="165" y1="52.5" x2="75" y2="97.5" stroke="#d4d4d8" strokeWidth="0.5" className="stroke-zinc-200 dark:stroke-zinc-800" />

                    {/* Window on Left Wall */}
                    <polygon
                      points="50,90 70,100 70,130 50,120"
                      fill="url(#glassGrad)"
                    />
                    {/* Window shining reflection lines */}
                    <polygon
                      points="55,92.5 60,95 60,125 55,122.5"
                      fill="#ffffff"
                      fillOpacity="0.4"
                    />

                    {/* 3D Isometric Bed/Sofa */}
                    {/* Bed Base */}
                    <polygon points="120,95 155,77.5 180,90 145,107.5" fill="#e4e4e7" className="fill-zinc-200 dark:fill-zinc-950" />
                    {/* Mattress */}
                    <polygon points="120,91 155,73.5 180,86 145,103.5" fill="url(#sofaGrad)" />
                    {/* Pillow */}
                    <polygon points="150,78 160,73 172,79 162,84" fill="#ffffff" />

                    {/* Cleaning Tool: Vacuum Cleaner robot (pulsing disc on the floor) */}
                    <g className="svg-float">
                      {/* Shadow under vacuum */}
                      <ellipse cx="90" cy="98" rx="12" ry="6" fill="#000000" fillOpacity="0.15" />
                      {/* Body */}
                      <ellipse cx="90" cy="95" rx="12" ry="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" className="dark:fill-zinc-800" />
                      {/* Pulsing light */}
                      <circle cx="90" cy="95" r="3" fill="#38bdf8" className="svg-glow" />
                    </g>

                    {/* Sparkling stars (frequent clean glints) */}
                    <g className="svg-glow">
                      {/* Sparkles */}
                      <path d="M60,65 L62,68 L66,69 L62,70 L60,73 L58,70 L54,69 L58,68 Z" fill="#fbbf24" />
                      <path d="M150,55 L152,58 L156,59 L152,60 L150,63 L148,60 L144,59 L148,58 Z" fill="#60a5fa" />
                      <path d="M125,125 L127,128 L131,129 L127,130 L125,133 L123,130 L119,129 L123,128 Z" fill="#34d399" />
                    </g>

                    {/* Sweep shining beam */}
                    <polygon
                      points="20,-20 80,-20 220,220 160,220"
                      fill="url(#sweepGrad)"
                      className="svg-sweep pointer-events-none mix-blend-screen"
                    />
                  </svg>
                  
                </div>

                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Sparkle className="h-3 w-3 text-amber-500 fill-amber-500 animate-spin-slow" />
                  Visualisasi Progress Kebersihan
                </p>
              </div>

              {/* Widget Footer: Real-time Stats */}
              <div className="space-y-3 z-20">
                <hr className="border-zinc-200/50 dark:border-zinc-800/40" />
                <div className="flex justify-between items-center text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  <span>Helper Aktif</span>
                  <span className="text-zinc-900 dark:text-white font-extrabold flex items-center gap-1">
                    24 Helper Ready
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  <span>Rating Layanan</span>
                  <span className="text-zinc-900 dark:text-white font-extrabold text-amber-500">
                    4.9 / 5.0 ★
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  <span>Cakupan Area</span>
                  <span className="text-zinc-900 dark:text-white font-extrabold">
                    Kota Bandung
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Features Minimalist Bar / Glassmorphism Widget */}
        <div className="mx-auto mt-20 max-w-4xl rounded-3xl border border-white/40 bg-white/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.02)] backdrop-blur-xl dark:border-white/5 dark:bg-zinc-950/20">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">100%</span>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Jaminan Kepuasan
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Bandung</span>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Cakupan Layanan Luas
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
              <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Instan</span>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Tanpa Antre Tanya Harga
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
