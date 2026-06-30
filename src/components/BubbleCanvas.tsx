"use client";

import React, { useEffect, useRef, useState } from "react";

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
  highlightColor: string;
  pulseSpeed: number;
  pulseTime: number;
  isPopping: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function BubbleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Detect theme change from DOM
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let bubbles: Bubble[] = [];
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 120,
    };

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Re-populate bubbles according to screen size
      initBubbles();
    };

    const initBubbles = () => {
      bubbles = [];
      const numBubbles = Math.min(Math.floor((width * height) / 25000), 40);
      
      const bubbleColors = [
        { main: "rgba(59, 130, 246, 0.15)", highlight: "rgba(255, 255, 255, 0.6)" },    // Blue
        { main: "rgba(6, 182, 212, 0.15)", highlight: "rgba(255, 255, 255, 0.65)" },   // Cyan
        { main: "rgba(16, 185, 129, 0.12)", highlight: "rgba(255, 255, 255, 0.55)" },  // Emerald
        { main: "rgba(168, 85, 247, 0.12)", highlight: "rgba(255, 255, 255, 0.5)" },   // Purple
      ];

      for (let i = 0; i < numBubbles; i++) {
        const radius = Math.random() * 35 + 15;
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(Math.random() * 0.5 + 0.2), // Upward trend
          opacity: Math.random() * 0.5 + 0.3,
          color: bubbleColors[i % bubbleColors.length].main,
          highlightColor: bubbleColors[i % bubbleColors.length].highlight,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          pulseTime: Math.random() * 100,
          isPopping: false,
        });
      }
    };

    const createBurst = (x: number, y: number, color: string) => {
      const pColors = [
        "rgba(56, 189, 248, 0.8)",  // cyan-400
        "rgba(52, 211, 153, 0.8)",  // emerald-400
        "rgba(255, 255, 255, 0.95)", // white
        "rgba(192, 132, 252, 0.8)", // purple-400
      ];

      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1;
        const maxLife = Math.random() * 20 + 20;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.5,
          color: pColors[Math.floor(Math.random() * pColors.length)],
          opacity: 1,
          life: maxLife,
          maxLife,
        });
      }
    };

    const drawBubble = (b: Bubble) => {
      if (b.isPopping) return;

      // Pulsing radius slightly
      b.pulseTime += b.pulseSpeed;
      const pulseRadius = b.radius + Math.sin(b.pulseTime) * 1.5;

      ctx.save();

      // Bubble Body (3D Spherical Radial Gradient)
      const grad = ctx.createRadialGradient(
        b.x - pulseRadius * 0.2,
        b.y - pulseRadius * 0.2,
        pulseRadius * 0.1,
        b.x,
        b.y,
        pulseRadius
      );
      
      const isDark = theme === "dark";
      
      if (isDark) {
        grad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
        grad.addColorStop(0.5, b.color);
        grad.addColorStop(0.9, "rgba(59, 130, 246, 0.08)");
        grad.addColorStop(1, "rgba(6, 182, 212, 0.18)");
      } else {
        grad.addColorStop(0, "rgba(255, 255, 255, 0.3)");
        grad.addColorStop(0.5, b.color);
        grad.addColorStop(0.9, "rgba(59, 130, 246, 0.05)");
        grad.addColorStop(1, "rgba(6, 182, 212, 0.15)");
      }

      ctx.beginPath();
      ctx.arc(b.x, b.y, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Shiny Specular Reflection Highlight (gives real 3D depth)
      ctx.beginPath();
      const highlightX = b.x - pulseRadius * 0.35;
      const highlightY = b.y - pulseRadius * 0.35;
      const highlightR = pulseRadius * 0.25;
      
      const highlightGrad = ctx.createRadialGradient(
        highlightX,
        highlightY,
        0,
        highlightX,
        highlightY,
        highlightR
      );
      highlightGrad.addColorStop(0, b.highlightColor);
      highlightGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      
      ctx.arc(highlightX, highlightY, highlightR, 0, Math.PI * 2);
      ctx.fillStyle = highlightGrad;
      ctx.fill();

      // Bubble thin outer rim ring
      ctx.beginPath();
      ctx.arc(b.x, b.y, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark 
        ? "rgba(255, 255, 255, 0.12)" 
        : "rgba(59, 130, 246, 0.18)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Subtle bottom shadow outline for spherical shading
      ctx.beginPath();
      ctx.arc(b.x, b.y, pulseRadius * 0.98, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.strokeStyle = isDark
        ? "rgba(6, 182, 212, 0.2)"
        : "rgba(59, 130, 246, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    };

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      
      // Shadow for stardust glow
      ctx.shadowBlur = p.size * 2;
      ctx.shadowColor = p.color;
      
      ctx.fill();
      ctx.restore();
    };

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Update and draw bubbles
      bubbles.forEach((b) => {
        // Normal floating movement
        b.x += b.vx;
        b.y += b.vy;

        // Bouncing off horizontal boundaries
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = Math.abs(b.vx);
        } else if (b.x + b.radius > width) {
          b.x = width - b.radius;
          b.vx = -Math.abs(b.vx);
        }

        // Loop vertically (wrap around bottom with random X)
        if (b.y + b.radius < -10) {
          b.y = height + b.radius + Math.random() * 50;
          b.x = Math.random() * width;
          b.vy = -(Math.random() * 0.5 + 0.2);
        }

        // Mouse repelling force (bubbles slide around cursor smoothly)
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Gently push bubbles away from mouse
          const pushX = Math.cos(angle) * force * 1.5;
          const pushY = Math.sin(angle) * force * 1.2;
          
          b.x += pushX;
          b.y += pushY;
          
          // Tilt velocities
          b.vx = b.vx * 0.95 + pushX * 0.05;
          b.vy = b.vy * 0.95 + pushY * 0.05;
        }

        drawBubble(b);
      });

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // Light gravity
        p.vx *= 0.98; // Friction
        
        p.life -= 1;
        p.opacity = Math.max(p.life / p.maxLife, 0);

        if (p.life <= 0) {
          particles.splice(idx, 1);
        } else {
          drawParticle(p);
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    // Events
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      bubbles.forEach((b) => {
        if (b.isPopping) return;
        const dx = b.x - clickX;
        const dy = b.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= b.radius * 1.2) {
          b.isPopping = true;
          createBurst(b.x, b.y, b.color);
          
          // Recycle bubble after popping
          setTimeout(() => {
            b.y = height + b.radius + Math.random() * 50;
            b.x = Math.random() * width;
            b.vy = -(Math.random() * 0.5 + 0.2);
            b.isPopping = false;
          }, 300);
        }
      });
    };

    window.addEventListener("resize", resize);
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("click", handleClick);
    }

    resize();
    update();

    return () => {
      window.removeEventListener("resize", resize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("click", handleClick);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full pointer-events-auto overflow-hidden opacity-80"
    >
      <canvas ref={canvasRef} className="block pointer-events-none" />
    </div>
  );
}
