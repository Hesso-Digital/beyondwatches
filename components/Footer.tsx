import Logo from "./Logo";
import { WhatsAppIcon } from "./Icons";
import { whatsappLink } from "@/lib/config";

const CARE = [
  { q: "Shipping", a: "Each piece ships insured across India, with tracking shared on WhatsApp. International shipping on request. (Details to be confirmed.)" },
  { q: "Warranty", a: "Every watch is covered by a manufacturer's warranty against defects in materials and workmanship. (Terms to be confirmed.)" },
  { q: "Payment", a: "Pay in full or with EMI on eligible cards. No cash on delivery and no discounts." },
  { q: "Returns", a: "Unworn pieces in original packaging may be returned within a set window after delivery. Your number is released back to the edition. (Policy to be confirmed.)" },
];

export default function Footer() {
  return (
    <footer className="footer" id="care">
      <div className="footer-top">
        <Logo variant="full" className="footer-logo" />
        <a className="cta cta--ghost" href={whatsappLink("Hello BEYOND, I have a question.")} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={16} /> Message us on WhatsApp
        </a>
      </div>
      <div className="care">
        <h2 className="label">Customer care</h2>
        {CARE.map((c) => (
          <details key={c.q} className="care-item">
            <summary>{c.q}</summary>
            <p>{c.a}</p>
          </details>
        ))}
      </div>
      <p className="footer-fine">© {new Date().getFullYear()} BEYOND · Edition of 300</p>
    </footer>
  );
}
