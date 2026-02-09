/**
 * Staff Dashboard
 * Main dashboard for staff members with overview, quick actions, and recent activity
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  FileText, 
  Package, 
  MapPin, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

interface DashboardStats {
  totalPosts: number;
  totalPackages: number;
  totalLocations: number;
  pendingApprovals: number;
}

export default function StaffDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalPackages: 0,
    totalLocations: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff-login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard", badge: null },
    { icon: FileText, label: "Blog Posts", href: "/admin/blog", badge: "3" },
    { icon: Package, label: "Packages", href: "/admin/packages", badge: "2" },
    { icon: MapPin, label: "Island Guides", href: "/admin/island-guides", badge: null },
    { icon: MapPin, label: "Map Locations", href: "/admin/map-locations", badge: null },
    { icon: MapPin, label: "Boat Routes", href: "/admin/boat-routes", badge: null },
    { icon: BarChart3, label: "SEO Optimizer", href: "/admin/seo-optimizer", badge: "5" },
    { icon: Activity, label: "CRM - Queries", href: "/admin/crm", badge: "5" },
    { icon: Users, label: "Staff Management", href: "/admin/staff", badge: null },
    { icon: Activity, label: "Activity Log", href: "/admin/activity", badge: null },
    { icon: Settings, label: "Settings", href: "/admin/settings", badge: null },
  ];

  const recentActivity = [
    { id: 1, action: "Blog post published", user: "Sarah Johnson", time: "2 hours ago", type: "success" },
    { id: 2, action: "Package updated", user: "Mike Chen", time: "4 hours ago", type: "info" },
    { id: 3, action: "SEO tags approved", user: "You", time: "1 day ago", type: "success" },
    { id: 4, action: "Staff member added", user: "Admin", time: "2 days ago", type: "info" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-primary text-primary-foreground transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Logo */}
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold">
              IN
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-sm">Isle Nomads</span>
                <span className="text-xs text-accent">STAFF</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <a className="flex items-center gap-3 px-4 py-3 hover:bg-primary-foreground/10 transition-colors duration-200 group">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </a>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-primary-foreground/20 p-4 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary-foreground/10 rounded-lg transition-colors duration-200 text-sm"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            {sidebarOpen && "Collapse"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200 text-sm text-red-300"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome back, {user?.name || "Staff Member"}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "S"}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">24</p>
                    <p className="text-xs text-green-600 mt-1">↑ 3 this month</p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-100" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-green-600 mt-1">↑ 2 this month</p>
                  </div>
                  <Package className="w-12 h-12 text-purple-100" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-orange-600">5</p>
                    <p className="text-xs text-orange-600 mt-1">Awaiting review</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-orange-100" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Staff Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">8</p>
                    <p className="text-xs text-green-600 mt-1">All active</p>
                  </div>
                  <Users className="w-12 h-12 text-green-100" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/blog">
                  <Button className="w-full justify-between bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                    <span>New Blog Post</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/admin/packages">
                  <Button className="w-full justify-between bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200">
                    <span>New Package</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/admin/seo-optimizer">
                  <Button className="w-full justify-between bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
                    <span>Review SEO Tags</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/admin/staff">
                  <Button className="w-full justify-between bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300">
                    <span>Manage Staff</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions from your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "success" ? "bg-green-100" : "bg-blue-100"
                      }`}>
                        {activity.type === "success" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">by {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
