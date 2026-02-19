/**
 * Enhanced Multi-Step Contact Form Component
 * Collects comprehensive trip planning information with progressive disclosure
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, Loader2, MapPin, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trackFormSubmission } from "@/lib/gtm";

interface FormData {
  // Step 1: Basic Info
  name: string;
  email: string;
  phone: string;
  
  // Step 2: Trip Preferences
  travelStyle: string;
  groupSize: string;
  travelDates: string;
  duration: string;
  budget: string;
  
  // Step 3: Special Requests
  specialOccasion: string;
  interests: string[];
  specialRequests: string;
}

const TRAVEL_STYLES = [
  { id: "family-adventures", label: "👨‍👩‍👧‍👦 Family Adventures", description: "Kid-friendly resorts with activities for all ages" },
  { id: "romantic", label: "💑 Romantic Getaway", description: "Intimate settings perfect for couples" },
  { id: "adventure", label: "🏔️ Adventure & Water Sports", description: "Action-packed activities and thrill-seeking" },
  { id: "relaxation", label: "🧘 Relaxation & Wellness", description: "Spa, yoga, and peaceful retreats" },
  { id: "luxury", label: "👑 Luxury Experience", description: "Premium amenities and exclusive services" },
  { id: "cultural", label: "🏛️ Cultural Exploration", description: "Local experiences and authentic encounters" },
];

const INTERESTS = [
  "Snorkeling & Diving",
  "Water Sports",
  "Spa & Wellness",
  "Island Hopping",
  "Local Culture",
  "Fine Dining",
  "Photography",
  "Marine Life",
];

const SPECIAL_OCCASIONS = [
  "Honeymoon",
  "Anniversary",
  "Birthday",
  "Proposal",
  "Celebration",
  "No special occasion",
];

const BUDGET_RANGES = [
  { id: "budget", label: "$3,000 - $5,000", description: "Affordable with good value" },
  { id: "mid-range", label: "$5,000 - $10,000", description: "Comfortable mid-range options" },
  { id: "premium", label: "$10,000 - $20,000", description: "Premium resorts and services" },
  { id: "luxury", label: "$20,000+", description: "Luxury and exclusive experiences" },
];

export default function ContactFormEnhanced() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    travelStyle: "",
    groupSize: "",
    travelDates: "",
    duration: "",
    budget: "",
    specialOccasion: "no-special-occasion",
    interests: [],
    specialRequests: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Our travel experts will design your perfect Maldives escape and contact you within 24 hours.");
      setCurrentStep(1);
      setFormData({
        name: "",
        email: "",
        phone: "",
        travelStyle: "",
        groupSize: "",
        travelDates: "",
        duration: "",
        budget: "",
        specialOccasion: "no-special-occasion",
        interests: [],
        specialRequests: "",
      });
      setErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send inquiry. Please try again.");
    },
  });

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    } else if (step === 2) {
      if (!formData.travelStyle) newErrors.travelStyle = "Please select a travel style";
      if (!formData.groupSize) newErrors.groupSize = "Group size is required";
      if (!formData.travelDates) newErrors.travelDates = "Travel dates are required";
      if (!formData.duration) newErrors.duration = "Duration is required";
      if (!formData.budget) newErrors.budget = "Budget range is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    // Track form submission in GTM
    trackFormSubmission('contact_inquiry', {
      travel_style: formData.travelStyle,
      group_size: formData.groupSize,
      budget: formData.budget,
      interests: formData.interests.join(', '),
    });

    setIsSubmitting(true);
    try {
      await submitContactForm.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Trip Design Request - ${formData.travelStyle}`,
        message: `Travel Style: ${formData.travelStyle}\nGroup Size: ${formData.groupSize}\nTravel Dates: ${formData.travelDates}\nDuration: ${formData.duration}\nBudget: ${formData.budget}\nSpecial Occasion: ${formData.specialOccasion}\nInterests: ${formData.interests.join(", ")}\n\nSpecial Requests:\n${formData.specialRequests}`,
        packageType: formData.travelStyle,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              currentStep >= 1 ? "bg-accent text-primary" : "bg-border text-muted-foreground"
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Your Info</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 transition-all ${currentStep >= 2 ? "bg-accent" : "bg-border"}`} />
          
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              currentStep >= 2 ? "bg-accent text-primary" : "bg-border text-muted-foreground"
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Trip Details</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 transition-all ${currentStep >= 3 ? "bg-accent" : "bg-border"}`} />
          
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              currentStep >= 3 ? "bg-accent text-primary" : "bg-border text-muted-foreground"
            }`}>
              3
            </div>
            <span className="text-sm font-medium">Preferences</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-primary-foreground/10 backdrop-blur-md rounded-lg p-4 md:p-8 border border-primary-foreground/20">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">Design Your Perfect Maldives Escape</h2>
              <p className="text-sm md:text-base text-primary-foreground/70">Let's start with your basic information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs md:text-sm text-primary-foreground font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-background/80 border-border text-foreground text-base md:text-sm py-3 md:py-2 ${errors.name ? "border-destructive" : ""}`}
                />
                {errors.name && <p className="text-xs md:text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs md:text-sm text-primary-foreground font-semibold">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-background/80 border-border text-foreground text-base md:text-sm py-3 md:py-2 ${errors.email ? "border-destructive" : ""}`}
                />
                {errors.email && <p className="text-xs md:text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-xs md:text-sm text-primary-foreground font-semibold">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`bg-background/80 border-border text-foreground text-base md:text-sm py-3 md:py-2 ${errors.phone ? "border-destructive" : ""}`}
                />
                {errors.phone && <p className="text-xs md:text-sm text-destructive">{errors.phone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Trip Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">Tell Us About Your Trip</h2>
              <p className="text-primary-foreground/70">Help us understand your travel preferences</p>
            </div>

            {/* Travel Style Selection */}
            <div className="space-y-3">
              <Label className="text-xs md:text-sm text-primary-foreground font-semibold">What's your travel style? *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, travelStyle: style.id }))}
                    className={`p-3 md:p-4 rounded-lg border-2 transition-all text-left active:scale-95 ${
                      formData.travelStyle === style.id
                        ? "border-accent bg-accent/10"
                        : "border-border bg-background/50 hover:border-accent/50"
                    }`}
                  >
                    <div className="text-sm md:text-base font-semibold text-primary-foreground">{style.label}</div>
                    <div className="text-xs md:text-sm text-primary-foreground/70">{style.description}</div>
                  </button>
                ))}
              </div>
              {errors.travelStyle && <p className="text-xs md:text-sm text-destructive">{errors.travelStyle}</p>}
            </div>

            {/* Group Size */}
            <div className="space-y-2">
              <Label htmlFor="groupSize" className="text-primary-foreground font-semibold">
                Group Size *
              </Label>
              <select
                id="groupSize"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background/80 border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Select group size</option>
                <option value="1">Solo Traveler</option>
                <option value="2">Couple (2 people)</option>
                <option value="3-4">Small Group (3-4 people)</option>
                <option value="5-6">Medium Group (5-6 people)</option>
                <option value="7+">Large Group (7+ people)</option>
              </select>
              {errors.groupSize && <p className="text-sm text-destructive">{errors.groupSize}</p>}
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="travelDates" className="text-primary-foreground font-semibold">
                  When do you want to travel? *
                </Label>
                <Input
                  id="travelDates"
                  name="travelDates"
                  type="text"
                  placeholder="e.g., March 2026"
                  value={formData.travelDates}
                  onChange={handleChange}
                  className={`bg-background/80 border-border text-foreground ${errors.travelDates ? "border-destructive" : ""}`}
                />
                {errors.travelDates && <p className="text-sm text-destructive">{errors.travelDates}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-primary-foreground font-semibold">
                  How long? *
                </Label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background/80 border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select duration</option>
                  <option value="3-4">3-4 days</option>
                  <option value="5-7">5-7 days</option>
                  <option value="8-10">8-10 days</option>
                  <option value="10+">10+ days</option>
                </select>
                {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <Label className="text-primary-foreground font-semibold">What's your budget per person? *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BUDGET_RANGES.map((budget) => (
                  <button
                    key={budget.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, budget: budget.id }))}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.budget === budget.id
                        ? "border-accent bg-accent/10"
                        : "border-border bg-background/50 hover:border-accent/50"
                    }`}
                  >
                    <div className="font-semibold text-primary-foreground">{budget.label}</div>
                    <div className="text-sm text-primary-foreground/70">{budget.description}</div>
                  </button>
                ))}
              </div>
              {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Preferences & Special Requests */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">Final Touches</h2>
              <p className="text-primary-foreground/70">Help us personalize your experience</p>
            </div>

            {/* Special Occasion */}
            <div className="space-y-2">
              <Label htmlFor="specialOccasion" className="text-primary-foreground font-semibold">
                Is this a special occasion?
              </Label>
              <select
                id="specialOccasion"
                name="specialOccasion"
                value={formData.specialOccasion}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background/80 border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {SPECIAL_OCCASIONS.map((occasion) => (
                  <option key={occasion} value={occasion.toLowerCase().replace(/ /g, "-")}>
                    {occasion}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label className="text-primary-foreground font-semibold">What are you interested in?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.interests.includes(interest)
                        ? "border-accent bg-accent/10 text-accent-foreground"
                        : "border-border bg-background/50 text-primary-foreground hover:border-accent/50"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests" className="text-primary-foreground font-semibold">
                Any special requests or requirements?
              </Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                placeholder="Dietary restrictions, accessibility needs, specific activities, etc."
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="bg-background/80 border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Trust Message */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-sm text-primary-foreground">
                ✨ <strong>Our Promise:</strong> Our expert travel advisors will review your preferences and design a personalized itinerary tailored to your needs. We'll contact you within 24 hours with recommendations and a custom proposal.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={handlePrevStep}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              className="flex-1 bg-accent text-primary hover:bg-accent/90"
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || submitContactForm.isPending}
              className="flex-1 bg-accent text-primary hover:bg-accent/90 disabled:opacity-50"
            >
              {isSubmitting || submitContactForm.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Designing Your Escape...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Design My Trip
                </>
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-primary-foreground/60 text-center mt-4">
          * Required fields. We respect your privacy and will only use your information to design your perfect trip.
        </p>
      </form>
    </div>
  );
}
