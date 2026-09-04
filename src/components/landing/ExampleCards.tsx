import { ArrowUpRight, RotateCcw, FileText } from "lucide-react";

interface ExampleCardsProps {
  onSelectExample?: (id: "return-agent" | "insurance-claim") => void;
}

export function ExampleCards({ onSelectExample }: ExampleCardsProps) {
  return (
    <section id="examples" className="py-16 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-alt)] text-xs font-mono uppercase tracking-widest text-[var(--color-ink-subtle)] mb-3">
          Reference Implementations
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--color-ink)]">
          Synthesized Examples
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[var(--color-ink-muted)] max-w-lg mx-auto">
          Explore two complete business processes built with the Process-to-Component skill.
        </p>
      </div>

      {/* The 2 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Return Agent */}
        <div className="group relative flex flex-col justify-between p-8 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] hover:border-[var(--color-rule-strong)] shadow-sm hover:shadow-md transition-all duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <RotateCcw className="w-3 h-3" />
                E-Commerce
              </span>
              <span className="text-xs font-mono text-[var(--color-ink-subtle)]">
                Tool: process_product_return
              </span>
            </div>

            <h3 className="text-xl font-bold font-display text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
              Return Agent
            </h3>

            <p className="text-sm text-[var(--color-ink-muted)] mb-6 leading-relaxed">
              A streamlined, universally intuitive consumer product return flow.
            </p>

            {/* Stepper Pipeline */}
            <div className="p-3.5 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] mb-6">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-subtle)] mb-2">
                Workflow Sequence
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[var(--color-ink-2)]">
                <span>Order</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span>Eligibility</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span>Reason</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span>Method</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span>Refund</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span className="text-[var(--color-accent)] font-semibold">Ready</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectExample?.("return-agent")}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[var(--color-rule-strong)] hover:border-[var(--color-accent)] text-xs font-display font-semibold text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-all"
          >
            <span>Launch Return Flow</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Insurance Claim */}
        <div className="group relative flex flex-col justify-between p-8 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] hover:border-[var(--color-rule-strong)] shadow-sm hover:shadow-md transition-all duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <FileText className="w-3 h-3" />
                Administrative
              </span>
              <span className="text-xs font-mono text-[var(--color-ink-subtle)]">
                Tool: file_insurance_claim
              </span>
            </div>

            <h3 className="text-xl font-bold font-display text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
              Insurance Claim
            </h3>

            <p className="text-sm text-[var(--color-ink-muted)] mb-6 leading-relaxed">
              A deep, multi-stage administrative procedure demonstrating agent handling of structured documentation.
            </p>

            {/* Stepper Pipeline */}
            <div className="p-3.5 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] mb-6">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-subtle)] mb-2">
                Workflow Sequence
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[var(--color-ink-2)]">
                <span>Policy</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span>Claim</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span>Requirements</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span>Evidence</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span>Validation</span>
                <span className="text-[var(--color-ink-subtle)]">→</span>
                <span className="text-[var(--color-accent)] font-semibold">Submission</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectExample?.("insurance-claim")}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[var(--color-rule-strong)] hover:border-[var(--color-accent)] text-xs font-display font-semibold text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-all"
          >
            <span>Launch Claim Flow</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
