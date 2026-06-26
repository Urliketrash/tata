"use client";

import React from "react";
import { BUSINESS_CONFIG } from "@/config";
import { Sparkles, ArrowRight, ShieldCheck, Sparkle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      {/* Background Pastel Blobs - Premium floating layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -left-60 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[130px] dark:bg-blue-900/10 animate-blob" />
        <div className="absolute top-40 -right-20 h-[450px] w-[450px] rounded-full bg-emerald-400/15 blur-[120px] dark:bg-emerald-900/10 animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-10 left-1/4 h-[420px] w-[420px] rounded-full bg-purple-400/10 blur-[140px] dark:bg-purple-900/5 animate-blob" style={{ animationDelay: "8s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/10 bg-blue-50/45 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 backdrop-blur-md dark:border-blue-400/10 dark:bg-blue-950/20 dark:text-blue-400">
          <Sparkle className="h-3.5 w-3.5 fill-blue-500/20 text-blue-500 dark:text-blue-400" />
          <span>Premium Home Cleaning Service</span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-black tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white leading-[1.1] sm:leading-[1.05]">
          Kost & Rumah Bersih
          <span className="block mt-2 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-400 bg-clip-text text-transparent dark:from-blue-400 dark:via-sky-400 dark:to-emerald-400">
            Tanpa Perlu Angkat Sapu
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-8 max-w-2xl text-base font-medium text-zinc-500 dark:text-zinc-400 sm:text-lg leading-relaxed">
          Layanan kebersihan eksklusif untuk kost dan rumah di wilayah <span className="font-semibold text-zinc-800 dark:text-zinc-200">Bandung</span>. Dikerjakan oleh helper terlatih dengan harga transparan dan instan.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#kalkulator"
            className="rounded-full bg-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.04] active:scale-[0.96] dark:bg-blue-500 dark:hover:bg-blue-600 inline-flex items-center justify-center gap-2.5"
          >
            Hitung Estimasi Harga
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#layanan"
            className="rounded-full border border-zinc-200 bg-white/40 px-8 py-4 text-sm font-bold uppercase tracking-wider text-zinc-600 backdrop-blur-sm transition-all hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800 dark:bg-black/50 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white inline-flex items-center justify-center gap-2.5"
          >
            Lihat Paket Layanan
          </a>
        </div>

        {/* Features Minimalist Bar / Glassmorphism Widget */}
        <div className="mx-auto mt-24 max-w-4xl rounded-3xl border border-white/40 bg-white/30 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.02)] backdrop-blur-xl dark:border-white/5 dark:bg-zinc-950/20">
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
