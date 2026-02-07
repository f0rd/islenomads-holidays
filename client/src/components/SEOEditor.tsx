import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Eye,
  TrendingUp,
} from "lucide-react";
import {
  analyzeSEO,
  generateSlug,
  generateMetaDescription,
  getSEOScoreColor,
  getSEOScoreBgColor,
  validateSEOFields,
  SEOAnalysis,
} from "@/utils/seoAnalyzer";

interface SEOEditorProps {
  title: string;
  content: string;
  onSEOChange: (seoData: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    slug: string;
    ogTitle?: string;
    ogDescription?: string;
  }) => void;
  initialData?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    slug?: string;
    ogTitle?: string;
    ogDescription?: string;
  };
}

export default function SEOEditor({
  title,
  content,
  onSEOChange,
  initialData,
}: SEOEditorProps) {
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || title);
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [focusKeyword, setFocusKeyword] = useState(
    initialData?.focusKeyword || ""
  );
  const [slug, setSlug] = useState(initialData?.slug || generateSlug(title));
  const [ogTitle, setOgTitle] = useState(initialData?.ogTitle || metaTitle);
  const [ogDescription, setOgDescription] = useState(
    initialData?.ogDescription || metaDescription
  );
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-generate meta description if empty
  useEffect(() => {
    if (!metaDescription && content) {
      const generated = generateMetaDescription(content);
      setMetaDescription(generated);
    }
  }, [content, metaDescription]);

  // Analyze SEO whenever relevant fields change
  useEffect(() => {
    const seoAnalysis = analyzeSEO({
      title,
      metaTitle,
      metaDescription,
      focusKeyword,
      content,
      slug,
    });
    setAnalysis(seoAnalysis);

    // Notify parent of changes
    onSEOChange({
      metaTitle,
      metaDescription,
      focusKeyword,
      slug,
      ogTitle,
      ogDescription,
    });
  }, [metaTitle, metaDescription, focusKeyword, slug, ogTitle, ogDescription, title, content, onSEOChange]);

  if (!analysis) return null;

  const validation = validateSEOFields({
    metaTitle,
    metaDescription,
    slug,
  });

  return (
    <div className="space-y-4">
      {/* SEO Score Card */}
      <Card className={`border-2 ${getSEOScoreBgColor(analysis.score)}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              SEO Score
            </span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={`text-3xl font-bold ${getSEOScoreColor(analysis.score)}`}>
                  {analysis.score}
                </div>
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={
                      analysis.score >= 80
                        ? "#10b981"
                        : analysis.score >= 60
                          ? "#f59e0b"
                          : analysis.score >= 40
                            ? "#f97316"
                            : "#ef4444"
                    }
                    strokeWidth="4"
                    strokeDasharray={`${(analysis.score / 100) * 176} 176`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* SEO Fields */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Meta Title
              <span className="text-xs text-muted-foreground ml-2">
                ({metaTitle.length}/60)
              </span>
            </label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter SEO-friendly title"
              maxLength={60}
              className={`${
                metaTitle.length < 30 || metaTitle.length > 60
                  ? "border-yellow-500"
                  : "border-green-500"
              }`}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 30-60 characters
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Meta Description
              <span className="text-xs text-muted-foreground ml-2">
                ({metaDescription.length}/160)
              </span>
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter compelling meta description"
              maxLength={160}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                metaDescription.length < 120 || metaDescription.length > 160
                  ? "border-yellow-500"
                  : "border-green-500"
              }`}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 120-160 characters
            </p>
          </div>

          {/* Focus Keyword */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Focus Keyword
            </label>
            <Input
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Enter main keyword to optimize for"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The primary keyword you want to rank for
            </p>
          </div>

          {/* URL Slug */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              URL Slug
              <span className="text-xs text-muted-foreground ml-2">
                ({slug.length}/75)
              </span>
            </label>
            <div className="flex gap-2">
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug"
                maxLength={75}
              />
              <Button
                onClick={() => setSlug(generateSlug(title))}
                variant="outline"
                size="sm"
              >
                Auto-generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          {/* Open Graph */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">Open Graph (Social Media)</h3>

            <div className="mb-3">
              <label className="block text-sm font-semibold text-foreground mb-2">
                OG Title
              </label>
              <Input
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                placeholder="Title for social media sharing"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                OG Description
              </label>
              <textarea
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                placeholder="Description for social media sharing"
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues & Warnings */}
      {(analysis.issues.length > 0 ||
        analysis.warnings.length > 0 ||
        analysis.suggestions.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              SEO Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Critical Issues */}
            {analysis.issues.length > 0 && (
              <div>
                <p className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Issues ({analysis.issues.length})
                </p>
                <div className="space-y-2">
                  {analysis.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                    >
                      {issue.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {analysis.warnings.length > 0 && (
              <div>
                <p className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Warnings ({analysis.warnings.length})
                </p>
                <div className="space-y-2">
                  {analysis.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700"
                    >
                      {warning.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <p className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Suggestions ({analysis.suggestions.length})
                </p>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700"
                    >
                      {suggestion.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {validation.isValid && analysis.score >= 80 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Great SEO optimization!</p>
              <p className="text-sm text-green-700">Your content is well-optimized for search engines.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Button */}
      <Button
        onClick={() => setShowPreview(!showPreview)}
        variant="outline"
        className="w-full"
      >
        <Eye className="w-4 h-4 mr-2" />
        {showPreview ? "Hide" : "Show"} Search Engine Preview
      </Button>

      {/* Search Engine Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Search Engine Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-blue-600 font-medium">
                islenomads.com › blog › {slug}
              </p>
              <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">
                {metaTitle || title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {metaDescription || "No description provided"}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                Social Media Preview (Facebook/LinkedIn)
              </p>
              <div className="bg-white border border-blue-200 rounded">
                <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  {/* OG Image would go here */}
                  Image Preview
                </div>
                <div className="p-3">
                  <p className="font-bold text-gray-900 text-sm line-clamp-2">
                    {ogTitle || metaTitle || title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {ogDescription || metaDescription || ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">islenomads.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
