"use client";

import React, { useState, useEffect } from "react";
import { SERVICES, CALCULATOR_CONFIG, BUSINESS_CONFIG } from "@/config";
import { Plus, Minus, MessageSquare, Info, ShieldCheck, HelpCircle } from "lucide-react";

export default function Calculator() {
  const [area, setArea] = useState<number | "">(50);
  const [serviceId, setServiceId] = useState<string>("reguler");
  const [helpers, setHelpers] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [estimatedHours, setEstimatedHours] = useState<number>(0);
  const [isMinOrderApplied, setIsMinOrderApplied] = useState<boolean>(false);

  const selectedService = SERVICES.find((s) => s.id === serviceId) || SERVICES[0];

  useEffect(() => {
    const areaNum = Number(area) || 0;
    if (areaNum <= 0) {
      setTotalPrice(0);
      setEstimatedHours(0);
      setIsMinOrderApplied(false);
      return;
    }

    // Hitung harga dasar
    let price = areaNum * selectedService.ratePerM2;

    // Tambah pengali helper jika dalam mode multiplier
    if (CALCULATOR_CONFIG.pricingMode === "multiplier") {
      price = price * helpers;
    }

    // Cek batas minimum order
    if (price < CALCULATOR_CONFIG.minOrderPrice) {
      setTotalPrice(CALCULATOR_CONFIG.minOrderPrice);
      setIsMinOrderApplied(true);
    } else {
      // Pembulatan ke ribuan terdekat
      setTotalPrice(Math.round(price / 1000) * 1000);
      setIsMinOrderApplied(false);
    }

    // Hitung estimasi waktu pengerjaan
    // Total jam = Luas / (Kecepatan m2 per jam per helper * Jumlah Helper)
    const hours = areaNum / (CALCULATOR_CONFIG.m2PerHourPerHelper * helpers);
    // Bulatkan ke kelipatan 0.5 jam, minimal 1 jam
    const roundedHours = Math.max(1, Math.round(hours * 2) / 2);
    setEstimatedHours(roundedHours);
  }, [area, serviceId, helpers, selectedService]);

  const handleAreaChange = (val: string) => {
    if (val === "") {
      setArea("");
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setArea(Math.min(num, CALCULATOR_CONFIG.maxArea));
    }
  };

  const incrementHelpers = () => {
    if (helpers < CALCULATOR_CONFIG.maxHelpers) {
      setHelpers((h) => h + 1);
    }
  };

  const decrementHelpers = () => {
    if (helpers > CALCULATOR_CONFIG.minHelpers) {
      setHelpers((h) => h - 1);
    }
  };

  // Generate link WA dengan pesan terenkode
  const getWhatsAppLink = () => {
    const serviceName = selectedService.name;
    const formattedPrice = totalPrice.toLocaleString("id-ID");
    const helperText = `${helpers} helper`;
    const durationText = `${estimatedHours} jam`;

    const message = `Halo ${BUSINESS_CONFIG.name}, saya ingin memesan layanan *${serviceName}* untuk area *${area} m²* dengan *${helperText}*.

*Rincian Estimasi:*
- Jenis Layanan: ${serviceName}
- Luas Area: ${area} m²
- Jumlah Helper: ${helpers} orang
- Estimasi Durasi: ${durationText}
- Total Tarif: Rp ${formattedPrice}

Apakah bisa dijadwalkan? Terima kasih.`;

    return `https://wa.me/${BUSINESS_CONFIG.phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="kalkulator" className="py-24 relative overflow-hidden bg-zinc-50/30 dark:bg-black/30">
      {/* Background shape */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-blue-100/10 blur-[100px] dark:bg-blue-900/5 animate-blob" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl dark:text-white leading-tight">
            Kalkulator Estimasi Instan
          </h2>
          <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Dapatkan transparansi tarif secara real-time. Sesuaikan luas area dan helper sesuai dengan ukuran hunian Anda.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="mt-16 overflow-hidden rounded-[32px] border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40">
          <div className="grid gap-0 md:grid-cols-12">
            
            {/* Input Panel (7 Cols) */}
            <div className="p-8 sm:p-12 md:col-span-7 space-y-10">
              {/* Tipe Layanan (iOS Segmented Control) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4">
                  Pilih Tipe Pembersihan
                </label>
                <div className="relative flex bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl p-1.5 w-full max-w-md">
                  {/* Sliding pill background */}
                  <div
                    className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white dark:bg-zinc-700 rounded-xl shadow-md transition-transform duration-300 ease-out ${
                      serviceId === "deep" ? "translate-x-full" : "translate-x-0"
                    }`}
                  />
                  <button
                    onClick={() => setServiceId("reguler")}
                    className={`flex-1 rounded-xl py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors relative z-10 ${
                      serviceId === "reguler"
                        ? "text-zinc-950 dark:text-white"
                        : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                    }`}
                  >
                    Reguler Clean
                  </button>
                  <button
                    onClick={() => setServiceId("deep")}
                    className={`flex-1 rounded-xl py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors relative z-10 ${
                      serviceId === "deep"
                        ? "text-zinc-950 dark:text-white"
                        : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                    }`}
                  >
                    Deep Clean
                  </button>
                </div>
              </div>

              {/* Luas Area Input & Slider */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Luas Area Hunian
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => handleAreaChange(e.target.value)}
                      className="w-20 rounded-xl border border-zinc-200 bg-white/70 px-3 py-1.5 text-center font-bold text-sm text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={CALCULATOR_CONFIG.minArea}
                      max={CALCULATOR_CONFIG.maxArea}
                    />
                    <span className="text-xs font-bold text-zinc-400">m²</span>
                  </div>
                </div>
                
                {/* Modern Track range slider */}
                <input
                  type="range"
                  min={CALCULATOR_CONFIG.minArea}
                  max={250}
                  value={area || 0}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer"
                />
                
                <div className="flex justify-between text-[10px] text-zinc-400 mt-3 font-bold tracking-wider">
                  <span>{CALCULATOR_CONFIG.minArea} m²</span>
                  <span>100 m²</span>
                  <span>200 m²</span>
                  <span>250 m² +</span>
                </div>
              </div>

              {/* Jumlah Helper (Stepper) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4">
                  Jumlah Tenaga (Helper)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex items-center rounded-2xl border border-zinc-200 bg-white/50 p-1 w-fit dark:border-zinc-800 dark:bg-zinc-950/20">
                    <button
                      onClick={decrementHelpers}
                      disabled={helpers <= CALCULATOR_CONFIG.minHelpers}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-14 text-center font-extrabold text-zinc-950 dark:text-white text-lg">
                      {helpers}
                    </span>
                    <button
                      onClick={incrementHelpers}
                      disabled={helpers >= CALCULATOR_CONFIG.maxHelpers}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    {helpers === 1
                      ? "1 helper ideal untuk kost / studio apartemen."
                      : `${helpers} helper direkomendasikan agar pekerjaan selesai jauh lebih cepat.`}
                  </span>
                </div>
              </div>

            </div>

            {/* Output Panel / Receipt View (5 Cols) */}
            <div className="p-8 sm:p-12 md:col-span-5 bg-zinc-950 text-white flex flex-col justify-between border-l border-zinc-900">
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Estimasi Rincian Biaya
                  </h3>
                  
                  {area === "" || area <= 0 ? (
                    <div className="mt-6 text-base font-semibold text-blue-400">
                      Silakan isi luas area hunian Anda
                    </div>
                  ) : (
                    <div className="mt-6">
                      <div className="text-4xl font-black tracking-tight text-white leading-none">
                        Rp {totalPrice.toLocaleString("id-ID")}
                      </div>
                      {isMinOrderApplied && (
                        <span className="inline-block mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
                          Batas Minimal Order
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Calculation Details List */}
                {area !== "" && area > 0 && (
                  <div className="space-y-4 border-t border-zinc-900 pt-6 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Paket</span>
                      <span className="text-white">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Harga Dasar</span>
                      <span className="text-white">
                        {area} m² × Rp {selectedService.ratePerM2.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {CALCULATOR_CONFIG.pricingMode === "multiplier" && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Faktor Helper</span>
                        <span className="text-white">× {helpers} Orang</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-zinc-900/50 pt-4">
                      <span className="text-zinc-500">Estimasi Durasi</span>
                      <span className="text-emerald-400 font-bold">± {estimatedHours} Jam Kerja</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-12 space-y-4">
                {area === "" || area <= 0 ? (
                  <button
                    disabled
                    className="w-full rounded-full py-4 text-xs font-black uppercase tracking-wider text-zinc-500 bg-zinc-900 border border-zinc-800 cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
                  >
                    Booking Sekarang
                  </button>
                ) : (
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-full py-4 text-xs font-black uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-400/10"
                  >
                    <MessageSquare className="h-4 w-4 fill-zinc-950 text-emerald-400" />
                    Pesan via WhatsApp
                  </a>
                )}
                
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-500">
                  <ShieldCheck className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span>Bayar Di Tempat (COD) Setelah Selesai</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 flex items-start gap-4 rounded-3xl border border-zinc-200/55 bg-white/40 p-5 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/20 max-w-3xl mx-auto">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
            <strong>Catatan Transparansi:</strong> Jumlah helper dihitung sebagai pengali kerja harian. Estimasi waktu didasarkan pada standar pengerjaan 15m² per jam per helper. Anda tidak perlu membayar DP apa pun di awal.
          </p>
        </div>

      </div>
    </section>
  );
}
