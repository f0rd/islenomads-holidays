/**
 * Breadcrumb Navigation Component
 * Shows the current page hierarchy and allows navigation to parent pages
 */

import { useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items = [] }: BreadcrumbProps) {
  const [, navigate] = useLocation();

  // Default breadcrumb items based on common routes
  const defaultItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/admin" },
  ];

  const breadcrumbs = items.length > 0 ? items : defaultItems;

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="p-0 h-auto hover:bg-transparent text-gray-600 hover:text-gray-900"
      >
        <Home className="w-4 h-4" />
      </Button>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.href!)}
              className="p-0 h-auto hover:bg-transparent text-gray-600 hover:text-gray-900"
            >
              {item.label}
            </Button>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
