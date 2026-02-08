/**
 * Activity Log Page
 * View all system activity and changes
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Search,
  ChevronLeft,
  FileText,
  Package,
  Users,
  Settings,
  Trash2,
  Edit2,
  Plus,
  Calendar,
  Filter,
} from "lucide-react";
import { Link } from "wouter";

interface ActivityLogEntry {
  id: number;
  action: string;
  entityType: "blog" | "package" | "staff" | "settings" | "seo";
  entityName: string;
  user: string;
  timestamp: string;
  details: string;
  status: "success" | "warning" | "error";
}

export default function AdminActivity() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff-login");
    }
  }, [isAuthenticated, navigate]);

  const activityLogs: ActivityLogEntry[] = [
    {
      id: 1,
      action: "created",
      entityType: "blog",
      entityName: "Top 10 Maldives Resorts",
      user: "Sarah Johnson",
      timestamp: "2 hours ago",
      details: "New blog post published",
      status: "success",
    },
    {
      id: 2,
      action: "updated",
      entityType: "package",
      entityName: "Luxury Island Escape",
      user: "Mike Chen",
      timestamp: "4 hours ago",
      details: "Package price and description updated",
      status: "success",
    },
    {
      id: 3,
      action: "approved",
      entityType: "seo",
      entityName: "Blog Meta Tags",
      user: "Emma Davis",
      timestamp: "6 hours ago",
      details: "5 SEO meta tags approved",
      status: "success",
    },
    {
      id: 4,
      action: "deleted",
      entityType: "blog",
      entityName: "Outdated Guide",
      user: "Admin",
      timestamp: "1 day ago",
      details: "Old blog post removed",
      status: "warning",
    },
    {
      id: 5,
      action: "created",
      entityType: "staff",
      entityName: "John Smith",
      user: "Emma Davis",
      timestamp: "2 days ago",
      details: "New staff member added as Editor",
      status: "success",
    },
    {
      id: 6,
      action: "updated",
      entityType: "settings",
      entityName: "Site Settings",
      user: "Admin",
      timestamp: "3 days ago",
      details: "SEO settings modified",
      status: "success",
    },
  ];

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="w-4 h-4" />;
      case "package":
        return <Package className="w-4 h-4" />;
      case "staff":
        return <Users className="w-4 h-4" />;
      case "settings":
        return <Settings className="w-4 h-4" />;
      case "seo":
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "updated":
        return <Edit2 className="w-4 h-4 text-blue-600" />;
      case "deleted":
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case "approved":
        return <Activity className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || log.entityType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/admin/dashboard">
            <a className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </a>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        </div>
        <p className="text-gray-600">Track all system changes and user actions</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, user, or action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All Types</option>
                <option value="blog">Blog Posts</option>
                <option value="package">Packages</option>
                <option value="staff">Staff</option>
                <option value="seo">SEO</option>
                <option value="settings">Settings</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity ({filteredLogs.length})</CardTitle>
          <CardDescription>All system changes and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 border rounded-lg transition-colors ${getStatusColor(log.status)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}{" "}
                          <span className="text-accent font-semibold">{log.entityName}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-900">{log.user}</p>
                          <p className="text-xs text-gray-500">{log.timestamp}</p>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getEntityIcon(log.entityType)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activity found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{activityLogs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
