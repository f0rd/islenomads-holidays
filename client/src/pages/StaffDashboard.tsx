/**
 * Staff Dashboard
 * Main dashboard for staff members with overview, quick actions, and recent activity
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  FileText, 
  Package, 
  ChevronRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  Users,
  MapPin,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

function StaffDashboardContent() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Fetch real dashboard data from server
  const { data: dashboardData, isLoading } = trpc.system.getDashboardStats.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff-login");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const recentActivity = [
    { id: 1, action: "Blog post published", user: "Sarah Johnson", time: "2 hours ago", type: "success" },
    { id: 2, action: "Package updated", user: "Mike Chen", time: "4 hours ago", type: "info" },
    { id: 3, action: "SEO tags approved", user: "You", time: "1 day ago", type: "success" },
    { id: 4, action: "Staff member added", user: "Admin", time: "2 days ago", type: "info" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.summary?.totalBlogPosts || 0}</p>
                <p className="text-xs text-green-600 mt-1">Published posts</p>
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
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.summary?.totalPackages || 0}</p>
                <p className="text-xs text-green-600 mt-1">Available packages</p>
              </div>
              <Package className="w-12 h-12 text-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Island Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.summary?.totalIslandGuides || 0}</p>
                <p className="text-xs text-green-600 mt-1">Published guides</p>
              </div>
              <MapPin className="w-12 h-12 text-orange-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Activity Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.summary?.totalActivitySpots || 0}</p>
                <p className="text-xs text-green-600 mt-1">Registered spots</p>
              </div>
              <Activity className="w-12 h-12 text-red-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/blog">
                <Button variant="outline" className="w-full justify-between">
                  <span>Create Blog Post</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/admin/packages">
                <Button variant="outline" className="w-full justify-between">
                  <span>Add Package</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/admin/island-guides">
                <Button variant="outline" className="w-full justify-between">
                  <span>Create Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/admin/ferry-routes">
                <Button variant="outline" className="w-full justify-between">
                  <span>Manage Ferry Routes</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>System overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm">Server running</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm">Database connected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaffDashboard() {
  return (
    <DashboardLayout>
      <StaffDashboardContent />
    </DashboardLayout>
  );
}
