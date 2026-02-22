/**
 * Admin Navigation Component
 * Provides consistent navigation across all admin pages
 */

import { Button } from '@/components/ui/button';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useLocation, useRouter } from 'wouter';

interface AdminNavigationProps {
  currentPage?: string;
  showBackButton?: boolean;
  customLinks?: Array<{ label: string; href: string }>;
}

export default function AdminNavigation({
  currentPage,
  showBackButton = true,
  customLinks = [],
}: AdminNavigationProps) {
  const [location] = useLocation();
  const router = useRouter();

  const defaultLinks = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Ferry Routes', href: '/admin/ferry-routes' },
    { label: 'Boat Routes', href: '/admin/boat-routes' },
    { label: 'Island Guides', href: '/admin/island-guides' },
    { label: 'Packages', href: '/admin/packages' },
    { label: 'Blog', href: '/admin/blog' },
    { label: 'Atolls', href: '/admin/atolls' },
    { label: 'Staff', href: '/admin/staff' },
    { label: 'CRM', href: '/admin/crm' },
    { label: 'SEO', href: '/admin/seo-optimizer' },
    { label: 'Branding', href: '/admin/branding' },
  ];

  const allLinks = [...defaultLinks, ...customLinks];

  return (
    <div className="border-b border-border bg-card">
      <div className="container py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {showBackButton && location !== '/admin/dashboard' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/admin/dashboard'}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Admin Home
            </Button>
          </div>
          {currentPage && (
            <div className="text-sm text-foreground/70">
              Current: <span className="font-semibold text-foreground">{currentPage}</span>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2">
          {allLinks.map((link) => (
            <Button
              key={link.href}
              variant={location === link.href ? 'default' : 'outline'}
              size="sm"
              onClick={() => window.location.href = link.href}
              className="text-xs"
            >
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
