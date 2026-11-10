"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Signal = { from: number; to: number; t: number; speed: number; hops: number };

const LINK_DISTANCE = 150;

// Reads the two accent colours (as "r g b" triplets) from the CSS variables, so the canvas follows the theme.
function readColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    a: style.getPropertyValue("--net-a").trim() || "124 58 237",
    b: style.getPropertyValue("--net-b").trim() || "8 145 178",
  };
}

/*
 * A drifting network of nodes. Nearby nodes are linked, and small signals travel along the links
 * and hop on to neighbours, like activity in a neural network. The pointer gently pulls nodes in.
 * Purely decorative: it pauses when off screen or in a background tab, and draws one still frame
 * when the visitor prefers reduced motion.
 */
export function NeuralCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readColors();
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let signals: Signal[] = [];
    let frame = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };

    const neighbours = (index: number) => {
      const result: number[] = [];
      const n = nodes[index];
      nodes.forEach((m, j) => {
        if (j !== index && Math.hypot(n.x - m.x, n.y - m.y) < LINK_DISTANCE) result.push(j);
      });
      return result;
    };

    const spawnSignal = (from?: number, hops = 0) => {
      const start = from ?? Math.floor(Math.random() * nodes.length);
      const options = neighbours(start);
      if (options.length === 0) return;
      const to = options[Math.floor(Math.random() * options.length)];
      signals.push({ from: start, to, t: 0, speed: 0.012 + Math.random() * 0.018, hops });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(24, Math.min(80, Math.round((width * height) / 11000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 1.8,
      }));
      signals = [];
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Links between nearby nodes, fading with distance.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx.strokeStyle = `rgb(${colors.a} / ${(1 - d / LINK_DISTANCE) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Links to the pointer.
        const n = nodes[i];
        const dp = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        if (dp < LINK_DISTANCE * 1.2) {
          ctx.strokeStyle = `rgb(${colors.b} / ${(1 - dp / (LINK_DISTANCE * 1.2)) * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgb(${colors.a} / 0.75)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Signals: a bright dot with a soft halo, travelling from one node to the next.
      for (const s of signals) {
        const a = nodes[s.from];
        const b = nodes[s.to];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 10);
        halo.addColorStop(0, `rgb(${colors.b} / 0.9)`);
        halo.addColorStop(1, `rgb(${colors.b} / 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgb(${colors.b})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 180 && d > 1) {
          n.x += (dx / d) * 0.35;
          n.y += (dy / d) * 0.35;
        }
      }

      const arrived: Signal[] = [];
      signals = signals.filter((s) => {
        s.t += s.speed;
        if (s.t >= 1) {
          arrived.push(s);
          return false;
        }
        return true;
      });
      // A signal that reaches a node usually fires on to a neighbour.
      for (const s of arrived) {
        if (s.hops < 6 && Math.random() < 0.75) spawnSignal(s.to, s.hops + 1);
      }
      if (signals.length < Math.max(3, nodes.length / 8) && Math.random() < 0.06) spawnSignal();
    };

    const loop = () => {
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    draw();
    start();

    const onResize = () => {
      resize();
      draw();
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    // Re-read the colours when the theme toggle flips the "dark" class.
    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      if (!running) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      stop();
      io.disconnect();
      themeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none size-full ${className}`} />;
}
