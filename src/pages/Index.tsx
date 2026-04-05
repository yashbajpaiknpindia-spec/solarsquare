import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import WhyChoose from "@/components/WhyChoose";
import ServicesSection from "@/components/ServicesSection";
import SolarSolutions from "@/components/SolarSolutions";
import SolarSystemTypes from "@/components/SolarSystemTypes";
import HowWeWork from "@/components/HowWeWork";
import SavingsSection from "@/components/SavingsSection";
import ContactForm from "@/components/ContactForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallBar from "@/components/CallBar";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <TrustBadges />
    <WhyChoose />
    <ServicesSection />
    <SolarSolutions />
    <SolarSystemTypes />
    <HowWeWork />
    <SavingsSection />
    <ContactForm />
    <TestimonialsSection />
    <FAQSection />
    <CTASection />
    <Footer />
    <WhatsAppButton />
    <CallBar />
  </div>
);

export default Index;
