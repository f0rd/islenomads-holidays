import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Trash2, GripVertical, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';


interface HeroGalleryManagerProps {
  pageSlug: string;
}

export default function HeroGalleryManager({ pageSlug }: HeroGalleryManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');

  // Fetch gallery images
  const { data: galleryImages = [], refetch } = trpc.heroSettings.getByPageSlug.useQuery(
    { pageSlug },
    { enabled: !!pageSlug }
  );

  // Note: delete mutation needs to be added to router
  // const deleteMutation = trpc.heroSettings.delete.useMutation({
  //   onSuccess: () => refetch(),
  // });
  
  const deleteMutation = {
    mutateAsync: async (data: any) => {
      // TODO: Implement delete mutation
      refetch();
    },
    isPending: false,
  };

  const handleAddImage = async () => {
    if (!imageUrl.trim()) return;

    setIsUploading(true);
    try {
      // TODO: Implement add image mutation via tRPC
      // For now, just clear the form
      setImageUrl('');
      setImageTitle('');
      setImageDescription('');
      await refetch();
    } catch (error) {
      console.error('Error adding image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteMutation.mutateAsync({ id });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextImage = () => {
    const images = galleryImages as any[];
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = galleryImages as any[];
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Auto-play carousel
  const useEffect = require('react').useEffect;
  useEffect(() => {
    const images = galleryImages as any[];
    if (!isAutoPlay || !images || images.length === 0) return;
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, galleryImages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Image Gallery</CardTitle>
        <CardDescription>Manage multiple hero images for {pageSlug}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Carousel Preview */}
        {(galleryImages as any[])?.length > 0 && (
          <div className="border rounded-lg overflow-hidden bg-muted">
            <div className="relative aspect-video flex items-center justify-center group">
              {(galleryImages as any[])?.[currentImageIndex]?.heroImageUrl && (
                <img
                  src={(galleryImages as any[])?.[currentImageIndex]?.heroImageUrl}
                  alt="Gallery preview"
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
              >
                {isAutoPlay ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>

              {/* Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {(galleryImages as any[])?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50 w-2 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Upload Section */}
        <div className="border-b pb-6">
          <h4 className="font-semibold mb-4">Add New Image</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="imageTitle">Image Title (Optional)</Label>
              <Input
                id="imageTitle"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                placeholder="e.g., Summer Paradise"
              />
            </div>

            <div>
              <Label htmlFor="imageDescription">Description (Optional)</Label>
              <Input
                id="imageDescription"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Brief description of the image"
              />
            </div>

            <Button
              onClick={handleAddImage}
              disabled={isUploading || !imageUrl.trim()}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Add Image
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div>
          <h4 className="font-semibold mb-4">Gallery Images ({(galleryImages as any[])?.length || 0})</h4>
          {(galleryImages as any[])?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(galleryImages as any[])?.map((image: any, index: number) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <div className="relative bg-muted aspect-video flex items-center justify-center">
                    {image.heroImageUrl && (
                      <img
                        src={image.heroImageUrl}
                        alt={image.heroTitle || `Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {image.heroTitle && (
                      <p className="font-semibold text-sm">{image.heroTitle}</p>
                    )}
                    {image.heroSubtitle && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {image.heroSubtitle}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled={true}
                      >
                        <GripVertical className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No images in gallery yet. Add one above to get started!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
