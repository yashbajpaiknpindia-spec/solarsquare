import { Settings, DollarSign, Shield, ClipboardCheck, FileText, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Settings, title: "End-to-End EPC", desc: "From site survey to final commissioning, we handle everything." },
  { icon: DollarSign, title: "Transparent Pricing", desc: "Clear quotes, no hidden costs, no surprises." },
  { icon: Shield, title: "Quality Components", desc: "Tier-1 panels and trusted equipment, always." },
  { icon: ClipboardCheck, title: "Expert Site Survey", desc: "Proper engineering assessment before every project." },
  { icon: FileText, title: "Subsidy & Net Metering", desc: "We handle the paperwork so you don't have to." },
  { icon: Wrench, title: "O&M / AMC Support", desc: "We stay with you long after installation is done." },
];

const WhyChoose = () => (
  <section className="py-20 bg-background" id="why-us">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground">
        Why Choose <span className="text-primary">Sol Grid India</span>
      </h2>
      <p className="text-center text-muted-foreground mt-4 max-w-xl mx-auto">
        We exist to make solar simple, affordable, and trustworthy for every customer.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/30 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <f.icon size={24} className="text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">{f.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChoose;
