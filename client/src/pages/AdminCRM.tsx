/**
 * CRM Dashboard Page
 * Manage customer queries and interactions
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Plus,
  Search,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Inbox,
  TrendingUp,
  Filter,
} from "lucide-react";
import { Link } from "wouter";

interface Query {
  id: number;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: "new" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  assignedTo?: string;
}

export default function AdminCRM() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff-login");
    }
  }, [isAuthenticated, navigate]);

  const queries: Query[] = [
    {
      id: 1,
      customerName: "John Smith",
      customerEmail: "john@example.com",
      subject: "Booking inquiry for Maldives package",
      status: "new",
      priority: "high",
      createdAt: "2 hours ago",
    },
    {
      id: 2,
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      subject: "Question about island guide",
      status: "in_progress",
      priority: "medium",
      createdAt: "1 day ago",
      assignedTo: "Mike Chen",
    },
    {
      id: 3,
      customerName: "Emma Davis",
      customerEmail: "emma@example.com",
      subject: "Complaint about booking",
      status: "resolved",
      priority: "urgent",
      createdAt: "2 days ago",
      assignedTo: "Sarah Johnson",
    },
    {
      id: 4,
      customerName: "Alex Rodriguez",
      customerEmail: "alex@example.com",
      subject: "Feedback on service",
      status: "closed",
      priority: "low",
      createdAt: "3 days ago",
      assignedTo: "Emma Davis",
    },
  ];

  const stats = {
    total: 24,
    new: 5,
    inProgress: 8,
    resolved: 9,
    closed: 2,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "waiting_customer":
        return "bg-purple-100 text-purple-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 font-bold";
      case "high":
        return "text-orange-600 font-semibold";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "new":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredQueries = queries.filter((q) => {
    const matchesSearch =
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || q.status === filterStatus;
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
          <h1 className="text-3xl font-bold text-gray-900">CRM - Query Management</h1>
        </div>
        <p className="text-gray-600">Manage customer queries and interactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">New</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{stats.closed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_customer">Waiting Customer</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            New Query
          </Button>
        </div>
      </div>

      {/* Queries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Queries ({filteredQueries.length})</CardTitle>
          <CardDescription>All customer inquiries and support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Assigned To</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((query) => (
                  <tr key={query.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{query.customerName}</p>
                        <p className="text-xs text-gray-500">{query.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900 max-w-xs truncate">{query.subject}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(query.status)}
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(query.status)}`}>
                          {query.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${getPriorityColor(query.priority)}`}>
                        {query.priority.charAt(0).toUpperCase() + query.priority.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {query.assignedTo || <span className="text-gray-400">Unassigned</span>}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{query.createdAt}</td>
                    <td className="py-4 px-4">
                      <Link href={`/admin/crm/${query.id}`}>
                        <a className="text-accent hover:text-accent/80 font-semibold text-sm">
                          View
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredQueries.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No queries found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
