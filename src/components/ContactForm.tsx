import { useState } from "react";
import { Phone, MessageCircle, Mail } from "lucide-react";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    propertyType: "",
    bill: "",
    requirement: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I'm interested in solar.\nName: ${form.name}\nPhone: ${form.phone}\nCity: ${form.city}\nProperty: ${form.propertyType}\nBill: ${form.bill}\nRequirement: ${form.requirement}\nMessage: ${form.message}`;
    window.open(`https://wa.me/917827812829?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="py-20 bg-secondary text-secondary-foreground" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center">
          Get Your Free <span className="text-primary">Solar Consultation</span>
        </h2>
        <p className="text-center text-secondary-foreground/70 mt-4">
          Tell us your requirement and our team will guide you — no obligation, no pressure.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name *"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-card text-foreground border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-card text-foreground border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="city"
            placeholder="City / Location"
            value={form.city}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-card text-foreground border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-card text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Property Type</option>
            <option>Home</option>
            <option>Office</option>
            <option>Shop</option>
            <option>Factory</option>
            <option>Institution</option>
            <option>Other</option>
          </select>
          <select
            name="bill"
            value={form.bill}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-card text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Monthly Electricity Bill</option>
            <option>Below ₹1,000</option>
            <option>₹1,000–₹3,000</option>
            <option>₹3,000–₹7,000</option>
            <option>₹7,000–₹15,000</option>
            <option>Above ₹15,000</option>
          </select>
          <select
            name="requirement"
            value={form.requirement}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-card text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Requirement</option>
            <option>Residential Solar</option>
            <option>Commercial Solar</option>
            <option>Industrial Solar</option>
            <option>Hybrid/Battery System</option>
            <option>Just Exploring</option>
            <option>Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Any message (optional)"
            value={form.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-card text-foreground border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />

          <button type="submit" className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-bold text-lg hover:opacity-90 transition">
            Submit Query
          </button>

          <p className="text-center text-secondary-foreground/50 text-xs mt-2">
            Or chat with us on{" "}
            <a href="https://wa.me/917827812829" className="text-accent underline">WhatsApp →</a>
          </p>
        </form>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <a href="tel:+917827812829" className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition">
            <Phone size={18} /> Call Us
          </a>
          <a href="https://wa.me/917827812829" className="flex items-center gap-2 text-secondary-foreground/80 hover:text-accent transition">
            <MessageCircle size={18} /> WhatsApp
          </a>
          <a href="mailto:info@solgridindia.com" className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition">
            <Mail size={18} /> Email
          </a>
        </div>
        <p className="text-center text-secondary-foreground/40 text-xs mt-4">
          Your details are safe with us. We'll never spam or share your information.
        </p>
      </div>
    </section>
  );
};

export default ContactForm;
