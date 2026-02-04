/**
 * Footer Component
 * Design: islenomads.com inspired - Teal background with cyan accents
 */

import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary text-primary-foreground">
      <div className="container pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-xl">IN</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">
                  Isle Nomads
                </span>
                <span className="text-xs text-accent leading-tight font-semibold">
                  EXPERIENCES
                </span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Your gateway to paradise. Discover the Maldives with personalized travel experiences and unforgettable memories.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent hover:text-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent hover:text-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent hover:text-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Destinations", "Packages", "Services", "About"].map((item) => (
                <li key={item}>
                  <Link href={item === "Home" ? "/" : `#${item.toLowerCase()}`} className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-accent">Our Services</h3>
            <ul className="space-y-3">
              {[
                "Luxury Resorts",
                "Island Hopping",
                "Water Sports",
                "Diving & Snorkeling",
                "Spa & Wellness",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-accent">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80 leading-relaxed">
                  DMCC Business Centre, Dubai, UAE
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="tel:+971123456789"
                  className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  +971 12 345 6789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="mailto:info@islenomads.com"
                  className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  info@islenomads.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/80 text-center md:text-left">
              © {currentYear} Isle Nomads Holidays. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
