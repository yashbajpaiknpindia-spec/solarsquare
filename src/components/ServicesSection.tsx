import { Settings, ShoppingCart, HardHat, Gauge, FileText, Wrench, MapPin, BarChart3, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  { icon: Settings, title: "Solar EPC Design & Engineering", desc: "Precision engineering for optimal system performance" },
  { icon: ShoppingCart, title: "Procurement", desc: "Sourcing quality components at competitive prices" },
  { icon: HardHat, title: "Installation & Commissioning", desc: "Professional, safe, and clean installation by trained teams" },
  { icon: Gauge, title: "Net Metering Assistance", desc: "End-to-end support for grid connection and metering" },
  { icon: FileText, title: "Subsidy Documentation", desc: "We handle all paperwork for government subsidy" },
  { icon: Wrench, title: "O&M / AMC", desc: "Ongoing maintenance to keep your system at peak performance" },
  { icon: MapPin, title: "Site Survey", desc: "Free on-site assessment before any project begins" },
  { icon: BarChart3, title: "Energy Audit", desc: "Understanding your current consumption for the right system design" },
  { icon: Wallet, title: "Solar Financing Support", desc: "Guidance on loans and EMI options for solar investment" },
];

const ServicesSection = () => (
  <section className="py-20 bg-background" id="services">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground">
        Our <span className="text-primary">Services</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground">{s.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
