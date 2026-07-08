"use client";
import { useState, useEffect } from "react";
import { IconArrowUp } from "@/components/Icon";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-surface border border-border rounded-full shadow-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all cta-btn"
      aria-label="回到顶部"
    >
      <IconArrowUp size={18} />
    </button>
  );
}
