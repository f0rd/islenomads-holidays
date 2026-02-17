import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AtollItem {
  id: number;
  name: string;
  slug: string;
  region?: string;
  description: string | null;
  published: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminAtolls() {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    region: '',
    description: '',
    published: 0,
  });

  // Fetch all atolls
  const { data: atolls = [], isLoading, refetch } = trpc.atolls.listAdmin.useQuery();
  const createMutation = trpc.atolls.create.useMutation();
  const updateMutation = trpc.atolls.update.useMutation();
  const deleteMutation = trpc.atolls.delete.useMutation();

  // Filter atolls based on search term
  const filteredAtolls = useMemo(() => {
    return atolls.filter((atoll: any) =>
      atoll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atoll.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [atolls, searchTerm]);

  const handleCreateAtoll = async () => {
    if (!formData.name || !formData.slug) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        slug: formData.slug,
        region: formData.region,
        description: formData.description,
        published: formData.published,
      });
      alert('Atoll created successfully!');
      setFormData({ name: '', slug: '', region: '', description: '', published: 0 });
      setIsCreateOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating atoll:', error);
      alert('Error creating atoll');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAtoll = (atoll: any) => {
    setFormData({
      name: atoll.name,
      slug: atoll.slug,
      region: atoll.region || '',
      description: atoll.description || '',
      published: atoll.published,
    });
    setEditingId(atoll.id);
    setIsEditOpen(true);
  };

  const handleUpdateAtoll = async () => {
    if (!formData.name || !formData.slug || editingId === null) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id: editingId,
        name: formData.name,
        slug: formData.slug,
        region: formData.region,
        description: formData.description,
        published: formData.published,
      });
      alert('Atoll updated successfully!');
      setFormData({ name: '', slug: '', region: '', description: '', published: 0 });
      setEditingId(null);
      setIsEditOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating atoll:', error);
      alert('Error updating atoll');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAtoll = async (id: number) => {
    if (!confirm('Are you sure you want to delete this atoll?')) return;

    try {
      await deleteMutation.mutateAsync({ id });
      alert('Atoll deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting atoll:', error);
      alert('Error deleting atoll');
    }
  };

  const handleTogglePublish = async (id: number, currentPublished: number) => {
    const atoll = atolls.find((a: any) => a.id === id);
    if (!atoll) return;

    try {
      await updateMutation.mutateAsync({
        id,
        published: currentPublished === 1 ? 0 : 1,
      });
      refetch();
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Error updating atoll status');
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
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

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Atolls Management</h1>
              <p className="text-muted-foreground mt-2">Manage all atolls in the Maldives</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Atoll
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Atoll</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Atoll Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., North Malé Atoll"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g., north-male-atoll"
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      placeholder="e.g., North, Central, South"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Atoll description"
                      className="min-h-24"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.published === 1}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                    />
                    <span className="text-sm font-medium">Published</span>
                  </label>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAtoll} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Create Atoll
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search atolls by name or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Atolls List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredAtolls.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No atolls found. Create your first atoll!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAtolls.map((atoll: any) => (
                <Card key={atoll.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{atoll.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Slug: <code className="bg-muted px-2 py-1 rounded">{atoll.slug}</code>
                        </p>
                        {atoll.region && (
                          <p className="text-sm text-muted-foreground mt-1">Region: {atoll.region}</p>
                        )}
                        {atoll.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{atoll.description}</p>
                        )}
                        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                          <span>{atoll.published === 1 ? '✓ Published' : '○ Draft'}</span>
                          <span>Updated: {new Date(atoll.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={atoll.published === 1 ? 'default' : 'outline'}
                          onClick={() => handleTogglePublish(atoll.id, atoll.published)}
                          title={atoll.published === 1 ? 'Unpublish' : 'Publish'}
                        >
                          {atoll.published === 1 ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Dialog open={isEditOpen && editingId === atoll.id} onOpenChange={setIsEditOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditAtoll(atoll)}
                              className="flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Atoll</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-name">Atoll Name *</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  placeholder="e.g., North Malé Atoll"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-slug">URL Slug *</Label>
                                <Input
                                  id="edit-slug"
                                  value={formData.slug}
                                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                  placeholder="e.g., north-male-atoll"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-region">Region</Label>
                                <Input
                                  id="edit-region"
                                  value={formData.region}
                                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                  placeholder="e.g., North, Central, South"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  placeholder="Atoll description"
                                  className="min-h-24"
                                />
                              </div>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={formData.published === 1}
                                  onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                                />
                                <span className="text-sm font-medium">Published</span>
                              </label>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateAtoll} disabled={isSubmitting}>
                                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                  Update Atoll
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteAtoll(atoll.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
