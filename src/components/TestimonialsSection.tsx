import { Star } from "lucide-react";

const testimonials = [
  { text: "Sol Grid India made the whole process seamless. From site survey to installation, everything was handled professionally.", name: "Customer", loc: "Greater Noida", type: "Residential" },
  { text: "Transparent pricing and quality work. Our electricity bill has dropped significantly after going solar.", name: "Customer", loc: "Noida", type: "Commercial" },
  { text: "The team was responsive and knowledgeable. Highly recommend for anyone considering solar in Delhi NCR.", name: "Customer", loc: "Ghaziabad", type: "Residential" },
];

const TestimonialsSection = () => (
  <section className="py-20 bg-muted">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground">
        What Our <span className="text-primary">Customers Say</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={16} className="text-primary fill-primary" />
              ))}
            </div>
            <p className="text-muted-foreground italic">"{t.text}"</p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="font-semibold text-foreground text-sm">— {t.name}, {t.loc}</p>
              <span className="text-xs text-primary font-medium">{t.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
