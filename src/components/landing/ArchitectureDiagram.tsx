import { Terminal, Bot, User, Cpu, Sparkles, Database, Layers, ShieldCheck } from "lucide-react";

export function ArchitectureDiagram() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-8 mb-16">
      {/* Container with subtle engineering grid background */}
      <div className="relative rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-alt)]/60 backdrop-blur-sm p-6 sm:p-10 overflow-hidden shadow-sm">
        {/* Engineering Background Grid */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--color-rule-strong) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Header Labels */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 text-xs font-mono uppercase tracking-widest text-[var(--color-ink-subtle)] pb-8 border-b border-[var(--color-rule)]">
          <div className="text-left font-semibold">Sources • Clients</div>
          <div className="text-center font-semibold hidden md:block">PTC Engine • Core Component</div>
          <div className="text-right font-semibold hidden md:block">Destinations • Dual Surface</div>
        </div>

        {/* Diagram Body */}
        <div className="relative py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Sources (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 z-10">
            {/* Source 1 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-sm hover:border-[var(--color-rule-strong)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-sunken)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-display font-semibold text-sm text-[var(--color-ink)]">
                  CLI & Developer Tools
                </div>
                <div className="text-xs text-[var(--color-ink-muted)] font-mono">
                  Claude Code, Codex, IDEs
                </div>
              </div>
            </div>

            {/* Source 2 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-paper)] shadow-sm ring-1 ring-[var(--color-accent)]/10">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-display font-semibold text-sm text-[var(--color-ink)]">
                  Autonomous AI Agents
                </div>
                <div className="text-xs text-[var(--color-ink-muted)] font-mono">
                  ChatGPT, Gemini, Browser Agents
                </div>
              </div>
            </div>

            {/* Source 3 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-sm hover:border-[var(--color-rule-strong)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-sunken)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-display font-semibold text-sm text-[var(--color-ink)]">
                  Human Users & Forms
                </div>
                <div className="text-xs text-[var(--color-ink-muted)] font-mono">
                  Web, Mobile, Desktop UIs
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: PTC Core Engine (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative z-10 py-4">
            {/* Glowing Halo around central hub */}
            <div className="absolute w-44 h-44 rounded-full bg-[var(--color-accent)]/20 filter blur-2xl animate-halo-pulse pointer-events-none" />

            {/* Top Engine Badges */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-3">
              <div className="px-2.5 py-1.5 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[11px] font-mono text-center text-[var(--color-ink-2)] shadow-xs">
                Single Zod Schema
              </div>
              <div className="px-2.5 py-1.5 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[11px] font-mono text-center text-[var(--color-ink-2)] shadow-xs">
                Unified Handler
              </div>
            </div>

            {/* Central Control Chip */}
            <div className="relative w-24 h-24 rounded-2xl bg-[#0F111A] border-2 border-[var(--color-accent)] flex flex-col items-center justify-center shadow-xl animate-chip-glow my-1">
              <Cpu className="w-10 h-10 text-[var(--color-accent)]" />
              <div className="mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-ping" />
                <span className="text-[9px] font-mono tracking-widest uppercase text-white font-bold">
                  PTC HUB
                </span>
              </div>
            </div>

            {/* Bottom Engine Badges */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-3">
              <div className="px-2.5 py-1.5 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[11px] font-mono text-center text-[var(--color-ink-2)] shadow-xs">
                Ref State Sync
              </div>
              <div className="px-2.5 py-1.5 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[11px] font-mono text-center text-[var(--color-ink-2)] shadow-xs">
                Abort Teardown
              </div>
            </div>
          </div>

          {/* Right Column: Destinations (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 z-10">
            {/* Destination 1 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-paper)] shadow-sm ring-1 ring-[var(--color-accent)]/10">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-display font-semibold text-sm text-[var(--color-ink)]">
                  document.modelContext
                </div>
                <div className="text-xs text-[var(--color-ink-muted)] font-mono">
                  Standard WebMCP Tool Surface
                </div>
              </div>
            </div>

            {/* Destination 2 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-sm hover:border-[var(--color-rule-strong)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-sunken)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-display font-semibold text-sm text-[var(--color-ink)]">
                  Human DOM Form & UI
                </div>
                <div className="text-xs text-[var(--color-ink-muted)] font-mono">
                  Live Feedback & Progress Stepper
                </div>
              </div>
            </div>

            {/* Destination 3 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-sm hover:border-[var(--color-rule-strong)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-sunken)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-display font-semibold text-sm text-[var(--color-ink)]">
                  Unified Mutation Handler
                </div>
                <div className="text-xs text-[var(--color-ink-muted)] font-mono">
                  Identical DB & Service Side Effects
                </div>
              </div>
            </div>

            {/* Destination 4 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-sm hover:border-[var(--color-rule-strong)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-sunken)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-display font-semibold text-sm text-[var(--color-ink)]">
                  Audit & Validation Guard
                </div>
                <div className="text-xs text-[var(--color-ink-muted)] font-mono">
                  Zod Validation & Safe Abort
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status / Architectural Rule Footer */}
        <div className="relative pt-6 mt-4 border-t border-[var(--color-rule)] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--color-ink-subtle)] gap-2">
          <div className="flex items-center gap-2">
            <span>REQUEST • INBOUND</span>
            <span>→</span>
          </div>
          <div className="font-bold tracking-wider text-[var(--color-ink-2)] text-center">
            ONE SCHEMA • ONE HANDLER • DUAL EXECUTION • LIFECYCLE SAFE
          </div>
          <div className="flex items-center gap-2">
            <span>→</span>
            <span>RESPONSE • OUTBOUND</span>
          </div>
        </div>
      </div>
    </section>
  );
}
