import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/917827812829"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={28} />
  </a>
);

export default WhatsAppButton;
