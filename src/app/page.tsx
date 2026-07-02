"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PainPointsSection from "@/components/sections/PainPointsSection";
import StepsSection from "@/components/sections/StepsSection";
import FeatureShowcaseSection from "@/components/sections/FeatureShowcaseSection";
import ScenariosSection from "@/components/sections/ScenariosSection";
import CTASection from "@/components/sections/CTASection";
import { useFadeUp } from "@/hooks/useFadeUp";

export default function HomePage() {
  useFadeUp();

  return (
    <>
      <Navbar />
      <main>
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
