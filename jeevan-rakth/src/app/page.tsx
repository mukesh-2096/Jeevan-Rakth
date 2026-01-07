import Navbar from "@/src/components/Navbar";
import HeroSection from "@/src/components/HeroSection";
import StatsSection from "@/src/components/StatsSection";
import FeaturesSection from "@/src/components/FeaturesSection";
import CTASection from "@/src/components/CTASection";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
