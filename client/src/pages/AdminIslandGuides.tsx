import { useState, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IslandGuideForm } from '@/components/IslandGuideForm';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface IslandGuideItem {
  id: number;
  name: string;
  slug: string;
  overview: string | null;
  published: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminIslandGuides() {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<IslandGuideItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all island guides
  const { data: guides = [], isLoading, refetch } = trpc.admin.islandGuides.listAdmin.useQuery();

  // Filter guides based on search term
  const filteredGuides = useMemo(() => {
    return guides.filter(guide =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guides, searchTerm]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const handleCreate = () => {
    setSelectedGuide(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (guide: IslandGuideItem) => {
    setSelectedGuide(guide);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedGuide(null);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Save logic would go here
      await refetch();
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this island guide?')) {
      try {
        // Delete logic would go here
        await refetch();
      } catch (error) {
        console.error('Error deleting guide:', error);
      }
    }
  };

  const handleTogglePublish = async (guide: IslandGuideItem) => {
    try {
      // Toggle publish logic would go here
      await refetch();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  if (isCreating || isEditing) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={handleCancel}>
            Back to List
          </Button>
        </div>
        <IslandGuideForm 
          guide={selectedGuide} 
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Island Guides Management</h1>
            <p className="text-gray-600">Manage and create island guides for your destinations</p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Guide
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search guides by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredGuides.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">No island guides found. Create your first guide to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{guide.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Slug: {guide.slug}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePublish(guide)}
                      className="gap-2"
                    >
                      {guide.published ? (
                        <>
                          <Eye className="w-4 h-4" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Draft
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(guide)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(guide.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {guide.overview || 'No overview provided'}
                </p>
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  <span>Created: {new Date(guide.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(guide.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
