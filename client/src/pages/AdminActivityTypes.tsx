import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Search, ArrowLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { AdminPageLayout } from '@/components/AdminPageLayout';

export default function AdminActivityTypes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingType, setEditingType] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
  });

  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Fetch activity types
  const { data: types = [], isLoading, refetch } = trpc.activityTypes.list.useQuery();

  // Filter types
  const filteredTypes = types.filter((type: any) => {
    const matchesSearch = 
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.key.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingType(null);
    setFormData({ key: '', name: '', description: '' });
  };

  const handleEdit = (type: any) => {
    setEditingType(type);
    setFormData({
      key: type.key,
      name: type.name,
      description: type.description || '',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    // Activity types are typically read-only metadata
    // This is a placeholder for future edit functionality
    console.log('Activity type management would be implemented here');
    handleFormClose();
  };

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/dashboard')}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Types</h1>
              <p className="text-sm text-muted-foreground">Manage activity categories and types</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Types List</CardTitle>
            <CardDescription>View all available activity types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or key..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Activity Types Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Key</th>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">
                        Loading activity types...
                      </td>
                    </tr>
                  ) : filteredTypes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">
                        No activity types found
                      </td>
                    </tr>
                  ) : (
                    filteredTypes.map((type: any, index: number) => (
                      <tr key={`${type.id}-${index}`} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Badge variant="outline">{type.key}</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">{type.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {type.description || '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(type)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Activity types are system metadata and typically managed by administrators. 
                Current types include: Diving, Snorkeling, Surfing, and other water sports activities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
}
