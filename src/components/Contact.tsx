"use client";

import React, { useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { ChevronDown, MessageSquare, Clock, MapPin, HelpCircle } from "lucide-react";

export default function Contact() {
  const { config } = useConfig();
  const { FAQS, BUSINESS_CONFIG } = config;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getInstagramUrl = (usernameOrUrl: string) => {
    if (!usernameOrUrl) return "#";
    if (usernameOrUrl.startsWith("http://") || usernameOrUrl.startsWith("https://")) {
      return usernameOrUrl;
    }
    return `https://instagram.com/${usernameOrUrl.replace("@", "").trim()}`;
  };

  const getTiktokUrl = (usernameOrUrl: string) => {
    if (!usernameOrUrl) return "#";
    if (usernameOrUrl.startsWith("http://") || usernameOrUrl.startsWith("https://")) {
      return usernameOrUrl;
    }
    return `https://tiktok.com/@${usernameOrUrl.replace("@", "").trim()}`;
  };

  const toggleFaq = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-zinc-50/20 dark:bg-black/20">
      {/* Background shape */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-10 h-[300px] w-[300px] rounded-full bg-blue-100/10 blur-[80px] dark:bg-blue-900/5 animate-blob" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-16 lg:grid-cols-12">
          
          {/* FAQ Column (7 Cols) */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl dark:text-white leading-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Menjawab kebingungan Anda secara cepat dan transparan mengenai layanan kami di Bandung.
            </p>

            <div className="mt-10 space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-blue-500 bg-white shadow-lg shadow-blue-500/5 dark:border-blue-500/30 dark:bg-zinc-900"
                        : "border-zinc-200/55 bg-white/40 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/30"
                    }`}
                  >
                    <button
                      suppressHydrationWarning
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between p-6 text-left font-bold text-sm text-zinc-950 dark:text-white focus:outline-none"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className={`h-4.5 w-4.5 shrink-0 transition-colors ${isOpen ? "text-blue-500" : "text-zinc-400"}`} />
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4.5 w-4.5 text-zinc-400 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-blue-500" : ""
                        }`}
                      />
                    </button>
                    
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-[300px] border-t border-zinc-100 dark:border-zinc-800" : "max-h-0"
                      }`}
                    >
                      <div className="p-6 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl dark:text-white leading-tight">
                Hubungi Admin & Area Kerja
              </h2>
              <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Punya kebutuhan custom atau area dengan kekotoran ekstrem? Tim admin kami siap merespons dengan cepat.
              </p>

               {/* Cards info */}
              <div className="mt-10 space-y-4">
                {/* Area Layanan */}
                <a
                  href={BUSINESS_CONFIG.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 rounded-2xl border border-zinc-200/50 bg-white/40 p-5 shadow-sm backdrop-blur-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-blue-500/30 transition-all dark:border-zinc-800/80 dark:bg-zinc-900/30 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      Cakupan Servis
                      <span className="text-[10px] text-blue-500 font-semibold lowercase tracking-normal group-hover:underline">(buka maps)</span>
                    </h4>
                    <p className="mt-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      {BUSINESS_CONFIG.area}
                    </p>
                  </div>
                </a>

                {/* Jam Kerja */}
                <div className="flex gap-4 rounded-2xl border border-zinc-200/50 bg-white/40 p-5 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Jam Operasional</h4>
                    <p className="mt-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Buka Setiap Hari: {BUSINESS_CONFIG.workingHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social links grid */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href={getInstagramUrl(BUSINESS_CONFIG.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200/50 bg-white/40 p-4 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 hover:scale-[1.03] transition-all dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  <svg
                    className="h-5 w-5 text-pink-500 fill-none stroke-current"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="text-xs font-bold tracking-wide">Instagram</span>
                </a>
                <a
                  href={getTiktokUrl(BUSINESS_CONFIG.tiktok)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200/50 bg-white/40 p-4 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 hover:scale-[1.03] transition-all dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  <svg
                    className="h-5 w-5 text-zinc-900 dark:text-white fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.09 1.13.9 2.53 1.39 4.01 1.48v3.91c-1.2-.07-2.39-.46-3.41-1.1-.9-.59-1.62-1.42-2.07-2.39-.02 2.19-.01 4.39-.02 6.58-.02 1.42-.31 2.87-1.04 4.08-.88 1.4-2.31 2.45-3.93 2.84-1.74.45-3.66.27-5.26-.54-1.61-.79-2.91-2.26-3.51-3.92-.68-1.75-.54-3.79.43-5.41.97-1.66 2.7-2.83 4.62-3.15.54-.08 1.09-.07 1.63-.01v3.96c-.63-.12-1.29-.08-1.9.11-.79.24-1.48.78-1.92 1.48-.48.74-.58 1.67-.3 2.5.26.85.89 1.55 1.71 1.89.87.38 1.89.33 2.72-.15.82-.46 1.37-1.35 1.44-2.29.02-3.08.01-6.16.02-9.24z" />
                  </svg>
                  <span className="text-xs font-bold tracking-wide">TikTok</span>
                </a>
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="mt-8 rounded-[24px] bg-blue-500/5 border border-blue-500/10 p-6 backdrop-blur-md">
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                Butuh Pemesanan Manual?
              </h4>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                Jika Anda ingin berkonsultasi mengenai kebutuhan custom di luar kalkulator kami, silakan chat langsung tim admin Bandung.
              </p>
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.phone}?text=Halo%20${encodeURIComponent(BUSINESS_CONFIG.name)}%2C%20saya%20ingin%20tanya-tanya%20mengenai%20layanan%20bersih-bersih%20rumah.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full rounded-full bg-blue-600 py-3.5 font-bold uppercase tracking-wider text-xs text-white transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
              >
                <MessageSquare className="h-4 w-4 fill-white text-blue-600 dark:text-blue-500" />
                Hubungi Admin
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
