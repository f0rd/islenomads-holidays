import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Search, ArrowLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import ActivitySpotForm from '@/components/ActivitySpotForm';
import { AdminPageLayout } from '@/components/AdminPageLayout';

export default function AdminActivitySpots() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'dive' | 'surf' | 'snorkeling'>('all');
  const [editingSpot, setEditingSpot] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch activity spots
  const { data: spots = [], isLoading, refetch } = trpc.activitySpots.list.useQuery();
  
  // Fetch island guides for linking
  const { data: islands = [] } = trpc.islandGuides.list.useQuery();

  // Delete mutation
  const deleteSpotMutation = trpc.activitySpots.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Filter spots
  const filteredSpots = spots.filter((spot: any) => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || spot.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this activity spot?')) {
      deleteSpotMutation.mutate({ id });
    }
  };

  const handleEdit = (spot: any) => {
    setEditingSpot(spot);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSpot(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refetch();
  };

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'dive':
        return 'bg-blue-100 text-blue-800';
      case 'surf':
        return 'bg-orange-100 text-orange-800';
      case 'snorkeling':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get island name by ID
  const getIslandName = (islandGuideId: number | null) => {
    if (!islandGuideId) return 'Unassigned';
    const island = islands.find((i: any) => i.id === islandGuideId);
    return island?.name || 'Unknown';
  };

  const headerAction = (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Activity Spot
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSpot ? 'Edit Activity Spot' : 'Create New Activity Spot'}
          </DialogTitle>
          <DialogDescription>
            {editingSpot
              ? 'Update the activity spot details and island association'
              : 'Add a new dive site, surf spot, or snorkeling location'}
          </DialogDescription>
        </DialogHeader>
        <ActivitySpotForm
          initialData={editingSpot}
          islands={islands}
          onSuccess={handleFormSuccess}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminPageLayout
      title="Activity Spots Management"
      description="Manage dive sites, surf spots, and snorkeling locations"
      headerAction={headerAction}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Activity Spots", href: "/admin/activity-spots" },
      ]}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <a
          href="/admin/dashboard"
          className="flex items-center gap-2 text-primary hover:text-primary/80 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </a>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{spots.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Dive Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{spots.filter((s: any) => s.type === 'dive').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Surf Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{spots.filter((s: any) => s.type === 'surf').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Snorkeling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{spots.filter((s: any) => s.type === 'snorkeling').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search spots by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="dive">Dive Sites</SelectItem>
                    <SelectItem value="surf">Surf Spots</SelectItem>
                    <SelectItem value="snorkeling">Snorkeling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Spots List */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Spots ({filteredSpots.length})</CardTitle>
            <CardDescription>
              {filterType !== 'all' && `Showing ${filterType} spots`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredSpots.length > 0 ? (
              <div className="space-y-3">
                {filteredSpots.map((spot: any) => (
                  <div
                    key={spot.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                        <Badge className={getTypeBadgeColor(spot.type)}>
                          {spot.type}
                        </Badge>
                        {spot.difficulty && (
                          <Badge className={getDifficultyColor(spot.difficulty)}>
                            {spot.difficulty}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Island: <strong>{getIslandName(spot.islandGuideId)}</strong></span>
                        {spot.depth && <span>Depth: <strong>{spot.depth}</strong></span>}
                        {spot.rating && <span>Rating: <strong>{spot.rating}★</strong></span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(spot)}
                        className="gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(spot.id)}
                        className="gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No activity spots found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
}
