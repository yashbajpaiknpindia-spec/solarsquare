import { Phone } from "lucide-react";

const CallBar = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-border">
    <a href="tel:+917827812829" className="flex items-center justify-center gap-2 py-3 font-bold text-foreground">
      <Phone size={18} /> Call Now
    </a>
  </div>
);

export default CallBar;
