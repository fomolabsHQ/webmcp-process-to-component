import { useState, useEffect } from "react";
import { Moon, Sun, Layers, GitBranch } from "lucide-react";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-rule)] bg-[var(--color-paper)]/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-lg tracking-tight text-[var(--color-ink)]">
              WebMCP
            </span>
            <span className="text-xs uppercase tracking-wider font-mono text-[var(--color-ink-subtle)] hidden sm:inline-block">
              Process-to-Component
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--color-ink-2)] hover:text-[var(--color-ink)] rounded-full border border-[var(--color-rule)] hover:border-[var(--color-rule-strong)] transition-all"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-full border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-rule-strong)] transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
