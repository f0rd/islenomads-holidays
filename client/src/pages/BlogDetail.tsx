import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, User, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Streamdown } from "streamdown";
import { useSeoMeta, addStructuredData } from "@/_core/hooks/useSeoMeta";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug as string;

  const { data: post, isLoading: postLoading } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const { data: comments } = trpc.blog.comments.list.useQuery(
    { postId: post?.id || 0 },
    { enabled: !!post?.id }
  );

  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
  });

  const addCommentMutation = trpc.blog.comments.create.useMutation();

  // Set SEO meta tags when post loads
  useEffect(() => {
    if (post) {
      useSeoMeta({
        title: `${post.title} | Isle Nomads Blog`,
        description: post.excerpt || post.content?.substring(0, 160) || 'Read our latest travel blog posts about Maldives vacations and island experiences.',
        keywords: post.category ? `Maldives, ${post.category}, travel, blog` : 'Maldives, travel, blog',
        ogTitle: post.title,
        ogDescription: post.excerpt || post.content?.substring(0, 160),
        ogImage: post.featuredImage || undefined,
        canonicalUrl: post.slug ? `https://islenomads.com/blog/${post.slug}` : undefined,
      });

      // Add BlogPosting schema
      addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || post.content?.substring(0, 160),
        image: post.featuredImage,
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
          '@type': 'Person',
          name: post.author || 'Isle Nomads',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Isle Nomads',
          logo: {
            '@type': 'ImageObject',
            url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/hTCJLfNBtwQlXnTa.svg',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://islenomads.com/blog/${post.slug}`,
        },
      }, 'blog-schema');
    }
  }, [post]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      await addCommentMutation.mutateAsync({
        postId: post.id,
        ...commentForm,
      });
      setCommentForm({ name: "", email: "", content: "" });
      alert("Comment submitted! It will appear after moderation.");
    } catch (error) {
      alert("Failed to submit comment. Please try again.");
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Blog post not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      {post.featuredImage && (
        <section className="relative h-96 bg-muted overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/40" />
        </section>
      )}

      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="container max-w-3xl mx-auto px-4">
          <article>
            {/* Header */}
            <div className="mb-8">
              {post.category && (
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{post.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm md:prose-base max-w-none mb-12">
              <Streamdown>{post.content}</Streamdown>
            </div>

            {/* Tags */}
            {post.tags && (
              <div className="mb-12 pb-12 border-b">
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Comments ({comments?.length || 0})
              </h2>

              {/* Comments List */}
              {comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-foreground">{comment.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground">{comment.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              )}

              {/* Comment Form */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Leave a Comment</h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={commentForm.name}
                        onChange={(e) =>
                          setCommentForm({ ...commentForm, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={commentForm.email}
                        onChange={(e) =>
                          setCommentForm({ ...commentForm, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Comment
                      </label>
                      <textarea
                        required
                        value={commentForm.content}
                        onChange={(e) =>
                          setCommentForm({ ...commentForm, content: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent min-h-24"
                        placeholder="Share your thoughts..."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={addCommentMutation.isPending}
                      className="w-full"
                    >
                      {addCommentMutation.isPending ? "Submitting..." : "Submit Comment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
