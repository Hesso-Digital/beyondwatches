"use client";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Clocks from "./Clocks";
import { WhatsAppIcon } from "./Icons";
import { whatsappLink } from "@/lib/config";

export default function TopBar() {
  return (
    <header className="topbar">
      <a href="#top" className="topbar-logo" aria-label="BEYOND, back to the runway">
        <Logo variant="full" />
      </a>
      <Clocks />
      <div className="topbar-right">
        <ThemeToggle />
        <a href="#claim" className="topbar-claim">Claim</a>
        <a
          href={whatsappLink("Hello BEYOND, I have a question.")}
          className="icon-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message BEYOND on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      </div>
    </header>
  );
}
