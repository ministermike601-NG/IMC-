import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/schedule", label: "Schedule" },
  { to: "/archive", label: "Class Archive" },
  { to: "/qr", label: "Share / QR" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Influencers Nations Membership Class"
            className="h-12 w-auto"
          />

          <div className="leading-tight">
            <h1 className="font-display text-lg font-bold text-foreground">
              Influencers Nations
            </h1>

            <p className="text-sm text-muted-foreground">
              Membership Class
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{
                className:
                  "rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-foreground",
              }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}

          <Button asChild size="sm" className="ml-2 rounded-full">
            <Link to="/register">Register Now</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="sm" className="rounded-full">
            <Link to="/register">Register</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="rounded-xl"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-xl">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-4 flex flex-col gap-2 px-4 pb-6">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-xl bg-primary px-3 py-3 text-center text-base font-semibold text-primary-foreground"
                >
                  Register Now
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
