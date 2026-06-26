"use client";

import React, { useState, useEffect } from "react";
import { BUSINESS_CONFIG } from "@/config";
import { MessageSquare, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Layanan", href: "#layanan" },
    { name: "Kalkulator", href: "#kalkulator" },
    { name: "Keunggulan", href: "#keunggulan" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-200/50 bg-white/75 py-3 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/75"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {BUSINESS_CONFIG.name.split(" ")[0]}
                <span className="text-blue-500 font-semibold">
                  {BUSINESS_CONFIG.name.split(" ")[1] ? ` ${BUSINESS_CONFIG.name.split(" ")[1]}` : ""}
                </span>
              </span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href={`https://wa.me/${BUSINESS_CONFIG.phone}?text=Halo%20${encodeURIComponent(BUSINESS_CONFIG.name)}%20saya%20tertarik%20untuk%20tanya%20jasa%20bersih-bersih.`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-5 font-medium text-white transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600 h-10 inline-flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <MessageSquare className="h-4 w-4 fill-white text-blue-600 dark:text-blue-500" />
              Chat WA
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-80 border-b border-zinc-200/50 bg-white/95 dark:border-zinc-800/50 dark:bg-black/95" : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 px-3">
            <a
              href={`https://wa.me/${BUSINESS_CONFIG.phone}?text=Halo%20${encodeURIComponent(BUSINESS_CONFIG.name)}%20saya%20tertarik%20untuk%20tanya%20jasa%20bersih-bersih.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-blue-600 py-3 text-center font-medium text-white dark:bg-blue-500 flex items-center justify-center gap-2 text-sm h-11 shadow-sm"
            >
              <MessageSquare className="h-4 w-4 fill-white text-blue-600 dark:text-blue-500" />
              Chat WA
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
