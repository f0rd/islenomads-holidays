import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Loader2, Search } from "lucide-react";

export default function IslandGuides() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAtoll, setSelectedAtoll] = useState<string | null>(null);

  // Fetch all island guides
  const { data: guides, isLoading, error } = trpc.islandGuides.list.useQuery();

  // Filter guides based on search and atoll selection
  const filteredGuides = guides?.filter((guide) => {
    const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAtoll = !selectedAtoll || guide.atoll === selectedAtoll;
    return matchesSearch && matchesAtoll;
  }) || [];

  // Get unique atolls for filter
  const atolls = Array.from(new Set(guides?.map((g) => g.atoll) || []));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-gray-600">Loading island guides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Guides</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Island Guides</h1>
          <p className="text-lg text-primary-foreground/90">
            Explore detailed guides to the Maldives' most beautiful islands
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container py-8">
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search islands by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Atoll Filter */}
          {atolls.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Filter by Atoll</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedAtoll === null ? "default" : "outline"}
                  onClick={() => setSelectedAtoll(null)}
                  size="sm"
                >
                  All Atolls
                </Button>
                {atolls.map((atoll) => (
                  <Button
                    key={atoll}
                    variant={selectedAtoll === atoll ? "default" : "outline"}
                    onClick={() => setSelectedAtoll(atoll)}
                    size="sm"
                  >
                    {atoll}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-gray-600">
            Showing {filteredGuides.length} of {guides?.length || 0} island guides
          </p>
        </div>
      </div>

      {/* Island Guides Grid */}
      <div className="container pb-16">
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No island guides found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => {
              // Parse images if they're JSON strings
              let images: Array<{ url: string; caption?: string }> = [];
              if (guide.images) {
                try {
                  images = typeof guide.images === "string" ? JSON.parse(guide.images) : guide.images;
                } catch (e) {
                  images = [];
                }
              }

              const featuredImage = images?.[0]?.url || "/placeholder-island.jpg";

              return (
                <Link key={guide.id} href={`/island/${guide.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    {/* Image */}
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={featuredImage}
                        alt={guide.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {guide.featured && (
                        <div className="absolute top-3 right-3 bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardHeader>
                      <CardTitle className="text-xl">{guide.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {guide.atoll} Atoll
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {guide.overview?.substring(0, 100) || "No description available"}
                      </p>



                      {/* View Guide Button */}
                      <Button className="w-full mt-4" size="sm">
                        View Full Guide
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
