import { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import { CMSBreadcrumb, BreadcrumbItem } from "./CMSBreadcrumb";

interface AdminPageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerAction?: ReactNode;
}

/**
 * AdminPageLayout Component
 * Wraps admin pages with DashboardLayout and provides consistent header structure
 * Includes breadcrumb navigation, title, description, and optional header actions
 */
export function AdminPageLayout({
  children,
  title,
  description,
  breadcrumbs,
  headerAction,
}: AdminPageLayoutProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <CMSBreadcrumb items={breadcrumbs} />

        {/* Page Header */}
        {title && (
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
          </div>
        )}

        {/* Page Content */}
        <div className="mt-6">{children}</div>
      </div>
    </DashboardLayout>
  );
}
