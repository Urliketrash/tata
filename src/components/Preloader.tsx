"use client";

import React, { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { Sparkle } from "lucide-react";

export default function Preloader() {
  const { config } = useConfig();
  const { BUSINESS_CONFIG } = config;
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Simulate load progress
    const duration = 1000; // 1 second loader
    const intervalTime = 15;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setFadeOut(true), 150); // Start fadeout
          setTimeout(() => setHidden(true), 650);  // Unmount completely
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (!mounted || hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-500 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 3D-styled Concentric Swirling Orbits (Pseudo-3D Particle representation) */}
      <div className="relative flex items-center justify-center h-48 w-48 mb-8">
        
        {/* Glowing aura background */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />

        {/* Outer Orbit (Axis Y Tilt) */}
        <div 
          className="absolute inset-0 border-[1.5px] border-dashed border-blue-500/40 rounded-full animate-spin-slow"
          style={{ transform: "rotateX(60deg) rotateY(15deg)" }}
        />

        {/* Middle Orbit (Axis X Tilt) */}
        <div 
          className="absolute inset-4 border-[1.2px] border-cyan-400/40 rounded-full"
          style={{ 
            transform: "rotateX(30deg) rotateY(60deg)",
            animation: "spin-slow 8s infinite linear reverse" 
          }}
        />

        {/* Inner Orbit (Axis Z tilt) */}
        <div 
          className="absolute inset-8 border-[1px] border-emerald-400/30 rounded-full animate-spin-slow"
          style={{ 
            transform: "rotateX(45deg) rotateY(-45deg)",
            animationDuration: "5s"
          }}
        />

        {/* Shiny central spinning core representing cleanliness / shine */}
        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-bounce" style={{ animationDuration: "3s" }}>
          <Sparkle className="h-6 w-6 text-white fill-white/20 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        {/* Floating miniature water-droplet particle accents */}
        <div className="absolute top-4 left-8 h-2 w-2 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute bottom-6 right-8 h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-4 h-2.5 w-2.5 bg-emerald-400 rounded-full opacity-60 blur-[0.5px]" style={{ animation: "float-blob 3s infinite" }} />
      </div>

      {/* Brand Label */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-widest text-white uppercase">
          {BUSINESS_CONFIG.name.split(".")[0]}
          <span className="text-blue-400">.{BUSINESS_CONFIG.name.split(".")[1]}</span>
        </h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Loading Premium Experience
        </p>
      </div>

      {/* Progress Bar (Glow tech line) */}
      <div className="mt-10 w-48 bg-zinc-900 h-[3px] rounded-full overflow-hidden border border-zinc-900 relative">
        <div
          className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
