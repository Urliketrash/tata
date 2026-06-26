"use client";

import React from "react";
import { ROOM_SERVICES, HOUSE_PACKAGE, KOST_PACKAGE, APARTMENT_PACKAGE, IRONING_SERVICE, MIN_ORDER_PRICE } from "@/config";
import { Check, Info, Sparkles, Shirt, Home, Building, HelpCircle } from "lucide-react";

export default function Services() {
  return (
    <section id="layanan" className="relative py-24 bg-zinc-100/40 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl dark:text-white leading-tight">
            Tarif & Paket Kebersihan
          </h2>
          <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Daftar tarif jujur dan transparan untuk seluruh cakupan layanan kami di Bandung. Silakan pilih paket terbaik Anda.
          </p>
        </div>

        {/* 1. Paket Kebersihan Hunian (Rumah, Kost, Apartemen) */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
            <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-black uppercase tracking-wider text-zinc-950 dark:text-white">
              Paket Hunian (Rumah, Kost & Apartemen)
            </h3>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* OPSI 1: Reguler (Alat Pribadi) */}
            <div className="rounded-[28px] border border-zinc-200 bg-white/60 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex flex-col justify-between hover:scale-[1.01] transition-all">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Alat Konsumen</span>
                <h4 className="text-xl font-black text-zinc-950 dark:text-white mt-1">Reguler (Alat Pribadi)</h4>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-2">Mitra hanya membawa tenaga kerja. Peralatan standar sapu/pel/cairan disiapkan pemesan.</p>
                
                <hr className="my-6 border-zinc-200/50 dark:border-zinc-800/50" />
                
                <ul className="space-y-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <li className="flex justify-between items-center">
                    <span>Rumah (m²)</span>
                    <span className="text-zinc-950 dark:text-white text-sm font-black">Rp {HOUSE_PACKAGE.regulerPribadiPerM2.toLocaleString("id-ID")}/m²</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Kost (Maks 3x4m)</span>
                    <span className="text-zinc-950 dark:text-white text-sm font-black">Rp {KOST_PACKAGE.regulerPribadi.toLocaleString("id-ID")}/flat</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Apartemen Studio</span>
                    <span className="text-zinc-950 dark:text-white text-sm font-black">Rp {APARTMENT_PACKAGE.regulerPribadi.toLocaleString("id-ID")}/flat</span>
                  </li>
                </ul>
              </div>
              <a href="#kalkulator" className="mt-8 text-center block w-full rounded-2xl border border-zinc-200 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-350 dark:hover:bg-zinc-900">
                Pilih Reguler Pribadi
              </a>
            </div>

            {/* OPSI 2: Reguler (Alat Mitra) - Terpopuler */}
            <div className="rounded-[28px] border-2 border-blue-500 bg-white p-8 shadow-xl shadow-blue-500/5 dark:bg-zinc-900/90 dark:border-blue-400 flex flex-col justify-between hover:scale-[1.01] transition-all relative">
              <div className="absolute -top-3.5 right-8 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-1 text-[9px] font-black uppercase tracking-wider text-white dark:from-blue-500 dark:to-sky-400 shadow-md">
                Paling Nyaman
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Alat Disediakan</span>
                <h4 className="text-xl font-black text-zinc-950 dark:text-white mt-1">Reguler (Alat Mitra)</h4>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-2">Mitra membawa cairan pembersih standar & alat lengkap (sapu, pel, lap microfiber, sikat).</p>
                
                <hr className="my-6 border-zinc-200/50 dark:border-zinc-800/50" />
                
                <ul className="space-y-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <li className="flex justify-between items-center">
                    <span>Rumah (m²)</span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-black">Rp {HOUSE_PACKAGE.regulerMitraPerM2.toLocaleString("id-ID")}/m²</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Kost (Maks 3x4m)</span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-black">Rp {KOST_PACKAGE.regulerMitra.toLocaleString("id-ID")}/flat</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Apartemen Studio</span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-black">Rp {APARTMENT_PACKAGE.regulerMitra.toLocaleString("id-ID")}/flat</span>
                  </li>
                </ul>
              </div>
              <a href="#kalkulator" className="mt-8 text-center block w-full rounded-2xl bg-blue-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 shadow-md shadow-blue-500/10">
                Pilih Reguler Mitra
              </a>
            </div>

            {/* OPSI 3: Deep Clean (Wajib Alat Mitra) */}
            <div className="rounded-[28px] border border-zinc-200 bg-white/60 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex flex-col justify-between hover:scale-[1.01] transition-all">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pembersihan Total</span>
                <h4 className="text-xl font-black text-zinc-950 dark:text-white mt-1">Deep Clean (Wajib Alat)</h4>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-2">Pembersihan detail kerak kamar mandi, kaca jendela, sedot debu kasur vakum, dan disinfeksi ruangan.</p>
                
                <hr className="my-6 border-zinc-200/50 dark:border-zinc-800/50" />
                
                <ul className="space-y-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <li className="flex justify-between items-center">
                    <span>Rumah (m²)</span>
                    <span className="text-zinc-950 dark:text-white text-sm font-black">Rp {HOUSE_PACKAGE.deepMitraPerM2.toLocaleString("id-ID")}/m²</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Kost (Maks 3x4m)</span>
                    <span className="text-zinc-950 dark:text-white text-sm font-black">Rp {KOST_PACKAGE.deepMitra.toLocaleString("id-ID")}/flat</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Apartemen Studio</span>
                    <span className="text-zinc-950 dark:text-white text-sm font-black">Rp {APARTMENT_PACKAGE.deepMitra.toLocaleString("id-ID")}/flat</span>
                  </li>
                </ul>
              </div>
              <a href="#kalkulator" className="mt-8 text-center block w-full rounded-2xl border border-zinc-200 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-355 dark:hover:bg-zinc-900">
                Pilih Deep Clean
              </a>
            </div>
          </div>
        </div>

        {/* 2. Grid Bagian Bawah: Paket Satuan Per Ruangan & Jasa Setrika */}
        <div className="mt-20 grid gap-8 lg:grid-cols-12">
          
          {/* Paket Satuan Per Ruangan (7 Cols) */}
          <div className="lg:col-span-7 rounded-[32px] border border-zinc-200/60 bg-white/60 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-black uppercase tracking-wider text-zinc-950 dark:text-white">
                  Paket Satuan Per Ruangan
                </h3>
              </div>
              <p className="text-xs font-semibold text-zinc-500 mb-6">Pilih pembersihan parsial per ruangan sesuai kebutuhan area terkotor Anda. Wajib Alat Mitra, batas akumulasi order sekali panggil Rp 100.000.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-bold text-zinc-700 dark:text-zinc-350">
                  <thead>
                    <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 text-[10px] text-zinc-400 uppercase tracking-wider">
                      <th className="pb-3">Nama Ruangan</th>
                      <th className="pb-3 text-right">Tarif Reguler</th>
                      <th className="pb-3 text-right">Tarif Deep Clean</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150/40 dark:divide-zinc-800/40">
                    {ROOM_SERVICES.map((room) => (
                      <tr key={room.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10">
                        <td className="py-3.5 text-zinc-900 dark:text-white">{room.name}</td>
                        <td className="py-3.5 text-right font-black text-blue-600 dark:text-blue-400">Rp {room.regulerPrice.toLocaleString("id-ID")}</td>
                        <td className="py-3.5 text-right font-black text-emerald-600 dark:text-emerald-400">Rp {room.deepPrice.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <a href="#kalkulator" className="mt-8 text-center block w-full rounded-2xl bg-zinc-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-50">
              Pesan Kamar / Ruangan Satuan
            </a>
          </div>

          {/* Jasa Setrika Pakaian (5 Cols) */}
          <div className="lg:col-span-5 rounded-[32px] border border-blue-500/10 bg-white/45 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shirt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-black uppercase tracking-wider text-zinc-950 dark:text-white">
                  Jasa Setrika Pakaian
                </h3>
              </div>
              <p className="text-xs font-semibold text-zinc-500 mb-6">Merapikan pakaian kusut harian. Helper akan langsung datang ke rumah Anda di Bandung.</p>
              
              <div className="space-y-6">
                <div className="text-center p-6 rounded-2xl bg-zinc-950 text-white dark:bg-zinc-900/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tarif Jasa</span>
                  <div className="text-3xl font-black tracking-tight text-white mt-1">
                    Rp {IRONING_SERVICE.ratePerHour.toLocaleString("id-ID")} <span className="text-xs text-zinc-500">/ Jam</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Minimal order: {IRONING_SERVICE.minHours} Jam (Otomatis memenuhi batas Rp 100K)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Mesin setrika, meja gosok & hanger wajib disediakan pelanggan</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Menggunakan aliran listrik konsumen</span>
                  </div>
                </div>
              </div>
            </div>

            <a href="#kalkulator" className="mt-8 text-center block w-full rounded-2xl bg-blue-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 shadow-md shadow-blue-500/10">
              Pesan Jasa Setrika
            </a>
          </div>

        </div>

        {/* Global Warning Box */}
        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-zinc-200/50 bg-white/40 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/20 max-w-xl mx-auto text-center justify-center">
          <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            <strong>Batas Minimum Kunjungan:</strong> Demi efisiensi transportasi bensin mitra, total pemesanan Anda wajib mencapai minimal <strong>Rp {MIN_ORDER_PRICE.toLocaleString("id-ID")}</strong> untuk sekali panggil.
          </span>
        </div>

      </div>
    </section>
  );
}
