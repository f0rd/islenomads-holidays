/**
 * Admin Ferry Routes Management Page
 * Allows staff to manage ferry routes with full CRUD operations
 */

import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import FerryRoutesAdmin from '@/components/FerryRoutesAdmin';
import AdminNavigation from '@/components/AdminNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Ship } from 'lucide-react';

export default function AdminFerryRoutes() {
  const { user, loading, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Check authentication and admin role
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be logged in to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/70">Please log in as a staff member to manage ferry routes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Insufficient Permissions
            </CardTitle>
            <CardDescription>Admin access required</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/70">
              You don't have permission to access this page. Only administrators can manage ferry routes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <AdminNavigation currentPage="Ferry Routes" />

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <Ship className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">Ferry Routes Management</h1>
          </div>
          <p className="text-foreground/70">Manage all ferry and speedboat routes in the system</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Ferry Routes</CardTitle>
            <CardDescription>
              Create, edit, and delete ferry routes. All changes are immediately reflected on the public website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FerryRoutesAdmin />
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-base">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70 space-y-2">
            <p>• Use the search bar to quickly find routes by name, location, or boat type</p>
            <p>• Click on any route row to edit its details</p>
            <p>• Toggle the "Published" status to show/hide routes from the public website</p>
            <p>• Use the export button to download route data as CSV</p>
            <p>• Delete routes by clicking the trash icon (this action cannot be undone)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
