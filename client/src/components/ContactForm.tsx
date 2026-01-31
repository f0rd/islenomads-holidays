/**
 * Contact Form Component
 * Collects customer inquiries with validation
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  packageType?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    packageType: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Your inquiry has been sent. We'll respond within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        packageType: "",
      });
      setErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send inquiry. Please try again.");
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactForm.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary-foreground/10 backdrop-blur-md rounded-lg p-8 border border-primary-foreground/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-primary-foreground font-semibold">
            Full Name *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            className={`bg-background/80 border-border text-foreground placeholder:text-muted-foreground ${
              errors.name ? "border-destructive" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-primary-foreground font-semibold">
            Email Address *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            className={`bg-background/80 border-border text-foreground placeholder:text-muted-foreground ${
              errors.email ? "border-destructive" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-primary-foreground font-semibold">
            Phone Number *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            className={`bg-background/80 border-border text-foreground placeholder:text-muted-foreground ${
              errors.phone ? "border-destructive" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Package Type Field */}
        <div className="space-y-2">
          <Label htmlFor="packageType" className="text-primary-foreground font-semibold">
            Interested Package
          </Label>
          <select
            id="packageType"
            name="packageType"
            value={formData.packageType}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background/80 border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            disabled={isSubmitting}
          >
            <option value="">Select a package</option>
            <option value="romantic-escape">Romantic Escape</option>
            <option value="ultimate-paradise">Ultimate Paradise</option>
            <option value="island-explorer">Island Explorer</option>
            <option value="custom">Custom Package</option>
          </select>
        </div>
      </div>

      {/* Subject Field */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="subject" className="text-primary-foreground font-semibold">
          Subject *
        </Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="What is this inquiry about?"
          value={formData.subject}
          onChange={handleChange}
          className={`bg-background/80 border-border text-foreground placeholder:text-muted-foreground ${
            errors.subject ? "border-destructive" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="message" className="text-primary-foreground font-semibold">
          Message *
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your travel plans, preferences, or any special requests..."
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`bg-background/80 border-border text-foreground placeholder:text-muted-foreground resize-none ${
            errors.message ? "border-destructive" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || submitContactForm.isPending}
        className="w-full rounded-md px-6 py-3 text-lg font-semibold bg-accent text-primary hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting || submitContactForm.isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Inquiry"
        )}
      </Button>

      <p className="text-sm text-primary-foreground/70 text-center mt-4">
        * Required fields. We'll respond to your inquiry within 24 hours.
      </p>
    </form>
  );
}
