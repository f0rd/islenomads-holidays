import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, Plus, Trash2, AlertCircle } from 'lucide-react';
import { ActivitySpotSelector } from './ActivitySpotSelector';
import { useState } from 'react';

export interface Attraction {
  id?: string;
  name: string;
  description: string;
  location?: string;
  icon?: string;
}

export interface ActivitySpot {
  id?: number;
  name: string;
  slug?: string;
  spotType: 'surf_spot' | 'dive_site' | 'snorkeling_spot';
  category?: string;
  description?: string;
  difficulty?: string;
  bestSeason?: string;
  maxDepth?: number;
  minDepth?: number;
  waveHeight?: string;
  coralCoverage?: string;
  tips?: string;
  [key: string]: any;
}

export interface IslandGuideFormData {
  name: string;
  slug: string;
  overview: string;
  quickFacts: string[];
  attractions?: Attraction[];
  transportation: {
    flight: string;
    speedboat: string;
    ferry: string;
  };
  topThingsToDo: Array<{ title: string; description: string }>;
  // Activity spots (snorkeling, diving, surfing) are now managed separately in activity_spots table
  beachesLocalRules: string;
  foodCafes: string;
  practicalInfo: string;
  itinerary3Day: string;
  itinerary5Day: string;
  faqs: Array<{ question: string; answer: string }>;
  activitySpots?: ActivitySpot[];
  published: boolean;
}

interface IslandGuideFormProps {
  initialData?: IslandGuideFormData;
  onSubmit: (data: IslandGuideFormData) => Promise<void>;
  isLoading?: boolean;
  islandName?: string;
}

