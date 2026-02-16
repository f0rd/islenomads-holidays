/**
 * Staff Dashboard
 * Main dashboard for staff members with overview, quick actions, and recent activity
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
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
  Users
} from "lucide-react";
import { Link } from "wouter";

interface DashboardStats {
  totalPosts: number;
  totalPackages: number;
  totalLocations: number;
  pendingApprovals: number;
}

function StaffDashboardContent() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
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
  );
}

export default function StaffDashboard() {
  return (
    <DashboardLayout>
      <StaffDashboardContent />
    </DashboardLayout>
  );
}
