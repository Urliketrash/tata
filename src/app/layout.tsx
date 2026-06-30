import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { BUSINESS_CONFIG } from "@/config";
import { ConfigProvider } from "@/context/ConfigContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SapuRapi.bdg — Jasa Bersih Rumah & Kost Bandung Terbaik",
  description: "Cari jasa bersih-bersih kost atau rumah di Bandung? SapuRapi.bdg hadir dengan layanan Reguler & Deep Clean profesional, harga transparan, dan helper terpercaya.",
  keywords: ["jasa bersih rumah Bandung", "jasa bersih kost Bandung", "cleaning service Bandung", "bersih kost harian Bandung", "deep clean Bandung", "SapuRapi"],
  authors: [{ name: BUSINESS_CONFIG.name }],
  metadataBase: new URL("https://sapurapi.com"), // Ganti jika domain sudah siap
  icons: {
    icon: "/logo-3d.png",
    shortcut: "/logo-3d.png",
    apple: "/logo-3d.png",
  },
  openGraph: {
    title: "SapuRapi.bdg — Jasa Bersih Rumah & Kost Bandung",
    description: "Hitung estimasi biaya bersih-bersih secara instan dan real-time. Layanan kebersihan terpercaya di Bandung dari SapuRapi.bdg.",
    url: "https://sapurapi.com",
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
      "opens": "07:00",
      "closes": "22:00"
    },
    "priceRange": "Rp50.000 - Rp1.000.000"
  };

  return (
    <html
      lang="id"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
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
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
