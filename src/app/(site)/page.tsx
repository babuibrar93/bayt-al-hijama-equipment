import type { Metadata } from "next";
import { SEO } from "@/constants/site";
import { siteUrl } from "@/lib/metadata";
import StructuredData from "@/components/seo/StructuredData";
import AnimatedSectionBand from "@/components/ui/AnimatedSectionBand";
import HeroSection from "@/sections/HeroSection";
import MarqueeSection from "@/sections/MarqueeSection";
import TrustSection from "@/sections/TrustSection";
import ProductsSection from "@/sections/ProductsSection";
import WhySection from "@/sections/WhySection";
import CategoriesSection from "@/sections/CategoriesSection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import FAQSection from "@/sections/FAQSection";
import CTASection from "@/sections/CTASection";

export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: SEO.title,
  },
  description: SEO.description,
  alternates: { canonical: "/" },
  openGraph: {
    url: siteUrl,
  },
};

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <HeroSection />
      <MarqueeSection />
      <AnimatedSectionBand id="trustOfferParticles">
        <TrustSection />
        <CategoriesSection />
      </AnimatedSectionBand>
      <ProductsSection />
      <WhySection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
