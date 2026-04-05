import { CheckCircle } from "lucide-react";

const items = [
  "Affordable & Transparent Solutions",
  "Quality Components",
  "Expert Installation",
  "Delhi NCR Coverage",
  "Long-Term Support",
];

const TrustBadges = () => (
  <section className="bg-solar-light py-4 overflow-hidden">
    <div className="flex animate-scroll-left whitespace-nowrap">
      {[...items, ...items].map((item, i) => (
        <div key={i} className="flex items-center gap-2 mx-8 shrink-0">
          <CheckCircle size={18} className="text-accent" />
          <span className="font-semibold text-foreground text-sm">{item}</span>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBadges;
