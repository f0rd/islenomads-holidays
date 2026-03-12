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
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Mail,
  Shield,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function AdminStaffContent() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    department: "",
    position: "",
    role: "",
  });

  // Fetch staff list
  const { data: staffList = [], isLoading, refetch } = trpc.staff.list.useQuery();

  // Staff mutations
  const updateMutation = trpc.staff.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditModalOpen(false);
      setSelectedStaff(null);
    },
  });

  const deleteMutation = trpc.staff.delete.useMutation({
    onSuccess: () => {
      refetch();
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff-login");
    }
  }, [isAuthenticated, navigate]);

  const filteredStaff = (staffList || []).filter(
    (member: any) =>
      (member.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (member.user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (staff: any) => {
    setSelectedStaff({
      id: staff.id,
      name: staff.user?.name || "",
      email: staff.user?.email || "",
      role: staff.role?.name || "",
      department: staff.department || "",
      status: staff.isActive ? "active" : "inactive",
      joinedDate: new Date(staff.createdAt).toLocaleDateString(),
      lastLogin: staff.lastLogin ? new Date(staff.lastLogin).toLocaleDateString() : "Never",
    });
    setEditFormData({
      name: staff.user?.name || "",
      department: staff.department || "",
      position: staff.position || "",
      role: staff.role?.name || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (staff: any) => {
    setSelectedStaff({
      id: staff.id,
      name: staff.user?.name || "",
      email: staff.user?.email || "",
      role: staff.role?.name || "",
      department: staff.department || "",
      status: staff.isActive ? "active" : "inactive",
      joinedDate: new Date(staff.createdAt).toLocaleDateString(),
      lastLogin: staff.lastLogin ? new Date(staff.lastLogin).toLocaleDateString() : "Never",
    });
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedStaff) return;
    await updateMutation.mutateAsync({
      id: selectedStaff.id,
      name: editFormData.name,
      department: editFormData.department,
      position: editFormData.position,
    });
  };

  const handleConfirmDelete = async () => {
    if (!selectedStaff) return;
    await deleteMutation.mutateAsync({ id: selectedStaff.id });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
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
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading staff members...</div>
            ) : filteredStaff.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No staff members found</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Department</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((member: any) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{member.user?.name || "N/A"}</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(member.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail className="w-4 h-4" />
                          {member.user?.email || "N/A"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          <Shield className="w-3 h-3" />
                          {member.role?.name || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{member.department || "N/A"}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            member.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.isActive ? "● Active" : "● Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(member)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(member)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff member details</DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  placeholder="e.g., John Doe"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={selectedStaff.email} disabled className="mt-1" />
              </div>
              <div>
                <Label>Department</Label>
                <Input
                  value={editFormData.department}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, department: e.target.value })
                  }
                  placeholder="e.g., Content, Operations"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={editFormData.position}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, position: e.target.value })
                  }
                  placeholder="e.g., Senior Editor"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={updateMutation.isPending}
                  className="bg-accent hover:bg-accent/90"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{filteredStaff.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {filteredStaff.filter((s: any) => s.isActive).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {filteredStaff.filter((s: any) => !s.isActive).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(filteredStaff.map((s: any) => s.department)).size}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminStaff() {
  return (
    <DashboardLayout>
      <AdminStaffContent />
    </DashboardLayout>
  );
}
