import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  generateMetaTags,
  validateGeneratedTags,
  calculateMetaTagScore,
  formatKeywords,
  type GeneratedMetaTags,
  type ContentForGeneration,
} from "@/utils/aiMetaTagGenerator";
import { Loader2, Sparkles, CheckCircle, AlertCircle, Copy } from "lucide-react";

interface AIMetaTagGeneratorProps {
  content: ContentForGeneration;
  onApply?: (tags: GeneratedMetaTags) => void;
}

export default function AIMetaTagGenerator({ content, onApply }: AIMetaTagGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTags, setGeneratedTags] = useState<GeneratedMetaTags | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const tags = await generateMetaTags(content);
      setGeneratedTags(tags);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate meta tags");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedTags && onApply) {
      onApply(generatedTags);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!generatedTags) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            AI Meta Tag Generator
          </CardTitle>
          <CardDescription>
            Generate optimized meta titles and descriptions using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2 w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Meta Tags
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const validation = validateGeneratedTags(generatedTags);
  const score = calculateMetaTagScore(generatedTags);

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Generated Meta Tags
            </CardTitle>
            <CardDescription>
              AI-generated SEO-optimized meta tags (Confidence: {Math.round(generatedTags.confidence * 100)}%)
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{score}</div>
            <p className="text-xs text-muted-foreground">SEO Score</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Meta Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Meta Title</label>
          <div className="flex gap-2">
            <Input
              value={generatedTags.title}
              readOnly
              className="bg-white"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(generatedTags.title, "title")}
              className="flex-shrink-0"
            >
              {copied === "title" ? "Copied!" : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {generatedTags.title.length} characters (optimal: 30-60)
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Meta Description</label>
          <div className="flex gap-2">
            <Textarea
              value={generatedTags.description}
              readOnly
              className="bg-white resize-none"
              rows={3}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(generatedTags.description, "description")}
              className="flex-shrink-0"
            >
              {copied === "description" ? "Copied!" : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {generatedTags.description.length} characters (optimal: 120-160)
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Keywords</label>
          <div className="flex gap-2">
            <Input
              value={formatKeywords(generatedTags.keywords)}
              readOnly
              className="bg-white"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(formatKeywords(generatedTags.keywords), "keywords")}
              className="flex-shrink-0"
            >
              {copied === "keywords" ? "Copied!" : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {generatedTags.keywords.length} keywords
          </p>
        </div>

        {/* Validation Issues */}
        {!validation.valid && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-yellow-800">Recommendations:</p>
            <ul className="space-y-1">
              {validation.issues.map((issue, idx) => (
                <li key={idx} className="text-sm text-yellow-700 flex gap-2">
                  <span>•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-green-200">
          <Button onClick={handleApply} className="flex-1">
            Apply These Tags
          </Button>
          <Button
            variant="outline"
            onClick={() => setGeneratedTags(null)}
            className="flex-1"
          >
            Generate Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
