import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  BarChart3,
  FileText,
  Package,
  MapPin,
  Anchor,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/cms/dashboard",
    badge: null,
  },
  {
    title: "Blog Posts",
    icon: FileText,
    href: "/admin/blog",
    badge: null,
  },
  {
    title: "Packages",
    icon: Package,
    href: "/admin/packages",
    badge: null,
  },
  {
    title: "Island Guides",
    icon: BookOpen,
    href: "/admin/island-guides",
    badge: null,
  },
  {
    title: "Map Locations",
    icon: MapPin,
    href: "/admin/map-locations",
    badge: null,
  },
  {
    title: "Boat Routes",
    icon: Anchor,
    href: "/admin/boat-routes",
    badge: null,
  },
  {
    title: "SEO Optimizer",
    icon: Zap,
    href: "/admin/seo-optimizer",
    badge: null,
  },
  {
    title: "Staff Management",
    icon: Users,
    href: "/admin/staff",
    badge: null,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    badge: null,
  },
];

export default function CMSDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const stats = [
    { label: "Total Blog Posts", value: "24", icon: FileText, color: "bg-blue-50" },
    { label: "Active Packages", value: "12", icon: Package, color: "bg-green-50" },
    { label: "Island Guides", value: "8", icon: BookOpen, color: "bg-purple-50" },
    { label: "Map Locations", value: "35", icon: MapPin, color: "bg-orange-50" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 overflow-y-auto`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white text-sm font-bold">IN</span>
                </div>
                <span className="font-bold text-sm">Isle Nomads</span>
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

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start gap-3 h-10"
              onClick={() => navigate(item.href)}
              title={item.title}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="flex-1 text-left text-sm">{item.title}</span>
              )}
              {item.badge && sidebarOpen && (
                <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
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
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">CMS Dashboard</h1>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common CMS tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/admin/blog")}
                  >
                    <FileText className="w-6 h-6" />
                    <span className="text-xs">New Blog Post</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/admin/packages")}
                  >
                    <Package className="w-6 h-6" />
                    <span className="text-xs">New Package</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/admin/island-guides")}
                  >
                    <BookOpen className="w-6 h-6" />
                    <span className="text-xs">New Island Guide</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/admin/map-locations")}
                  >
                    <MapPin className="w-6 h-6" />
                    <span className="text-xs">New Location</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest CMS updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Blog post published</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Package updated</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Island guide created</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
