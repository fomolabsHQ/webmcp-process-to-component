import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-rule)] bg-[var(--color-paper-alt)] py-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--color-ink-muted)]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-display font-semibold text-[var(--color-ink)]">
            WebMCP Process-to-Component
          </span>
          <span className="text-[var(--color-ink-subtle)] font-mono">
            • Dual-surface architecture
          </span>
        </div>

        <div className="font-mono text-center md:text-right text-[11px] text-[var(--color-ink-subtle)]">
          Canonical surface: <code className="text-[var(--color-ink)] font-bold">document.modelContext.registerTool</code>
        </div>
      </div>
    </footer>
  );
}
