import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminBoatRoutes() {
  const { user, loading: authLoading } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
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
  const { data: routes = [], isLoading } = trpc.boatRoutes.list.useQuery();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingRoute) {
        // Update route
        // await updateBoatRoute(editingRoute.id, formData);
        setEditingRoute(null);
      } else {
        // Create new route
        // await createBoatRoute(formData);
      }
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
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error saving boat route:", error);
    }
  };

  const handleEdit = (route: any) => {
    setEditingRoute(route);
    setFormData(route);
    setIsCreateOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this boat route?")) {
      try {
        // await deleteBoatRoute(id);
      } catch (error) {
        console.error("Error deleting boat route:", error);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-muted-foreground">Please log in to access this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Boat Routes Management</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-accent text-primary hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                Add New Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRoute ? "Edit Boat Route" : "Create New Boat Route"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-1">Route Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Malé to Ari Atoll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="e.g., male-to-ari-atoll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Route Type</label>
                  <Select value={formData.type} onValueChange={(value: any) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="speedboat">Speedboat</SelectItem>
                      <SelectItem value="ferry">Ferry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Locations */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">From Location</label>
                    <Input
                      value={formData.fromLocation}
                      onChange={(e) => handleInputChange("fromLocation", e.target.value)}
                      placeholder="e.g., Malé"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">To Location</label>
                    <Input
                      value={formData.toLocation}
                      onChange={(e) => handleInputChange("toLocation", e.target.value)}
                      placeholder="e.g., Ari Atoll"
                    />
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">From Latitude</label>
                    <Input
                      value={formData.fromLat}
                      onChange={(e) => handleInputChange("fromLat", e.target.value)}
                      placeholder="4.1755"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">From Longitude</label>
                    <Input
                      value={formData.fromLng}
                      onChange={(e) => handleInputChange("fromLng", e.target.value)}
                      placeholder="73.5093"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">To Latitude</label>
                    <Input
                      value={formData.toLat}
                      onChange={(e) => handleInputChange("toLat", e.target.value)}
                      placeholder="4.0833"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">To Longitude</label>
                    <Input
                      value={formData.toLng}
                      onChange={(e) => handleInputChange("toLng", e.target.value)}
                      placeholder="72.8333"
                    />
                  </div>
                </div>

                {/* Route Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Distance</label>
                    <Input
                      value={formData.distance}
                      onChange={(e) => handleInputChange("distance", e.target.value)}
                      placeholder="e.g., 45 km"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="e.g., 1 hour 30 mins"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (cents)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", parseInt(e.target.value))}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Capacity</label>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", parseInt(e.target.value))}
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Route description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amenities (comma-separated)</label>
                  <Input
                    value={formData.amenities}
                    onChange={(e) => handleInputChange("amenities", e.target.value)}
                    placeholder="WiFi, Air Conditioning, Snacks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.published === 1}
                      onChange={(e) => handleInputChange("published", e.target.checked ? 1 : 0)}
                    />
                    <span className="text-sm font-medium">Published</span>
                  </label>
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleCreateOrUpdate}
                  className="w-full bg-accent text-primary hover:bg-accent/90"
                >
                  {editingRoute ? "Update Route" : "Create Route"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Routes List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : routes.length > 0 ? (
          <div className="grid gap-4">
            {routes.map((route: any) => (
              <Card key={route.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{route.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {route.fromLocation} → {route.toLocation}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(route)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(route.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-semibold capitalize">{route.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold">{route.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold">${(route.price / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-semibold">
                        {route.published === 1 ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">No boat routes yet</p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-accent text-primary">
              Create First Route
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
