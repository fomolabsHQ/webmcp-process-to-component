import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { ArchitectureDiagram } from "./components/landing/ArchitectureDiagram";
import { ExampleCards } from "./components/landing/ExampleCards";
import { Footer } from "./components/landing/Footer";

export default function App() {
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
          onSelectExample={(_id) => {
            // Interactive components will be connected when synthesized in subsequent steps
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
