import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  Download,
  Filter,
  Waves,
  AlertCircle,
} from "lucide-react";

interface BoatRoute {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  fromLocation: string;
  toLocation: string;
  distance?: string | null;
  duration: string;
  type: "ferry" | "speedboat";
  price: number;
  capacity: number;
  schedule?: string | null;
  amenities?: string | null;
  published: number;
}

interface RouteFormData {
  name: string;
  slug: string;
  description: string;
  fromLocation: string;
  toLocation: string;
  distance?: string;
  duration: string;
  type: "ferry" | "speedboat";
  price: number;
  capacity: number;
  schedule?: string;
  amenities?: string;
  published: number;
}

export default function FerryRoutesAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "ferry" | "speedboat">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"name" | "price" | "duration">("name");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<BoatRoute | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<RouteFormData>({
    name: "",
    slug: "",
    description: "",
    fromLocation: "",
    toLocation: "",
    distance: "",
    duration: "",
    type: "ferry",
    price: 0,
    capacity: 0,
    schedule: "",
    amenities: "",
    published: 1,
  });

  // Fetch routes
  const { data: routes = [], isLoading, refetch } = trpc.boatRoutes.list.useQuery();

  // Create/Update mutations
  const createMutation = trpc.boatRoutes.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
      setIsDialogOpen(false);
    },
  });

  const updateMutation = trpc.boatRoutes.update.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = trpc.boatRoutes.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirm(null);
    },
  });

  // Filter and sort routes
  const filteredRoutes = routes
    .filter((route: BoatRoute) => {
      const matchesSearch =
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.toLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || route.type === filterType;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "published" && route.published === 1) ||
        (filterStatus === "draft" && route.published === 0);

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a: BoatRoute, b: BoatRoute) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      fromLocation: "",
      toLocation: "",
      distance: "",
      duration: "",
      type: "ferry",
      price: 0,
      capacity: 0,
      schedule: "",
      amenities: "",
      published: 1,
    });
    setEditingRoute(null);
  };

  const handleOpenDialog = (route?: BoatRoute) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        name: route.name,
        slug: route.slug,
        description: route.description || "",
        fromLocation: route.fromLocation,
        toLocation: route.toLocation,
        distance: route.distance || "",
        duration: route.duration,
        type: route.type,
        price: route.price,
        capacity: route.capacity,
        schedule: route.schedule || "",
        amenities: route.amenities || "",
        published: route.published,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.slug ||
      !formData.fromLocation ||
      !formData.toLocation ||
      !formData.duration
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingRoute) {
        await updateMutation.mutateAsync({
          id: editingRoute.id,
          ...formData,
          price: Math.round(formData.price * 100),
          distance: formData.distance ? parseFloat(formData.distance) : undefined,
        } as any);
      } else {
        await createMutation.mutateAsync({
          ...formData,
          price: Math.round(formData.price * 100),
          distance: formData.distance ? parseFloat(formData.distance) : undefined,
        } as any);
      }
    } catch (error) {
      console.error("Error saving route:", error);
      alert("Error saving route. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
    } catch (error) {
      console.error("Error deleting route:", error);
      alert("Error deleting route. Please try again.");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "From",
      "To",
      "Type",
      "Duration",
      "Price (USD)",
      "Capacity",
      "Status",
    ];
    const rows = filteredRoutes.map((route: BoatRoute) => [
      route.name,
      route.fromLocation,
      route.toLocation,
      route.type,
      route.duration,
      (route.price / 100).toFixed(2),
      route.capacity,
      route.published === 1 ? "Published" : "Draft",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ferry-routes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin">
            <Waves className="w-8 h-8 text-accent mx-auto mb-4" />
          </div>
          <p className="text-muted-foreground">Loading ferry routes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ferry Routes</h1>
          <p className="text-muted-foreground mt-1">
            Manage all ferry and speedboat routes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-accent hover:bg-accent/90"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? "Edit Route" : "Create New Route"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Route Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Male to Maafushi"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="e.g., male-maafushi"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Route description"
                  className="mt-1 w-full p-2 border border-border rounded-md text-sm"
                  rows={2}
                />
              </div>

              {/* Locations */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    From Location *
                  </label>
                  <Input
                    value={formData.fromLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, fromLocation: e.target.value })
                    }
                    placeholder="e.g., Male"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    To Location *
                  </label>
                  <Input
                    value={formData.toLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, toLocation: e.target.value })
                    }
                    placeholder="e.g., Maafushi"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Route Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Type *
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ferry">Ferry</SelectItem>
                      <SelectItem value="speedboat">Speedboat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Duration *
                  </label>
                  <Input
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g., 45 min"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Pricing & Capacity */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Price (USD)
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Capacity
                  </label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Distance (km)
                  </label>
                  <Input
                    type="number"
                    value={formData.distance}
                    onChange={(e) =>
                      setFormData({ ...formData, distance: e.target.value })
                    }
                    placeholder="0"
                    step="0.1"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Schedule & Amenities */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Schedule
                  </label>
                  <Input
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    placeholder="e.g., Daily 8am, 2pm"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Status
                  </label>
                  <Select
                    value={formData.published.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        published: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Published</SelectItem>
                      <SelectItem value="0">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Amenities
                </label>
                <textarea
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  placeholder="e.g., Air conditioning, Toilets, Snacks"
                  className="mt-1 w-full p-2 border border-border rounded-md text-sm"
                  rows={2}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-accent hover:bg-accent/90"
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editingRoute
                    ? "Update Route"
                    : "Create Route"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by route name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Type
                </label>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ferry">Ferry</SelectItem>
                    <SelectItem value="speedboat">Speedboat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Export
                </label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleExportCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Routes ({filteredRoutes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRoutes.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No routes found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoutes.map((route: BoatRoute) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-foreground">
                            {route.fromLocation} → {route.toLocation}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {route.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            route.type === "ferry" ? "default" : "secondary"
                          }
                        >
                          {route.type === "ferry" ? "🚢 Ferry" : "⚡ Speedboat"}
                        </Badge>
                      </TableCell>
                      <TableCell>{route.duration}</TableCell>
                      <TableCell className="font-semibold text-accent">
                        ${(route.price / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>{route.capacity}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            route.published === 1 ? "default" : "secondary"
                          }
                        >
                          {route.published === 1 ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDialog(route)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(route.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Route</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this route? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
