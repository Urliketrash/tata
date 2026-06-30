"use client";

import React, { useState, useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";

export default function FloatingWA() {
  const { config } = useConfig();
  const { BUSINESS_CONFIG } = config;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href={`https://wa.me/${BUSINESS_CONFIG.phone}?text=Halo%20${encodeURIComponent(BUSINESS_CONFIG.name)}%2C%20saya%20tertarik%20dengan%20jasa%20bersih-bersih.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800"
      aria-label="Hubungi kami melalui WhatsApp"
    >
      {/* Pulse rings */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
      
      {/* Official WhatsApp SVG Path Logo */}
      <svg
        className="h-7 w-7 text-white fill-current transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.018 14.07 1 11.993 1c-5.445 0-9.871 4.372-9.875 9.8-.002 1.778.475 3.514 1.382 5.04L2.463 20.3l4.184-1.146zm11.233-5.32c-.328-.164-1.942-.959-2.242-1.069-.3-.11-.519-.165-.737.165-.219.329-.848 1.069-1.04 1.288-.192.219-.384.246-.712.082-.328-.164-1.386-.511-2.641-1.63-1-.893-1.674-1.997-1.871-2.327-.197-.33-.021-.508.143-.671.147-.147.328-.384.492-.576.164-.192.219-.329.328-.549.11-.22.055-.411-.027-.576-.082-.165-.737-1.782-1.011-2.441-.267-.642-.56-.554-.768-.565-.2-.01-.428-.01-.657-.01-.229 0-.601.086-.916.429-.315.343-1.203 1.179-1.203 2.875s1.232 3.322 1.405 3.552c.174.229 2.425 3.702 5.874 5.19 1.147.494 1.942.744 2.607.954.858.272 1.639.234 2.256.142.688-.103 1.942-.795 2.216-1.564.274-.77.274-1.429.192-1.564-.082-.135-.3-.219-.628-.384z" />
      </svg>
    </a>
  );
}
