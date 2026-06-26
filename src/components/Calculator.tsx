"use client";

import React, { useState, useEffect } from "react";
import { SERVICES, CALCULATOR_CONFIG, BUSINESS_CONFIG } from "@/config";
import { Plus, Minus, MessageSquare, Info, ShieldCheck } from "lucide-react";

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
    <section id="kalkulator" className="py-20 relative">
      {/* Background shape */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-blue-100/20 blur-[80px] dark:bg-blue-900/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Kalkulator Estimasi Harga
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Dapatkan estimasi harga instan secara transparan. Sesuaikan luas area dan kebutuhan tenaga pembantu Anda.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/60 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/60 sm:p-10">
          <div className="grid gap-8 md:grid-cols-12">
            
            {/* Input Panel (7 Cols) */}
            <div className="space-y-8 md:col-span-7">
              {/* Tipe Layanan (iOS Segmented Control) */}
              <div>
                <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block mb-3">
                  Tipe Layanan
                </label>
                <div className="relative flex bg-zinc-100/80 dark:bg-zinc-800/80 rounded-full p-1 w-full max-w-sm">
                  {/* Sliding pill background */}
                  <div
                    className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-out ${
                      serviceId === "deep" ? "translate-x-full" : "translate-x-0"
                    }`}
                  />
                  <button
                    onClick={() => setServiceId("reguler")}
                    className={`flex-1 rounded-full py-2 text-center text-sm font-semibold transition-colors relative z-10 ${
                      serviceId === "reguler"
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    }`}
                  >
                    Reguler Clean
                  </button>
                  <button
                    onClick={() => setServiceId("deep")}
                    className={`flex-1 rounded-full py-2 text-center text-sm font-semibold transition-colors relative z-10 ${
                      serviceId === "deep"
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    }`}
                  >
                    Deep Clean
                  </button>
                </div>
              </div>

              {/* Luas Area Input & Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Luas Area Hunian
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => handleAreaChange(e.target.value)}
                      className="w-20 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-center font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min={CALCULATOR_CONFIG.minArea}
                      max={CALCULATOR_CONFIG.maxArea}
                    />
                    <span className="text-sm font-semibold text-zinc-500">m²</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={CALCULATOR_CONFIG.minArea}
                  max={250} // slider batas 250 agar nyaman digeser, tapi manual bisa ketik 500
                  value={area || 0}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer dark:bg-zinc-800"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-2 font-medium">
                  <span>{CALCULATOR_CONFIG.minArea} m²</span>
                  <span>100 m²</span>
                  <span>200 m²</span>
                  <span>250 m² +</span>
                </div>
              </div>

              {/* Jumlah Helper (Stepper) */}
              <div>
                <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block mb-3">
                  Jumlah Helper (Tenaga Kerja)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-zinc-200/80 bg-zinc-50/50 p-1 dark:border-zinc-800/80 dark:bg-zinc-950/20">
                    <button
                      onClick={decrementHelpers}
                      disabled={helpers <= CALCULATOR_CONFIG.minHelpers}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-zinc-900 dark:text-white text-base">
                      {helpers}
                    </span>
                    <button
                      onClick={incrementHelpers}
                      disabled={helpers >= CALCULATOR_CONFIG.maxHelpers}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    Direkomendasikan {helpers === 1 ? "1 helper untuk kost / rumah kecil" : `${helpers} helper untuk mempercepat waktu kerja`}
                  </span>
                </div>
              </div>

            </div>

            {/* Output Panel (5 Cols) */}
            <div className="rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-950/50 md:col-span-5 flex flex-col justify-between border border-zinc-100 dark:border-zinc-900">
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                  Estimasi Total
                </h3>
                
                {/* Real-time price display */}
                {area === "" || area <= 0 ? (
                  <div className="mt-4 text-lg font-semibold text-blue-500">
                    Isi luas area dulu, ya
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-none tracking-tight sm:text-4xl">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </div>
                    {isMinOrderApplied && (
                      <span className="inline-block mt-2 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                        Minimum Order Rp 50K
                      </span>
                    )}
                  </div>
                )}

                {/* Calculation details */}
                {area !== "" && area > 0 && (
                  <div className="mt-6 space-y-3.5 border-t border-zinc-200/60 pt-4 text-sm font-medium dark:border-zinc-800/60">
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Perhitungan Tarif:</span>
                      <span className="text-zinc-800 dark:text-zinc-200 text-right">
                        {area} m² × Rp {selectedService.ratePerM2.toLocaleString("id-ID")}
                        {CALCULATOR_CONFIG.pricingMode === "multiplier" && ` × ${helpers} helper`}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Estimasi Pengerjaan:</span>
                      <span className="text-zinc-800 dark:text-zinc-200">
                        ± {estimatedHours} jam
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Tenaga Bersih:</span>
                      <span className="text-zinc-800 dark:text-zinc-200">
                        {helpers} Orang Helper
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking button */}
              <div className="mt-8">
                {area === "" || area <= 0 ? (
                  <button
                    disabled
                    className="w-full rounded-full py-3.5 font-semibold text-white bg-zinc-300 dark:bg-zinc-800 cursor-not-allowed opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Booking Jasa Bersih
                  </button>
                ) : (
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-full py-3.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.99] dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <MessageSquare className="h-4 w-4 fill-white text-emerald-600 dark:text-emerald-500" />
                    Booking via WhatsApp
                  </a>
                )}
                
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-zinc-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>Tanpa DP, bayar setelah pekerjaan selesai</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Info Alert */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-zinc-200/50 bg-white/40 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/20 max-w-2xl mx-auto">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            <strong>Cara Kerja Booking:</strong> Hasil perhitungan di atas akan dikirimkan otomatis ke WhatsApp kami saat Anda mengklik tombol booking. Tim admin kami akan segera mengonfirmasi ketersediaan jadwal helper di area Anda di Bandung.
          </p>
        </div>

      </div>
    </section>
  );
}
