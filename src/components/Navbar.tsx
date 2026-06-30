"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConfig } from "@/context/ConfigContext";
import { MessageSquare, Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { config } = useConfig();
  const { BUSINESS_CONFIG } = config;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    if (logoClicks === 0) return;
    const timeout = setTimeout(() => {
      setLogoClicks(0);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [logoClicks]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextCount = logoClicks + 1;
    if (nextCount >= 3) {
      setLogoClicks(0);
      router.push("/admin");
    } else {
      setLogoClicks(nextCount);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    
    // Theme initialization
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { name: "Layanan", href: "#layanan" },
    { name: "Kalkulator", href: "#kalkulator" },
    { name: "Keunggulan", href: "#keunggulan" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-zinc-200/40 bg-white/70 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.01)] backdrop-blur-xl dark:border-zinc-800/40 dark:bg-black/75"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 group">
              <img
                src="/logo-3d.png"
                alt="SapuRapi Logo"
                className="h-20 w-auto object-contain transition-transform group-hover:scale-105 dark:invert-0 -my-4"
              />
              <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white transition-colors">
                {BUSINESS_CONFIG.name.includes(".") ? BUSINESS_CONFIG.name.split(".")[0] : BUSINESS_CONFIG.name}
                {BUSINESS_CONFIG.name.includes(".") && (
                  <span className="text-blue-500 font-extrabold group-hover:text-blue-600 dark:text-blue-400 transition-colors">
                    .{BUSINESS_CONFIG.name.split(".")[1]}
                  </span>
                )}
              </span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Action Elements */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/50 bg-white/50 text-zinc-600 shadow-sm backdrop-blur-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 hover:scale-105 active:scale-95 dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4.5 w-4.5 transition-transform duration-500 hover:rotate-12" />
              ) : (
                <Sun className="h-4.5 w-4.5 transition-transform duration-500 hover:rotate-45" />
              )}
            </button>

            {/* WA button */}
            <a
              href={`https://wa.me/${BUSINESS_CONFIG.phone}?text=Halo%20${encodeURIComponent(BUSINESS_CONFIG.name)}%20saya%20tertarik%20untuk%20tanya%20jasa%20bersih-bersih.`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-5 font-semibold text-xs uppercase tracking-wider text-white transition-all hover:bg-blue-700 hover:scale-[1.03] active:scale-[0.97] dark:bg-blue-500 dark:hover:bg-blue-600 h-10 inline-flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
            >
              <MessageSquare className="h-3.5 w-3.5 fill-white text-blue-600 dark:text-blue-500" />
              Chat WA
            </a>
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/50 bg-white/50 text-zinc-600 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-full p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-80 border-b border-zinc-200/40 bg-white/95 dark:border-zinc-800/40 dark:bg-black/95" : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-4 pb-5 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 px-3">
            <a
              href={`https://wa.me/${BUSINESS_CONFIG.phone}?text=Halo%20${encodeURIComponent(BUSINESS_CONFIG.name)}%20saya%20tertarik%20untuk%20tanya%20jasa%20bersih-bersih.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-blue-600 py-3 text-center font-bold uppercase tracking-wider text-xs text-white dark:bg-blue-500 flex items-center justify-center gap-2 h-11 shadow-sm"
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
