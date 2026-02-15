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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

interface MenuSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.FC<any>;
}

const menuSections: MenuSection[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    items: [
      {
        id: "overview",
        label: "Overview",
        icon: BarChart3,
        component: StaffDashboard,
      },
      {
        id: "data-management",
        label: "Data Management",
        icon: TrendingUp,
        component: AdminDashboard,
      },
      {
        id: "activity-log",
        label: "Activity Log",
        icon: Activity,
        component: AdminActivity,
      },
    ],
  },
  {
    title: "Content Management",
    icon: FileText,
    items: [
      {
        id: "blog",
        label: "Blog Posts",
        icon: BookOpen,
        component: AdminBlog,
      },
      {
        id: "island-guides",
        label: "Island Guides",
        icon: BookOpen,
        component: AdminIslandGuides,
      },
      {
        id: "packages",
        label: "Packages",
        icon: Package,
        component: AdminPackages,
      },
    ],
  },
  {
    title: "Activity Management",
    icon: Waves,
    items: [
      {
        id: "activity-spots",
        label: "Activity Spots",
        icon: MapPin,
        component: AdminActivitySpots,
      },
      {
        id: "map-locations",
        label: "Map Locations",
        icon: MapPin,
        component: AdminMapLocations,
      },
    ],
  },
  {
    title: "Travel & Transportation",
    icon: Ship,
    items: [
      {
        id: "boat-routes",
        label: "Boat Routes",
        icon: Ship,
        component: AdminBoatRoutes,
      },
      {
        id: "transports",
        label: "Transports",
        icon: Ship,
        component: AdminTransports,
      },
    ],
  },
  {
    title: "Business Management",
    icon: MessageSquare,
    items: [
      {
        id: "crm",
        label: "CRM Dashboard",
        icon: MessageSquare,
        component: AdminCRM,
      },
    ],
  },
  {
    title: "Organization",
    icon: Users,
    items: [
      {
        id: "staff",
        label: "Staff Management",
        icon: Users,
        component: AdminStaff,
      },
      {
        id: "roles",
        label: "Roles & Permissions",
        icon: Settings,
        component: AdminRoles,
      },
    ],
  },
  {
    title: "Configuration",
    icon: Settings,
    items: [
      {
        id: "seo",
        label: "SEO Optimizer",
        icon: FileText,
        component: AdminSEOOptimizer,
      },
      {
        id: "branding",
        label: "Branding",
        icon: Palette,
        component: AdminBranding,
      },
    ],
  },
];

export default function UnifiedCMS() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Dashboard", "Content Management"])
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  // Find the current component to render
  let CurrentComponent: React.FC<any> = StaffDashboard;
  for (const section of menuSections) {
    const item = section.items.find((i) => i.id === activeSection);
    if (item) {
      CurrentComponent = item.component as React.FC<any>;
      break;
    }
  }

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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuSections.map((section) => {
            const isExpanded = expandedGroups.has(section.title);
            const hasActiveItem = section.items.some((item) => item.id === activeSection);

            return (
              <Collapsible
                key={section.title}
                open={isExpanded}
                onOpenChange={() => toggleGroup(section.title)}
                className="group/collapsible"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={hasActiveItem ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3 h-10"
                    title={section.title}
                  >
                    <section.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm">{section.title}</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>

                {sidebarOpen && (
                  <CollapsibleContent className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                    {section.items.map((item) => (
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
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
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
