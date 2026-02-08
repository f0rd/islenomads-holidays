import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Mail, Send, CheckCircle } from "lucide-react";
import { createPricingRequest } from "@/utils/tripGenerator";

interface CustomPricingRequestProps {
  destinations: string[];
  duration: number;
  travelers: number;
}

export default function CustomPricingRequest({
  destinations,
  duration,
  travelers,
}: CustomPricingRequestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    budget: "mid-range",
    preferences: "",
    specialRequests: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create pricing request
    const request = createPricingRequest(
      formData.customerName,
      formData.email,
      destinations,
      duration,
      travelers,
      formData.budget,
      formData.preferences,
      formData.specialRequests
    );

    console.log("Pricing request created:", request);

    // Reset form
    setFormData({
      customerName: "",
      email: "",
      budget: "mid-range",
      preferences: "",
      specialRequests: "",
    });

    setIsSubmitted(true);

    // Reset submitted state after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-accent text-primary hover:bg-accent/90">
          <DollarSign className="w-4 h-4" />
          Request Custom Pricing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Custom Pricing</DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for your interest. Our team will review your request and send you a custom quote within 24 hours.
            </p>
            <p className="text-sm text-muted-foreground">
              Check your email at <span className="font-semibold">{formData.email}</span> for updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trip Summary */}
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-base">Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destinations:</span>
                  <span className="font-semibold">{destinations.length} locations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travelers:</span>
                  <span className="font-semibold">{travelers} people</span>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <Input
                required
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Budget Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Budget Range *</label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget (Under $100/day per person)</SelectItem>
                  <SelectItem value="mid-range">Mid-Range ($100-300/day per person)</SelectItem>
                  <SelectItem value="luxury">Luxury ($300-600/day per person)</SelectItem>
                  <SelectItem value="ultra-luxury">Ultra-Luxury ($600+/day per person)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium mb-1">Travel Preferences</label>
              <Input
                value={formData.preferences}
                onChange={(e) => handleInputChange("preferences", e.target.value)}
                placeholder="e.g., Diving, snorkeling, relaxation, adventure"
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium mb-1">Special Requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                placeholder="Any special requirements, dietary restrictions, or preferences?"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 min-h-24"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full gap-2 bg-accent text-primary hover:bg-accent/90"
            >
              <Send className="w-4 h-4" />
              Send Pricing Request
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Our team will review your request and send you a personalized quote within 24 hours.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
