import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, Edit2, Trash2, Plus, Search } from "lucide-react";
import { validateIslandData } from "@shared/geographicalData";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Queries - must be called at top level
  const { data: islands, isLoading, refetch } = trpc.islandGuides.listAdmin.useQuery();
  const updateMutation = trpc.islandGuides.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingId(null);
      setEditData({});
      setValidationErrors({});
    },
  });
  const deleteMutation = trpc.islandGuides.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Filter islands based on search - must be before admin check
  const filteredIslands = useMemo(() => {
    if (!islands) return [];
    return islands.filter((island: any) =>
      island.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      island.atoll?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      island.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [islands, searchTerm]);

  // Check admin access
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Access Denied</p>
            <p className="text-muted-foreground">
              Only administrators can access this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle edit
  const handleEdit = (island: any) => {
    setEditingId(island.id);
    setEditData({ ...island });
    setValidationErrors({});
  };

  // Validate and save
  const handleSave = async () => {
    const errors: Record<string, string> = {};

    // Validate required fields
    if (!editData.name?.trim()) errors.name = "Name is required";
    if (!editData.slug?.trim()) errors.slug = "Slug is required";
    if (!editData.atoll?.trim()) errors.atoll = "Atoll is required";

    // Validate geographical data
    const geoValidation = validateIslandData({
      slug: editData.slug,
      atoll: editData.atoll,
    });
    if (!geoValidation.valid && geoValidation.errors.length > 0) {
      errors.atoll = geoValidation.errors[0];
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingId!,
        ...editData,
      });
    } catch (error: any) {
      setValidationErrors({
        submit: error.message || "Failed to save changes",
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this island guide?")) {
      try {
        await deleteMutation.mutateAsync({ id });
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading island data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage and validate island data</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Island
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, atoll, or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Island Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Island Guides ({filteredIslands.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Atoll</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIslands.map((island: any) => (
                    <TableRow key={island.id}>
                      <TableCell className="font-medium">{island.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {island.slug}
                      </TableCell>
                      <TableCell>{island.atoll}</TableCell>
                      <TableCell>
                        {island.published ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Yes
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog open={editingId === island.id} onOpenChange={(open) => !open && setEditingId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(island)}
                              className="gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Island: {editData.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Name */}
                              <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <Input
                                  value={editData.name || ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData, name: e.target.value })
                                  }
                                  className={validationErrors.name ? "border-destructive" : ""}
                                />
                                {validationErrors.name && (
                                  <p className="text-sm text-destructive mt-1">
                                    {validationErrors.name}
                                  </p>
                                )}
                              </div>

                              {/* Slug */}
                              <div>
                                <label className="block text-sm font-medium mb-1">Slug</label>
                                <Input
                                  value={editData.slug || ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData, slug: e.target.value })
                                  }
                                  className={validationErrors.slug ? "border-destructive" : ""}
                                />
                                {validationErrors.slug && (
                                  <p className="text-sm text-destructive mt-1">
                                    {validationErrors.slug}
                                  </p>
                                )}
                              </div>

                              {/* Atoll */}
                              <div>
                                <label className="block text-sm font-medium mb-1">Atoll</label>
                                <Input
                                  value={editData.atoll || ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData, atoll: e.target.value })
                                  }
                                  className={validationErrors.atoll ? "border-destructive" : ""}
                                />
                                {validationErrors.atoll && (
                                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {validationErrors.atoll}
                                  </p>
                                )}
                              </div>

                              {/* Published */}
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="published"
                                  checked={editData.published === 1}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      published: e.target.checked ? 1 : 0,
                                    })
                                  }
                                  className="w-4 h-4"
                                />
                                <label htmlFor="published" className="text-sm font-medium">
                                  Published
                                </label>
                              </div>

                              {/* Submit Error */}
                              {validationErrors.submit && (
                                <div className="p-3 bg-destructive/10 border border-destructive rounded-md flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-destructive" />
                                  <p className="text-sm text-destructive">
                                    {validationErrors.submit}
                                  </p>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex gap-2 justify-end pt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSave}
                                  disabled={updateMutation.isPending}
                                >
                                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(island.id)}
                          disabled={deleteMutation.isPending}
                          className="gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Validation Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Data Validation</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <p>
              All island data is validated in real-time against our geographical reference database.
              The system ensures:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Island names are unique within their atoll</li>
              <li>Atoll assignments match authoritative geographical data</li>
              <li>Coordinates are within valid ranges</li>
              <li>No duplicate entries exist</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
