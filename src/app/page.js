'use client';

import { useEffect, useState } from 'react';
import RecorderPage from "./recorder/page";
import Landing from "./components/site/Landing";
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
    <>
      <Landing />
      {/* Search-friendly product summary, visually hidden */}
      <AIContent />
    </>
  );
}

