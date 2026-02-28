import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BlogForm, BlogPostFormData } from '@/components/BlogForm';
import { Edit2, Trash2, Eye, EyeOff, Plus, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  published: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  featuredImage: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  focusKeyword: string;
  canonicalUrl: string;
  robotsIndex: string;
  robotsFollow: string;
}

export default function AdminBlog() {
  const { user, loading: authLoading } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch blog posts
  const { data: posts, isLoading: postsLoading, refetch } = trpc.blog.listAdmin.useQuery(undefined, {
    enabled: !!user,
  });

  // Create blog post mutation
  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreating(false);
      setSelectedPost(null);
    },
  });

  // Update blog post mutation
  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedPost(null);
    },
  });

  // Delete blog post mutation
  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Toggle publish mutation (using update with published field)
  const togglePublishMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (posts) {
      setBlogPosts(posts as BlogPost[]);
    }
  }, [posts]);

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Please log in</div>;
  }

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (data: BlogPostFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        published: data.published ? 1 : 0,
      };
      if (data.id) {
        await updateMutation.mutateAsync({
          id: data.id,
          ...payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteMutation.mutateAsync({ id });
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const handleTogglePublish = async (id: number, currentPublished: number) => {
    try {
      const post = blogPosts.find(p => p.id === id);
      if (post) {
        await togglePublishMutation.mutateAsync({
          id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          author: post.author,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          category: post.category,
          tags: post.tags,
          published: currentPublished ? 0 : 1,
        });
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  // Show form when creating or editing
  if (isCreating || selectedPost) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setIsCreating(false);
              setSelectedPost(null);
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>

          <Card>
            <CardHeader>
              <CardTitle>{selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
              <CardDescription>
                {selectedPost
                  ? 'Update the blog post details below'
                  : 'Fill in the details to create a new blog post'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlogForm
                initialData={selectedPost ? {
                  id: selectedPost.id,
                  title: selectedPost.title,
                  slug: selectedPost.slug,
                  content: selectedPost.content,
                  excerpt: selectedPost.excerpt,
                  featuredImage: selectedPost.featuredImage,
                  author: selectedPost.author,
                  category: selectedPost.category,
                  tags: selectedPost.tags,
                  published: Boolean(selectedPost.published),
                  metaTitle: selectedPost.metaTitle,
                  metaDescription: selectedPost.metaDescription,
                  metaKeywords: selectedPost.metaKeywords,
                  focusKeyword: selectedPost.focusKeyword,
                  canonicalUrl: selectedPost.canonicalUrl,
                  robotsIndex: selectedPost.robotsIndex,
                  robotsFollow: selectedPost.robotsFollow,
                } : undefined}
                onSave={handleSave}
                onCancel={() => {
                  setIsCreating(false);
                  setSelectedPost(null);
                }}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show list view
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <a
          href="/admin/dashboard"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </a>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Posts Management</h1>
            <p className="text-muted-foreground mt-2">Manage and create blog posts for your website</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Post
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Input
              placeholder="Search posts by title, slug, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {postsLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading blog posts...</p>
              </CardContent>
            </Card>
          ) : filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  {blogPosts.length === 0
                    ? 'No blog posts yet. Create your first post!'
                    : 'No posts match your search.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground truncate">{post.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        Slug: <span className="font-mono text-foreground">{post.slug}</span>
                      </p>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Author: {post.author}</span>
                        {post.category && <span>Category: {post.category}</span>}
                        <span>Views: {post.viewCount}</span>
                        <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className="p-2 hover:bg-accent rounded-md transition-colors"
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-2 hover:bg-accent rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>

                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 hover:bg-red-100 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {blogPosts.length > 0 && (
          <Card className="mt-6 bg-muted">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold text-foreground">{blogPosts.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {blogPosts.filter((p) => p.published).length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {blogPosts.filter((p) => !p.published).length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">
                    {blogPosts.reduce((sum, p) => sum + p.viewCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
