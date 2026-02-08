/**
 * Package Form Component
 * Reusable form for creating and editing vacation packages
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface PackageFormProps {
  package?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PackageForm({ package: initialPackage, onSuccess, onCancel }: PackageFormProps) {
  const [formData, setFormData] = useState({
    name: initialPackage?.name || "",
    description: initialPackage?.description || "",
    destination: initialPackage?.destination || "",
    price: initialPackage?.price || 0,
    duration: initialPackage?.duration || "",
    highlights: Array.isArray(initialPackage?.highlights)
      ? initialPackage.highlights.join(", ")
      : initialPackage?.highlights || "",
    featured: initialPackage?.featured || false,
    published: initialPackage?.published || false,
  });

  const createMutation = trpc.packages.create.useMutation();
  const updateMutation = trpc.packages.update.useMutation();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (initialPackage?.id) {
        // Update existing package
        await updateMutation.mutateAsync({
          id: initialPackage.id,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          duration: formData.duration,
          highlights: formData.highlights
            .split(",")
            .map((h: string) => h.trim())
            .filter((h: string) => h),
          featured: formData.featured ? 1 : 0,
          published: formData.published ? 1 : 0,
        });
      } else {
        // Create new package
        await createMutation.mutateAsync({
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description,
          destination: formData.destination || '',
          price: formData.price,
          duration: formData.duration,
          highlights: formData.highlights
            .split(",")
            .map((h: string) => h.trim())
            .filter((h: string) => h),
          featured: formData.featured ? 1 : 0,
          published: formData.published ? 1 : 0,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving package:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Package Name */}
      <div>
        <Label htmlFor="name">Package Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Romantic Escape"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the package..."
          className="min-h-24"
          required
        />
      </div>

      {/* Price and Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price per Person ($) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="2999"
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration *</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 5 Days / 4 Nights"
            required
          />
        </div>
      </div>

      {/* Highlights */}
      <div>
        <Label htmlFor="highlights">Highlights (comma-separated)</Label>
        <Textarea
          id="highlights"
          value={formData.highlights}
          onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
          placeholder="Luxury water villa, Private beach dinner, Spa treatment..."
          className="min-h-20"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate each highlight with a comma
        </p>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-teal-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Featured on Home Page
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-teal-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Published
          </span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            initialPackage?.id ? "Update Package" : "Create Package"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
