import { motion } from "framer-motion";
import { Zap, ShieldCheck, BarChart3 } from "lucide-react";
import heroImg from "@/assets/hero-solar.jpg";

const badges = [
  { icon: Zap, label: "End-to-End Solar EPC" },
  { icon: ShieldCheck, label: "Subsidy & Net Metering Support" },
  { icon: BarChart3, label: "Residential, Commercial & Industrial" },
];

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center pt-20" id="hero">
    <div className="absolute inset-0">
      <img src={heroImg} alt="Solar panels on rooftop" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-secondary/80" />
    </div>
    <div className="container relative z-10 mx-auto px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-secondary-foreground leading-tight max-w-3xl"
      >
        Powering India, One Roof at a Time —{" "}
        <span className="text-primary">Homes, Businesses & Industry</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-6 text-lg md:text-xl text-secondary-foreground/80 max-w-2xl"
      >
        Sol Grid India delivers affordable, high-performance solar systems with end-to-end EPC execution, quality components, subsidy support, and long-term service across Delhi NCR.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <a href="#contact" className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition">
          Get Free Quote
        </a>
        <a href="#contact" className="bg-card/20 border-2 border-secondary-foreground/30 text-secondary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:bg-card/30 transition">
          Book Site Survey
        </a>
      </motion.div>

      <div className="mt-10 flex flex-wrap gap-6">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-2 text-secondary-foreground/90">
            <b.icon size={20} className="text-primary" />
            <span className="text-sm font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
