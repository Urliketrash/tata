"use client";

import React, { useState, useEffect } from "react";
import RoomVisualizer from "./RoomVisualizer";
import { useConfig } from "@/context/ConfigContext";
import { Plus, Minus, MessageSquare, Info, ShieldCheck, CheckSquare, Square } from "lucide-react";

type RoomSelection = {
  [roomId: string]: {
    quantity: number;
    isDeep: boolean;
  };
};

export default function Calculator() {
  const { config } = useConfig();
  const {
    ROOM_SERVICES,
    HOUSE_PACKAGE,
    KOST_PACKAGE,
    APARTMENT_PACKAGE,
    IRONING_SERVICE,
    MIN_ORDER_PRICE,
    BUSINESS_CONFIG,
    TRANSPORT_ZONES
  } = config;
  const [activeTab, setActiveTab] = useState<"house" | "unit" | "rooms" | "ironing">("house");
  
  // 3D Card Tilt State for Calculator
  const [calcTilt, setCalcTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, go: 0 });

  const handleCalcMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Subtle tilt for large card
    const rx = -((y - yc) / yc) * 2;
    const ry = ((x - xc) / xc) * 2;
    setCalcTilt({
      rx,
      ry,
      mx: (x / rect.width) * 100,
      my: (y / rect.height) * 100,
      go: 1,
    });
  };

  const handleCalcMouseLeave = () => {
    setCalcTilt({ rx: 0, ry: 0, mx: 50, my: 50, go: 0 });
  };
  
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

  // Transport Zone State
  const [transportZone, setTransportZone] = useState<string>("zona1");

  // Ironing Add-on State
  const [ironingAddonActive, setIroningAddonActive] = useState<boolean>(false);
  const [ironingAddonHours, setIroningAddonHours] = useState<number>(1);

  // State to block booking for Zona 3 under 250K
  const [isZone3Blocked, setIsZone3Blocked] = useState<boolean>(false);
  const [basePrice, setBasePrice] = useState<number>(0);

  // Menghitung harga total berdasarkan tab aktif
  useEffect(() => {
    let servicePrice = 0;

    if (activeTab === "house") {
      const rate =
        houseType === "pribadi"
          ? HOUSE_PACKAGE.regulerPribadiPerM2
          : houseType === "mitra"
          ? HOUSE_PACKAGE.regulerMitraPerM2
          : HOUSE_PACKAGE.deepMitraPerM2;
      servicePrice = houseArea * rate;
    } 
    else if (activeTab === "unit") {
      if (unitType === "kost") {
        servicePrice =
          unitService === "pribadi"
            ? KOST_PACKAGE.regulerPribadi
            : unitService === "mitra"
            ? KOST_PACKAGE.regulerMitra
            : KOST_PACKAGE.deepMitra;
      } else {
        servicePrice =
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
          servicePrice += selection.quantity * rate;
        }
      });
    } 
    else if (activeTab === "ironing") {
      servicePrice = ironingHours * IRONING_SERVICE.ratePerHour;
    }

    // Add ironing addon price if active (only for non-ironing tabs)
    if (activeTab !== "ironing" && ironingAddonActive) {
      servicePrice += ironingAddonHours * 50000;
    }

    setBasePrice(servicePrice);
    
    // Check if base service price meets minimum order (Rp 100.000)
    const appliedServicePrice = (servicePrice > 0 && servicePrice < MIN_ORDER_PRICE) ? MIN_ORDER_PRICE : servicePrice;
    setIsMinOrderApplied(servicePrice > 0 && servicePrice < MIN_ORDER_PRICE);

    // Add transport fee
    const zoneObj = TRANSPORT_ZONES.find((z) => z.id === transportZone);
    const transportFee = zoneObj ? zoneObj.fee : 0;
    
    setTotalPrice(servicePrice > 0 ? (appliedServicePrice + transportFee) : 0);

    // Zona 3 validation: Radius > 20km, min order Rp 250.000
    if (transportZone === "zona3" && servicePrice > 0 && appliedServicePrice < 250000) {
      setIsZone3Blocked(true);
    } else {
      setIsZone3Blocked(false);
    }
  }, [activeTab, houseArea, houseType, unitType, unitService, roomSelection, ironingHours, ironingAddonActive, ironingAddonHours, transportZone]);

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
    const zoneObj = TRANSPORT_ZONES.find((z) => z.id === transportZone);
    const transportText = zoneObj ? `\n- Jarak Layanan: ${zoneObj.name} (Ongkir: Rp ${zoneObj.fee.toLocaleString("id-ID")})` : "";
    const addonText = (activeTab !== "ironing" && ironingAddonActive) ? `\n- Tambahan Setrika: +${ironingAddonHours} Jam` : "";
    
    const formattedPrice = totalPrice.toLocaleString("id-ID");
    const minOrderText = isMinOrderApplied ? ` (Disesuaikan ke Min. Order Jasa Rp ${MIN_ORDER_PRICE.toLocaleString("id-ID")})` : "";
    const actualPriceText = `Rp ${totalPrice.toLocaleString("id-ID")}`;

    if (activeTab === "house") {
      const modeText =
        houseType === "pribadi"
          ? "Reguler - Alat Pribadi"
          : houseType === "mitra"
          ? "Reguler - Alat Mitra"
          : "Deep Clean - Wajib Alat Mitra";
      
      message = `Halo ${BUSINESS_CONFIG.name}, saya ingin memesan *Paket Rumah* dengan rincian:
- Luas Area: ${houseArea} m²
- Paket: ${modeText}${addonText}${transportText}
- Estimasi Tarif Total: ${actualPriceText}${minOrderText}
 
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
- Layanan: ${modeText}${addonText}${transportText}
- Estimasi Tarif Total: ${actualPriceText}${minOrderText}
 
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
${rincian}- Tambahan: ${addonText ? addonText : "Tidak ada"}${transportText}
- Estimasi Tarif Total: ${actualPriceText}${minOrderText}
 
Apakah bisa dijadwalkan? Terima kasih.`;
    } 
    else if (activeTab === "ironing") {
      message = `Halo ${BUSINESS_CONFIG.name}, saya ingin memesan *Jasa Setrika Pakaian* dengan rincian:
- Durasi: ${ironingHours} Jam (Min. 2 Jam)
- Catatan: Alat & listrik disediakan sendiri oleh konsumen${transportText}
- Estimasi Tarif Total: ${actualPriceText}
 
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
              suppressHydrationWarning
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
        <div
          onMouseMove={handleCalcMouseMove}
          onMouseLeave={handleCalcMouseLeave}
          style={{
            "--rx": `${calcTilt.rx}deg`,
            "--ry": `${calcTilt.ry}deg`,
            "--mx": `${calcTilt.mx}%`,
            "--my": `${calcTilt.my}%`,
            "--go": calcTilt.go,
            transform: `perspective(1000px) rotateX(${calcTilt.rx}deg) rotateY(${calcTilt.ry}deg)`,
          } as React.CSSProperties}
          className="tilt-card mt-8 overflow-hidden rounded-[32px] border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40 transition-transform duration-300 ease-out"
        >
          <div className="tilt-card-glare" />
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
                          suppressHydrationWarning
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
                      suppressHydrationWarning
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
                          suppressHydrationWarning
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
                        suppressHydrationWarning
                        onClick={() => setUnitType("kost")}
                        className={`flex-1 rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-wider transition-colors relative z-10 ${
                          unitType === "kost" ? "text-zinc-950 dark:text-white" : "text-zinc-400"
                        }`}
                      >
                        Kost (Maks 3x4m)
                      </button>
                      <button
                        suppressHydrationWarning
                        onClick={() => setUnitType("apartment")}
                        className={`flex-1 rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-wider transition-colors relative z-10 ${
                          unitType === "apartment" ? "text-zinc-950 dark:text-white" : "text-zinc-400"
                        }`}
                      >
                        Apartemen
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
                            suppressHydrationWarning
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

                  <div className="grid gap-6 lg:grid-cols-12 items-start">
                    {/* Room Visualizer 3D Map (Rendered first on mobile, second on desktop) */}
                    <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
                      <RoomVisualizer
                        roomSelection={roomSelection}
                        onRoomQtyChange={handleRoomQtyChange}
                        onRoomTypeToggle={handleRoomTypeToggle}
                      />
                    </div>

                    {/* Room Selector List (Rendered second on mobile, first on desktop) */}
                    <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
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

              {/* SECTION: ZONA TRANSPORT */}
              <div className="border-t border-zinc-200/50 dark:border-zinc-800/40 pt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider">
                    Pilih Wilayah Jarak (Ongkir)
                  </h4>
                  <p className="text-[10px] font-semibold text-zinc-400 mt-1">
                    Gratis ongkir untuk wilayah Kota Bandung. Untuk wilayah luar kota Bandung, dikenakan ongkos kirim sesuai ketentuan radius jarak.
                  </p>
                </div>
                
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {TRANSPORT_ZONES.map((zone) => (
                    <button
                      suppressHydrationWarning
                      key={zone.id}
                      type="button"
                      onClick={() => setTransportZone(zone.id)}
                      className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                        transportZone === zone.id
                          ? "border-blue-500 bg-blue-500/5 dark:border-blue-400 dark:bg-blue-400/5"
                          : "border-zinc-200/60 bg-white/20 hover:bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-950/10"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-900 dark:text-white">{zone.id.toUpperCase()}</span>
                      <span className="text-xs font-extrabold text-zinc-950 dark:text-white mt-1">{zone.name.split(":")[1] || zone.name}</span>
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 mt-1.5">
                        {zone.fee === 0 ? "Free Ongkir" : `+Rp ${zone.fee.toLocaleString("id-ID")}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION: ADD-ON SETRIKA (Hanya untuk non-Setrika) */}
              {activeTab !== "ironing" && (
                <div className="border-t border-zinc-200/50 dark:border-zinc-800/40 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider">
                        Layanan Tambahan: Jasa Setrika Pakaian
                      </h4>
                      <p className="text-[10px] font-semibold text-zinc-400 mt-1">Bantu rapikan pakaian harian. Tarif flat Rp 50.000 / jam (Min. 1 jam).</p>
                    </div>
                    
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => setIroningAddonActive(!ironingAddonActive)}
                      className={`rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all border ${
                        ironingAddonActive
                          ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                          : "bg-white text-zinc-600 border-zinc-250 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-850"
                      }`}
                    >
                      {ironingAddonActive ? "Batalkan" : "Tambah Setrika"}
                    </button>
                  </div>
                  
                  {ironingAddonActive && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 animate-scaleIn">
                      <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-950/20">
                        <button
                          type="button"
                          onClick={() => setIroningAddonHours((h) => Math.max(1, h - 1))}
                          disabled={ironingAddonHours <= 1}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-600 shadow-sm transition-all disabled:opacity-30 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center font-extrabold text-zinc-950 dark:text-white text-sm">
                          {ironingAddonHours}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIroningAddonHours((h) => Math.min(8, h + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-600 shadow-sm transition-all dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Jam Kerja Gosok Pakaian (+Rp {(ironingAddonHours * 50000).toLocaleString("id-ID")})
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Output Panel / Receipt View (5 Cols) */}
            <div className="p-8 sm:p-12 md:col-span-5 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col justify-between border-l border-zinc-200 dark:border-zinc-900/60">
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Estimasi Rincian Biaya
                  </h3>
                  
                  {totalPrice <= 0 ? (
                    <div className="mt-6 text-sm font-bold text-blue-500 dark:text-blue-400">
                      Silakan atur ruangan atau layanan pilihan Anda
                    </div>
                  ) : (
                    <div className="mt-6">
                      <div className="text-4xl font-black tracking-tight text-zinc-950 dark:text-white leading-none">
                        Rp {Math.max(MIN_ORDER_PRICE, totalPrice).toLocaleString("id-ID")}
                      </div>
                      {isMinOrderApplied && (
                        <div className="inline-block mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">
                          Batas Minimal Order Diterapkan
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress bar warning untuk minimal order */}
                {totalPrice > 0 && isMinOrderApplied && (
                  <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-900/80 pt-6">
                    <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <span>Progres Minimal Order</span>
                      <span>{Math.round((totalPrice / MIN_ORDER_PRICE) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-900 rounded-full h-1.5">
                      <div
                        className="bg-amber-500 dark:bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(totalPrice / MIN_ORDER_PRICE) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 leading-normal">
                      Harga pembersihan saat ini adalah Rp {totalPrice.toLocaleString("id-ID")}. Tambahkan layanan senilai <strong>Rp {(MIN_ORDER_PRICE - totalPrice).toLocaleString("id-ID")}</strong> lagi untuk memenuhi batas bensin/operasional. Jika tetap dipesan, tarif dibulatkan ke Rp 100.000.
                    </p>
                  </div>
                )}

                {/* Tab specific details list */}
                {totalPrice > 0 && (
                  <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-900/80 pt-6 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Kategori</span>
                      <span className="text-zinc-950 dark:text-white uppercase tracking-wider text-[10px] font-black">
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
                          <span className="text-zinc-950 dark:text-white">{houseArea} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Harga Dasar</span>
                          <span className="text-zinc-950 dark:text-white">
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
                          <span className="text-zinc-950 dark:text-white">{unitType === "kost" ? "Kost (3x4m)" : "Apartemen"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Peralatan</span>
                          <span className="text-zinc-950 dark:text-white">{unitService === "pribadi" ? "Alat Pribadi" : "Alat Mitra"}</span>
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
                                <span className="text-zinc-950 dark:text-white">{sel.quantity}x</span>
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
                          <span className="text-zinc-950 dark:text-white">{ironingHours} Jam</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Tarif Gosok</span>
                          <span className="text-zinc-950 dark:text-white">Rp {IRONING_SERVICE.ratePerHour.toLocaleString("id-ID")}/Jam</span>
                        </div>
                      </>
                    )}

                    {/* Add-on Ironing Details */}
                    {activeTab !== "ironing" && ironingAddonActive && (
                      <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-900/60 pt-3">
                        <span className="text-zinc-500">Add-on Setrika</span>
                        <span className="text-zinc-950 dark:text-white font-extrabold">{ironingAddonHours} Jam (+Rp {(ironingAddonHours * 50000).toLocaleString("id-ID")})</span>
                      </div>
                    )}

                    {/* Transport Fee Details */}
                    <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-900/60 pt-3">
                      <span className="text-zinc-500">Biaya Jarak (Ongkir)</span>
                      <span className="text-zinc-950 dark:text-white font-extrabold">
                        {TRANSPORT_ZONES.find((z) => z.id === transportZone)?.fee === 0
                          ? "Free Ongkir"
                          : `+Rp ${TRANSPORT_ZONES.find((z) => z.id === transportZone)?.fee.toLocaleString("id-ID")}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Zona 3 Blocked Warning */}
              {totalPrice > 0 && isZone3Blocked && (
                <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold leading-normal space-y-1 animate-scaleIn">
                  <p className="font-extrabold text-[10px] uppercase tracking-wider text-rose-500">⚠️ Minimal Order Zona 3</p>
                  <p className="text-[10px] text-rose-350">
                    Radius &gt;20km membutuhkan minimal order layanan senilai <strong>Rp 250.000</strong>. Tambahkan pesanan Anda (sebelum ongkir) agar dapat memesan.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-12 space-y-4">
                {isZone3Blocked ? (
                  <button
                    suppressHydrationWarning
                    disabled
                    type="button"
                    className="w-full rounded-full py-4 text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 cursor-not-allowed flex items-center justify-center gap-2 opacity-80"
                  >
                    Batas Order Kurang (Min. Rp 250K)
                  </button>
                ) : totalPrice <= 0 ? (
                  <button
                    suppressHydrationWarning
                    disabled
                    type="button"
                    className="w-full rounded-full py-4 text-xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
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
