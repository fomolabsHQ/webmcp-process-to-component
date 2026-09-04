import { useState, useEffect } from "react";
import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { ArchitectureDiagram } from "./components/landing/ArchitectureDiagram";
import { ExampleCards } from "./components/landing/ExampleCards";
import { Footer } from "./components/landing/Footer";
import { ReturnAgentFlow } from "./examples/return-agent";
import { InsuranceClaimFlow } from "./examples/insurance-claim";

export default function App() {
  const [activeExample, setActiveExample] = useState<"return-agent" | "insurance-claim" | null>(null);

  const scrollToExamples = () => {
    document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" });
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveExample(null);
      }
    };

    if (activeExample) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeExample]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink-2)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        <Hero onScrollToExamples={scrollToExamples} />
        <ArchitectureDiagram />
        <ExampleCards
          onSelectExample={(id) => {
            setActiveExample(id);
          }}
        />

        {/* Modal / Overlay for Active Process Component */}
        {activeExample && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setActiveExample(null)}
          >
            <div
              className="relative w-full max-w-3xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {activeExample === "return-agent" && (
                <ReturnAgentFlow onClose={() => setActiveExample(null)} />
              )}
              {activeExample === "insurance-claim" && (
                <InsuranceClaimFlow onClose={() => setActiveExample(null)} />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
