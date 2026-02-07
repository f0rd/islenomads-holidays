import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import SEOEditor from "@/components/SEOEditor";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AdminPackages() {
  const { user } = useAuth();
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
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  const { data: packages = [], isLoading, refetch } = trpc.admin.packages.listAll.useQuery();
  const createMutation = trpc.packages.create.useMutation();
  const updateMutation = trpc.packages.update.useMutation();
  const deleteMutation = trpc.packages.delete.useMutation();

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </div>
        <Footer />
      </div>
    );
  }

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
      alert("Package created successfully!");
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
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      });
      setSeoData({
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      });
      setIsCreateOpen(false);
      refetch();
    } catch (error) {
      alert("Error creating package");
    }
  };

  const handleUpdatePackage = async () => {
    if (!editingId) return;
    try {
      await updateMutation.mutateAsync({
        id: editingId,
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
      alert("Package updated successfully!");
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
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      });
      setSeoData({
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      });
      setEditingId(null);
      setIsEditOpen(false);
      refetch();
    } catch (error) {
      alert("Error updating package");
    }
  };

  const handleEditPackage = (pkg: any) => {
    setFormData({
      name: pkg.name,
      slug: pkg.slug,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      destination: pkg.destination,
      highlights: pkg.highlights,
      amenities: pkg.amenities,
      image: pkg.image,
      featured: pkg.featured,
      published: pkg.published,
      metaTitle: pkg.metaTitle || "",
      metaDescription: pkg.metaDescription || "",
      focusKeyword: pkg.focusKeyword || "",
      ogTitle: pkg.ogTitle || "",
      ogDescription: pkg.ogDescription || "",
      ogImage: pkg.ogImage || "",
    });
    setSeoData({
      metaTitle: pkg.metaTitle || "",
      metaDescription: pkg.metaDescription || "",
      focusKeyword: pkg.focusKeyword || "",
      ogTitle: pkg.ogTitle || "",
      ogDescription: pkg.ogDescription || "",
      ogImage: pkg.ogImage || "",
    });
    setEditingId(pkg.id);
    setIsEditOpen(true);
  };

  const handleDeletePackage = async (id: number) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        alert("Package deleted successfully!");
        refetch();
      } catch (error) {
        alert("Error deleting package");
      }
    }
  };

  const resetForm = () => {
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
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
    });
    setSeoData({
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-12 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Packages Management</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Package
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Package</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Package Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Maldives Paradise"
                      />
                    </div>
                    <div>
                      <Label>Slug *</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="maldives-paradise"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Package description"
                      className="min-h-24"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price ($) *</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Duration *</Label>
                      <Input
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 5 days"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Destination</Label>
                      <Input
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g., Male, Ari Atoll"
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
                  </div>

                  <div>
                    <Label>Highlights</Label>
                    <Textarea
                      value={formData.highlights}
                      onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                      placeholder="Key highlights (comma-separated)"
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <Label>Amenities</Label>
                    <Textarea
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      placeholder="Available amenities (comma-separated)"
                      className="min-h-20"
                    />
                  </div>

                  {/* SEO Editor Section */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold mb-4">SEO Optimization</h3>
                    <SEOEditor
                      title={formData.name}
                      content={formData.description}
                      initialData={{
                        metaTitle: seoData.metaTitle,
                        metaDescription: seoData.metaDescription,
                        focusKeyword: seoData.focusKeyword,
                        slug: formData.slug,
                        ogTitle: seoData.ogTitle,
                        ogDescription: seoData.ogDescription,
                      }}
                      onSEOChange={(updatedSeo: any) => {
                        setSeoData(updatedSeo);
                        setFormData({
                          ...formData,
                          metaTitle: updatedSeo.metaTitle,
                          metaDescription: updatedSeo.metaDescription,
                          focusKeyword: updatedSeo.focusKeyword,
                          ogTitle: updatedSeo.ogTitle || "",
                          ogDescription: updatedSeo.ogDescription || "",
                          ogImage: updatedSeo.ogImage || "",
                        });
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreatePackage} className="flex-1">
                      Create Package
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setIsCreateOpen(false);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Package</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Package Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Maldives Paradise"
                    />
                  </div>
                  <div>
                    <Label>Slug *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="maldives-paradise"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Package description"
                    className="min-h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price ($) *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Duration *</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 5 days"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Destination</Label>
                    <Input
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g., Male, Ari Atoll"
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
                </div>

                <div>
                  <Label>Highlights</Label>
                  <Textarea
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="Key highlights (comma-separated)"
                    className="min-h-20"
                  />
                </div>

                <div>
                  <Label>Amenities</Label>
                  <Textarea
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="Available amenities (comma-separated)"
                    className="min-h-20"
                  />
                </div>

                {/* SEO Editor Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-4">SEO Optimization</h3>
                  <SEOEditor
                    title={formData.name}
                    content={formData.description}
                    initialData={{
                      metaTitle: seoData.metaTitle,
                      metaDescription: seoData.metaDescription,
                      focusKeyword: seoData.focusKeyword,
                      slug: formData.slug,
                      ogTitle: seoData.ogTitle,
                      ogDescription: seoData.ogDescription,
                    }}
                    onSEOChange={(updatedSeo: any) => {
                      setSeoData(updatedSeo);
                      setFormData({
                        ...formData,
                        metaTitle: updatedSeo.metaTitle,
                        metaDescription: updatedSeo.metaDescription,
                        focusKeyword: updatedSeo.focusKeyword,
                        ogTitle: updatedSeo.ogTitle || "",
                        ogDescription: updatedSeo.ogDescription || "",
                        ogImage: updatedSeo.ogImage || "",
                      });
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleUpdatePackage} className="flex-1">
                    Update Package
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsEditOpen(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Packages Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg: any) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{pkg.description}</p>
                      <div className="grid grid-cols-2 gap-2 py-2">
                        <div>
                          <span className="font-semibold">Price:</span> ${pkg.price}
                        </div>
                        <div>
                          <span className="font-semibold">Duration:</span> {pkg.duration}
                        </div>
                        <div>
                          <span className="font-semibold">Destination:</span> {pkg.destination}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span>{" "}
                          {pkg.published === 1 ? "Published" : "Draft"}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPackage(pkg)}
                          className="flex-1"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No packages yet. Create your first package!
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
