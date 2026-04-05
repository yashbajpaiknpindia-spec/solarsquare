import { MessageCircle } from "lucide-react";

const CTASection = () => (
  <section className="py-20 bg-secondary text-secondary-foreground">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold">
        Ready to Switch to Solar with <span className="text-primary">Confidence?</span>
      </h2>
      <p className="mt-4 text-secondary-foreground/70 max-w-xl mx-auto">
        Get a free consultation from Sol Grid India's team. No obligation. No pressure. Just honest solar guidance.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a href="#contact" className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition">
          Get Free Quote
        </a>
        <a href="https://wa.me/917827812829" className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition flex items-center gap-2">
          <MessageCircle size={20} /> WhatsApp Now
        </a>
      </div>
    </div>
  </section>
);

export default CTASection;
