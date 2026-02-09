import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminBoatRoutes() {
  const { user, loading: authLoading } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "speedboat" as "speedboat" | "ferry",
    fromLocation: "",
    toLocation: "",
    fromLat: "",
    fromLng: "",
    toLat: "",
    toLng: "",
    distance: "",
    duration: "",
    price: 0,
    schedule: "",
    capacity: 0,
    amenities: "",
    boatInfo: "",
    description: "",
    image: "",
    published: 0,
  });

  // Fetch boat routes
  const { data: routes = [], isLoading, refetch } = trpc.boatRoutes.list.useQuery();

  // Mutations
  const createMutation = trpc.boatRoutes.create.useMutation({
    onSuccess: () => {
      toast.success("Boat route created successfully");
      refetch();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.boatRoutes.update.useMutation({
    onSuccess: () => {
      toast.success("Boat route updated successfully");
      refetch();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.boatRoutes.delete.useMutation({
    onSuccess: () => {
      toast.success("Boat route deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      type: "speedboat",
      fromLocation: "",
      toLocation: "",
      fromLat: "",
      fromLng: "",
      toLat: "",
      toLng: "",
      distance: "",
      duration: "",
      price: 0,
      schedule: "",
      capacity: 0,
      amenities: "",
      boatInfo: "",
      description: "",
      image: "",
      published: 0,
    });
    setEditingRoute(null);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      if (editingRoute) {
        await updateMutation.mutateAsync({
          id: editingRoute.id,
          name: formData.name,
          slug: formData.slug,
          type: formData.type,
          fromLocation: formData.fromLocation,
          toLocation: formData.toLocation,
          distance: formData.distance ? parseFloat(formData.distance) : undefined,
          duration: formData.duration,
          price: formData.price,
          capacity: formData.capacity,
          amenities: formData.amenities,
          description: formData.description,
          image: formData.image,
          published: formData.published,
        } as any);
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          slug: formData.slug,
          type: formData.type,
          fromLocation: formData.fromLocation,
          toLocation: formData.toLocation,
          distance: formData.distance ? parseFloat(formData.distance) : undefined,
          duration: formData.duration,
          price: formData.price,
          capacity: formData.capacity,
          amenities: formData.amenities,
          description: formData.description,
          image: formData.image,
          published: formData.published,
        } as any);
      }
    } catch (error) {
      console.error("Error saving boat route:", error);
    }
  };

  const handleEdit = (route: any) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      slug: route.slug,
      type: route.type,
      fromLocation: route.fromLocation,
      toLocation: route.toLocation,
      fromLat: route.fromLat,
      fromLng: route.fromLng,
      toLat: route.toLat,
      toLng: route.toLng,
      distance: route.distance || "",
      duration: route.duration,
      price: route.price || 0,
      schedule: route.schedule || "",
      capacity: route.capacity || 0,
      amenities: route.amenities || "",
      boatInfo: route.boatInfo || "",
      description: route.description || "",
      image: route.image || "",
      published: route.published || 0,
    });
    setIsCreateOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this boat route?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredRoutes = routes.filter((route: any) =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.toLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) return <div className="p-8">Loading...</div>;

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-red-500">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Boat Routes Management</h1>
          <p className="text-gray-600 mt-2">Manage speedboat and ferry routes</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="gap-2">
              <Plus size={20} />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? "Edit Boat Route" : "Create New Boat Route"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Route Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <Input
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select value={formData.type} onValueChange={(val) => handleInputChange("type", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="speedboat">Speedboat</SelectItem>
                    <SelectItem value="ferry">Ferry</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.published.toString()} onValueChange={(val) => handleInputChange("published", parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Published" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Draft</SelectItem>
                    <SelectItem value="1">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="From Location"
                  value={formData.fromLocation}
                  onChange={(e) => handleInputChange("fromLocation", e.target.value)}
                />
                <Input
                  placeholder="To Location"
                  value={formData.toLocation}
                  onChange={(e) => handleInputChange("toLocation", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                />
                <Input
                  placeholder="Distance"
                  value={formData.distance}
                  onChange={(e) => handleInputChange("distance", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Price (cents)"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                  type="number"
                />
                <Input
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                  type="number"
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />

              <Input
                placeholder="Amenities (comma-separated)"
                value={formData.amenities}
                onChange={(e) => handleInputChange("amenities", e.target.value)}
              />

              <Input
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
              />

              <Button
                onClick={handleCreateOrUpdate}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Route"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-gray-400 mt-3" />
            <Input
              placeholder="Search by name, slug, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRoutes.map((route: any) => (
            <Card key={route.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{route.name}</h3>
                    <p className="text-sm text-gray-600">{route.slug}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {route.type}
                      </span>
                      <span className={`px-2 py-1 rounded ${route.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {route.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>{route.fromLocation}</strong> → <strong>{route.toLocation}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      {route.duration} • {route.distance} • ৳{(route.price / 100).toFixed(2)}
                    </p>
                    {route.description && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {route.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(route)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(route.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredRoutes.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No routes found. Create one to get started!
          </CardContent>
        </Card>
      )}
    </div>
  );
}
