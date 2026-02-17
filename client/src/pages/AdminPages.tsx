/**
 * Admin Pages - CMS Page Management
 * Manage About, Contact, and other static pages
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Edit2, Eye, Save, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface CMSPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  updatedAt: string;
}

const PAGES: CMSPage[] = [
  {
    id: 1,
    slug: "about",
    title: "About Us",
    content: "About page content...",
    published: true,
    updatedAt: "2026-02-17",
  },
  {
    id: 2,
    slug: "contact",
    title: "Contact Us",
    content: "Contact page content...",
    published: true,
    updatedAt: "2026-02-17",
  },
];

export default function AdminPages() {
  const { user } = useAuth();
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEdit = (page: CMSPage) => {
    setSelectedPage(page);
    setEditContent(page.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedPage) {
      // Here you would call an API to save the changes
      console.log("Saving page:", selectedPage.slug, editContent);
      setIsEditing(false);
      setSelectedPage(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Pages Management</h1>
          <p className="text-muted-foreground">Edit and publish your website pages</p>
        </div>

        {!isEditing ? (
          <div className="grid gap-6">
            {PAGES.map((page) => (
              <Card key={page.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{page.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Slug: /{page.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      page.published
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {page.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Last Updated</p>
                      <p className="text-foreground">{page.updatedAt}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleEdit(page)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(`/${page.slug}`, "_blank")}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>Edit: {selectedPage?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Page Content
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-96 p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
                  placeholder="Enter page content..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-accent text-primary hover:bg-accent/90"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
