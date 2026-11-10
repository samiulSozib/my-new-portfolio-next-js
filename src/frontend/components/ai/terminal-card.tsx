import type { CSSProperties, ReactNode } from "react";

type Line = { kind: "command" | "output" | "accent"; text: string; prefix?: ReactNode };

/*
 * A small terminal window whose lines appear one after another as if typed. The reveal is pure CSS
 * (see .term-line in frontend.css), so the server-rendered HTML already contains every line.
 */
export function TerminalCard({ title, lines, className = "" }: { title: string; lines: Line[]; className?: string }) {
  let delay = 0.4;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b1d]/90 font-mono text-[13px] leading-6 text-slate-200 shadow-2xl shadow-violet-950/40 backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ms-3 truncate text-xs text-slate-400">{title}</span>
      </div>
      <div className="space-y-1 px-5 py-4" aria-hidden="true">
        {lines.map((line, index) => {
          const steps = Math.max(8, Math.min(48, line.text.length));
          // Commands are "typed" slower than output is printed.
          const duration = line.kind === "command" ? steps * 0.045 : 0.35;
          const style = {
            "--type-delay": `${delay}s`,
            "--type-steps": steps,
            "--type-duration": `${duration}s`,
          } as CSSProperties;
          delay += duration + (line.kind === "command" ? 0.25 : 0.12);

          return (
            <p key={index} className="term-line flex gap-2 whitespace-pre-wrap" style={style}>
              {line.kind === "command" ? (
                <span className="text-emerald-400">❯</span>
              ) : (
                <span className="text-slate-500">{line.prefix ?? " "}</span>
              )}
              <span
                className={
                  line.kind === "command" ? "text-slate-100" : line.kind === "accent" ? "text-violet-300" : "text-cyan-200/90"
                }
              >
                {line.text}
              </span>
            </p>
          );
        })}
        <p className="term-line flex gap-2" style={{ "--type-delay": `${delay}s`, "--type-steps": 1 } as CSSProperties}>
          <span className="text-emerald-400">❯</span>
          <span className="term-cursor inline-block h-5 w-2 translate-y-0.5 bg-slate-200" />
        </p>
      </div>
      {/* The plain text, for screen readers. */}
      <div className="sr-only">
        {lines.filter((line) => line.kind !== "command").map((line) => line.text).join(". ")}
      </div>
    </div>
  );
}
