import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  FileText,
  Package,
  BookOpen,
  MapPin,
  RefreshCw,
  Download,
} from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  type: "blog" | "package" | "island-guide" | "location";
  seoScore: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  issues: string[];
  recommendations: string[];
}

const mockContentData: ContentItem[] = [
  {
    id: 1,
    title: "Maldives Diving Guide",
    type: "blog",
    seoScore: 85,
    metaTitle: "Complete Maldives Diving Guide | Isle Nomads",
    metaDescription: "Discover the best diving spots in Maldives with our comprehensive guide covering depths, marine life, and safety tips.",
    keywords: "Maldives diving, dive sites, underwater",
    issues: [],
    recommendations: [
      "Add more internal links to related articles",
      "Include video content for better engagement",
    ],
  },
  {
    id: 2,
    title: "Luxury Maldives Package",
    type: "package",
    seoScore: 72,
    metaTitle: "Luxury Maldives Vacation Package",
    metaDescription: "Experience luxury in Maldives with our all-inclusive package.",
    keywords: "Maldives package, luxury vacation",
    issues: [
      "Meta description is too short (under 120 characters)",
      "Missing focus keyword in first paragraph",
    ],
    recommendations: [
      "Expand meta description to 120-160 characters",
      "Add schema markup for pricing and availability",
      "Include customer reviews and testimonials",
    ],
  },
  {
    id: 3,
    title: "Malé City Guide",
    type: "island-guide",
    seoScore: 68,
    metaTitle: "Malé City",
    metaDescription: "Guide to Malé",
    keywords: "Malé, Maldives",
    issues: [
      "Meta title is too short",
      "Meta description is too short",
      "Missing H1 tag",
      "Low keyword density",
    ],
    recommendations: [
      "Expand meta title to include main keywords",
      "Write a more descriptive meta description",
      "Add comprehensive H1 tag",
      "Increase keyword density naturally",
    ],
  },
];

export default function AdminSEOOptimizer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "issues">("score");

  const filteredContent = useMemo(() => {
    let filtered = mockContentData;

    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "score") {
      filtered = [...filtered].sort((a, b) => b.seoScore - a.seoScore);
    } else {
      filtered = [...filtered].sort((a, b) => b.issues.length - a.issues.length);
    }

    return filtered;
  }, [searchTerm, selectedType, sortBy]);

  const averageScore = Math.round(
    mockContentData.reduce((sum, item) => sum + item.seoScore, 0) / mockContentData.length
  );

  const contentWithIssues = mockContentData.filter((item) => item.issues.length > 0).length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="w-4 h-4" />;
      case "package":
        return <Package className="w-4 h-4" />;
      case "island-guide":
        return <BookOpen className="w-4 h-4" />;
      case "location":
        return <MapPin className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">SEO Optimizer</h1>
        <p className="text-muted-foreground mt-2">
          Analyze and optimize your content for search engines
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average SEO Score</p>
              <p className="text-3xl font-bold">{averageScore}</p>
              <p className="text-xs text-green-600">↑ 5% from last week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Content</p>
              <p className="text-3xl font-bold">{mockContentData.length}</p>
              <p className="text-xs text-muted-foreground">Items analyzed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Issues Found</p>
              <p className="text-3xl font-bold text-red-600">{contentWithIssues}</p>
              <p className="text-xs text-red-600">Need attention</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Optimized Content</p>
              <p className="text-3xl font-bold text-green-600">
                {mockContentData.length - contentWithIssues}
              </p>
              <p className="text-xs text-green-600">Excellent SEO</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Content Analysis</CardTitle>
          <CardDescription>Search and filter content by SEO performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Types</option>
              <option value="blog">Blog Posts</option>
              <option value="package">Packages</option>
              <option value="island-guide">Island Guides</option>
              <option value="location">Locations</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "issues")}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="score">Sort by Score</option>
              <option value="issues">Sort by Issues</option>
            </select>

            <Button className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Analyze All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${getScoreColor(item.seoScore)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.type.replace("-", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(item.seoScore)}`}>
                      {item.seoScore}
                    </div>
                    <p className="text-xs text-muted-foreground">SEO Score</p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                  {item.metaTitle && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Meta Title</p>
                      <p className="text-sm truncate">{item.metaTitle}</p>
                    </div>
                  )}
                  {item.metaDescription && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Meta Description</p>
                      <p className="text-sm truncate">{item.metaDescription}</p>
                    </div>
                  )}
                </div>

                {/* Issues and Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Issues */}
                  {item.issues.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <p className="font-semibold text-sm">Issues ({item.issues.length})</p>
                      </div>
                      <ul className="space-y-1">
                        {item.issues.map((issue, idx) => (
                          <li key={idx} className="text-sm text-red-600 flex gap-2">
                            <span>•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {item.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="font-semibold text-sm">Recommendations</p>
                      </div>
                      <ul className="space-y-1">
                        {item.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-green-600 flex gap-2">
                            <span>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm">
                    Edit Content
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Report */}
      <Card>
        <CardHeader>
          <CardTitle>Export SEO Report</CardTitle>
          <CardDescription>Generate and download comprehensive SEO analysis reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF Report
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download CSV Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
