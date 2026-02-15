import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Package,
  MapPin,
  Ship,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Waves,
  MessageSquare,
  Palette,
  Activity,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

// Import all admin components
import AdminBlog from "./AdminBlog";
import AdminPackages from "./AdminPackages";
import AdminIslandGuides from "./AdminIslandGuides";
import AdminActivitySpots from "./AdminActivitySpots";
import AdminBoatRoutes from "./AdminBoatRoutes";
import AdminTransports from "./AdminTransports";
import AdminMapLocations from "./AdminMapLocations";
import AdminSEOOptimizer from "./AdminSEOOptimizer";
import AdminStaff from "./AdminStaff";
import AdminCRM from "./AdminCRM";
import AdminRoles from "./AdminRoles";
import AdminBranding from "./AdminBranding";
import AdminActivity from "./AdminActivity";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.FC<any>;
  section?: string;
}

const menuItems: MenuItem[] = [
  // Dashboard Section
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    component: (props: any) => <StaffDashboard {...props} disableLayout={true} />,
    section: "Dashboard",
  },
  {
    id: "data-management",
    label: "Data Management",
    icon: TrendingUp,
    component: AdminDashboard,
    section: "Dashboard",
  },
  {
    id: "activity-log",
    label: "Activity Log",
    icon: Activity,
    component: AdminActivity,
    section: "Dashboard",
  },
  // Content Management Section
  {
    id: "blog",
    label: "Blog Posts",
    icon: BookOpen,
    component: (props: any) => <AdminBlog {...props} hideLayout={true} />,
    section: "Content Management",
  },
  {
    id: "island-guides",
    label: "Island Guides",
    icon: BookOpen,
    component: AdminIslandGuides,
    section: "Content Management",
  },
  {
    id: "packages",
    label: "Packages",
    icon: Package,
    component: AdminPackages,
    section: "Content Management",
  },
  // Activity Management Section
  {
    id: "activity-spots",
    label: "Activity Spots",
    icon: MapPin,
    component: AdminActivitySpots,
    section: "Activity Management",
  },
  {
    id: "map-locations",
    label: "Map Locations",
    icon: MapPin,
    component: AdminMapLocations,
    section: "Activity Management",
  },
  // Travel & Transportation Section
  {
    id: "boat-routes",
    label: "Boat Routes",
    icon: Ship,
    component: AdminBoatRoutes,
    section: "Travel & Transportation",
  },
  {
    id: "transports",
    label: "Transports",
    icon: Ship,
    component: AdminTransports,
    section: "Travel & Transportation",
  },
  // Business Management Section
  {
    id: "crm",
    label: "CRM Dashboard",
    icon: MessageSquare,
    component: AdminCRM,
    section: "Business Management",
  },
  // Organization Section
  {
    id: "staff",
    label: "Staff Management",
    icon: Users,
    component: AdminStaff,
    section: "Organization",
  },
  {
    id: "roles",
    label: "Roles & Permissions",
    icon: Settings,
    component: AdminRoles,
    section: "Organization",
  },
  // Configuration Section
  {
    id: "seo",
    label: "SEO Optimizer",
    icon: FileText,
    component: AdminSEOOptimizer,
    section: "Configuration",
  },
  {
    id: "branding",
    label: "Branding",
    icon: Palette,
    component: AdminBranding,
    section: "Configuration",
  },
];

const sections = [
  "Dashboard",
  "Content Management",
  "Activity Management",
  "Travel & Transportation",
  "Business Management",
  "Organization",
  "Configuration",
];

export default function UnifiedCMS() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Dashboard", "Content Management"])
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Find the current component to render
  const currentItem = menuItems.find((item) => item.id === activeSection);
  const CurrentComponent = currentItem?.component || ((props: any) => <StaffDashboard {...props} disableLayout={true} />);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 overflow-y-auto flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white text-sm font-bold">IN</span>
                </div>
                <span className="font-bold text-sm">Isle Nomads CMS</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Clean single layer */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarOpen ? (
            // Expanded view: Show sections with collapsible items
            sections.map((section) => {
              const sectionItems = menuItems.filter((item) => item.section === section);
              const isExpanded = expandedSections.has(section);
              const hasActiveItem = sectionItems.some((item) => item.id === activeSection);

              return (
                <div key={section}>
                  <Button
                    variant={hasActiveItem ? "secondary" : "ghost"}
                    className="w-full justify-between gap-3 h-10 font-medium text-sm"
                    onClick={() => toggleSection(section)}
                  >
                    <span className="flex-1 text-left">{section}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </Button>

                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                      {sectionItems.map((item) => (
                        <Button
                          key={item.id}
                          variant={activeSection === item.id ? "secondary" : "ghost"}
                          className="w-full justify-start gap-2 h-9 text-sm"
                          onClick={() => setActiveSection(item.id)}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Collapsed view: Show only icons
            menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-10 h-10 p-0 flex items-center justify-center"
                onClick={() => setActiveSection(item.id)}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </Button>
            ))
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <Button
            variant="ghost"
            className={`${
              sidebarOpen
                ? "w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                : "w-10 h-10 p-0 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
            }`}
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold">Isle Nomads CMS</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || "Staff"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
