'use client';

import { useEffect, useState } from 'react';
import RecorderPage from "./recorder/page";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import InstallGuide from "./components/InstallGuide";
import UsageGuide from "./components/UsageGuide";
import Footer from "./components/Footer";
import AIContent from "./components/AIContent";

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(
    process.env.NEXT_PUBLIC_IS_DESKTOP === 'true'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const inTauri = window.__TAURI_INTERNALS__ !== undefined || window.__TAURI__ !== undefined;
      if (inTauri) {
        setIsDesktop(true);
      }
    }
  }, []);

  if (isDesktop) {
    return <RecorderPage />;
  }

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

