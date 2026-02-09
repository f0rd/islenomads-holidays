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
import { useState } from "react";
import { toast } from "sonner";

export default function AdminMapLocations() {
  const { user, loading: authLoading } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "island" as "island" | "resort" | "dive_site" | "surf_spot" | "atoll" | "city",
    latitude: "",
    longitude: "",
    description: "",
    highlights: "",
    amenities: "",
    image: "",
    icon: "",
    color: "",
    difficulty: "",
    depth: "",
    waveHeight: "",
    rating: "",
    reviews: 0,
    population: 0,
    priceRange: "",
    bestSeason: "",
    guideId: "",
    published: 0,
  });

  // Fetch map locations
  const { data: locations = [], isLoading, refetch } = trpc.mapLocations.list.useQuery();
  
  // Mutations
  const createMutation = trpc.mapLocations.create.useMutation({
    onSuccess: () => {
      toast.success("Location created successfully");
      refetch();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.mapLocations.update.useMutation({
    onSuccess: () => {
      toast.success("Location updated successfully");
      refetch();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.mapLocations.delete.useMutation({
    onSuccess: () => {
      toast.success("Location deleted successfully");
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
      type: "island",
      latitude: "",
      longitude: "",
      description: "",
      highlights: "",
      amenities: "",
      image: "",
      icon: "",
      color: "",
      difficulty: "",
      depth: "",
      waveHeight: "",
      rating: "",
      reviews: 0,
      population: 0,
      priceRange: "",
      bestSeason: "",
      guideId: "",
      published: 0,
    });
    setEditingLocation(null);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      if (editingLocation) {
        await updateMutation.mutateAsync({
          id: editingLocation.id,
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          reviews: parseInt(formData.reviews.toString()),
          population: parseInt(formData.population.toString()),
          guideId: formData.guideId ? parseInt(formData.guideId) : undefined,
          published: parseInt(formData.published.toString()),
        } as any);
      } else {
        await createMutation.mutateAsync({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          reviews: parseInt(formData.reviews.toString()),
          population: parseInt(formData.population.toString()),
          guideId: formData.guideId ? parseInt(formData.guideId) : undefined,
          published: parseInt(formData.published.toString()),
        } as any);
      }
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      slug: location.slug,
      type: location.type,
      latitude: location.latitude?.toString() || "",
      longitude: location.longitude?.toString() || "",
      description: location.description || "",
      highlights: location.highlights || "",
      amenities: location.amenities || "",
      image: location.image || "",
      icon: location.icon || "",
      color: location.color || "",
      difficulty: location.difficulty || "",
      depth: location.depth || "",
      waveHeight: location.waveHeight || "",
      rating: location.rating || "",
      reviews: location.reviews || 0,
      population: location.population || 0,
      priceRange: location.priceRange || "",
      bestSeason: location.bestSeason || "",
      guideId: location.guideId?.toString() || "",
      published: location.published || 0,
    });
    setIsCreateOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this location?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredLocations = locations.filter((location: any) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) return <div className="p-8">Loading...</div>;

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-red-500">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Map Locations Management</h1>
          <p className="text-gray-600 mt-2">Manage islands, resorts, dive sites, and other map locations</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="gap-2">
              <Plus size={20} />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Edit Location" : "Create New Location"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Location Name"
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
                    <SelectItem value="island">Island</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="dive_site">Dive Site</SelectItem>
                    <SelectItem value="surf_spot">Surf Spot</SelectItem>
                    <SelectItem value="atoll">Atoll</SelectItem>
                    <SelectItem value="city">City</SelectItem>
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
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  type="number"
                  step="0.000001"
                />
                <Input
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  type="number"
                  step="0.000001"
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Rating (0-5)"
                  value={formData.rating}
                  onChange={(e) => handleInputChange("rating", e.target.value)}
                />
                <Input
                  placeholder="Reviews Count"
                  value={formData.reviews}
                  onChange={(e) => handleInputChange("reviews", parseInt(e.target.value) || 0)}
                  type="number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Best Season"
                  value={formData.bestSeason}
                  onChange={(e) => handleInputChange("bestSeason", e.target.value)}
                />
                <Input
                  placeholder="Price Range"
                  value={formData.priceRange}
                  onChange={(e) => handleInputChange("priceRange", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Difficulty"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange("difficulty", e.target.value)}
                />
                <Input
                  placeholder="Depth (for dive sites)"
                  value={formData.depth}
                  onChange={(e) => handleInputChange("depth", e.target.value)}
                />
              </div>

              <Input
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Icon"
                  value={formData.icon}
                  onChange={(e) => handleInputChange("icon", e.target.value)}
                />
                <Input
                  placeholder="Color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
              </div>

              <Input
                placeholder="Guide ID (optional)"
                value={formData.guideId}
                onChange={(e) => handleInputChange("guideId", e.target.value)}
                type="number"
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
                  "Save Location"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-gray-400 mt-3" />
            <Input
              placeholder="Search by name or slug..."
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
          {filteredLocations.map((location: any) => (
            <Card key={location.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.slug}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {location.type}
                      </span>
                      <span className={`px-2 py-1 rounded ${location.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {location.published ? "Published" : "Draft"}
                      </span>
                      {location.rating && (
                        <span className="text-yellow-600">⭐ {location.rating}</span>
                      )}
                    </div>
                    {location.description && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {location.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(location)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(location.id)}
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

      {filteredLocations.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No locations found. Create one to get started!
          </CardContent>
        </Card>
      )}
    </div>
  );
}
