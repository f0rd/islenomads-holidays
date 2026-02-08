/**
 * Navigation Component
 * Design: islenomads.com inspired - Dark teal header with bright cyan accents
 */

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Map", href: "/map" },
    { label: "Boat Routes", href: "/boat-routes" },
    { label: "Trip Planner", href: "/trip-planner" },
    { label: "Packages", href: "/packages" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform duration-300">
            IN
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-lg leading-tight">
              Isle Nomads
            </span>
            <span className="text-xs text-accent leading-tight font-semibold">
              HOLIDAYS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium hover:text-accent transition-colors duration-300 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/staff-login">
            <button className="px-4 py-2 text-sm font-medium text-primary-foreground hover:text-accent transition-colors duration-300 border border-primary-foreground/30 rounded-md hover:border-accent">
              Staff Login
            </button>
          </Link>
          <Link href="#contact">
            <button className="px-6 py-2 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-all duration-300 hover:scale-105">
              Contact Us
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 hover:bg-primary-foreground/10 rounded-md transition-colors duration-300"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/10">
          <div className="container py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium hover:bg-primary-foreground/10 rounded-md transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/staff-login">
              <button className="w-full px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 rounded-md transition-colors duration-300 border border-primary-foreground/30">
                Staff Login
              </button>
            </Link>
            <Link href="#contact">
              <button className="w-full px-4 py-2 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-all duration-300 mt-2" onClick={() => setIsOpen(false)}>
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
