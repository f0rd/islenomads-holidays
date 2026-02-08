/**
 * Role Management Page
 * Manage staff roles and permissions
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  Check,
  X,
} from "lucide-react";
import { Link } from "wouter";

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
}

export default function AdminRoles() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff-login");
    }
  }, [isAuthenticated, navigate]);

  const roles: Role[] = [
    {
      id: 1,
      name: "Admin",
      description: "Full system access and management",
      permissions: [
        "manage_staff",
        "manage_roles",
        "manage_content",
        "manage_seo",
        "view_analytics",
        "manage_settings",
      ],
      memberCount: 1,
    },
    {
      id: 2,
      name: "Manager",
      description: "Content and team management",
      permissions: [
        "manage_content",
        "manage_seo",
        "view_analytics",
        "manage_staff_limited",
      ],
      memberCount: 1,
    },
    {
      id: 3,
      name: "Editor",
      description: "Create and edit content",
      permissions: ["manage_content", "manage_seo", "view_analytics"],
      memberCount: 1,
    },
    {
      id: 4,
      name: "Contributor",
      description: "Create and submit content",
      permissions: ["create_content", "view_analytics"],
      memberCount: 1,
    },
  ];

  const allPermissions = [
    { id: "manage_staff", label: "Manage Staff", description: "Add, edit, delete staff members" },
    { id: "manage_roles", label: "Manage Roles", description: "Create and modify roles" },
    { id: "manage_content", label: "Manage Content", description: "Create, edit, delete all content" },
    { id: "manage_seo", label: "Manage SEO", description: "Approve and manage SEO tags" },
    { id: "view_analytics", label: "View Analytics", description: "Access analytics and reports" },
    { id: "manage_settings", label: "Manage Settings", description: "Modify system settings" },
    { id: "manage_staff_limited", label: "Manage Staff (Limited)", description: "Manage team members only" },
    { id: "create_content", label: "Create Content", description: "Create new content only" },
  ];

  const hasPermission = (role: Role, permissionId: string) => {
    return role.permissions.includes(permissionId);
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
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
        </div>
        <p className="text-gray-600">Manage roles and their permissions</p>
      </div>

      {/* Add Role Button */}
      <div className="mb-8">
        <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Create New Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Members</span>
                  <span className="text-lg font-bold text-gray-900">{role.memberCount}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Permissions:</p>
                  <div className="space-y-1">
                    {role.permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="w-3 h-3 text-green-600" />
                        {perm.replace(/_/g, " ")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
          <CardDescription>Overview of all permissions across roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Permission</th>
                  {roles.map((role) => (
                    <th key={role.id} className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPermissions.map((perm) => (
                  <tr key={perm.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{perm.label}</p>
                        <p className="text-xs text-gray-500">{perm.description}</p>
                      </div>
                    </td>
                    {roles.map((role) => (
                      <td key={role.id} className="text-center py-4 px-4">
                        {hasPermission(role, perm.id) ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
