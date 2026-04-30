import {
  BenefitsSection,
  CtaSection,
  FaqSection,
  HeroSection,
  HowItWorksSection,
  PricingSection,
  ProblemSection,
  SiteFooter,
  SiteHeader,
  SocialProofStrip,
  SolutionSection,
} from "@/components/landing";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <SocialProofStrip />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <BenefitsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
