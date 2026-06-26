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

// 1. Paket Satuan Per Ruangan
export type RoomService = {
  id: string;
  name: string;
  regulerPrice: number;
  deepPrice: number;
};

export const ROOM_SERVICES: RoomService[] = [
  { id: "toilet", name: "Toilet / Kamar Mandi", regulerPrice: 50000, deepPrice: 100000 },
  { id: "bedroom", name: "Kamar Tidur", regulerPrice: 50000, deepPrice: 100000 },
  { id: "kitchen", name: "Dapur (Kitchen)", regulerPrice: 50000, deepPrice: 100000 },
  { id: "living", name: "Ruang Tamu / Keluarga", regulerPrice: 45000, deepPrice: 85000 },
  { id: "terrace", name: "Halaman Rumah / Teras", regulerPrice: 35000, deepPrice: 75000 },
];

// 2. Paket Rumah (Mulai Tipe 36) - Harga per m2
export const HOUSE_PACKAGE = {
  minArea: 36,
  regulerPribadiPerM2: 3500,
  regulerMitraPerM2: 5500,
  deepMitraPerM2: 13500,
};

// 3. Paket Kost (Maks 3x4m)
export const KOST_PACKAGE = {
  regulerPribadi: 50000,
  regulerMitra: 75000,
  deepMitra: 135000,
};

// 4. Paket Apartemen (Studio)
export const APARTMENT_PACKAGE = {
  regulerPribadi: 75000,
  regulerMitra: 100000,
  deepMitra: 175000,
};

// 5. Jasa Setrika Pakaian (New)
export const IRONING_SERVICE = {
  ratePerHour: 50000,
  minHours: 2,
};

// Batas minimum order global agar tidak rugi operasional
export const MIN_ORDER_PRICE = 100000;

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
    answer: "Untuk paket dengan Alat Mitra, seluruh peralatan dan cairan pembersih disediakan oleh kami. Untuk opsi Alat Pribadi (seperti pada paket Kost/Apartemen), pemesan wajib menyiapkan peralatan standar seperti sapu, kain pel, ember, dan pembersih.",
  },
  {
    question: "Berapa batas minimal order untuk sekali panggil?",
    answer: "Batas minimal order kumulatif untuk sekali panggil adalah Rp 100.000. Anda dapat menggabungkan beberapa layanan (misal: 1 Kamar Tidur Reguler + 1 Kamar Mandi Reguler) agar menyentuh batas minimal order.",
  },
  {
    question: "Apa ketentuan untuk Jasa Setrika Pakaian?",
    answer: "Tarif setrika adalah Rp 50.000 / jam dengan minimal order 2 jam (total Rp 100.000). Konsumen wajib menyediakan aliran listrik, setrika, meja setrika, dan hanger pakaian di lokasi.",
  },
  {
    question: "Bagaimana cara melakukan pembayaran?",
    answer: "Pembayaran dapat dilakukan melalui transfer bank atau e-wallet (GoPay/OVO) setelah pengerjaan selesai dilakukan dan diperiksa langsung oleh Anda di lokasi (COD).",
  },
];
