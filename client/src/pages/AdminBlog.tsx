import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Publish immediately</span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingId ? "Update Post" : "Create Post"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
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
            <h2 className="text-xl font-bold text-foreground">All Posts</h2>
            {posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <span className="inline-block px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                              {post.category || "Uncategorized"}
                            </span>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                post.published
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No blog posts yet. Create your first post!</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
