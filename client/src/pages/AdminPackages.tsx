import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";

export default function AdminPackages() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    duration: "",
    destination: "",
    highlights: "",
    amenities: "",
    image: "",
    featured: 0,
    published: 0,
  });

  const { data: packages = [], isLoading, refetch } = trpc.admin.packages.listAll.useQuery();
  const createMutation = trpc.packages.create.useMutation();
  const updateMutation = trpc.packages.update.useMutation();
  const deleteMutation = trpc.packages.delete.useMutation();

  const handleCreatePackage = async () => {
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        destination: formData.destination,
        highlights: formData.highlights,
        amenities: formData.amenities,
        image: formData.image,
        featured: formData.featured,
        published: formData.published,
      });
      
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: 0,
        duration: "",
        destination: "",
        highlights: "",
        amenities: "",
        image: "",
        featured: 0,
        published: 0,
      });
      setIsCreateOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to create package:", error);
    }
  };

  const handleUpdatePackage = async () => {
    if (!editingId) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingId,
        name: formData.name || undefined,
        slug: formData.slug || undefined,
        description: formData.description || undefined,
        price: formData.price || undefined,
        duration: formData.duration || undefined,
        destination: formData.destination || undefined,
        highlights: formData.highlights || undefined,
        amenities: formData.amenities || undefined,
        image: formData.image || undefined,
        featured: formData.featured || undefined,
        published: formData.published || undefined,
      });
      
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: 0,
        duration: "",
        destination: "",
        highlights: "",
        amenities: "",
        image: "",
        featured: 0,
        published: 0,
      });
      setIsEditOpen(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Failed to update package:", error);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        refetch();
      } catch (error) {
        console.error("Failed to delete package:", error);
      }
    }
  };

  const handleEditClick = (pkg: any) => {
    setFormData({
      name: pkg.name || "",
      slug: pkg.slug || "",
      description: pkg.description || "",
      price: pkg.price || 0,
      duration: pkg.duration || "",
      destination: pkg.destination || "",
      highlights: pkg.highlights || "",
      amenities: pkg.amenities || "",
      image: pkg.image || "",
      featured: pkg.featured || 0,
      published: pkg.published || 0,
    });
    setEditingId(pkg.id);
    setIsEditOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Packages Management</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Package Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Maldives Paradise 5 Days"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., maldives-paradise-5-days"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Package description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (USD)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 5 days"
                  />
                </div>
              </div>
              <div>
                <Label>Destination</Label>
                <Input
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g., Maldives"
                />
              </div>
              <div>
                <Label>Highlights (JSON)</Label>
                <Textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder='["Beach resort", "Water sports"]'
                  rows={3}
                />
              </div>
              <div>
                <Label>Amenities (JSON)</Label>
                <Textarea
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder='["Pool", "Spa", "Restaurant"]'
                  rows={3}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured === 1}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked ? 1 : 0 })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published === 1}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                  />
                  Published
                </label>
              </div>
              <Button onClick={handleCreatePackage} disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Creating..." : "Create Package"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {packages.map((pkg: any) => (
          <Card key={pkg.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{pkg.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{pkg.destination}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(pkg)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePackage(pkg.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{pkg.description}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Price:</span> ${pkg.price}
                </div>
                <div>
                  <span className="font-semibold">Duration:</span> {pkg.duration}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {pkg.published ? "Published" : "Draft"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Package Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Maldives Paradise 5 Days"
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., maldives-paradise-5-days"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Package description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (USD)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 5 days"
                />
              </div>
            </div>
            <div>
              <Label>Destination</Label>
              <Input
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Maldives"
              />
            </div>
            <div>
              <Label>Highlights (JSON)</Label>
              <Textarea
                value={formData.highlights}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                placeholder='["Beach resort", "Water sports"]'
                rows={3}
              />
            </div>
            <div>
              <Label>Amenities (JSON)</Label>
              <Textarea
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder='["Pool", "Spa", "Restaurant"]'
                rows={3}
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured === 1}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked ? 1 : 0 })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published === 1}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                />
                Published
              </label>
            </div>
            <Button onClick={handleUpdatePackage} disabled={updateMutation.isPending} className="w-full">
              {updateMutation.isPending ? "Updating..." : "Update Package"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
