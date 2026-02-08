/**
 * Staff Management Page
 * Manage staff members, roles, and permissions
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  Mail,
  Shield,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { Link } from "wouter";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  joinedDate: string;
  lastLogin: string;
}

export default function AdminStaff() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@islenomads.com",
      role: "Editor",
      department: "Content",
      status: "active",
      joinedDate: "2024-01-15",
      lastLogin: "2 hours ago",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@islenomads.com",
      role: "Manager",
      department: "Operations",
      status: "active",
      joinedDate: "2023-11-20",
      lastLogin: "1 day ago",
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma@islenomads.com",
      role: "Admin",
      department: "Management",
      status: "active",
      joinedDate: "2023-06-10",
      lastLogin: "30 minutes ago",
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      email: "alex@islenomads.com",
      role: "Contributor",
      department: "Content",
      status: "inactive",
      joinedDate: "2024-02-01",
      lastLogin: "1 week ago",
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff-login");
    }
  }, [isAuthenticated, navigate]);

  const filteredStaff = staffMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Manager":
        return "bg-blue-100 text-blue-800";
      case "Editor":
        return "bg-green-100 text-green-800";
      case "Contributor":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        </div>
        <p className="text-gray-600">Manage team members, roles, and permissions</p>
      </div>

      {/* Actions Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({filteredStaff.length})</CardTitle>
          <CardDescription>All staff members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Last Login</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">Joined {member.joinedDate}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(member.role)}`}>
                        <Shield className="w-3 h-3" />
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{member.department}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {member.status === "active" ? "● Active" : "● Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{member.lastLogin}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Editors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
