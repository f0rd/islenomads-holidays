'use client';

import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IslandGuideForm, type IslandGuideFormData } from '@/components/IslandGuideForm';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2, GripVertical, Star } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useState, useMemo } from 'react';

interface IslandGuideItem {
  id: number;
  name: string;
  slug: string;
  atoll?: string;
  overview: string | null;
  published: number;
  featured: number;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminIslandGuides() {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<(IslandGuideFormData & { id?: number }) | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Fetch all island guides
  const { data: guides = [], isLoading, refetch } = trpc.islandGuides.listAdmin.useQuery();
  const updateDisplayOrderMutation = trpc.islandGuides.updateDisplayOrder.useMutation();
  const createMutation = trpc.islandGuides.create.useMutation();
  const updateMutation = trpc.islandGuides.update.useMutation();

  // Get featured guides sorted by display order
  const featuredGuides = useMemo(() => {
    return guides
      .filter((guide: any) => guide.featured === 1)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }, [guides]);

  // Filter guides based on search term
  const filteredGuides = useMemo(() => {
    return guides.filter((guide: any) =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guides, searchTerm]);

  const handleDragStart = (e: React.DragEvent, guideId: number) => {
    setDraggedItem(guideId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetGuideId: number) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetGuideId) return;

    const draggedIndex = featuredGuides.findIndex((g: any) => g.id === draggedItem);
    const targetIndex = featuredGuides.findIndex((g: any) => g.id === targetGuideId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...featuredGuides];
    const [draggedGuide] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedGuide);

    const updates = newOrder.map((guide: any, index: number) => ({
      id: guide.id,
      displayOrder: index,
    }));

    setIsSavingOrder(true);
    try {
      await updateDisplayOrderMutation.mutateAsync({ updates });
      await refetch();
    } catch (error) {
      console.error('Error updating display order:', error);
    } finally {
      setIsSavingOrder(false);
      setDraggedItem(null);
    }
  };

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
    setSelectedGuide(undefined);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (guide: IslandGuideItem) => {
    setSelectedGuide(guide as any);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedGuide(undefined);
  };

  const handleSave = async (formData: IslandGuideFormData) => {
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        quickFacts: JSON.stringify(formData.quickFacts || []),
        topThingsToDo: JSON.stringify(formData.topThingsToDo || []),
        foodCafes: formData.foodCafes || '',
        practicalInfo: formData.practicalInfo || '',
        faqs: JSON.stringify(formData.faqs || []),
      };

      if (isCreating) {
        await createMutation.mutateAsync(dataToSave as any);
      } else if (isEditing && (selectedGuide as any)?.id) {
        await updateMutation.mutateAsync({
          id: (selectedGuide as any).id,
          ...dataToSave,
        } as any);
      }
      
      await refetch();
      handleCancel();
    } catch (error) {
      console.error('Error saving island guide:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this island guide?')) {
      try {
        await refetch();
      } catch (error) {
        console.error('Error deleting guide:', error);
      }
    }
  };

  const handleTogglePublish = async (guide: IslandGuideItem) => {
    try {
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
          initialData={selectedGuide} 
          onSubmit={handleSave}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Featured Destinations Reordering Section */}
      {featuredGuides.length > 0 && (
        <div className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <CardTitle>Featured Destinations Order</CardTitle>
                  <CardDescription>Drag and drop to reorder featured destinations on the homepage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {featuredGuides.map((guide: any) => (
                  <div
                    key={guide.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, guide.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, guide.id)}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-move transition-all ${
                      draggedItem === guide.id
                        ? 'opacity-50 bg-gray-100'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">{guide.name}</p>
                      <p className="text-sm text-gray-600">{guide.atoll || 'Maldives'}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded">
                      #{guide.displayOrder + 1}
                    </span>
                  </div>
                ))}
              </div>
              {isSavingOrder && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving order...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Island Guides Management Section */}
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
          {filteredGuides.map((guide: any) => (
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
                    {guide.featured === 1 && (
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
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
