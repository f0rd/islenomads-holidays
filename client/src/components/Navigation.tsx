/**
 * Navigation Component
 * Modern Design: Enhanced with smooth animations and refined styling
 */

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "#destinations" },
    { label: "Packages", href: "#packages" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg transition-all duration-300">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform duration-300 shadow-md">
            IN
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-lg leading-tight">
              Isle Nomads
            </span>
            <span className="text-xs text-accent leading-tight font-semibold">
              EXPERIENCES
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium hover:text-accent transition-all duration-300 relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <button className="px-6 py-2.5 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:scale-105 transform">
            Contact Us
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 hover:bg-primary-foreground/10 rounded-lg transition-all duration-300"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-300" style={{ transform: 'rotate(90deg)' }} />
          ) : (
            <Menu className="w-6 h-6 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-primary/98 backdrop-blur-md border-t border-primary-foreground/10 animate-slide-down">
          <div className="container py-4 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-3 text-sm font-medium hover:bg-primary-foreground/10 rounded-lg transition-all duration-300 hover:translate-x-1"
                style={{
                  animation: `slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s both`,
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button className="w-full px-4 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-all duration-300 hover:shadow-lg mt-4">
              Contact Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
