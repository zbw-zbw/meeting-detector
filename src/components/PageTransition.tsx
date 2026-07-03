"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay to ensure browser has painted the new content
    const id = requestAnimationFrame(() => {
      containerRef.current?.classList.remove("page-loading");
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div ref={containerRef} key={pathname} className="page-loading">
      {children}
    </div>
  );
}
