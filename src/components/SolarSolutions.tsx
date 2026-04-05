import { Home, Building2, Factory } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    icon: Home,
    title: "Residential Solar",
    desc: "Reduce your electricity bill and gain energy independence with a rooftop solar system designed for your home.",
    range: "3kW–10kW systems for homes and housing societies.",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
  },
  {
    icon: Building2,
    title: "Commercial Solar",
    desc: "Cut operational costs and boost ROI with a professionally designed solar system for your office, shop, or building.",
    range: "10kW–100kW systems for offices, malls, institutions.",
    img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800",
  },
  {
    icon: Factory,
    title: "Industrial Solar",
    desc: "Scalable, high-performance solar solutions for factories and warehouses with significant energy cost reduction.",
    range: "100kW–1MW+ for industrial rooftops.",
    img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
  },
];

const SolarSolutions = () => (
  <section className="py-20 bg-muted" id="solutions">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground">
        Solar Solutions For <span className="text-primary">Everyone</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {solutions.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all group"
          >
            <div className="h-48 overflow-hidden">
              <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <s.icon size={20} className="text-primary" />
                <h3 className="font-heading font-bold text-lg text-foreground">{s.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
              <p className="text-primary font-semibold text-sm mt-3">{s.range}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolarSolutions;
