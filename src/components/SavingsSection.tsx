import { motion } from "framer-motion";

const stats = [
  { value: "₹0", label: "electricity bill", sub: "Many customers reach near-zero bills after going solar" },
  { value: "25+", label: "years", sub: "Expected performance life of quality solar panels" },
  { value: "3–5", label: "years", sub: "Typical payback period for a well-designed solar system" },
];

const SavingsSection = () => (
  <section className="py-20 bg-secondary text-secondary-foreground">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center">
        Smart Investment. <span className="text-primary">Real Savings.</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <div className="text-5xl font-heading font-extrabold text-primary">{s.value}</div>
            <div className="text-xl font-semibold mt-1">{s.label}</div>
            <p className="text-secondary-foreground/70 mt-2 text-sm">{s.sub}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
        <a href="#contact" className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition inline-block">
          Calculate Your Savings — Get Free Quote
        </a>
      </div>
    </div>
  </section>
);

export default SavingsSection;
