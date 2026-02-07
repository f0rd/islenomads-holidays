import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOEditor from "@/components/SEOEditor";

export default function AdminBlog() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    author: user?.name || "",
    category: "",
    tags: "",
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

  const { data: posts, refetch } = trpc.blog.list.useQuery({ limit: 100 });
  const createMutation = trpc.blog.create.useMutation();
  const updateMutation = trpc.blog.update.useMutation();
  const deleteMutation = trpc.blog.delete.useMutation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        alert("Blog post updated successfully!");
      } else {
        await createMutation.mutateAsync(formData);
        alert("Blog post created successfully!");
      }

      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        author: user?.name || "",
        category: "",
        tags: "",
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
      setShowForm(false);
      refetch();
    } catch (error) {
      alert("Error saving blog post. Please try again.");
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      featuredImage: post.featuredImage || "",
      author: post.author,
      category: post.category || "",
      tags: post.tags || "",
      published: post.published,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      focusKeyword: post.focusKeyword || "",
      ogTitle: post.ogTitle || "",
      ogDescription: post.ogDescription || "",
      ogImage: post.ogImage || "",
    });
    setSeoData({
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      focusKeyword: post.focusKeyword || "",
      ogTitle: post.ogTitle || "",
      ogDescription: post.ogDescription || "",
      ogImage: post.ogImage || "",
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        alert("Blog post deleted successfully!");
        refetch();
      } catch (error) {
        alert("Error deleting blog post. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  slug: "",
                  content: "",
                  excerpt: "",
                  featuredImage: "",
                  author: user?.name || "",
                  category: "",
                  tags: "",
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
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Blog post title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Slug *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="blog-post-slug"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Content *</label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent min-h-48"
                      placeholder="Blog post content (supports markdown)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                    <input
                      type="text"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Brief summary of the post"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="e.g., Travel Tips, Destination Guide"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tags</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                    <input
                      type="text"
                      value={formData.featuredImage}
                      onChange={(e) =>
                        setFormData({ ...formData, featuredImage: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* SEO Editor Section */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">SEO Optimization</h3>
                    <SEOEditor
                      title={formData.title}
                      content={formData.content}
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

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.published === 1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            published: e.target.checked ? 1 : 0,
                          })
                        }
                      />
                      <span className="text-sm font-medium">Published</span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-accent text-primary hover:bg-accent/90">
                      {editingId ? "Update Post" : "Create Post"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>By {post.author}</span>
                          {post.category && <span>Category: {post.category}</span>}
                          <span>{post.published === 1 ? "Published" : "Draft"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(post)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No blog posts yet. Create your first post!
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
