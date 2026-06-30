"use client";

import React from "react";
import { useConfig } from "@/context/ConfigContext";

export default function Footer() {
  const { config } = useConfig();
  const { BUSINESS_CONFIG } = config;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/50 bg-white py-12 dark:border-zinc-800/50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Business Info */}
          <div className="text-center sm:text-left flex flex-col sm:flex-row items-center gap-3">
            <img
              src="/logo-3d.png"
              alt="SapuRapi Logo"
              className="h-20 w-auto object-contain"
            />
            <div className="text-center sm:text-left">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                {BUSINESS_CONFIG.name.includes(".") ? BUSINESS_CONFIG.name.split(".")[0] : BUSINESS_CONFIG.name}
                {BUSINESS_CONFIG.name.includes(".") && (
                  <span className="text-blue-500 font-semibold">
                    .{BUSINESS_CONFIG.name.split(".")[1]}
                  </span>
                )}
              </span>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Jasa bersih-bersih kost dan rumah terpercaya di Bandung.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <a href="#layanan" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Paket Layanan
            </a>
            <a href="#kalkulator" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Kalkulator Harga
            </a>
            <a href="#keunggulan" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Keunggulan
            </a>
            <a href="#faq" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Tanya Jawab
            </a>
          </div>

        </div>

        <hr className="my-8 border-zinc-100 dark:border-zinc-800/80" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-[11px] font-semibold text-zinc-400">
          <div>
            &copy; {currentYear} {BUSINESS_CONFIG.name}. Hak Cipta Dilindungi.
          </div>
          <div>
            Melayani area: {BUSINESS_CONFIG.area}
          </div>
        </div>
      </div>
    </footer>
  );
}
