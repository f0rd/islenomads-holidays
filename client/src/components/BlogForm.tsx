import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, AlertCircle } from 'lucide-react';
import SEOEditor from './SEOEditor';

export interface BlogPostFormData {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  focusKeyword: string;
  canonicalUrl: string;
  robotsIndex: string;
  robotsFollow: string;
}

interface BlogFormProps {
  initialData?: BlogPostFormData;
  onSave: (data: BlogPostFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BlogForm({ initialData, onSave, onCancel, isLoading = false }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogPostFormData>(
    initialData || {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      author: '',
      category: '',
      tags: '',
      published: false,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      focusKeyword: '',
      canonicalUrl: '',
      robotsIndex: 'index',
      robotsFollow: 'follow',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    content: true,
    seo: false,
  });

  const handleChange = (field: keyof BlogPostFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (value: string) => {
    handleChange('title', value);
    if (!initialData?.id) {
      handleChange('slug', generateSlug(value));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Title</CardTitle>
              <CardDescription>Enter the title of your blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Top 10 Diving Spots in Maldives"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.title ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Slug *</label>
                <input
                  type="text"
                  placeholder="e.g., top-10-diving-spots"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.slug ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.slug}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Author *</label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.author ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.author && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.author}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Travel Tips"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.featuredImage}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="e.g., diving, maldives, travel (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="published" className="text-sm font-medium cursor-pointer">
                  Publish this post
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
              <CardDescription>Brief summary of the blog post (max 500 characters)</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Write a 100-200 word excerpt of your blog post..."
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                maxLength={500}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm ${
                  errors.excerpt ? 'border-red-500' : 'border-border'
                }`}
              />
              <div className="text-sm text-muted-foreground mt-2">
                {formData.excerpt.length}/500 characters
              </div>
              {errors.excerpt && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.excerpt}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
              <CardDescription>Write your blog post content (Markdown supported)</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Write your blog post content here..."
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={12}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm ${
                  errors.content ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.content}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SEOEditor
            title={formData.title}
            content={formData.content}
            initialData={{
              metaTitle: formData.metaTitle,
              metaDescription: formData.metaDescription,
              focusKeyword: formData.focusKeyword,
              slug: formData.slug,
            }}
            onSEOChange={(seoData: any) => {
              setFormData((prev) => ({ ...prev, ...seoData }));
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Blog Post'}
        </Button>
      </div>
    </form>
  );
}
