import { motion } from "framer-motion";

const steps = [
  { num: 1, title: "Consultation", desc: "Tell us your requirement. We'll understand your energy needs and goals." },
  { num: 2, title: "Site Survey", desc: "Our team visits your property for a detailed technical assessment. Free of charge." },
  { num: 3, title: "Design & Proposal", desc: "We prepare a custom system design with transparent pricing and ROI projection." },
  { num: 4, title: "Installation & Commissioning", desc: "Our trained team installs your system cleanly and professionally." },
  { num: 5, title: "Support & Savings", desc: "Your system goes live. We stay available for O&M, AMC, and any support." },
];

const HowWeWork = () => (
  <section className="py-20 bg-muted">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground">
        How We <span className="text-primary">Work</span>
      </h2>
      <p className="text-center text-muted-foreground mt-4">A simple, transparent process from first call to final handover.</p>
      <div className="mt-12 max-w-3xl mx-auto space-y-0">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-6 relative"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                {s.num}
              </div>
              {i < steps.length - 1 && <div className="w-0.5 h-full bg-primary/20 mt-1" />}
            </div>
            <div className="pb-10">
              <h3 className="font-heading font-bold text-lg text-foreground">{s.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowWeWork;
