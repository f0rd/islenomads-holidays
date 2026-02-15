import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, Plus, Trash2, AlertCircle } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { TransportSelector } from './TransportSelector';

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
  spotType: 'surf_spot' | 'dive_site' | 'snorkeling_spot';
  category?: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bestSeason?: string;
  maxDepth?: number;
  minDepth?: number;
  waveHeight?: string;
  coralCoverage?: string;
  tips?: string;
}

export interface NearbySpot {
  name: string;
  distance: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

export interface IslandGuideFormData {
  id?: number;
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
  nearbyDiveSites?: NearbySpot[];
  nearbySurfSpots?: NearbySpot[];
  heroImage?: string;
  published: boolean;
}

interface IslandGuideFormProps {
  initialData?: IslandGuideFormData;
  onSubmit: (data: IslandGuideFormData) => Promise<void>;
  isLoading?: boolean;
  islandName?: string;
}

export function IslandGuideForm({ initialData, onSubmit, isLoading = false, islandName }: IslandGuideFormProps) {
  // Parse JSON strings from database into arrays
  const parseInitialData = (data?: IslandGuideFormData): IslandGuideFormData => {
    if (!data) return undefined as any;
    
    return {
      ...data,
      quickFacts: typeof data.quickFacts === 'string' ? JSON.parse(data.quickFacts || '[]') : (data.quickFacts || []),
      attractions: typeof data.attractions === 'string' ? JSON.parse(data.attractions || '[]') : (data.attractions || []),
      topThingsToDo: typeof data.topThingsToDo === 'string' ? JSON.parse(data.topThingsToDo || '[]') : (data.topThingsToDo || []),
      faqs: typeof data.faqs === 'string' ? JSON.parse(data.faqs || '[]') : (data.faqs || []),
      activitySpots: typeof data.activitySpots === 'string' ? JSON.parse(data.activitySpots || '[]') : (data.activitySpots || []),
      nearbyDiveSites: typeof data.nearbyDiveSites === 'string' ? JSON.parse(data.nearbyDiveSites || '[]') : (data.nearbyDiveSites || []),
      nearbySurfSpots: typeof data.nearbySurfSpots === 'string' ? JSON.parse(data.nearbySurfSpots || '[]') : (data.nearbySurfSpots || []),
    };
  };

  const [formData, setFormData] = useState<IslandGuideFormData>(
    parseInitialData(initialData) || {
      name: islandName || '',
      slug: '',
      overview: '',
      quickFacts: ['', '', '', '', '', '', '', ''],
      attractions: [],
      transportation: { flight: '', speedboat: '', ferry: '' },
      topThingsToDo: Array(10).fill({ title: '', description: '' }),
      // Activity spots managed separately
      beachesLocalRules: '',
      foodCafes: '',
      practicalInfo: '',
      itinerary3Day: '',
      itinerary5Day: '',
      faqs: Array(6).fill({ question: '', answer: '' }),
      activitySpots: [],
      nearbyDiveSites: [],
      nearbySurfSpots: [],
      published: false,
    }
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
    const updated = [...formData.quickFacts];
    updated[index] = value;
    setFormData({ ...formData, quickFacts: updated });
  };

  const updateThingToDo = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...formData.topThingsToDo];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, topThingsToDo: updated });
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...formData.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, faqs: updated });
  };

  const addActivitySpot = () => {
    const newSpot: ActivitySpot = {
      name: '',
      spotType: 'dive_site',
      difficulty: 'intermediate',
    };
    setFormData({
      ...formData,
      activitySpots: [...(formData.activitySpots || []), newSpot],
    });
  };

  const updateActivitySpot = (index: number, field: keyof ActivitySpot, value: any) => {
    const updated = [...(formData.activitySpots || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, activitySpots: updated });
  };

  const removeActivitySpot = (index: number) => {
    const updated = (formData.activitySpots || []).filter((_, i) => i !== index);
    setFormData({ ...formData, activitySpots: updated });
  };

  const addNearbySite = (type: 'dive' | 'surf') => {
    const newSite: NearbySpot = {
      name: '',
      distance: '',
      difficulty: 'intermediate',
    };
    if (type === 'dive') {
      setFormData({
        ...formData,
        nearbyDiveSites: [...(formData.nearbyDiveSites || []), newSite],
      });
    } else {
      setFormData({
        ...formData,
        nearbySurfSpots: [...(formData.nearbySurfSpots || []), newSite],
      });
    }
  };

  const updateNearbySite = (type: 'dive' | 'surf', index: number, field: keyof NearbySpot, value: any) => {
    const sites = type === 'dive' ? [...(formData.nearbyDiveSites || [])] : [...(formData.nearbySurfSpots || [])];
    sites[index] = { ...sites[index], [field]: value };
    if (type === 'dive') {
      setFormData({ ...formData, nearbyDiveSites: sites });
    } else {
      setFormData({ ...formData, nearbySurfSpots: sites });
    }
  };

  const removeNearbySite = (type: 'dive' | 'surf', index: number) => {
    if (type === 'dive') {
      const updated = (formData.nearbyDiveSites || []).filter((_, i) => i !== index);
      setFormData({ ...formData, nearbyDiveSites: updated });
    } else {
      const updated = (formData.nearbySurfSpots || []).filter((_, i) => i !== index);
      setFormData({ ...formData, nearbySurfSpots: updated });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="nearby">Nearby Spots</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="transports">Transports</TabsTrigger>
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
                  placeholder="e.g., Malé City"
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
                    value={fact}
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
                    value={formData.transportation?.flight || ''}
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
                    value={formData.transportation?.speedboat || ''}
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
                    value={formData.transportation?.ferry || ''}
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
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('thingsToDo')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top 10 Things To Do</CardTitle>
                  <CardDescription>Activities and attractions</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.thingsToDo ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.thingsToDo && (
              <CardContent className="space-y-4">
                {(formData.topThingsToDo || []).map((item, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-md bg-gray-50">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateThingToDo(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md font-medium"
                      placeholder={`Activity ${index + 1} title`}
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => updateThingToDo(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[60px]"
                      placeholder="Description..."
                    />
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Food & Cafés */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('foodCafes')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Food & Cafés</CardTitle>
                  <CardDescription>Dining recommendations</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.foodCafes ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.foodCafes && (
              <CardContent>
                <textarea
                  value={formData.foodCafes}
                  onChange={(e) => setFormData({ ...formData, foodCafes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="Food and café recommendations..."
                />
              </CardContent>
            )}
          </Card>

          {/* Practical Info */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('practicalInfo')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Practical Information</CardTitle>
                  <CardDescription>Useful travel tips and information</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.practicalInfo ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.practicalInfo && (
              <CardContent>
                <textarea
                  value={formData.practicalInfo}
                  onChange={(e) => setFormData({ ...formData, practicalInfo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="Practical information..."
                />
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-4">
          {/* Activity Spots (Snorkeling, Diving, Surfing) are now managed separately in the Activity Spots CMS */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Spots</CardTitle>
              <CardDescription>Manage dive sites, snorkeling spots, and surf spots separately in the Activity Spots CMS module</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Link activity spots to this island using the Activity Spots CMS page</p>
            </CardContent>
          </Card>

          {/* Beaches & Local Rules */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('beaches')}>
              <div className="flex items-center justify-between">
                <CardTitle>Beaches & Local Rules</CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.beaches ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.beaches && (
              <CardContent>
                <textarea
                  value={formData.beachesLocalRules}
                  onChange={(e) => setFormData({ ...formData, beachesLocalRules: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="Beach information and local rules..."
                />
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Itineraries Tab */}
        <TabsContent value="itineraries" className="space-y-4">
          {/* 3-Day Itinerary */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('itinerary3')}>
              <div className="flex items-center justify-between">
                <CardTitle>3-Day Itinerary</CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.itinerary3 ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.itinerary3 && (
              <CardContent>
                <textarea
                  value={formData.itinerary3Day}
                  onChange={(e) => setFormData({ ...formData, itinerary3Day: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="3-day itinerary..."
                />
              </CardContent>
            )}
          </Card>

          {/* 5-Day Itinerary */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('itinerary5')}>
              <div className="flex items-center justify-between">
                <CardTitle>5-Day Itinerary</CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.itinerary5 ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.itinerary5 && (
              <CardContent>
                <textarea
                  value={formData.itinerary5Day}
                  onChange={(e) => setFormData({ ...formData, itinerary5Day: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="5-day itinerary..."
                />
              </CardContent>
            )}
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('faqs')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>6 common questions and answers</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.faqs ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.faqs && (
              <CardContent className="space-y-4">
                {(formData.faqs || []).map((faq, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-md bg-gray-50">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md font-medium"
                      placeholder={`Question ${index + 1}`}
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                      placeholder="Answer..."
                    />
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Activity Spots Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('activities')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Spots</CardTitle>
                  <CardDescription>Manage dive sites, surf spots, and snorkeling locations</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.activities ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.activities && (
              <CardContent className="space-y-4">
                {(formData.activitySpots || []).map((spot, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Activity Spot {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeActivitySpot(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={spot.name}
                        onChange={(e) => updateActivitySpot(index, 'name', e.target.value)}
                        className="col-span-2 px-3 py-2 border rounded-md"
                        placeholder="Spot name (e.g., Pasta Point, Blue Lagoon)"
                      />
                      <select
                        value={spot.spotType}
                        onChange={(e) => updateActivitySpot(index, 'spotType', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="dive_site">Dive Site</option>
                        <option value="surf_spot">Surf Spot</option>
                        <option value="snorkeling_spot">Snorkeling Spot</option>
                      </select>
                      <select
                        value={spot.difficulty}
                        onChange={(e) => updateActivitySpot(index, 'difficulty', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={spot.category || ''}
                      onChange={(e) => updateActivitySpot(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Category (e.g., Beginner Dive Sites, Manta Ray Spots)"
                    />
                    <textarea
                      value={spot.description || ''}
                      onChange={(e) => updateActivitySpot(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[60px]"
                      placeholder="Description of the activity spot..."
                    />
                    <input
                      type="text"
                      value={spot.bestSeason || ''}
                      onChange={(e) => updateActivitySpot(index, 'bestSeason', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Best season (e.g., November - April)"
                    />
                    {spot.spotType === 'dive_site' && (
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={spot.minDepth || ''}
                          onChange={(e) => updateActivitySpot(index, 'minDepth', parseInt(e.target.value))}
                          className="px-3 py-2 border rounded-md"
                          placeholder="Min depth (m)"
                        />
                        <input
                          type="number"
                          value={spot.maxDepth || ''}
                          onChange={(e) => updateActivitySpot(index, 'maxDepth', parseInt(e.target.value))}
                          className="px-3 py-2 border rounded-md"
                          placeholder="Max depth (m)"
                        />
                      </div>
                    )}
                    {spot.spotType === 'surf_spot' && (
                      <input
                        type="text"
                        value={spot.waveHeight || ''}
                        onChange={(e) => updateActivitySpot(index, 'waveHeight', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Wave height (e.g., 2-4 feet)"
                      />
                    )}
                    {spot.spotType === 'snorkeling_spot' && (
                      <input
                        type="text"
                        value={spot.coralCoverage || ''}
                        onChange={(e) => updateActivitySpot(index, 'coralCoverage', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Coral coverage (e.g., 90%, Excellent)"
                      />
                    )}
                    <textarea
                      value={spot.tips || ''}
                      onChange={(e) => updateActivitySpot(index, 'tips', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[50px]"
                      placeholder="Tips and recommendations..."
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addActivitySpot}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Activity Spot
                </button>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Nearby Spots Tab */}
        <TabsContent value="nearby" className="space-y-4">
          {/* Nearby Dive Sites */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('nearbySites')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Nearby Dive Sites</CardTitle>
                  <CardDescription>Popular dive sites near this island</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.nearbySites ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.nearbySites && (
              <CardContent className="space-y-4">
                {(formData.nearbyDiveSites || []).map((site, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Dive Site {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeNearbySite('dive', index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={site.name}
                        onChange={(e) => updateNearbySite('dive', index, 'name', e.target.value)}
                        className="col-span-2 px-3 py-2 border rounded-md"
                        placeholder="Dive site name (e.g., Hanifaru Bay)"
                      />
                      <input
                        type="text"
                        value={site.distance}
                        onChange={(e) => updateNearbySite('dive', index, 'distance', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        placeholder="Distance (e.g., 2 km)"
                      />
                      <select
                        value={site.difficulty}
                        onChange={(e) => updateNearbySite('dive', index, 'difficulty', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <textarea
                      value={site.description || ''}
                      onChange={(e) => updateNearbySite('dive', index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[60px]"
                      placeholder="Description of the dive site..."
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNearbySite('dive')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Dive Site
                </button>
              </CardContent>
            )}
          </Card>

          {/* Nearby Surf Spots */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('nearbySurf')}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Nearby Surf Spots</CardTitle>
                  <CardDescription>Popular surf spots near this island</CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.nearbySurf ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.nearbySurf && (
              <CardContent className="space-y-4">
                {(formData.nearbySurfSpots || []).map((spot, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Surf Spot {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeNearbySite('surf', index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={spot.name}
                        onChange={(e) => updateNearbySite('surf', index, 'name', e.target.value)}
                        className="col-span-2 px-3 py-2 border rounded-md"
                        placeholder="Surf spot name (e.g., Pasta Point)"
                      />
                      <input
                        type="text"
                        value={spot.distance}
                        onChange={(e) => updateNearbySite('surf', index, 'distance', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        placeholder="Distance (e.g., 3 km)"
                      />
                      <select
                        value={spot.difficulty}
                        onChange={(e) => updateNearbySite('surf', index, 'difficulty', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <textarea
                      value={spot.description || ''}
                      onChange={(e) => updateNearbySite('surf', index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[60px]"
                      placeholder="Description of the surf spot..."
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNearbySite('surf')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Surf Spot
                </button>
              </CardContent>
            )}
          </Card>
         </TabsContent>

        {/* Transports Tab */}
        <TabsContent value="transports" className="space-y-4">
          <TransportSelector
            islandGuideId={formData.id || 0}
            onTransportsChange={(transports) => {
              // Handle transport changes if needed
              console.log('Transports updated:', transports);
            }}
          />
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
              <CardDescription>Upload a hero image for this island guide</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImage={formData.heroImage}
                onImageUpload={(url) => setFormData({ ...formData, heroImage: url })}
                label="Island Hero Image"
                maxSizeMB={5}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Submit Buttons */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Island Guide'}
        </Button>
      </div>
    </form>
  );
}