export function IslandGuideForm({ initialData, onSubmit, isLoading = false, islandName }: IslandGuideFormProps) {
  // Helper to safely parse JSON strings
  const safeJsonParse = (value: any, defaultValue: any = []): any => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value || '[]');
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // Parse JSON strings from database into arrays
  const parseInitialData = (data?: IslandGuideFormData): IslandGuideFormData | null => {
    if (!data) return null;
    
    try {
      return {
        ...data,
        quickFacts: safeJsonParse(data.quickFacts, []),
        attractions: safeJsonParse(data.attractions, []),
        topThingsToDo: safeJsonParse(data.topThingsToDo, []),
        faqs: safeJsonParse(data.faqs, []),
        activitySpots: safeJsonParse(data.activitySpots, []),
      };
    } catch (error) {
      console.error('Error parsing initial data:', error);
      return null;
    }
  };

  const getDefaultFormData = (): IslandGuideFormData => ({
    name: islandName || '',
    slug: '',
    overview: '',
    quickFacts: ['', '', '', '', '', '', '', ''],
    attractions: [],
    transportation: { flight: '', speedboat: '', ferry: '' },
    topThingsToDo: Array(10).fill({ title: '', description: '' }),
    beachesLocalRules: '',
    foodCafes: '',
    practicalInfo: '',
    itinerary3Day: '',
    itinerary5Day: '',
    faqs: Array(6).fill({ question: '', answer: '' }),
    activitySpots: [],
    published: false,
  });

  const [formData, setFormData] = useState<IslandGuideFormData>(
    parseInitialData(initialData) || getDefaultFormData()
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    quickFacts: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Island name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.overview.trim()) newErrors.overview = 'Overview is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const updateQuickFact = (index: number, value: string) => {
    const updated = [...(formData.quickFacts || [])];
    updated[index] = value;
    setFormData({ ...formData, quickFacts: updated });
  };

  const updateThingToDo = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...(formData.topThingsToDo || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, topThingsToDo: updated });
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...(formData.faqs || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, faqs: updated });
  };

  const addActivitySpot = () => {
    const newSpot: ActivitySpot = {
      name: '',
      spotType: 'dive_site',
      description: '',
    };
    setFormData({
      ...formData,
      activitySpots: [...(formData.activitySpots || []), newSpot],
    });
  };

  const removeActivitySpot = (index: number) => {
    const updated = formData.activitySpots?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, activitySpots: updated });
  };

  const updateActivitySpot = (index: number, field: string, value: any) => {
    const updated = [...(formData.activitySpots || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, activitySpots: updated });
  };

  const addAttraction = () => {
    setFormData({
      ...formData,
      attractions: [...(formData.attractions || []), { name: '', description: '' }],
    });
  };

  const removeAttraction = (index: number) => {
    const updated = formData.attractions?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, attractions: updated });
  };

  const updateAttraction = (index: number, field: string, value: string) => {
    const updated = [...(formData.attractions || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, attractions: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Island name, slug, and overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Island Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Malé"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., male-city"
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Overview (120 words) *</label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                  placeholder="Write a 120-word overview of the island..."
                />
                <p className="text-xs text-gray-500 mt-1">Word count: {formData.overview.split(/\s+/).filter(w => w).length}</p>
                {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-medium">Publish this guide</label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          {/* Quick Facts */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('quickFacts')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quick Facts</CardTitle>
                  <CardDescription>8 key facts about the island</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.quickFacts ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.quickFacts && (
              <CardContent className="space-y-3">
                {(formData.quickFacts || []).map((fact, index) => (
                  <input
                    key={index}
                    type="text"
                    value={fact || ''}
                    onChange={(e) => updateQuickFact(index, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={`Quick fact ${index + 1}`}
                  />
                ))}
              </CardContent>
            )}
          </Card>

          {/* Transportation */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('transportation')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>How to Get There</CardTitle>
                  <CardDescription>Flight, speedboat, and ferry information</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.transportation ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.transportation && (
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Flight Information</label>
                  <textarea
                    value={formData.transportation?.flight ?? ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      transportation: { ...(formData.transportation || {}), flight: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                    placeholder="Flight details..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Speedboat Information</label>
                  <textarea
                    value={formData.transportation?.speedboat ?? ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      transportation: { ...(formData.transportation || {}), speedboat: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                    placeholder="Speedboat details..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ferry Information</label>
                  <textarea
                    value={formData.transportation?.ferry ?? ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      transportation: { ...(formData.transportation || {}), ferry: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                    placeholder="Ferry details..."
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Top Things to Do */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('topThingsToDo')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top 10 Things to Do</CardTitle>
                  <CardDescription>Main attractions and activities</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.topThingsToDo ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.topThingsToDo && (
              <CardContent className="space-y-4">
                {(formData.topThingsToDo || []).map((item, index) => (
                  <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                    <input
                      type="text"
                      value={item?.title || ''}
                      onChange={(e) => updateThingToDo(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md font-medium"
                      placeholder={`Activity ${index + 1} title`}
                    />
                    <textarea
                      value={item?.description ?? ''}
                      onChange={(e) => updateThingToDo(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[60px]"
                      placeholder="Description..."
                    />
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Beaches & Local Rules */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('beaches')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Beaches & Local Rules</CardTitle>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.beaches ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.beaches && (
              <CardContent>
                <textarea
                  value={formData.beachesLocalRules ?? ''}
                  onChange={(e) => setFormData({ ...formData, beachesLocalRules: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                  placeholder="Information about beaches and local rules..."
                />
              </CardContent>
            )}
          </Card>

          {/* Food & Cafes */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('food')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Food & Cafes</CardTitle>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.food ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.food && (
              <CardContent>
                <textarea
                  value={formData.foodCafes ?? ''}
                  onChange={(e) => setFormData({ ...formData, foodCafes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                  placeholder="Food and cafe recommendations..."
                />
              </CardContent>
            )}
          </Card>

          {/* Practical Info */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('practical')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Practical Information</CardTitle>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.practical ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.practical && (
              <CardContent>
                <textarea
                  value={formData.practicalInfo ?? ''}
                  onChange={(e) => setFormData({ ...formData, practicalInfo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                  placeholder="Practical information (ATM, hospital, etc.)..."
                />
              </CardContent>
            )}
          </Card>

          {/* Itineraries */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('itineraries')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sample Itineraries</CardTitle>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.itineraries ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.itineraries && (
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">3-Day Itinerary</label>
                  <textarea
                    value={formData.itinerary3Day ?? ''}
                    onChange={(e) => setFormData({ ...formData, itinerary3Day: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                    placeholder="3-day itinerary..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">5-Day Itinerary</label>
                  <textarea
                    value={formData.itinerary5Day ?? ''}
                    onChange={(e) => setFormData({ ...formData, itinerary5Day: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                    placeholder="5-day itinerary..."
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Attractions */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('attractions')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attractions</CardTitle>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.attractions ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.attractions && (
              <CardContent className="space-y-4">
                {(formData.attractions || []).map((attraction, index) => (
                  <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={attraction?.name || ''}
                          onChange={(e) => updateAttraction(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md font-medium"
                          placeholder="Attraction name"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttraction(index)}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={attraction?.description ?? ''}
                      onChange={(e) => updateAttraction(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[60px]"
                      placeholder="Description..."
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addAttraction}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Attraction
                </Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Spots</CardTitle>
              <CardDescription>Diving, snorkeling, and surfing spots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(formData.activitySpots || []).map((spot, index) => (
                <div key={index} className="space-y-3 pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={spot?.name || ''}
                        onChange={(e) => updateActivitySpot(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Spot name"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeActivitySpot(index)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={spot?.spotType || 'dive_site'}
                      onChange={(e) => updateActivitySpot(index, 'spotType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="dive_site">Dive Site</option>
                      <option value="snorkeling_spot">Snorkeling Spot</option>
                      <option value="surf_spot">Surf Spot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={spot?.description ?? ''}
                      onChange={(e) => updateActivitySpot(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[60px]"
                      placeholder="Description..."
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={addActivitySpot}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity Spot
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(formData.faqs || []).map((faq, index) => (
                <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                  <input
                    type="text"
                    value={faq?.question || ''}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md font-medium"
                    placeholder={`Question ${index + 1}`}
                  />
                  <textarea
                    value={faq?.answer ?? ''}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                    placeholder="Answer..."
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Island Guide'}
        </Button>
      </div>
    </form>
  );
}
