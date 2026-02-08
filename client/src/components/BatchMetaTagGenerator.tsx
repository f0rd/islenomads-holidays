import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  generateMetaTagsBatch,
  type ContentForGeneration,
  type GeneratedMetaTags,
} from "@/utils/aiMetaTagGenerator";
import { Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

interface BatchMetaTagGeneratorProps {
  items: ContentForGeneration[];
  onComplete?: (results: Map<number, GeneratedMetaTags>) => void;
}

interface GenerationProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: boolean;
}

export default function BatchMetaTagGenerator({ items, onComplete }: BatchMetaTagGeneratorProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set(items.map((i) => i.id)));
  const [progress, setProgress] = useState<GenerationProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: false,
  });
  const [results, setResults] = useState<Map<number, GeneratedMetaTags>>(new Map());
  const [error, setError] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(items.map((i) => i.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const handleGenerateBatch = async () => {
    if (selectedItems.size === 0) {
      setError("Please select at least one item");
      return;
    }

    const itemsToGenerate = items.filter((i) => selectedItems.has(i.id));

    setProgress({
      total: itemsToGenerate.length,
      completed: 0,
      failed: 0,
      inProgress: true,
    });
    setError(null);
    setResults(new Map());

    try {
      const batchResults = await generateMetaTagsBatch(itemsToGenerate);
      setResults(batchResults);
      setProgress((prev) => ({
        ...prev,
        completed: batchResults.size,
        inProgress: false,
      }));
      onComplete?.(batchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate batch");
      setProgress((prev) => ({
        ...prev,
        failed: selectedItems.size,
        inProgress: false,
      }));
    }
  };

  const progressPercentage =
    progress.total > 0 ? Math.round(((progress.completed + progress.failed) / progress.total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Batch Meta Tag Generation
        </CardTitle>
        <CardDescription>
          Generate meta tags for multiple pages at once
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Selection Section */}
        {!progress.inProgress && results.size === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox
                checked={selectedItems.size === items.length}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              />
              <span className="text-sm font-semibold">
                Select All ({selectedItems.size}/{items.length})
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  />
                  <span className="text-sm flex-1">{item.title}</span>
                  <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGenerateBatch}
              disabled={selectedItems.size === 0}
              className="gap-2 w-full"
              size="lg"
            >
              <Sparkles className="w-4 h-4" />
              Generate for {selectedItems.size} Item{selectedItems.size !== 1 ? "s" : ""}
            </Button>
          </div>
        )}

        {/* Progress Section */}
        {progress.inProgress && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Generating...</span>
                <span className="text-sm text-muted-foreground">
                  {progress.completed + progress.failed}/{progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">{progressPercentage}% complete</p>
            </div>

            <div className="flex gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{progress.completed}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{progress.total}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Processing items...</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.size > 0 && !progress.inProgress && (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Generation Complete!</p>
                <p className="text-xs text-green-700">
                  Successfully generated meta tags for {results.size} item{results.size !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Array.from(results.entries()).map(([itemId, tags]) => {
                const item = items.find((i) => i.id === itemId);
                return (
                  <div key={itemId} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold">{item?.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Title: {tags.title.substring(0, 50)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Description: {tags.description.substring(0, 50)}...
                    </p>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => {
                setResults(new Map());
                setProgress({ total: 0, completed: 0, failed: 0, inProgress: false });
              }}
              variant="outline"
              className="w-full"
            >
              Generate Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
