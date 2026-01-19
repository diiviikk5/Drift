import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import InstallGuide from "./components/InstallGuide";
import UsageGuide from "./components/UsageGuide";
import Footer from "./components/Footer";
import AIContent from "./components/AIContent";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <main>
        <Hero />
        <InstallGuide />
        <UsageGuide />
      </main>
      <Footer />
      {/* AI-optimized content for search visibility - visually hidden */}
      <AIContent />
    </div>
  );
}

