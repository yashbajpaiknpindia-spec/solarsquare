import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/solgrid-india-logo.jpeg";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Why Us", href: "#why-us" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Sol Grid India" className="h-12 w-auto" />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
          <a href="tel:+917827812829" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition">
            <Phone size={16} /> Call Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-t px-4 pb-4">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-foreground font-medium border-b border-border">
              {l.label}
            </a>
          ))}
          <a href="tel:+917827812829" className="mt-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold">
            <Phone size={16} /> Call Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
