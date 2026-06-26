"use client";

import React from "react";
import { SERVICES, BUSINESS_CONFIG } from "@/config";
import { Check, Info } from "lucide-react";

export default function Services() {
  return (
    <section id="layanan" className="relative py-20 bg-zinc-50/50 dark:bg-zinc-950/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Pilihan Paket Layanan
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Pilih jenis pembersihan yang sesuai dengan kebutuhan rumah atau kost Anda. Kami menawarkan harga transparan berdasarkan luas area.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {SERVICES.map((service, index) => {
            const isDeep = service.id === "deep";

            return (
              <div
                key={service.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  isDeep
                    ? "border-2 border-blue-500 bg-white shadow-md shadow-blue-500/5 dark:bg-zinc-900/90"
                    : "border border-zinc-200 bg-white/70 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/50"
                } hover:scale-[1.01] hover:shadow-lg`}
              >
                {/* Popular Badge */}
                {isDeep && (
                  <span className="absolute -top-3 right-8 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white dark:bg-blue-500">
                    Sangat Direkomendasikan
                  </span>
                )}

                <div>
                  {/* Name & Rate */}
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                      {service.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                        Rp {service.ratePerM2.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {" "}/ m²
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>

                  <hr className="my-6 border-zinc-100 dark:border-zinc-800" />

                  {/* Feature list */}
                  <ul className="space-y-3.5">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-normal">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href="#kalkulator"
                    className={`block text-center w-full rounded-full py-3.5 font-semibold transition-all ${
                      isDeep
                        ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                        : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 bg-white"
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
        <div className="mt-8 flex items-center justify-center gap-2 max-w-lg mx-auto text-center rounded-xl bg-blue-50/50 border border-blue-100/50 p-3 backdrop-blur-sm dark:bg-blue-950/10 dark:border-blue-900/20">
          <Info className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Harga di atas belum termasuk potongan diskon atau biaya khusus untuk area dengan kekotoran ekstrem.
          </span>
        </div>
      </div>
    </section>
  );
}
