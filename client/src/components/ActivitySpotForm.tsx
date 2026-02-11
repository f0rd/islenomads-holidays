'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { useState, useEffect } from 'react';

interface ActivitySpotFormProps {
  initialData?: any;
  islands: any[];
  onSuccess: () => void;
}

export default function ActivitySpotForm({ initialData, islands, onSuccess }: ActivitySpotFormProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    slug: '',
    spotType: 'Dive Site',
    islandGuideId: '0',
    category: '',
    difficulty: 'Beginner',
    description: '',
    latitude: '',
    longitude: '',
    maxDepth: '',
    minDepth: '',
    waveHeight: '',
    coralCoverage: '',
    marineLife: '',
    bestSeason: '',
    rating: '',
    reviewCount: '',
    capacity: '',
    operatorInfo: '',
    metaTitle: '',
    metaDescription: '',
    published: false,
  });

  // Create/Update mutations
  const createMutation = trpc.activitySpots.create.useMutation({
    onSuccess: () => {
      console.log('Activity spot created successfully');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error creating activity spot:', error);
    },
  });

  const updateMutation = trpc.activitySpots.update.useMutation({
    onSuccess: () => {
      console.log('Activity spot updated successfully');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error updating activity spot:', error);
    },
  });

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        spotType: initialData.spotType || 'Dive Site',
        islandGuideId: initialData.islandGuideId || '0',
        category: initialData.category || '',
        difficulty: initialData.difficulty || 'Beginner',
        description: initialData.description || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        maxDepth: initialData.maxDepth || '',
        minDepth: initialData.minDepth || '',
        waveHeight: initialData.waveHeight || '',
        coralCoverage: initialData.coralCoverage || '',
        marineLife: initialData.marineLife || '',
        bestSeason: initialData.bestSeason || '',
        rating: initialData.rating || '',
        reviewCount: initialData.reviewCount || '',
        capacity: initialData.capacity || '',
        operatorInfo: initialData.operatorInfo || '',
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
        published: initialData.published ? true : false,
      });
    }
  }, [initialData]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map spotType display names to router enum values
    const spotTypeMap: { [key: string]: string } = {
      'Dive Site': 'dive_site',
      'Surf Spot': 'surf_spot',
      'Snorkeling': 'snorkeling_spot',
    };

    // Map difficulty display names to router enum values
    const difficultyMap: { [key: string]: string } = {
      'Beginner': 'beginner',
      'Intermediate': 'intermediate',
      'Advanced': 'advanced',
    };

    const submitData: any = {
      islandGuideId: formData.islandGuideId ? parseInt(formData.islandGuideId) : 0,
      name: formData.name,
      slug: formData.slug,
      spotType: spotTypeMap[formData.spotType] || 'dive_site',
      description: formData.description || undefined,
      difficulty: difficultyMap[formData.difficulty] || 'beginner',
      bestSeason: formData.bestSeason || undefined,
      maxDepth: formData.maxDepth ? parseInt(formData.maxDepth) : undefined,
      minDepth: formData.minDepth ? parseInt(formData.minDepth) : undefined,
      marineLife: formData.marineLife || undefined,
      waveHeight: formData.waveHeight || undefined,
      coralCoverage: formData.coralCoverage || undefined,
      metaTitle: formData.metaTitle || undefined,
      metaDescription: formData.metaDescription || undefined,
      published: formData.published ? 1 : 0,
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Spot Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g., Banana Reef"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="banana-reef"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.spotType}
                onValueChange={(value) => setFormData({ ...formData, spotType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dive Site">Dive Site</SelectItem>
                  <SelectItem value="Surf Spot">Surf Spot</SelectItem>
                  <SelectItem value="Snorkeling">Snorkeling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the activity spot..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Island & Location */}
      <Card>
        <CardHeader>
          <CardTitle>Island & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="island">Associated Island</Label>
              <Select
                value={formData.islandGuideId.toString()}
                onValueChange={(value) => setFormData({ ...formData, islandGuideId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an island..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  {islands.map((island) => (
                    <SelectItem key={island.id} value={island.id.toString()}>
                      {island.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Manta Ray Spots, Beginner Dive Sites"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g., 4.1699"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g., 73.5079"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dive Site Details */}
      <Card>
        <CardHeader>
          <CardTitle>Dive Site Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minDepth">Min Depth (meters)</Label>
              <Input
                id="minDepth"
                type="number"
                value={formData.minDepth}
                onChange={(e) => setFormData({ ...formData, minDepth: e.target.value })}
                placeholder="e.g., 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDepth">Max Depth (meters)</Label>
              <Input
                id="maxDepth"
                type="number"
                value={formData.maxDepth}
                onChange={(e) => setFormData({ ...formData, maxDepth: e.target.value })}
                placeholder="e.g., 30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coralCoverage">Coral Coverage</Label>
              <Input
                id="coralCoverage"
                value={formData.coralCoverage}
                onChange={(e) => setFormData({ ...formData, coralCoverage: e.target.value })}
                placeholder="e.g., 70%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waveHeight">Wave Height (Surf)</Label>
              <Input
                id="waveHeight"
                value={formData.waveHeight}
                onChange={(e) => setFormData({ ...formData, waveHeight: e.target.value })}
                placeholder="e.g., 2-4 feet"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marineLife">Marine Life</Label>
            <Textarea
              id="marineLife"
              value={formData.marineLife}
              onChange={(e) => setFormData({ ...formData, marineLife: e.target.value })}
              placeholder="Describe marine life found here..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* General Details */}
      <Card>
        <CardHeader>
          <CardTitle>General Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bestSeason">Best Season</Label>
              <Input
                id="bestSeason"
                value={formData.bestSeason}
                onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                placeholder="e.g., Nov-Apr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                placeholder="4.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (people)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewCount">Review Count</Label>
              <Input
                id="reviewCount"
                type="number"
                value={formData.reviewCount}
                onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="operatorInfo">Operator Info</Label>
            <Textarea
              id="operatorInfo"
              value={formData.operatorInfo}
              onChange={(e) => setFormData({ ...formData, operatorInfo: e.target.value })}
              placeholder="Contact info, booking details, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="SEO title for search engines"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="SEO description for search engines"
            />
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {initialData ? 'Update Spot' : 'Create Spot'}
        </Button>
      </div>
    </form>
  );
}
