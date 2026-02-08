import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, Plus, Trash2, AlertCircle } from 'lucide-react';

export interface IslandGuideFormData {
  name: string;
  slug: string;
  overview: string;
  quickFacts: string[];
  transportation: {
    flight: string;
    speedboat: string;
    ferry: string;
  };
  topThingsToDo: Array<{ title: string; description: string }>;
  snorkelingGuide: string;
  divingGuide: string;
  surfWatersports: string;
  sandBankDolphinTrips: string;
  beachesLocalRules: string;
  foodCafes: string;
  practicalInfo: string;
  itinerary3Day: string;
  itinerary5Day: string;
  faqs: Array<{ question: string; answer: string }>;
  published: boolean;
}

interface IslandGuideFormProps {
  initialData?: IslandGuideFormData;
  onSubmit: (data: IslandGuideFormData) => Promise<void>;
  isLoading?: boolean;
  islandName?: string;
}

export function IslandGuideForm({ initialData, onSubmit, isLoading = false, islandName }: IslandGuideFormProps) {
  const [formData, setFormData] = useState<IslandGuideFormData>(
    initialData || {
      name: islandName || '',
      slug: '',
      overview: '',
      quickFacts: ['', '', '', '', '', '', '', ''],
      transportation: { flight: '', speedboat: '', ferry: '' },
      topThingsToDo: Array(10).fill({ title: '', description: '' }),
      snorkelingGuide: '',
      divingGuide: '',
      surfWatersports: '',
      sandBankDolphinTrips: '',
      beachesLocalRules: '',
      foodCafes: '',
      practicalInfo: '',
      itinerary3Day: '',
      itinerary5Day: '',
      faqs: Array(6).fill({ question: '', answer: '' }),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
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
                {formData.quickFacts.map((fact, index) => (
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
                    value={formData.transportation.flight}
                    onChange={(e) => setFormData({
                      ...formData,
                      transportation: { ...formData.transportation, flight: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                    placeholder="Flight details..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Speedboat Information</label>
                  <textarea
                    value={formData.transportation.speedboat}
                    onChange={(e) => setFormData({
                      ...formData,
                      transportation: { ...formData.transportation, speedboat: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                    placeholder="Speedboat details..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ferry Information</label>
                  <textarea
                    value={formData.transportation.ferry}
                    onChange={(e) => setFormData({
                      ...formData,
                      transportation: { ...formData.transportation, ferry: e.target.value }
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
                {formData.topThingsToDo.map((item, index) => (
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
          {/* Snorkeling Guide */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('snorkeling')}>
              <div className="flex items-center justify-between">
                <CardTitle>Snorkeling Guide</CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.snorkeling ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.snorkeling && (
              <CardContent>
                <textarea
                  value={formData.snorkelingGuide}
                  onChange={(e) => setFormData({ ...formData, snorkelingGuide: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="Snorkeling guide and tips..."
                />
              </CardContent>
            )}
          </Card>

          {/* Diving Guide */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('diving')}>
              <div className="flex items-center justify-between">
                <CardTitle>Diving Guide</CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.diving ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.diving && (
              <CardContent>
                <textarea
                  value={formData.divingGuide}
                  onChange={(e) => setFormData({ ...formData, divingGuide: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="Diving guide and information..."
                />
              </CardContent>
            )}
          </Card>

          {/* Surf & Watersports */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('surfWatersports')}>
              <div className="flex items-center justify-between">
                <CardTitle>Surf & Watersports</CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.surfWatersports ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.surfWatersports && (
              <CardContent>
                <textarea
                  value={formData.surfWatersports}
                  onChange={(e) => setFormData({ ...formData, surfWatersports: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="Surf and watersports information..."
                />
              </CardContent>
            )}
          </Card>

          {/* Sandbank & Dolphin Trips */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('sandbank')}>
              <div className="flex items-center justify-between">
                <CardTitle>Sandbank & Dolphin Trips</CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.sandbank ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
            {expandedSections.sandbank && (
              <CardContent>
                <textarea
                  value={formData.sandBankDolphinTrips}
                  onChange={(e) => setFormData({ ...formData, sandBankDolphinTrips: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="Sandbank and dolphin trip information..."
                />
              </CardContent>
            )}
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
                {formData.faqs.map((faq, index) => (
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
