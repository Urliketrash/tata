import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BUSINESS_CONFIG } from "@/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beresin Bandung — Jasa Bersih Rumah & Kost Bandung Terbaik",
  description: "Cari jasa bersih-bersih kost atau rumah di Bandung? Beresin Bandung hadir dengan layanan Reguler & Deep Clean profesional, harga transparan mulai Rp 5.000/m², dan helper terpercaya.",
  keywords: ["jasa bersih rumah Bandung", "jasa bersih kost Bandung", "cleaning service Bandung", "bersih kost harian Bandung", "deep clean Bandung"],
  authors: [{ name: BUSINESS_CONFIG.name }],
  metadataBase: new URL("https://beresinbandung.com"), // Ganti jika domain sudah siap
  openGraph: {
    title: "Beresin Bandung — Jasa Bersih Rumah & Kost Bandung",
    description: "Hitung estimasi biaya bersih-bersih secara instan dan real-time. Layanan Reguler & Deep Clean terpercaya di Bandung.",
    url: "https://beresinbandung.com",
    siteName: BUSINESS_CONFIG.name,
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LocalBusiness structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": BUSINESS_CONFIG.name,
    "description": BUSINESS_CONFIG.description,
    "telephone": `+${BUSINESS_CONFIG.phone}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bandung",
      "addressRegion": "Jawa Barat",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-6.917464",
      "longitude": "107.619122"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "priceRange": "Rp50.000 - Rp1.000.000"
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-zinc-50 dark:bg-black"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
