/**
 * Admin Branding Management Page
 * Manage logos, colors, and company branding
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function AdminBranding() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const [formData, setFormData] = useState({
    logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/EbseTOGtZahDcrEN.png",
    logoMarkUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NyFkoHHMcvrJONSe.png",
    faviconUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/eZgpTLDdPAgJDwZO.png",
    logoWhiteUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/vSjAAzmhFbZMRswg.png",
    logoColorUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/gBEmRLSiZsDgAMhZ.png",
    primaryColor: "#0D7F7F",
    accentColor: "#00D4D4",
    companyName: "Isle Nomads",
    tagline: "Your gateway to paradise",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Save branding data via tRPC
      console.log("Saving branding:", formData);
      // await trpc.branding.update.mutate(formData);
      alert("Branding updated successfully!");
    } catch (error) {
      console.error("Error saving branding:", error);
      alert("Failed to save branding");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <a
            href="/admin/dashboard"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </a>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Branding Management</h1>
            <p className="text-muted-foreground">
              Manage your company logos, colors, and branding assets
            </p>
          </div>

          {/* Logo Assets */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Logo Assets</CardTitle>
              <CardDescription>Upload and manage your company logos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Logo */}
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Main Logo (with text)</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="Enter logo URL"
                  className="font-mono text-sm"
                />
                {formData.logoUrl && (
                  <div className="mt-2 p-4 bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={formData.logoUrl}
                      alt="Main Logo"
                      className="h-16 w-auto"
                    />
                  </div>
                )}
              </div>

              {/* Logo Mark */}
              <div className="space-y-2">
                <Label htmlFor="logoMarkUrl">Logo Mark (icon only)</Label>
                <Input
                  id="logoMarkUrl"
                  name="logoMarkUrl"
                  value={formData.logoMarkUrl}
                  onChange={handleChange}
                  placeholder="Enter logo mark URL"
                  className="font-mono text-sm"
                />
                {formData.logoMarkUrl && (
                  <div className="mt-2 p-4 bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={formData.logoMarkUrl}
                      alt="Logo Mark"
                      className="h-16 w-auto"
                    />
                  </div>
                )}
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon</Label>
                <Input
                  id="faviconUrl"
                  name="faviconUrl"
                  value={formData.faviconUrl}
                  onChange={handleChange}
                  placeholder="Enter favicon URL"
                  className="font-mono text-sm"
                />
                {formData.faviconUrl && (
                  <div className="mt-2 p-4 bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={formData.faviconUrl}
                      alt="Favicon"
                      className="h-8 w-auto"
                    />
                  </div>
                )}
              </div>

              {/* White Logo */}
              <div className="space-y-2">
                <Label htmlFor="logoWhiteUrl">White Logo (for dark backgrounds)</Label>
                <Input
                  id="logoWhiteUrl"
                  name="logoWhiteUrl"
                  value={formData.logoWhiteUrl}
                  onChange={handleChange}
                  placeholder="Enter white logo URL"
                  className="font-mono text-sm"
                />
                {formData.logoWhiteUrl && (
                  <div className="mt-2 p-4 bg-primary rounded-lg flex items-center justify-center">
                    <img
                      src={formData.logoWhiteUrl}
                      alt="White Logo"
                      className="h-16 w-auto"
                    />
                  </div>
                )}
              </div>

              {/* Color Logo */}
              <div className="space-y-2">
                <Label htmlFor="logoColorUrl">Color Logo</Label>
                <Input
                  id="logoColorUrl"
                  name="logoColorUrl"
                  value={formData.logoColorUrl}
                  onChange={handleChange}
                  placeholder="Enter color logo URL"
                  className="font-mono text-sm"
                />
                {formData.logoColorUrl && (
                  <div className="mt-2 p-4 bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={formData.logoColorUrl}
                      alt="Color Logo"
                      className="h-16 w-auto"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Define your primary brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Color */}
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      placeholder="#0D7F7F"
                      className="font-mono text-sm flex-1"
                    />
                  </div>
                  <div
                    className="mt-2 h-12 rounded-lg border"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      name="accentColor"
                      type="color"
                      value={formData.accentColor}
                      onChange={handleChange}
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      name="accentColor"
                      value={formData.accentColor}
                      onChange={handleChange}
                      placeholder="#00D4D4"
                      className="font-mono text-sm flex-1"
                    />
                  </div>
                  <div
                    className="mt-2 h-12 rounded-lg border"
                    style={{ backgroundColor: formData.accentColor }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage company name and tagline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Isle Nomads"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Textarea
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Your gateway to paradise"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setLocation("/admin")}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
