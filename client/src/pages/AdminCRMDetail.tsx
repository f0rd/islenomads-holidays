/**
 * CRM Query Detail Page
 * View and manage individual customer queries
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Send,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "wouter";

interface Interaction {
  id: number;
  type: "note" | "email" | "call" | "meeting";
  author: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

export default function AdminCRMDetail() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff-login");
    }
  }, [isAuthenticated, navigate]);

  // Mock query data
  const query = {
    id: 1,
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "+1-555-0123",
    customerCountry: "United States",
    subject: "Booking inquiry for Maldives package",
    message: "Hi, I am interested in booking the Luxury Island Escape package for my honeymoon. Can you provide more details about availability in June 2026?",
    status: "new",
    priority: "high",
    queryType: "booking",
    createdAt: "2 hours ago",
    packageName: "Luxury Island Escape",
  };

  const interactions: Interaction[] = [
    {
      id: 1,
      type: "email",
      author: "System",
      content: "Customer email received",
      timestamp: "2 hours ago",
      isInternal: false,
    },
    {
      id: 2,
      type: "note",
      author: "Sarah Johnson",
      content: "Customer is interested in honeymoon package. Need to check June availability.",
      timestamp: "1 hour ago",
      isInternal: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/admin/crm">
            <a className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </a>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Query #{query.id}</h1>
        </div>
        <p className="text-gray-600">{query.subject}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Details */}
          <Card>
            <CardHeader>
              <CardTitle>Query Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Subject</p>
                <p className="text-gray-900">{query.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Message</p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{query.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Query Type</p>
                  <p className="text-gray-900 capitalize">{query.queryType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Related Package</p>
                  <p className="text-gray-900">{query.packageName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactions */}
          <Card>
            <CardHeader>
              <CardTitle>Interaction History</CardTitle>
              <CardDescription>All notes, emails, and communications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {interactions.map((interaction) => (
                <div key={interaction.id} className={`p-4 rounded-lg border ${
                  interaction.isInternal ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{interaction.author}</span>
                      {interaction.isInternal && (
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Internal</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{interaction.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{interaction.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Add Note */}
          <Card>
            <CardHeader>
              <CardTitle>Add Internal Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add an internal note about this query..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={4}
                />
                <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold">
                  <Send className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
                <p className="text-gray-900">{query.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="text-gray-900 break-all">{query.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </p>
                <p className="text-gray-900">{query.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Country
                </p>
                <p className="text-gray-900">{query.customerCountry}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Status</p>
                <select className={`w-full px-3 py-2 rounded-lg border ${getStatusColor(query.status)} focus:outline-none focus:ring-2 focus:ring-accent`}>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_customer">Waiting Customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Priority</p>
                <select className={`w-full px-3 py-2 rounded-lg border ${getPriorityColor(query.priority)} focus:outline-none focus:ring-2 focus:ring-accent`}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Assign To</p>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Unassigned</option>
                  <option value="sarah">Sarah Johnson</option>
                  <option value="mike">Mike Chen</option>
                  <option value="emma">Emma Davis</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Created</p>
                  <p className="text-gray-600">{query.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">First Response</p>
                  <p className="text-gray-600">Not yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
