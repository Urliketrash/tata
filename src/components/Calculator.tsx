"use client";

import React, { useState, useEffect } from "react";
import {
  ROOM_SERVICES,
  HOUSE_PACKAGE,
  KOST_PACKAGE,
  APARTMENT_PACKAGE,
  IRONING_SERVICE,
  MIN_ORDER_PRICE,
  BUSINESS_CONFIG
} from "@/config";
import { Plus, Minus, MessageSquare, Info, ShieldCheck, CheckSquare, Square } from "lucide-react";

type RoomSelection = {
  [roomId: string]: {
    quantity: number;
    isDeep: boolean;
  };
};

export default function Calculator() {
  const [activeTab, setActiveTab] = useState<"house" | "unit" | "rooms" | "ironing">("house");
  
  // Tab 1: Paket Rumah State
  const [houseArea, setHouseArea] = useState<number>(36);
  const [houseType, setHouseType] = useState<"pribadi" | "mitra" | "deep">("mitra");

  // Tab 2: Paket Kost / Apartemen State
  const [unitType, setUnitType] = useState<"kost" | "apartment">("kost");
  const [unitService, setUnitService] = useState<"pribadi" | "mitra" | "deep">("mitra");

  // Tab 3: Paket Per Ruangan State
  const [roomSelection, setRoomSelection] = useState<RoomSelection>({
    toilet: { quantity: 1, isDeep: false },
    bedroom: { quantity: 0, isDeep: false },
    kitchen: { quantity: 0, isDeep: false },
    living: { quantity: 0, isDeep: false },
    terrace: { quantity: 0, isDeep: false },
  });

  // Tab 4: Jasa Setrika State
  const [ironingHours, setIroningHours] = useState<number>(2);

  // Output State
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isMinOrderApplied, setIsMinOrderApplied] = useState<boolean>(false);

  // Menghitung harga total berdasarkan tab aktif
  useEffect(() => {
    let price = 0;

    if (activeTab === "house") {
      const rate =
        houseType === "pribadi"
          ? HOUSE_PACKAGE.regulerPribadiPerM2
          : houseType === "mitra"
          ? HOUSE_PACKAGE.regulerMitraPerM2
          : HOUSE_PACKAGE.deepMitraPerM2;
      price = houseArea * rate;
    } 
    else if (activeTab === "unit") {
      if (unitType === "kost") {
        price =
          unitService === "pribadi"
            ? KOST_PACKAGE.regulerPribadi
            : unitService === "mitra"
            ? KOST_PACKAGE.regulerMitra
            : KOST_PACKAGE.deepMitra;
      } else {
        price =
          unitService === "pribadi"
            ? APARTMENT_PACKAGE.regulerPribadi
            : unitService === "mitra"
            ? APARTMENT_PACKAGE.regulerMitra
            : APARTMENT_PACKAGE.deepMitra;
      }
    } 
    else if (activeTab === "rooms") {
      ROOM_SERVICES.forEach((room) => {
        const selection = roomSelection[room.id];
        if (selection && selection.quantity > 0) {
          const rate = selection.isDeep ? room.deepPrice : room.regulerPrice;
          price += selection.quantity * rate;
        }
      });
    } 
    else if (activeTab === "ironing") {
      price = ironingHours * IRONING_SERVICE.ratePerHour;
    }

    setTotalPrice(price);
    setIsMinOrderApplied(price > 0 && price < MIN_ORDER_PRICE);
  }, [activeTab, houseArea, houseType, unitType, unitService, roomSelection, ironingHours]);

  // Handler Luas Rumah
  const handleHouseAreaChange = (val: string) => {
    if (val === "") {
      setHouseArea(0);
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setHouseArea(Math.min(num, 500));
    }
  };

  // Handler Stepper Kamar
  const handleRoomQtyChange = (roomId: string, increment: boolean) => {
    setRoomSelection((prev) => {
      const current = prev[roomId] || { quantity: 0, isDeep: false };
      const newQty = increment
        ? Math.min(current.quantity + 1, 10)
        : Math.max(current.quantity - 1, 0);
      return {
        ...prev,
        [roomId]: { ...current, quantity: newQty },
      };
    });
  };

  const handleRoomTypeToggle = (roomId: string) => {
    setRoomSelection((prev) => {
      const current = prev[roomId] || { quantity: 0, isDeep: false };
      return {
        ...prev,
        [roomId]: { ...current, isDeep: !current.isDeep },
      };
    });
  };

  // WhatsApp Message Generator
  const getWhatsAppLink = () => {
    let message = "";
    const formattedPrice = totalPrice.toLocaleString("id-ID");
    const minOrderText = isMinOrderApplied ? ` (Disesuaikan ke Min. Order Rp ${MIN_ORDER_PRICE.toLocaleString("id-ID")})` : "";
    const actualPriceText = `Rp ${(isMinOrderApplied ? MIN_ORDER_PRICE : totalPrice).toLocaleString("id-ID")}`;

    if (activeTab === "house") {
      const modeText =
        houseType === "pribadi"
          ? "Reguler - Alat Pribadi"
          : houseType === "mitra"
          ? "Reguler - Alat Mitra"
          : "Deep Clean - Wajib Alat Mitra";
      
      message = `Halo ${BUSINESS_CONFIG.name}, saya ingin memesan *Paket Rumah* dengan rincian:
- Luas Area: ${houseArea} m²
- Paket: ${modeText}
- Estimasi Tarif: ${actualPriceText}${minOrderText}

Apakah bisa dijadwalkan? Terima kasih.`;
    } 
    else if (activeTab === "unit") {
      const typeText = unitType === "kost" ? "Kost (Maks. 3x4m)" : "Apartemen (Studio)";
      const modeText =
        unitService === "pribadi"
          ? "Reguler - Alat Pribadi"
          : unitService === "mitra"
          ? "Reguler - Alat Mitra"
          : "Deep Clean - Wajib Alat Mitra";

      message = `Halo ${BUSINESS_CONFIG.name}, saya ingin memesan *Paket ${typeText}* dengan rincian:
- Layanan: ${modeText}
- Estimasi Tarif: ${actualPriceText}${minOrderText}

Apakah bisa dijadwalkan? Terima kasih.`;
    } 
    else if (activeTab === "rooms") {
      let rincian = "";
      ROOM_SERVICES.forEach((room) => {
        const sel = roomSelection[room.id];
        if (sel && sel.quantity > 0) {
          const typeText = sel.isDeep ? "Deep Clean" : "Reguler";
          rincian += `- ${room.name} (${typeText}): ${sel.quantity} ruangan\n`;
        }
      });

      message = `Halo ${BUSINESS_CONFIG.name}, saya ingin memesan *Paket Satuan Per Ruangan* dengan rincian:
${rincian}- Estimasi Tarif: ${actualPriceText}${minOrderText}

Apakah bisa dijadwalkan? Terima kasih.`;
    } 
    else if (activeTab === "ironing") {
      message = `Halo ${BUSINESS_CONFIG.name}, saya ingin memesan *Jasa Setrika Pakaian* dengan rincian:
- Durasi: ${ironingHours} Jam (Min. 2 Jam)
- Catatan: Alat & listrik disediakan sendiri oleh konsumen
- Estimasi Tarif: ${actualPriceText}

Apakah bisa dijadwalkan? Terima kasih.`;
    }

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
            Kalkulator Tarif Terbuka
          </h2>
          <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Hitung tarif Anda secara transparan. Minimal order sekali panggil adalah Rp 100.000.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 p-1.5 bg-zinc-200/50 dark:bg-zinc-800/40 rounded-3xl max-w-2xl mx-auto border border-zinc-200/20">
          {[
            { id: "house", label: "Rumah (m²)" },
            { id: "unit", label: "Kost / Apartemen" },
            { id: "rooms", label: "Per Ruangan" },
            { id: "ironing", label: "Setrika" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[120px] rounded-2xl py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-zinc-950 shadow-md dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator Main Grid */}
        <div className="mt-8 overflow-hidden rounded-[32px] border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40">
          <div className="grid gap-0 md:grid-cols-12">
            
            {/* Input Panel (7 Cols) */}
            <div className="p-8 sm:p-12 md:col-span-7 space-y-8">
              
              {/* TAB 1: PAKET RUMAH */}
              {activeTab === "house" && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider mb-2">
                      Paket Rumah (Mulai Tipe 36)
                    </h3>
                    <p className="text-xs font-semibold text-zinc-400">Pembersihan fleksibel berdasarkan m².</p>
                  </div>

                  {/* Input Luas Area */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Luas Area Hunian
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={houseArea || ""}
                          onChange={(e) => handleHouseAreaChange(e.target.value)}
                          className="w-20 rounded-xl border border-zinc-200 bg-white/70 px-3 py-1.5 text-center font-bold text-sm text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min={HOUSE_PACKAGE.minArea}
                          max={500}
                        />
                        <span className="text-xs font-bold text-zinc-400">m²</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={HOUSE_PACKAGE.minArea}
                      max={250}
                      value={houseArea}
                      onChange={(e) => setHouseArea(Number(e.target.value))}
                      className="w-full accent-blue-600 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-2 font-bold">
                      <span>Tipe 36 m²</span>
                      <span>100 m²</span>
                      <span>200 m²</span>
                      <span>250 m² +</span>
                    </div>
                  </div>

                  {/* Opsi Tipe Alat / Pembersihan */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4">
                      Jenis Alat & Kebersihan
                    </label>
                    <div className="grid gap-3">
                      {[
                        { id: "pribadi", label: "Reguler (Alat Pribadi)", rate: HOUSE_PACKAGE.regulerPribadiPerM2, desc: "Alat sapu/pel/cairan disiapkan oleh konsumen." },
                        { id: "mitra", label: "Reguler (Alat Mitra)", rate: HOUSE_PACKAGE.regulerMitraPerM2, desc: "Seluruh alat & cairan pembersih standar dibawa oleh helper kami." },
                        { id: "deep", label: "Deep Clean (Wajib Alat Mitra)", rate: HOUSE_PACKAGE.deepMitraPerM2, desc: "Pembersihan total kerak membandel, kaca, disinfeksi lengkap (wajib alat kami)." }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setHouseType(item.id as any)}
                          className={`flex flex-col text-left p-4 rounded-2xl border transition-all ${
                            houseType === item.id
                              ? "border-blue-500 bg-blue-500/5 dark:border-blue-400 dark:bg-blue-400/5"
                              : "border-zinc-200/60 bg-white/20 hover:bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-950/10"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-xs font-extrabold text-zinc-950 dark:text-white">{item.label}</span>
                            <span className="text-xs font-black text-blue-600 dark:text-blue-400">Rp {item.rate.toLocaleString("id-ID")}/m²</span>
                          </div>
                          <span className="text-[10px] font-semibold text-zinc-400 mt-1">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PAKET KOST / APARTEMEN */}
              {activeTab === "unit" && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider mb-2">
                      Paket Kost & Apartemen (Flat Rate)
                    </h3>
                    <p className="text-xs font-semibold text-zinc-400">Paket harga tetap per unit (Kost maks 3x4m, Apartemen tipe Studio).</p>
                  </div>

                  {/* Pilihan Tipe Unit */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4">
                      Tipe Unit Hunian
                    </label>
                    <div className="relative flex bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl p-1.5 w-full max-w-xs">
                      <div
                        className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white dark:bg-zinc-700 rounded-xl shadow-md transition-transform duration-300 ease-out ${
                          unitType === "apartment" ? "translate-x-full" : "translate-x-0"
                        }`}
                      />
                      <button
                        onClick={() => setUnitType("kost")}
                        className={`flex-1 rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-wider transition-colors relative z-10 ${
                          unitType === "kost" ? "text-zinc-950 dark:text-white" : "text-zinc-400"
                        }`}
                      >
                        Kost (Maks 3x4m)
                      </button>
                      <button
                        onClick={() => setUnitType("apartment")}
                        className={`flex-1 rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-wider transition-colors relative z-10 ${
                          unitType === "apartment" ? "text-zinc-950 dark:text-white" : "text-zinc-400"
                        }`}
                      >
                        Apartemen Studio
                      </button>
                    </div>
                  </div>

                  {/* Pilihan Layanan */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4">
                      Opsi Pembersihan
                    </label>
                    <div className="grid gap-3">
                      {[
                        { id: "pribadi", label: "Reguler (Alat Pribadi)", prices: { kost: KOST_PACKAGE.regulerPribadi, apartment: APARTMENT_PACKAGE.regulerPribadi }, desc: "Alat disiapkan konsumen." },
                        { id: "mitra", label: "Reguler (Alat Mitra)", prices: { kost: KOST_PACKAGE.regulerMitra, apartment: APARTMENT_PACKAGE.regulerMitra }, desc: "Helper membawa peralatan lengkap." },
                        { id: "deep", label: "Deep Clean (Wajib Alat Mitra)", prices: { kost: KOST_PACKAGE.deepMitra, apartment: APARTMENT_PACKAGE.deepMitra }, desc: "Kerak kamar mandi dibersihkan tuntas, pembersihan kaca jendela & disinfeksi." }
                      ].map((item) => {
                        const price = unitType === "kost" ? item.prices.kost : item.prices.apartment;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setUnitService(item.id as any)}
                            className={`flex flex-col text-left p-4 rounded-2xl border transition-all ${
                              unitService === item.id
                                ? "border-blue-500 bg-blue-500/5 dark:border-blue-400 dark:bg-blue-400/5"
                                : "border-zinc-200/60 bg-white/20 hover:bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-950/10"
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="text-xs font-extrabold text-zinc-950 dark:text-white">{item.label}</span>
                              <span className="text-xs font-black text-blue-600 dark:text-blue-400">Rp {price.toLocaleString("id-ID")}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-zinc-400 mt-1">{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PAKET PER RUANGAN */}
              {activeTab === "rooms" && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider mb-2">
                      Paket Satuan Per Ruangan
                    </h3>
                    <p className="text-xs font-semibold text-zinc-400">Pilih secara fleksibel ruangan mana saja yang perlu dibersihkan (Wajib Alat Mitra, Min. Order Rp100.000).</p>
                  </div>

                  {/* List Ruangan */}
                  <div className="space-y-4">
                    {ROOM_SERVICES.map((room) => {
                      const sel = roomSelection[room.id] || { quantity: 0, isDeep: false };
                      const currentRate = sel.isDeep ? room.deepPrice : room.regulerPrice;

                      return (
                        <div
                          key={room.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                            sel.quantity > 0
                              ? "border-blue-500/40 bg-white dark:border-blue-500/20 dark:bg-zinc-900"
                              : "border-zinc-200/60 bg-white/10 dark:border-zinc-800/60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-extrabold text-zinc-950 dark:text-white">{room.name}</h4>
                              <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                                Rp {currentRate.toLocaleString("id-ID")} / Ruangan
                              </p>
                            </div>

                            {/* Stepper qty */}
                            <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-50/50 dark:bg-zinc-950/20">
                              <button
                                onClick={() => handleRoomQtyChange(room.id, false)}
                                disabled={sel.quantity <= 0}
                                className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-zinc-600 disabled:opacity-30 dark:bg-zinc-850 dark:text-zinc-400 shadow-sm"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-extrabold text-zinc-900 dark:text-white">
                                {sel.quantity}
                              </span>
                              <button
                                onClick={() => handleRoomQtyChange(room.id, true)}
                                className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-zinc-600 dark:bg-zinc-850 dark:text-zinc-400 shadow-sm"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Opsi reguler vs deep clean per ruangan */}
                          {sel.quantity > 0 && (
                            <div className="flex gap-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                              <button
                                onClick={() => handleRoomTypeToggle(room.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                  !sel.isDeep
                                    ? "border-blue-500 bg-blue-500/5 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                    : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400"
                                }`}
                              >
                                Reguler (Rp {room.regulerPrice.toLocaleString("id-ID")})
                              </button>
                              <button
                                onClick={() => handleRoomTypeToggle(room.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                  sel.isDeep
                                    ? "border-blue-500 bg-blue-500/5 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                    : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400"
                                }`}
                              >
                                Deep Clean (Rp {room.deepPrice.toLocaleString("id-ID")})
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: JASA SETRIKA */}
              {activeTab === "ironing" && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider mb-2">
                      Jasa Setrika Pakaian (New)
                    </h3>
                    <p className="text-xs font-semibold text-zinc-400">Jasa gosok merapikan pakaian harian.</p>
                  </div>

                  {/* Ketentuan setrika */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs font-semibold text-amber-800 dark:text-amber-400 space-y-1.5">
                    <p>⚠️ <strong>Aturan Pemesanan:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Tarif flat Rp 50.000 / jam.</li>
                      <li>Minimal pemesanan adalah 2 Jam (Otomatis memenuhi batas minimal order Rp 100.000).</li>
                      <li>Aliran listrik, mesin setrika, hanger, dan meja gosok wajib disediakan oleh Anda di lokasi.</li>
                    </ul>
                  </div>

                  {/* Stepper jam */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4">
                      Durasi Pemesanan Setrika
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-2xl border border-zinc-200 bg-white/50 p-1 w-fit dark:border-zinc-800 dark:bg-zinc-950/20">
                        <button
                          onClick={() => setIroningHours((h) => Math.max(IRONING_SERVICE.minHours, h - 1))}
                          disabled={ironingHours <= IRONING_SERVICE.minHours}
                          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm transition-all disabled:opacity-30 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-14 text-center font-extrabold text-zinc-950 dark:text-white text-lg">
                          {ironingHours}
                        </span>
                        <button
                          onClick={() => setIroningHours((h) => Math.min(12, h + 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm transition-all dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">Jam Kerja Setrika</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Output Panel / Receipt View (5 Cols) */}
            <div className="p-8 sm:p-12 md:col-span-5 bg-zinc-950 text-white flex flex-col justify-between border-l border-zinc-900/60">
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Estimasi Rincian Biaya
                  </h3>
                  
                  {totalPrice <= 0 ? (
                    <div className="mt-6 text-sm font-bold text-blue-400">
                      Silakan atur ruangan atau layanan pilihan Anda
                    </div>
                  ) : (
                    <div className="mt-6">
                      <div className="text-4xl font-black tracking-tight text-white leading-none">
                        Rp {Math.max(MIN_ORDER_PRICE, totalPrice).toLocaleString("id-ID")}
                      </div>
                      {isMinOrderApplied && (
                        <div className="inline-block mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
                          Batas Minimal Order Diterapkan
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress bar warning untuk minimal order */}
                {totalPrice > 0 && isMinOrderApplied && (
                  <div className="space-y-2 border-t border-zinc-900/80 pt-6">
                    <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                      <span>Progres Minimal Order</span>
                      <span>{Math.round((totalPrice / MIN_ORDER_PRICE) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5">
                      <div
                        className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(totalPrice / MIN_ORDER_PRICE) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-semibold text-zinc-400 leading-normal">
                      Harga pembersihan saat ini adalah Rp {totalPrice.toLocaleString("id-ID")}. Tambahkan layanan senilai <strong>Rp {(MIN_ORDER_PRICE - totalPrice).toLocaleString("id-ID")}</strong> lagi untuk memenuhi batas bensin/operasional. Jika tetap dipesan, tarif dibulatkan ke Rp 100.000.
                    </p>
                  </div>
                )}

                {/* Tab specific details list */}
                {totalPrice > 0 && (
                  <div className="space-y-4 border-t border-zinc-900/80 pt-6 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Kategori</span>
                      <span className="text-white uppercase tracking-wider text-[10px] font-black">
                        {activeTab === "house"
                          ? "Paket Rumah"
                          : activeTab === "unit"
                          ? "Paket Kost/Apartemen"
                          : activeTab === "rooms"
                          ? "Paket Per Ruangan"
                          : "Jasa Setrika"}
                      </span>
                    </div>

                    {/* House Details */}
                    {activeTab === "house" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Ukuran</span>
                          <span className="text-white">{houseArea} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Harga Dasar</span>
                          <span className="text-white">
                            Rp {(houseType === "pribadi" ? HOUSE_PACKAGE.regulerPribadiPerM2 : houseType === "mitra" ? HOUSE_PACKAGE.regulerMitraPerM2 : HOUSE_PACKAGE.deepMitraPerM2).toLocaleString("id-ID")}/m²
                          </span>
                        </div>
                      </>
                    )}

                    {/* Unit Details */}
                    {activeTab === "unit" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Tipe Unit</span>
                          <span className="text-white">{unitType === "kost" ? "Kost (3x4m)" : "Apartemen Studio"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Peralatan</span>
                          <span className="text-white">{unitService === "pribadi" ? "Alat Pribadi" : "Alat Mitra"}</span>
                        </div>
                      </>
                    )}

                    {/* Rooms Details */}
                    {activeTab === "rooms" && (
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {ROOM_SERVICES.map((room) => {
                          const sel = roomSelection[room.id];
                          if (sel && sel.quantity > 0) {
                            return (
                              <div key={room.id} className="flex justify-between text-[11px]">
                                <span className="text-zinc-500">{room.name} ({sel.isDeep ? "Deep" : "Reg"})</span>
                                <span className="text-white">{sel.quantity}x</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                    {/* Ironing Details */}
                    {activeTab === "ironing" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Durasi Kerja</span>
                          <span className="text-white">{ironingHours} Jam</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Tarif Gosok</span>
                          <span className="text-white">Rp {IRONING_SERVICE.ratePerHour.toLocaleString("id-ID")}/Jam</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-12 space-y-4">
                {totalPrice <= 0 ? (
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
                  <span>Bayar COD Setelah Pengerjaan Selesai</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 flex items-start gap-4 rounded-3xl border border-zinc-200/55 bg-white/40 p-5 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/20 max-w-3xl mx-auto">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
            <strong>Catatan Batas Minimum Order:</strong> Jika akumulasi tarif pemesanan Anda berada di bawah Rp 100.000, pemesanan tetap dapat diajukan dengan tarif yang akan disesuaikan ke Rp 100.000 saat tim konfirmasi pesanan (untuk menutup biaya transportasi bensin mitra).
          </p>
        </div>

      </div>
    </section>
  );
}
