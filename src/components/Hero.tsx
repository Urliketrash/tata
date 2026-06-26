"use client";

import React from "react";
import { BUSINESS_CONFIG } from "@/config";
import { Sparkles, ArrowRight, Home } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Pastel Blobs - iOS Style */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-300/30 blur-[100px] dark:bg-blue-900/10 animate-blob" />
        <div className="absolute top-60 -right-20 h-[350px] w-[350px] rounded-full bg-green-300/25 blur-[90px] dark:bg-green-900/10 animate-blob" />
        <div className="absolute -bottom-20 left-1/3 h-[380px] w-[380px] rounded-full bg-purple-300/20 blur-[110px] dark:bg-purple-900/5 animate-blob" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-blue-50/50 px-3.5 py-1 text-xs font-semibold text-blue-700 backdrop-blur-md dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400">
          <Sparkles className="h-3 w-3 fill-blue-100 text-blue-600 dark:text-blue-400" />
          <span>Jasa Bersih Terbaik di Bandung & Sekitarnya</span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl dark:text-white leading-[1.15]">
          Kost & Rumah Bersih Sempurna
          <span className="block mt-1 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
            Tanpa Perlu Repot Bersih-Bersih
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
          Layanan kebersihan kost dan rumah profesional di <span className="font-semibold text-zinc-800 dark:text-zinc-200">Bandung</span>. Cepat, detail, aman, dan harga transparan yang bisa dihitung secara real-time.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#kalkulator"
            className="rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600 inline-flex items-center justify-center gap-2"
          >
            Hitung Estimasi Harga
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#layanan"
            className="rounded-full border border-zinc-200/80 bg-white/50 px-8 py-4 text-base font-semibold text-zinc-700 backdrop-blur-sm transition-all hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800/80 dark:bg-black/50 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 inline-flex items-center justify-center gap-2"
          >
            Lihat Paket Layanan
          </a>
        </div>

        {/* Features Minimalist Bar */}
        <div className="mx-auto mt-20 max-w-4xl rounded-2xl border border-zinc-200/50 bg-white/40 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/20">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">100%</span>
              <span className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Kepuasan Pelanggan</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Bandung</span>
              <span className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Area Layanan Utama</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1 Menit</span>
              <span className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Estimasi Instan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
