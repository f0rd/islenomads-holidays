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
          <p className="text-red-800">You must be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  const handleCreateNew = () => {
    setSelectedGuide(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (guide: IslandGuideItem) => {
    setSelectedGuide(guide);
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedGuide(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing && selectedGuide) {
        // Update existing guide
        await trpc.admin.islandGuides.update.mutate({
          id: selectedGuide.id,
          ...formData,
        });
      } else {
        // Create new guide
        await trpc.admin.islandGuides.create.mutate(formData);
      }
      
      // Reset form after submission
      handleCancel();
      
      // Refetch guides
      await refetch();
    } catch (error) {
      console.error('Error submitting island guide:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (guideId: number) => {
    if (!confirm('Are you sure you want to delete this island guide?')) return;
    
    try {
      await trpc.admin.islandGuides.delete.mutate({ id: guideId });
      await refetch();
    } catch (error) {
      console.error('Error deleting island guide:', error);
    }
  };

  const handleTogglePublish = async (guide: IslandGuideItem) => {
    try {
      // TODO: Implement API call to toggle publish status
      console.log('Toggling publish status for:', guide.id);
      await refetch();
    } catch (error) {
      console.error('Error updating island guide:', error);
    }
  };

  // Show form if creating or editing
  if (isCreating || isEditing) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={handleCancel} className="mb-4">
            ← Back to Island Guides
          </Button>
          <h1 className="text-3xl font-bold">
            {isCreating ? 'Create New Island Guide' : `Edit: ${selectedGuide?.name}`}
          </h1>
        </div>

        <IslandGuideForm
          initialData={selectedGuide ? {
            name: selectedGuide.name,
            slug: selectedGuide.slug,
            overview: selectedGuide.overview || '',
            quickFacts: [],
            transportation: { flight: '', speedboat: '', ferry: '' },
            topThingsToDo: [],
            snorkelingGuide: '',
            divingGuide: '',
            surfWatersports: '',
            sandBankDolphinTrips: '',
            beachesLocalRules: '',
            foodCafes: '',
            practicalInfo: '',
            itinerary3Day: '',
            itinerary5Day: '',
            faqs: [],
            published: !!selectedGuide.published,
          } : undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          islandName={selectedGuide?.name}
        />
      </div>
    );
  }

  // Show list view
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Island Guides</h1>
            <p className="text-gray-600 mt-2">Manage comprehensive guides for all Maldives islands</p>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Guide
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search island guides by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Guides List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredGuides.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No island guides match your search.' : 'No island guides yet. Create your first one!'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateNew}>Create First Guide</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{guide.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guide.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {guide.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Slug:</span> {guide.slug}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {guide.overview}
                    </p>
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span>Created: {new Date(guide.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(guide.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(guide)}
                      title={guide.published ? 'Unpublish' : 'Publish'}
                    >
                      {guide.published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(guide)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(guide.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Showing <span className="font-semibold">{filteredGuides.length}</span> of{' '}
          <span className="font-semibold">{guides.length}</span> island guides
        </p>
      </div>
    </div>
  );
}
