import { ArrowRight, Code2 } from "lucide-react";

interface HeroProps {
  onScrollToExamples: () => void;
  repoUrl?: string;
}

export function Hero({ onScrollToExamples, repoUrl = "https://github.com" }: HeroProps) {
  return (
    <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 text-center px-4 max-w-5xl mx-auto">
      {/* Kicker badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-rule-strong)] bg-[var(--color-paper-alt)] text-[var(--color-ink-muted)] text-xs font-mono uppercase tracking-widest mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
        Process-to-Component Architecture
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-[var(--color-ink)] tracking-tight leading-[1.1] mb-6">
        One Component. One Logic. <br />
        <span className="bg-gradient-to-r from-[var(--color-accent)] via-purple-500 to-indigo-600 bg-clip-text text-transparent">
          Both Human UI and AI Agents.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed mb-10">
        Turn complex, multi-step workflows into single, WebMCP-compliant components.
        Serve human forms and autonomous agents from a single Zod schema and a unified
        mutation handler registered directly to{" "}
        <code className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--color-paper-sunken)] border border-[var(--color-rule)] text-[var(--color-ink)]">
          document.modelContext
        </code>
        .
      </p>

      {/* The 2 CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Button 1: See the repo */}
        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-white font-display font-semibold text-sm shadow-sm transition-all duration-150 transform hover:-translate-y-0.5"
        >
          <Code2 className="w-4 h-4" />
          <span>See the repo</span>
        </a>

        {/* Button 2: See examples */}
        <button
          onClick={onScrollToExamples}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-[var(--color-paper-alt)] text-[var(--color-ink-2)] border border-[var(--color-rule-strong)] font-display font-semibold text-sm transition-all duration-150 transform hover:-translate-y-0.5"
        >
          <span>See examples</span>
          <ArrowRight className="w-4 h-4 text-[var(--color-ink-subtle)]" />
        </button>
      </div>
    </section>
  );
}
