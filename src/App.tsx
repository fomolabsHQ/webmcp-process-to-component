import { useState } from "react";
import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { ArchitectureDiagram } from "./components/landing/ArchitectureDiagram";
import { ExampleCards } from "./components/landing/ExampleCards";
import { Footer } from "./components/landing/Footer";
import { ReturnAgentFlow } from "./examples/return-agent";

export default function App() {
  const [activeExample, setActiveExample] = useState<"return-agent" | "insurance-claim" | null>(null);

  const scrollToExamples = () => {
    document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" });
  };

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
        {activeExample === "return-agent" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl my-8">
              <ReturnAgentFlow onClose={() => setActiveExample(null)} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
