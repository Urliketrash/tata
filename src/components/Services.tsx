"use client";

import React from "react";
import { SERVICES } from "@/config";
import { Check, Info, Sparkles } from "lucide-react";

export default function Services() {
  return (
    <section id="layanan" className="relative py-24 bg-zinc-100/40 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl dark:text-white leading-tight">
            Paket Layanan Profesional
          </h2>
          <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Kami menyediakan solusi pembersihan harian standar dan pembersihan menyeluruh yang disesuaikan untuk rumah & kost di Bandung.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {SERVICES.map((service) => {
            const isDeep = service.id === "deep";

            return (
              <div
                key={service.id}
                className={`relative flex flex-col justify-between rounded-[32px] p-8 sm:p-10 transition-all duration-500 ${
                  isDeep
                    ? "border-2 border-blue-500 bg-white shadow-xl shadow-blue-500/5 dark:bg-zinc-900/90 dark:border-blue-400"
                    : "border border-zinc-200/70 bg-white/60 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40"
                } hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/5`}
              >
                {/* Popular Badge */}
                {isDeep && (
                  <div className="absolute -top-3.5 right-10 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-1 text-[10px] font-black uppercase tracking-wider text-white dark:from-blue-500 dark:to-sky-400 flex items-center gap-1 shadow-md">
                    <Sparkles className="h-3 w-3 fill-white" />
                    <span>Terpopuler</span>
                  </div>
                )}

                <div>
                  {/* Name & Rate */}
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                      {service.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                        Rp {service.ratePerM2.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        {" "}/ m²
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>

                  <hr className="my-8 border-zinc-200/50 dark:border-zinc-800/50" />

                  {/* Feature list */}
                  <ul className="space-y-4">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-normal">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  <a
                    href="#kalkulator"
                    className={`block text-center w-full rounded-full py-4 text-xs font-bold uppercase tracking-wider transition-all ${
                      isDeep
                        ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-500/10"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    }`}
                  >
                    Hitung Tarif {service.name.split(" ")[0]}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small Notice */}
        <div className="mt-12 flex items-center justify-center gap-2.5 max-w-lg mx-auto text-center rounded-2xl bg-blue-500/5 border border-blue-500/10 p-4 backdrop-blur-sm dark:bg-blue-400/5 dark:border-blue-400/10">
          <Info className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Butuh jadwal rutin mingguan atau bulanan? Hubungi admin kami untuk mendapatkan harga kontrak langganan khusus yang lebih hemat.
          </span>
        </div>
      </div>
    </section>
  );
}
