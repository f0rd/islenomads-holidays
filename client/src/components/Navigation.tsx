/**
 * Navigation Component
 * Design: Organic Fluidity - Soft, rounded elements with natural spacing
 * Features: Transparent on scroll top, solid background on scroll
 */

import { Button } from "@/components/ui/button";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#destinations", label: "Destinations" },
    { href: "#packages", label: "Packages" },
    { href: "#experiences", label: "Experiences" },
    { href: "#about", label: "About" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-display font-bold text-xl">IN</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight text-foreground">
                  Isle Nomads
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Holidays
                </span>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`font-body font-medium text-sm transition-colors duration-300 hover:text-primary relative group ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              size="lg"
              className="rounded-full font-display font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-accent/20 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-lg border-t border-border animate-in slide-in-from-top-5 duration-300">
          <div className="container py-6 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`block py-3 px-4 rounded-2xl font-body font-medium transition-all duration-300 ${
                    location === link.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/20 text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <Button
              size="lg"
              className="w-full rounded-full font-display font-semibold shadow-lg mt-4"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
