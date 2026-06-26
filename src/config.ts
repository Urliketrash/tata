// Konfigurasi Utama Website Jasa Bersih-Bersih Rumah & Kost (Bandung)

export const BUSINESS_CONFIG = {
  name: "Beresin Bandung",
  tagline: "Bersih Cepat, Rapi Maksimal, Terpercaya di Bandung",
  description: "Layanan bersih-bersih rumah dan kost profesional dengan standar tinggi. Melayani area Bandung dan sekitarnya.",
  phone: "6281234567890", // Nomor WhatsApp aktif (awali dengan kode negara 62, tanpa + atau 0)
  instagram: "beresinbandung.id",
  tiktok: "beresinbandung.id",
  area: "Kota Bandung & sekitarnya",
  workingHours: "08.00 - 18.00 WIB",
  googleMapsLink: "https://maps.google.com/?q=Bandung",
};

export type ServicePackage = {
  id: string;
  name: string;
  ratePerM2: number;
  description: string;
  features: string[];
};

export const SERVICES: ServicePackage[] = [
  {
    id: "reguler",
    name: "Reguler Clean",
    ratePerM2: 5000,
    description: "Layanan bersih-bersih standar harian untuk menjaga kenyamanan hunian Anda.",
    features: [
      "Menyapu & mengepel lantai",
      "Membersihkan debu pada furnitur & meja",
      "Merapikan tempat tidur & kamar",
      "Membersihkan kamar mandi ringan",
      "Membuang sampah ke tempat pembuangan terdekat",
    ],
  },
  {
    id: "deep",
    name: "Deep Clean",
    ratePerM2: 7000,
    description: "Pembersihan menyeluruh, detail, dan mendalam untuk area yang jarang dibersihkan.",
    features: [
      "Semua fitur Reguler Clean",
      "Pembersihan noda membandel kamar mandi/kerak lantai",
      "Pembersihan kaca jendela bagian dalam & luar",
      "Sedot debu kasur, sofa, dan karpet (vakum standar)",
      "Pembersihan bagian dalam lemari & laci (jika kosong)",
      "Disinfeksi area utama",
    ],
  },
];

export const CALCULATOR_CONFIG = {
  // Mode kalkulasi harga helper:
  // 'multiplier' = Total Harga = Luas * Rate * Jumlah Helper (PRD Default)
  // 'fixed' = Total Harga = Luas * Rate (Jumlah helper hanya mempercepat durasi, bukan pengali harga)
  pricingMode: "multiplier" as "multiplier" | "fixed",

  minArea: 1, // Luas minimum (m²)
  maxArea: 500, // Luas maksimum (m²)
  minHelpers: 1, // Minimal helper
  maxHelpers: 4, // Maksimal helper
  minOrderPrice: 50000, // Batas minimum order (Rp)

  // Estimasi kecepatan kerja helper (m² per jam per helper) - untuk info durasi
  m2PerHourPerHelper: 15,
};

export const WHY_CHOOSE_US = [
  {
    title: "Tenaga Terpercaya",
    description: "Semua helper kami telah melalui proses seleksi ketat dan pelatihan profesional.",
    icon: "ShieldCheck",
  },
  {
    title: "Fleksibel & Cepat",
    description: "Pilih jadwal sesuka Anda, helper kami siap datang tepat waktu dan bekerja efisien.",
    icon: "Clock",
  },
  {
    title: "Peralatan Lengkap",
    description: "Helper dibekali cairan pembersih standar ramah lingkungan dan alat kebersihan lengkap.",
    icon: "Sparkles",
  },
  {
    title: "Harga Transparan",
    description: "Hitung estimasi tarif secara instan lewat website. Bayar sesuai yang disepakati.",
    icon: "Receipt",
  },
];

export const FAQS = [
  {
    question: "Apakah peralatan kebersihan sudah disediakan?",
    answer: "Ya, helper kami datang membawa peralatan standar dan cairan pembersih dasar. Jika Anda memiliki preferensi alat atau cairan khusus (misalnya untuk marmer), Anda bisa menyediakannya di lokasi.",
  },
  {
    question: "Berapa lama proses pengerjaan biasanya?",
    answer: "Estimasi waktu bergantung pada luas area dan tingkat kekotoran. Rata-rata 1 helper dapat menyelesaikan area 15 m² dalam 1 jam.",
  },
  {
    question: "Bagaimana cara melakukan pembayaran?",
    answer: "Pembayaran dapat dilakukan melalui transfer bank atau e-wallet (GoPay/OVO) setelah pengerjaan selesai dilakukan dan diperiksa oleh Anda.",
  },
  {
    question: "Apakah melayani luar kota Bandung?",
    answer: "Saat ini kami fokus melayani wilayah Kota Bandung, Kabupaten Bandung, dan Bandung Barat yang terjangkau transportasi umum/ojek online.",
  },
];
