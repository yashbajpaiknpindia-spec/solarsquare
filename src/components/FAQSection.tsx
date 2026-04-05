import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How much can I save with solar?", a: "Savings depend on your current electricity consumption, system size, and local tariff rates. Many of our customers achieve near-zero electricity bills. We provide a detailed savings projection with every proposal." },
  { q: "Which solar system is right for me?", a: "It depends on your energy needs and grid reliability. On-grid is most popular for homes and businesses with reliable power. Off-grid suits remote areas. Hybrid offers the best of both worlds with battery backup." },
  { q: "Do you help with government subsidy and net metering?", a: "Yes! We handle all paperwork for government subsidies under PM Surya Ghar Muft Bijli Yojana and complete net metering application with your local DISCOM." },
  { q: "How long does the installation take?", a: "Residential systems typically take 1-3 days for installation. Commercial and industrial projects may take 1-4 weeks depending on system size and site conditions." },
  { q: "What brands and components do you use?", a: "We use only Tier-1 panels and quality-tested components from brands like Adani Solar, Tata Power Solar, Waaree, and others to ensure long-term performance." },
  { q: "Do you offer maintenance and service after installation?", a: "Absolutely. We offer comprehensive O&M (Operations & Maintenance) and AMC (Annual Maintenance Contract) services to keep your system at peak performance." },
];

const FAQSection = () => (
  <section className="py-20 bg-background" id="faq">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground">
        Frequently Asked <span className="text-primary">Questions</span>
      </h2>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-heading font-semibold text-foreground">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
