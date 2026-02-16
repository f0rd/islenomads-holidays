import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2, Star, Link2, Unlink2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminPageLayout } from "@/components/AdminPageLayout";
import { AttractionIslandLinksManager } from "@/components/AttractionIslandLinksManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AttractionGuideItem {
  id: number;
  name: string;
  slug: string;
  attractionType: string;
  overview: string | null;
  published: number;
  featured: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AttractionGuideFormData {
  name: string;
  slug: string;
  attractionType: string;
  overview: string;
  difficulty?: string;
  bestSeason?: string;
  depthRange?: string;
  waveHeight?: string;
  marineLife?: string;
  facilities?: string;
  safetyTips?: string;
  localRules?: string;
  accessInfo?: string;
  typicalCost?: string;
  heroImage?: string;
  nearestIsland?: string;
  distanceFromIsland?: string;
  published: number;
  featured: number;
}

const ATTRACTION_TYPES = [
  { value: "dive_site", label: "Dive Site" },
  { value: "snorkeling_spot", label: "Snorkeling Spot" },
  { value: "surf_spot", label: "Surf Spot" },
  { value: "poi", label: "Point of Interest" },
];

export default function AdminAttractionGuides() {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<(AttractionGuideFormData & { id?: number }) | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all attraction guides
  const { data: guides = [], isLoading, refetch } = trpc.attractionGuides.listAdmin.useQuery();
  const createMutation = trpc.attractionGuides.create.useMutation();
  const updateMutation = trpc.attractionGuides.update.useMutation();
  const deleteMutation = trpc.attractionGuides.delete.useMutation();
  const togglePublishMutation = trpc.attractionGuides.togglePublish.useMutation();
  const toggleFeatureMutation = trpc.attractionGuides.toggleFeature.useMutation();

  // Filter guides based on search term
  const filteredGuides = useMemo(() => {
    return guides.filter((guide: any) =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.attractionType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guides, searchTerm]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <AdminPageLayout title="Access Denied">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive font-semibold">
              Only administrators can access this page.
            </p>
          </CardContent>
        </Card>
      </AdminPageLayout>
    );
  }

  const handleCreate = () => {
    setSelectedGuide({
      name: "",
      slug: "",
      attractionType: "dive_site",
      overview: "",
      difficulty: "",
      bestSeason: "",
      depthRange: "",
      waveHeight: "",
      marineLife: "",
      facilities: "",
      safetyTips: "",
      localRules: "",
      accessInfo: "",
      typicalCost: "",
      heroImage: "",
      nearestIsland: "",
      distanceFromIsland: "",
      published: 1,
      featured: 0,
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (guide: any) => {
    setSelectedGuide({
      ...guide,
      marineLife: typeof guide.marineLife === "string" ? guide.marineLife : JSON.stringify(guide.marineLife || []),
      facilities: typeof guide.facilities === "string" ? guide.facilities : JSON.stringify(guide.facilities || []),
      safetyTips: typeof guide.safetyTips === "string" ? guide.safetyTips : JSON.stringify(guide.safetyTips || []),
      localRules: typeof guide.localRules === "string" ? guide.localRules : JSON.stringify(guide.localRules || []),
    });
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedGuide) return;

    setIsSubmitting(true);
    try {
      if (selectedGuide.id) {
        // Update
        await updateMutation.mutateAsync({
          id: selectedGuide.id,
          name: selectedGuide.name,
          slug: selectedGuide.slug,
          attractionType: selectedGuide.attractionType as 'dive_site' | 'surf_spot' | 'snorkeling_spot' | 'poi',
          overview: selectedGuide.overview,
          difficulty: selectedGuide.difficulty,
          bestSeason: selectedGuide.bestSeason,
          depthRange: selectedGuide.depthRange,
          waveHeight: selectedGuide.waveHeight,
          marineLife: selectedGuide.marineLife,
          facilities: selectedGuide.facilities,
          safetyTips: selectedGuide.safetyTips,
          localRules: selectedGuide.localRules,
          accessInfo: selectedGuide.accessInfo,
          typicalCost: selectedGuide.typicalCost,
          heroImage: selectedGuide.heroImage,
          nearestIsland: selectedGuide.nearestIsland,
          distanceFromIsland: selectedGuide.distanceFromIsland,
          published: selectedGuide.published,
          featured: selectedGuide.featured,
        });
      } else {
        // Create
        await createMutation.mutateAsync({
          name: selectedGuide.name,
          slug: selectedGuide.slug,
          attractionType: selectedGuide.attractionType as 'dive_site' | 'surf_spot' | 'snorkeling_spot' | 'poi',
          overview: selectedGuide.overview,
          difficulty: selectedGuide.difficulty,
          bestSeason: selectedGuide.bestSeason,
          depthRange: selectedGuide.depthRange,
          waveHeight: selectedGuide.waveHeight,
          marineLife: selectedGuide.marineLife,
          facilities: selectedGuide.facilities,
          safetyTips: selectedGuide.safetyTips,
          localRules: selectedGuide.localRules,
          accessInfo: selectedGuide.accessInfo,
          typicalCost: selectedGuide.typicalCost,
          heroImage: selectedGuide.heroImage,
          nearestIsland: selectedGuide.nearestIsland,
          distanceFromIsland: selectedGuide.distanceFromIsland,
          published: selectedGuide.published,
          featured: selectedGuide.featured,
        });
      }
      await refetch();
      setSelectedGuide(undefined);
      setIsCreating(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving guide:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this attraction guide?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        await refetch();
      } catch (error) {
        console.error("Error deleting guide:", error);
      }
    }
  };

  const handleTogglePublish = async (guide: any) => {
    try {
      await togglePublishMutation.mutateAsync({
        id: guide.id,
        published: guide.published === 1 ? 0 : 1,
      });
      await refetch();
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const handleToggleFeature = async (guide: any) => {
    try {
      await toggleFeatureMutation.mutateAsync({
        id: guide.id,
        featured: guide.featured === 1 ? 0 : 1,
      });
      await refetch();
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  };

  return (
    <AdminPageLayout
      title="Attraction Guides"
      description="Manage dive sites, snorkeling spots, surf spots, and points of interest"
      headerAction={
        <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
          if (!open) {
            setSelectedGuide(undefined);
            setIsCreating(false);
            setIsEditing(false);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              New Attraction
            </Button>
          </DialogTrigger>
          {(isCreating || isEditing) && selectedGuide && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isCreating ? "Create New Attraction" : "Edit Attraction"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={selectedGuide.name}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, name: e.target.value })
                      }
                      placeholder="e.g., Banana Reef"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={selectedGuide.slug}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, slug: e.target.value })
                      }
                      placeholder="e.g., banana-reef"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={selectedGuide.attractionType}
                      onValueChange={(value: any) =>
                        setSelectedGuide({ ...selectedGuide, attractionType: value })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ATTRACTION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Input
                      id="difficulty"
                      value={selectedGuide.difficulty || ""}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, difficulty: e.target.value })
                      }
                      placeholder="e.g., beginner, intermediate, advanced"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="overview">Overview *</Label>
                  <Textarea
                    id="overview"
                    value={selectedGuide.overview}
                    onChange={(e) =>
                      setSelectedGuide({ ...selectedGuide, overview: e.target.value })
                    }
                    placeholder="Detailed description of the attraction"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bestSeason">Best Season</Label>
                    <Input
                      id="bestSeason"
                      value={selectedGuide.bestSeason || ""}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, bestSeason: e.target.value })
                      }
                      placeholder="e.g., November to April"
                    />
                  </div>
                  <div>
                    <Label htmlFor="depthRange">Depth Range</Label>
                    <Input
                      id="depthRange"
                      value={selectedGuide.depthRange || ""}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, depthRange: e.target.value })
                      }
                      placeholder="e.g., 5-25 meters"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nearestIsland">Nearest Island</Label>
                    <Input
                      id="nearestIsland"
                      value={selectedGuide.nearestIsland || ""}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, nearestIsland: e.target.value })
                      }
                      placeholder="e.g., North Male Atoll"
                    />
                  </div>
                  <div>
                    <Label htmlFor="distance">Distance</Label>
                    <Input
                      id="distance"
                      value={selectedGuide.distanceFromIsland || ""}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, distanceFromIsland: e.target.value })
                      }
                      placeholder="e.g., ~8 km"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="typicalCost">Typical Cost</Label>
                    <Input
                      id="typicalCost"
                      value={selectedGuide.typicalCost || ""}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, typicalCost: e.target.value })
                      }
                      placeholder="e.g., $40-70 per person"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroImage">Hero Image URL</Label>
                    <Input
                      id="heroImage"
                      value={selectedGuide.heroImage || ""}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, heroImage: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accessInfo">Access Information</Label>
                  <Textarea
                    id="accessInfo"
                    value={selectedGuide.accessInfo || ""}
                    onChange={(e) =>
                      setSelectedGuide({ ...selectedGuide, accessInfo: e.target.value })
                    }
                    placeholder="How to get there"
                    rows={2}
                  />

                {!isCreating && selectedGuide.id && (
                  <div className="border-t pt-4">
                    <AttractionIslandLinksManager
                      attractionGuideId={selectedGuide.id}
                      onUpdate={() => refetch()}
                    />
                  </div>
                )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedGuide(undefined);
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      }
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search attractions by name, slug, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Guides List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredGuides.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No attractions found. Create your first attraction guide!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredGuides.map((guide: any) => (
              <Card key={guide.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">{guide.name}</h3>
                        {guide.featured === 1 && (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Type:</span> {guide.attractionType.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {guide.overview}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {guide.slug}
                        </span>
                        {guide.nearestIsland && (
                          <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                            {guide.nearestIsland}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTogglePublish(guide)}
                        title={guide.published === 1 ? "Unpublish" : "Publish"}
                      >
                        {guide.published === 1 ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleFeature(guide)}
                        title={guide.featured === 1 ? "Unfeature" : "Feature"}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            guide.featured === 1
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(guide)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(guide.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
