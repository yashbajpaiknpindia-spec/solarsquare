import { useState } from "react";
import { Sun, Battery, Zap } from "lucide-react";

const types = [
  {
    id: "on-grid",
    label: "On-Grid",
    icon: Sun,
    title: "On-Grid Solar",
    desc: "Connected to the electricity grid. Export surplus power and earn credits through net metering. Most popular for homes and businesses. No battery needed.",
    best: "Homes, offices, buildings with reliable grid supply.",
  },
  {
    id: "off-grid",
    label: "Off-Grid",
    icon: Battery,
    title: "Off-Grid Solar",
    desc: "Completely independent of the electricity grid. Uses battery storage for 24/7 power. Ideal for areas with unreliable or no grid connection.",
    best: "Remote locations, farmhouses, areas with frequent power cuts.",
  },
  {
    id: "hybrid",
    label: "Hybrid",
    icon: Zap,
    title: "Hybrid Solar + Battery",
    desc: "The best of both worlds. Stores solar energy in batteries while staying grid-connected. Ensures 24/7 backup power.",
    best: "Homes and businesses wanting both savings and power backup.",
  },
];

const SolarSystemTypes = () => {
  const [active, setActive] = useState("on-grid");
  const current = types.find((t) => t.id === active)!;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground">
          Which Solar System Is <span className="text-primary">Right For You?</span>
        </h2>

        {/* Tab buttons - FIXED */}
        <div className="flex justify-center mt-10">
          <div className="inline-flex bg-muted rounded-xl p-1.5 gap-1">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  active === t.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content card */}
        <div className="mt-8 max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <current.icon size={28} className="text-primary" />
            <h3 className="font-heading font-bold text-xl text-foreground">{current.title}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{current.desc}</p>
          <p className="mt-4 text-accent font-semibold text-sm">
            Best for: {current.best}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolarSystemTypes;
