import type { ReactNode } from "react";

import type { CoverVariant } from "@frontend/lib/types";

type CoverProps = {
  variant: CoverVariant;
  className?: string;
  // Tailwind aspect ratio class.
  aspect?: string;
};

// Fixed positions, so the markup is the same on the server and in the browser.
const layers = [
  [[180, 110], [180, 225], [180, 340]],
  [[340, 80], [340, 175], [340, 270], [340, 365]],
  [[500, 80], [500, 175], [500, 270], [500, 365]],
  [[640, 160], [640, 290]],
];

const neuralLinks: [number, number, number, number][] = [];
for (let l = 0; l < layers.length - 1; l++) {
  for (const [x1, y1] of layers[l]) {
    for (const [x2, y2] of layers[l + 1]) neuralLinks.push([x1, y1, x2, y2]);
  }
}

const circuitTraces = [
  "M0 120 H180 L220 160 H330",
  "M0 330 H150 L200 280 H330",
  "M800 100 H620 L580 140 H470",
  "M800 350 H640 L600 300 H470",
  "M400 0 V130",
  "M400 450 V320",
  "M260 450 V380 L300 340 H330",
  "M540 0 V60 L500 100 V130",
];

const bars = [120, 180, 150, 230, 200, 280, 250, 320];

// Each scene is an 800×450 SVG. Animated parts use the anim-* classes from frontend.css.
const scenes: Record<CoverVariant, ReactNode> = {
  neural: (
    <>
      {neuralLinks.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(196,181,253,0.18)" strokeWidth="1" />
      ))}
      {neuralLinks.filter((_, i) => i % 3 === 0).map(([x1, y1, x2, y2], i) => (
        <line
          key={`f${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(103,232,249,0.75)"
          strokeWidth="1.5"
          strokeDasharray="6 34"
          className="anim-flow"
          style={{ animationDelay: `${(i % 5) * 0.4}s` }}
        />
      ))}
      {layers.flat().map(([x, y], i) => (
        <g key={`n${i}`}>
          <circle cx={x} cy={y} r="16" fill="rgba(167,139,250,0.18)" className="anim-glow" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
          <circle cx={x} cy={y} r="6" fill="#ddd6fe" />
        </g>
      ))}
    </>
  ),
  circuit: (
    <>
      {circuitTraces.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="rgba(165,243,252,0.22)" strokeWidth="3" />
          <path d={d} fill="none" stroke="rgba(165,243,252,0.9)" strokeWidth="3" strokeDasharray="10 30" className="anim-flow" style={{ animationDelay: `${i * 0.3}s` }} />
        </g>
      ))}
      <rect x="330" y="130" width="140" height="190" rx="14" fill="rgba(8,47,73,0.9)" stroke="rgba(165,243,252,0.6)" strokeWidth="2" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={`p${i}`} fill="rgba(165,243,252,0.6)">
          <rect x="318" y={148 + i * 28} width="12" height="6" rx="2" />
          <rect x="470" y={148 + i * 28} width="12" height="6" rx="2" />
        </g>
      ))}
      <text x="400" y="236" textAnchor="middle" fill="rgba(207,250,254,0.9)" fontSize="34" fontFamily="monospace" fontWeight="700">AI</text>
      <circle cx="400" cy="225" r="80" fill="rgba(34,211,238,0.12)" className="anim-glow" />
    </>
  ),
  code: (
    <>
      <defs>
        <pattern id="cover-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 H0 V40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="450" fill="url(#cover-grid)" />
      <text x="110" y="250" fill="rgba(255,255,255,0.32)" fontSize="150" fontFamily="monospace" fontWeight="700" className="anim-float">{"</>"}</text>
      <text x="520" y="330" fill="rgba(165,243,252,0.35)" fontSize="72" fontFamily="monospace" className="anim-float" style={{ animationDelay: "1.5s" }}>{"{ }"}</text>
      <rect x="0" y="0" width="800" height="5" fill="rgba(196,181,253,0.6)" className="anim-scan" />
    </>
  ),
  data: (
    <>
      {[110, 190, 270, 350].map((y) => (
        <line key={y} x1="80" x2="720" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
      ))}
      {bars.map((h, i) => (
        <rect
          key={i}
          x={110 + i * 76}
          y={380 - h}
          width="44"
          height={h}
          rx="6"
          fill={i % 2 ? "rgba(94,234,212,0.55)" : "rgba(167,139,250,0.55)"}
          className="anim-grow"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <polyline
        points={bars.map((h, i) => `${132 + i * 76},${360 - h}`).join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="3"
        strokeDasharray="8 12"
        className="anim-flow"
      />
      {bars.map((h, i) => (
        <circle key={`d${i}`} cx={132 + i * 76} cy={360 - h} r="5" fill="#fff" />
      ))}
    </>
  ),
  terminal: (
    <>
      <rect x="120" y="70" width="560" height="310" rx="16" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.12)" />
      <circle cx="150" cy="96" r="7" fill="#ff5f57" />
      <circle cx="174" cy="96" r="7" fill="#febc2e" />
      <circle cx="198" cy="96" r="7" fill="#28c840" />
      {[
        ["❯ ask", "“summarize the incident”", "rgba(110,231,183,0.9)"],
        ["  →", "retrieving 6 passages…", "rgba(165,243,252,0.8)"],
        ["  →", "answer with 3 citations", "rgba(196,181,253,0.9)"],
        ["❯ run", "eval --suite support", "rgba(110,231,183,0.9)"],
        ["  ✓", "38/40 cases passed", "rgba(165,243,252,0.8)"],
      ].map(([prompt, text, color], i) => (
        <text key={i} x="150" y={150 + i * 40} fontSize="22" fontFamily="monospace">
          <tspan fill={color}>{prompt}</tspan>
          <tspan fill="rgba(226,232,240,0.85)"> {text}</tspan>
        </text>
      ))}
      <rect x="150" y="346" width="14" height="24" fill="rgba(226,232,240,0.9)" className="anim-blink" />
    </>
  ),
  orbit: (
    <>
      <circle cx="400" cy="225" r="60" fill="rgba(196,181,253,0.35)" className="anim-glow" />
      <circle cx="400" cy="225" r="26" fill="#ede9fe" />
      <g className="anim-spin">
        <ellipse cx="400" cy="225" rx="200" ry="70" fill="none" stroke="rgba(196,181,253,0.35)" strokeWidth="1.5" />
        <circle cx="600" cy="225" r="9" fill="#a5f3fc" />
      </g>
      <g className="anim-spin-reverse">
        <ellipse cx="400" cy="225" rx="140" ry="140" fill="none" stroke="rgba(165,243,252,0.25)" strokeWidth="1.5" strokeDasharray="4 8" />
        <circle cx="400" cy="85" r="7" fill="#c4b5fd" />
        <circle cx="400" cy="365" r="5" fill="#a5f3fc" />
      </g>
      <g className="anim-spin" style={{ animationDuration: "30s" }}>
        <ellipse cx="400" cy="225" rx="290" ry="120" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <circle cx="110" cy="225" r="6" fill="#fff" />
      </g>
    </>
  ),
};

// Decorative illustrated cover. Pure SVG and CSS, so it needs no image files.
// The image zooms slightly when the parent with the `group` class is hovered.
export function Cover({ variant, className = "", aspect = "aspect-[16/9]" }: CoverProps) {
  const scene = scenes[variant] ? variant : "code";

  return (
    <div aria-hidden="true" className={`cover-${scene} relative isolate overflow-hidden ${aspect} ${className}`}>
      <svg
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full transition-transform duration-700 ease-out group-hover:scale-105"
      >
        {scenes[scene]}
      </svg>
      <div className="anim-sheen pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
    </div>
  );
}
