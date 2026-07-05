"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PainPointsSection from "@/components/sections/PainPointsSection";
import StepsSection from "@/components/sections/StepsSection";
const FeatureShowcaseSection = dynamic(
  () => import("@/components/sections/FeatureShowcaseSection"),
  { ssr: true }
);
const ScenariosSection = dynamic(
  () => import("@/components/sections/ScenariosSection"),
  { ssr: true }
);
const CTASection = dynamic(
  () => import("@/components/sections/CTASection"),
  { ssr: true }
);
import { useFadeUp } from "@/hooks/useFadeUp";

export default function HomePage() {
  useFadeUp();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <PainPointsSection />
        <StepsSection />
        <FeatureShowcaseSection />
        <ScenariosSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
