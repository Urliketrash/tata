"use client";

import React, { useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import * as Icons from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, go: 0 });
  const IconComponent = (Icons as any)[icon] || Icons.Sparkles;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Max 10 deg tilt
    const rx = -((y - yc) / yc) * 10;
    const ry = ((x - xc) / xc) * 10;
    setTilt({
      rx,
      ry,
      mx: (x / rect.width) * 100,
      my: (y / rect.height) * 100,
      go: 1,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, go: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        "--rx": `${tilt.rx}deg`,
        "--ry": `${tilt.ry}deg`,
        "--mx": `${tilt.mx}%`,
        "--my": `${tilt.my}%`,
        "--go": tilt.go,
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      } as React.CSSProperties}
      className="tilt-card group rounded-3xl border border-zinc-200/50 bg-zinc-50/30 p-8 shadow-sm backdrop-blur-sm transition-transform duration-200 ease-out hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 dark:border-zinc-800/50 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/40 overflow-hidden"
    >
      {/* Glossy sheen overlay */}
      <div className="tilt-card-glare" />

      {/* Icon Container */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 dark:bg-blue-950/30 dark:text-blue-400 dark:group-hover:bg-blue-500 dark:group-hover:text-zinc-950 relative z-20">
        <IconComponent className="h-5.5 w-5.5" />
      </div>

      <h3 className="mt-6 text-base font-bold text-zinc-950 dark:text-white tracking-tight relative z-20">
        {title}
      </h3>
      <p className="mt-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed relative z-20">
        {description}
      </p>
    </div>
  );
}

export default function Features() {
  const { config } = useConfig();
  const { WHY_CHOOSE_US } = config;
  return (
    <section id="keunggulan" className="py-24 relative overflow-hidden bg-white dark:bg-black">
      {/* Background shape */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 h-[300px] w-[300px] rounded-full bg-emerald-100/10 blur-[90px] dark:bg-emerald-900/5 animate-blob" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl dark:text-white leading-tight">
            Keunggulan Layanan Kami
          </h2>
          <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Komitmen kami untuk memberikan kenyamanan, keamanan, dan kebersihan tingkat tinggi pada setiap kunjungan.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, index) => (
            <FeatureCard
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
