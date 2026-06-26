"use client";

import React from "react";
import { WHY_CHOOSE_US } from "@/config";
import * as Icons from "lucide-react";

export default function Features() {
  return (
    <section id="keunggulan" className="py-20 bg-zinc-50/50 dark:bg-zinc-950/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Kenapa Memilih Jasa Bersih Kami?
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Kami berkomitmen memberikan layanan kebersihan terbaik untuk kost dan rumah Anda di Bandung dengan proses yang mudah dan aman.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, index) => {
            // Dinamika ambil ikon dari lucide
            const IconComponent = (Icons as any)[item.icon] || Icons.Sparkles;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-zinc-200/50 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50"
              >
                {/* Icon Container */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/30 dark:text-blue-400 dark:group-hover:bg-blue-500 dark:group-hover:text-black">
                  <IconComponent className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
