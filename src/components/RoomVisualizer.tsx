"use client";

import React, { useState } from "react";
import { Plus, Minus, Sparkles } from "lucide-react";

interface RoomVisualizerProps {
  roomSelection: {
    [roomId: string]: {
      quantity: number;
      isDeep: boolean;
    };
  };
  onRoomQtyChange: (roomId: string, increment: boolean) => void;
  onRoomTypeToggle: (roomId: string) => void;
}

interface BlockConfig {
  id: string;
  name: string;
  cx: number; // Center X
  cy: number; // Center Y
  w: number;  // Half width
  h: number;  // Half height
  d: number;  // Height/Extrude depth
  themeColor: {
    base: string;
    active: string;
    stroke: string;
    glow: string;
  };
}

export default function RoomVisualizer({
  roomSelection,
  onRoomQtyChange,
  onRoomTypeToggle,
}: RoomVisualizerProps) {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  // Configuration for rooms in back-to-front rendering order (to ensure correct overlapping)
  const blocks: BlockConfig[] = [
    {
      id: "toilet",
      name: "Toilet / Kamar Mandi",
      cx: 110,
      cy: 115,
      w: 42,
      h: 21,
      d: 42,
      themeColor: {
        base: "rgba(59, 130, 246, 0.08)",
        active: "rgba(59, 130, 246, 0.28)",
        stroke: "rgba(59, 130, 246, 0.8)",
        glow: "rgba(59, 130, 246, 0.4)",
      },
    },
    {
      id: "bedroom",
      name: "Kamar Tidur",
      cx: 215,
      cy: 115,
      w: 60,
      h: 30,
      d: 48,
      themeColor: {
        base: "rgba(16, 185, 129, 0.08)",
        active: "rgba(16, 185, 129, 0.26)",
        stroke: "rgba(16, 185, 129, 0.8)",
        glow: "rgba(16, 185, 129, 0.4)",
      },
    },
    {
      id: "kitchen",
      name: "Dapur (Kitchen)",
      cx: 80,
      cy: 185,
      w: 45,
      h: 22.5,
      d: 38,
      themeColor: {
        base: "rgba(245, 158, 11, 0.08)",
        active: "rgba(245, 158, 11, 0.26)",
        stroke: "rgba(245, 158, 11, 0.8)",
        glow: "rgba(245, 158, 11, 0.4)",
      },
    },
    {
      id: "living",
      name: "Ruang Tamu / Keluarga",
      cx: 185,
      cy: 185,
      w: 64,
      h: 32,
      d: 46,
      themeColor: {
        base: "rgba(168, 85, 247, 0.08)",
        active: "rgba(168, 85, 247, 0.26)",
        stroke: "rgba(168, 85, 247, 0.8)",
        glow: "rgba(168, 85, 247, 0.4)",
      },
    },
    {
      id: "terrace",
      name: "Halaman Rumah / Teras",
      cx: 130,
      cy: 245,
      w: 80,
      h: 22,
      d: 12, // Thin slab
      themeColor: {
        base: "rgba(6, 182, 212, 0.08)",
        active: "rgba(6, 182, 212, 0.28)",
        stroke: "rgba(6, 182, 212, 0.8)",
        glow: "rgba(6, 182, 212, 0.4)",
      },
    },
  ];

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 3D Visualizer Map Header */}
      <div className="flex items-center gap-2 mb-4 bg-zinc-100 dark:bg-zinc-800/60 px-4 py-1.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/40">
        <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          Denah 3D Interaktif (Bisa Diklik)
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full aspect-[4/3] max-w-[380px] bg-zinc-950/5 dark:bg-zinc-950/20 rounded-[32px] border border-zinc-250/20 dark:border-zinc-800/40 overflow-hidden flex items-center justify-center p-2 shadow-inner">
        
        {/* Soft grid overlay inside SVG */}
        <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-10 pointer-events-none" />

        <svg
          viewBox="0 0 320 280"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glowing Filters */}
          <defs>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
            </linearGradient>
          </defs>

          {/* Render Room Blocks */}
          {blocks.map((block) => {
            const selection = roomSelection[block.id] || { quantity: 0, isDeep: false };
            const isActive = selection.quantity > 0;
            const isHovered = hoveredRoom === block.id;
            const colors = block.themeColor;

            // Geometry offsets
            const { cx, cy, w, h, d } = block;

            // Top Face path points
            const topPt1 = `${cx},${cy - d - h}`;
            const topPt2 = `${cx + w},${cy - d}`;
            const topPt3 = `${cx},${cy - d + h}`;
            const topPt4 = `${cx - w},${cy - d}`;

            // Left Face path points
            const leftPt1 = `${cx - w},${cy - d}`;
            const leftPt2 = `${cx},${cy - d + h}`;
            const leftPt3 = `${cx},${cy + h}`;
            const leftPt4 = `${cx - w},${cy}`;

            // Right Face path points
            const rightPt1 = `${cx},${cy - d + h}`;
            const rightPt2 = `${cx + w},${cy - d}`;
            const rightPt3 = `${cx + w},${cy}`;
            const rightPt4 = `${cx},${cy + h}`;

            // Determine Fill Colors based on state
            const fillBase = isActive ? colors.active : (isHovered ? "rgba(255, 255, 255, 0.05)" : colors.base);
            const strokeColor = isActive ? colors.stroke : (isHovered ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 116, 139, 0.25)");
            const strokeWidth = isActive || isHovered ? 1.5 : 1;

            return (
              <g
                key={block.id}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredRoom(block.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => onRoomQtyChange(block.id, true)}
              >
                {/* 3D Glowing Shadow Backing (Neon highlight effect) */}
                {isActive && (
                  <path
                    d={`M ${cx - w},${cy} L ${cx},${cy + h} L ${cx + w},${cy} L ${cx},${cy - h} Z`}
                    fill={colors.glow}
                    filter="url(#glow-filter)"
                    opacity="0.65"
                    className="animate-pulse"
                  />
                )}

                {/* Left Wall Face */}
                <path
                  d={`M ${leftPt1} L ${leftPt2} L ${leftPt3} L ${leftPt4} Z`}
                  fill={isActive ? colors.active : (isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(100, 116, 139, 0.03)")}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                />

                {/* Right Wall Face */}
                <path
                  d={`M ${rightPt1} L ${rightPt2} L ${rightPt3} L ${rightPt4} Z`}
                  fill={isActive ? colors.active : (isHovered ? "rgba(255, 255, 255, 0.05)" : "rgba(100, 116, 139, 0.02)")}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                />

                {/* Top Floor/Roof Face */}
                <path
                  d={`M ${topPt1} L ${topPt2} L ${topPt3} L ${topPt4} Z`}
                  fill={fillBase}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                />

                {/* Glossy Diagonal Specular Glare Layer (Top Face Reflection) */}
                <path
                  d={`M ${cx},${cy - d - h} L ${cx + w * 0.5},${cy - d - h * 0.5} L ${cx - w * 0.5},${cy - d - h * 0.5} Z`}
                  fill="url(#glass-grad)"
                  pointerEvents="none"
                  opacity={isActive || isHovered ? 0.4 : 0.15}
                />

                {/* Grid markings on top of rooms for premium tech layout look */}
                <line x1={cx} y1={cy - d - h} x2={cx} y2={cy - d + h} stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3,3" opacity="0.3" />
                <line x1={cx - w} y1={cy - d} x2={cx + w} y2={cy - d} stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3,3" opacity="0.3" />

                {/* Interactive floating count label if active or hovered */}
                {(isActive || isHovered) && (
                  <g transform={`translate(${cx}, ${cy - d - h - 14})`}>
                    {/* Badge BG */}
                    <rect
                      x="-35"
                      y="-12"
                      width="70"
                      height="24"
                      rx="12"
                      fill={isActive ? "#09090b" : "rgba(15, 23, 42, 0.9)"}
                      stroke={strokeColor}
                      strokeWidth="1"
                      className="shadow-lg"
                    />

                    {/* Quantity Label */}
                    <text
                      x="0"
                      y="4"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="800"
                      textAnchor="middle"
                      letterSpacing="0.5"
                    >
                      {isActive ? `${selection.quantity}x ${selection.isDeep ? "DEEP" : "REG"}` : "TAMBAH"}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Hover Status Card (Sleek Glassmorphic Floating Panel) */}
        {hoveredRoom && (
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl glass-panel dark:glass-panel-dark border border-white/20 shadow-lg pointer-events-none animate-fadeIn flex justify-between items-center">
            <div>
              <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Detail Ruangan
              </h4>
              <p className="text-xs font-black text-zinc-900 dark:text-white mt-0.5">
                {blocks.find((b) => b.id === hoveredRoom)?.name}
              </p>
            </div>
            <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-500/5 px-2.5 py-1 rounded-lg border border-blue-500/10">
              {roomSelection[hoveredRoom]?.quantity > 0
                ? `${roomSelection[hoveredRoom].quantity} Dipesan`
                : "Klik untuk menambah"}
            </div>
          </div>
        )}
      </div>

      {/* Manual Quick Action Controls (Directly under 3D map if selection is active) */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center max-w-[320px]">
        {blocks.map((block) => {
          const selection = roomSelection[block.id] || { quantity: 0, isDeep: false };
          if (selection.quantity === 0) return null;

          return (
            <div
              key={block.id}
              className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-2 py-1 shadow-sm animate-scaleIn text-[10px] font-bold text-zinc-800 dark:text-zinc-300"
            >
              <span>{block.name.split(" ")[0]} x{selection.quantity}</span>
              <button
                onClick={() => onRoomTypeToggle(block.id)}
                className={`px-1 rounded text-[8px] uppercase tracking-wider font-extrabold border ${
                  selection.isDeep
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-zinc-250 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                }`}
              >
                {selection.isDeep ? "Deep" : "Reg"}
              </button>
              <div className="flex items-center border-l border-zinc-100 dark:border-zinc-800/80 pl-1.5 gap-1">
                <button
                  onClick={() => onRoomQtyChange(block.id, false)}
                  className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded"
                >
                  <Minus className="h-2.5 w-2.5" />
                </button>
                <button
                  onClick={() => onRoomQtyChange(block.id, true)}
                  className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded"
                >
                  <Plus className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
