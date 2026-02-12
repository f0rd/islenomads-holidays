import { ChevronRight, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface CMSBreadcrumbProps {
  items?: BreadcrumbItem[];
}

/**
 * CMSBreadcrumb Component
 * Displays breadcrumb navigation for CMS pages
 * Can be auto-generated from URL or manually provided
 */
export function CMSBreadcrumb({ items }: CMSBreadcrumbProps) {
  const [location] = useLocation();

  // Auto-generate breadcrumbs from URL if not provided
  const breadcrumbs = useMemo(() => {
    if (items) return items;

    const segments = location.split("/").filter(Boolean);
    const generated: BreadcrumbItem[] = [
      { label: "CMS", href: "/admin" },
    ];

    let path = "";
    for (const segment of segments) {
      path += "/" + segment;
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      generated.push({ label, href: path });
    }

    return generated;
  }, [location, items]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <a href="/admin" className="flex items-center gap-2 hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
        <span>CMS</span>
      </a>

      {breadcrumbs.slice(1).map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {index === breadcrumbs.length - 2 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <a href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
