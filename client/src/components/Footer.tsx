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
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/vSjAAzmhFbZMRswg.png"
                alt="Isle Nomads Logo"
                className="h-20 w-auto drop-shadow-lg"
              />
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Your gateway to paradise. Discover the Maldives with personalized travel experiences and unforgettable memories.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.islenomads.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300 flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300" />
                www.islenomads.com
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
                  Ma. Faseri, Ameenee Magu, Malé City, Maldives
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="tel:+960799063600"
                  className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  (+960) 799 0636
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="mailto:hello@islenomads.com"
                  className="text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  hello@islenomads.com
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
