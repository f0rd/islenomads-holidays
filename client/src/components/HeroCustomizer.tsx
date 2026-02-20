import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, X } from 'lucide-react';

interface HeroCustomizerProps {
  pageSlug: string;
  onClose?: () => void;
}

const TAILWIND_COLORS = [
  'primary', 'secondary', 'accent', 'destructive', 'muted',
  'primary-foreground', 'secondary-foreground', 'accent-foreground',
];

const TAILWIND_HEIGHTS = [
  'min-h-64', 'min-h-80', 'min-h-96', 'min-h-screen',
];

export default function HeroCustomizer({ pageSlug, onClose }: HeroCustomizerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImageUrl: '',
    overlayOpacity: 70,
    gradientColorStart: 'primary',
    gradientColorEnd: 'primary',
    gradientOpacityStart: 85,
    gradientOpacityEnd: 70,
    textColor: 'primary-foreground',
    subtitleColor: 'primary-foreground',
    minHeight: 'min-h-96',
    published: 1,
  });

  // Fetch existing hero settings
  const { data: heroSettings, isLoading } = trpc.heroSettings.getByPageSlug.useQuery(
    { pageSlug },
    {
      onSuccess: (data) => {
        if (data) {
          setFormData({
            heroTitle: data.heroTitle || '',
            heroSubtitle: data.heroSubtitle || '',
            heroImageUrl: data.heroImageUrl || '',
            overlayOpacity: data.overlayOpacity || 70,
            gradientColorStart: data.gradientColorStart || 'primary',
            gradientColorEnd: data.gradientColorEnd || 'primary',
            gradientOpacityStart: data.gradientOpacityStart || 85,
            gradientOpacityEnd: data.gradientOpacityEnd || 70,
            textColor: data.textColor || 'primary-foreground',
            subtitleColor: data.subtitleColor || 'primary-foreground',
            minHeight: data.minHeight || 'min-h-96',
            published: data.published || 1,
          });
        }
      },
    }
  );

  const updateMutation = trpc.heroSettings.update.useMutation();
  const createMutation = trpc.heroSettings.create.useMutation();

  const handleSave = async () => {
    try {
      if (heroSettings?.id) {
        await updateMutation.mutateAsync({
          pageSlug,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync({
          pageSlug,
          ...formData,
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving hero settings:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hero Section Customizer</CardTitle>
            <CardDescription>Customize the hero section for {pageSlug}</CardDescription>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                placeholder="Enter hero title"
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="Enter hero subtitle"
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="heroImageUrl">Hero Image URL</Label>
              <Input
                id="heroImageUrl"
                value={formData.heroImageUrl}
                onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                disabled={!isEditing}
              />
            </div>
          </TabsContent>

          {/* Styling Tab */}
          <TabsContent value="styling" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="overlayOpacity">Overlay Opacity: {formData.overlayOpacity}%</Label>
                <input
                  id="overlayOpacity"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.overlayOpacity}
                  onChange={(e) => setFormData({ ...formData, overlayOpacity: parseInt(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="minHeight">Minimum Height</Label>
                <select
                  id="minHeight"
                  value={formData.minHeight}
                  onChange={(e) => setFormData({ ...formData, minHeight: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  {TAILWIND_HEIGHTS.map((height) => (
                    <option key={height} value={height}>
                      {height}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Gradient Colors</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gradientColorStart">Start Color</Label>
                  <select
                    id="gradientColorStart"
                    value={formData.gradientColorStart}
                    onChange={(e) => setFormData({ ...formData, gradientColorStart: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {TAILWIND_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="gradientColorEnd">End Color</Label>
                  <select
                    id="gradientColorEnd"
                    value={formData.gradientColorEnd}
                    onChange={(e) => setFormData({ ...formData, gradientColorEnd: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {TAILWIND_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="gradientOpacityStart">Start Opacity: {formData.gradientOpacityStart}%</Label>
                  <input
                    id="gradientOpacityStart"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.gradientOpacityStart}
                    onChange={(e) => setFormData({ ...formData, gradientOpacityStart: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="gradientOpacityEnd">End Opacity: {formData.gradientOpacityEnd}%</Label>
                  <input
                    id="gradientOpacityEnd"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.gradientOpacityEnd}
                    onChange={(e) => setFormData({ ...formData, gradientOpacityEnd: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Text Colors</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="textColor">Title Text Color</Label>
                  <select
                    id="textColor"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {TAILWIND_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="subtitleColor">Subtitle Text Color</Label>
                  <select
                    id="subtitleColor"
                    value={formData.subtitleColor}
                    onChange={(e) => setFormData({ ...formData, subtitleColor: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {TAILWIND_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <div
              className={`relative ${formData.minHeight} bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center`}
              style={{
                backgroundImage: `url('${formData.heroImageUrl}')`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, rgba(var(--${formData.gradientColorStart}), ${formData.gradientOpacityStart / 100}), rgba(var(--${formData.gradientColorEnd}), ${formData.gradientOpacityEnd / 100}))`,
                  opacity: formData.overlayOpacity / 100,
                }}
              />
              <div className="container relative z-10 text-center">
                <h1 className={`text-5xl md:text-6xl font-bold text-${formData.textColor} mb-4`}>
                  {formData.heroTitle || 'Hero Title'}
                </h1>
                <p className={`text-lg md:text-xl text-${formData.subtitleColor}`}>
                  {formData.heroSubtitle || 'Hero Subtitle'}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-6">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="default">
              Edit Settings
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending || createMutation.isPending}
                className="gap-2"
              >
                {updateMutation.isPending || createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
