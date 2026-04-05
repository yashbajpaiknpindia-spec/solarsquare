import logo from "@/assets/solgrid-india-logo.jpeg";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background/80 py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <img src={logo} alt="Sol Grid India" className="h-16 w-auto mb-4" />
          <p className="text-sm text-background/60">Powering India, One Roof at a Time. End-to-end solar EPC solutions across Delhi NCR.</p>
        </div>
        <div>
          <h4 className="font-heading font-bold text-background mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <a href="#hero" className="block hover:text-primary transition">Home</a>
            <a href="#services" className="block hover:text-primary transition">Services</a>
            <a href="#solutions" className="block hover:text-primary transition">Solutions</a>
            <a href="#contact" className="block hover:text-primary transition">Contact</a>
            <a href="#faq" className="block hover:text-primary transition">FAQ</a>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-bold text-background mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm">
            <a href="tel:+917827812829" className="flex items-center gap-2 hover:text-primary transition">
              <Phone size={16} /> +91 78278 12829
            </a>
            <a href="mailto:info@solgridindia.com" className="flex items-center gap-2 hover:text-primary transition">
              <Mail size={16} /> info@solgridindia.com
            </a>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" /> Delhi NCR, India
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 mt-10 pt-6 text-center text-xs text-background/40">
        © {new Date().getFullYear()} Sol Grid India. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
