import { Link } from "@tanstack/react-router";
import { Crown, Mail, MessageCircle, Phone } from "lucide-react";

import { EVENT } from "@/lib/event";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl gradient-royal">
              <Crown className="size-4 text-primary-foreground" aria-hidden />
            </span>
            <span className="font-display text-lg font-semibold">{EVENT.shortName}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A three-week discipleship and leadership training programme of {EVENT.address}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/curriculum" className="transition-colors hover:text-foreground">
                Curriculum
              </Link>
            </li>
            <li>
              <Link to="/schedule" className="transition-colors hover:text-foreground">
                Class schedule
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition-colors hover:text-foreground">
                Register
              </Link>
            </li>
            <li>
              <Link to="/qr" className="transition-colors hover:text-foreground">
                QR code &amp; share link
              </Link>
            </li>
            <li>
              <Link to="/admin" className="transition-colors hover:text-foreground">
                Organiser login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" aria-hidden />
              <a href={`mailto:${EVENT.email}`} className="break-all hover:text-foreground">
                {EVENT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" aria-hidden />
              <a href={`tel:${EVENT.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                {EVENT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 shrink-0 text-primary" aria-hidden />
              <span>WhatsApp: {EVENT.whatsapp}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {EVENT.name}. All rights reserved.
      </div>
    </footer>
  );
}
