import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, MapPin, Calendar, DollarSign, Loader2 } from "lucide-react";

export default function Packages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const itemsPerPage = 12;

  // Fetch all packages and categories
  const { data: packages = [], isLoading } = trpc.packages.list.useQuery();
  const { data: categories = [] } = trpc.packages.getCategories.useQuery();

  // Extract unique destinations and durations
  const destinations = useMemo(() => {
    const dests = new Set<string>();
    packages.forEach((pkg: any) => {
      if (pkg.destination) dests.add(pkg.destination);
    });
    return Array.from(dests).sort((a, b) => a.localeCompare(b));
  }, [packages]);

  const durations = useMemo(() => {
    const durs = new Set<string>();
    packages.forEach((pkg: any) => {
      if (pkg.duration) durs.add(pkg.duration);
    });
    return Array.from(durs).sort((a, b) => a.localeCompare(b));
  }, [packages]);

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let filtered = packages.filter((pkg: any) => {
      // Search filter
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || pkg.category === selectedCategory;

      // Destination filter
      const matchesDestination =
        !selectedDestination || pkg.destination === selectedDestination;

      // Price range filter
      let matchesPrice = true;
      if (priceRange !== "all") {
        const price = pkg.price;
        if (priceRange === "budget" && price > 2000) matchesPrice = false;
        if (priceRange === "mid" && (price < 2000 || price > 5000))
          matchesPrice = false;
        if (priceRange === "luxury" && price < 5000) matchesPrice = false;
      }

      // Duration filter
      const matchesDuration =
        !durationFilter || pkg.duration === durationFilter;

      // Only show published packages
      const isPublished = pkg.published === 1;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDestination &&
        matchesPrice &&
        matchesDuration &&
        isPublished
      );
    });

    // Sort packages
    if (sortBy === "price-low") {
      filtered.sort((a: any, b: any) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a: any, b: any) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (sortBy === "featured") {
      filtered.sort((a: any, b: any) => (b.featured || 0) - (a.featured || 0));
    }

    return filtered;
  }, [packages, searchQuery, selectedCategory, selectedDestination, priceRange, durationFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Vacation Packages
          </h1>
          <p className="text-lg opacity-90">
            Discover our curated collection of unforgettable Maldives experiences
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12">
        <div className="container">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Journey Type
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className="rounded-full"
              >
                All Packages
              </Button>
              {categories.map((cat: any) => (
                <Button
                  key={cat.id}
                  variant={
                    selectedCategory === cat.id ? "default" : "outline"
                  }
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className="rounded-full"
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Select value={selectedDestination || "all-destinations"} onValueChange={(value) => {
              setSelectedDestination(value === "all-destinations" ? "" : value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Destinations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-destinations">All Destinations</SelectItem>
                {destinations.map((dest) => (
                  <SelectItem key={dest} value={dest}>
                    {dest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={durationFilter || "all-durations"} onValueChange={(value) => {
              setDurationFilter(value === "all-durations" ? "" : value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Durations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-durations">All Durations</SelectItem>
                {durations.map((dur) => (
                  <SelectItem key={dur} value={dur}>
                    {dur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={(value) => {
              setPriceRange(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <DollarSign className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Budget (&lt;$2,000)</SelectItem>
                <SelectItem value="mid">Mid-Range ($2,000 - $5,000)</SelectItem>
                <SelectItem value="luxury">Luxury (&gt;$5,000)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {paginatedPackages.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPackages.length)} of{" "}
            {filteredPackages.length} packages
          </div>

          {/* Packages Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : paginatedPackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedPackages.map((pkg: any) => (
                  <Card
                    key={pkg.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  >
                    {pkg.image && (
                      <div className="h-48 overflow-hidden bg-muted">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg line-clamp-2">
                            {pkg.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {pkg.destination}
                          </p>
                        </div>
                        {pkg.featured === 1 && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                      {pkg.category && (
                        <div className="mt-2">
                          <Badge variant="secondary">
                            {categories.find((c: any) => c.id === pkg.category)?.label}
                          </Badge>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {pkg.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4" />
                          {pkg.duration}
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(pkg.price)}
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full"
                            onClick={() => setSelectedPackage(pkg)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{pkg.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {pkg.image && (
                              <img
                                src={pkg.image}
                                alt={pkg.name}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {pkg.description}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Duration
                                </p>
                                <p className="font-semibold">{pkg.duration}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Price
                                </p>
                                <p className="font-semibold text-primary">
                                  {formatPrice(pkg.price)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Destination
                                </p>
                                <p className="font-semibold">
                                  {pkg.destination}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Category
                                </p>
                                <p className="font-semibold">
                                  {categories.find((c: any) => c.id === pkg.category)?.label}
                                </p>
                              </div>
                            </div>
                            {pkg.highlights && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Highlights
                                </h4>
                                <ul className="text-sm space-y-1">
                                  {(() => {
                                    try {
                                      const parsed = typeof pkg.highlights === 'string' ? JSON.parse(pkg.highlights) : pkg.highlights;
                                      return Array.isArray(parsed) ? parsed : [pkg.highlights];
                                    } catch {
                                      return [pkg.highlights];
                                    }
                                  })().map(
                                    (h: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-primary">✓</span>
                                        {h}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                            {pkg.amenities && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Amenities
                                </h4>
                                <ul className="text-sm space-y-1">
                                  {(() => {
                                    try {
                                      const parsed = typeof pkg.amenities === 'string' ? JSON.parse(pkg.amenities) : pkg.amenities;
                                      return Array.isArray(parsed) ? parsed : [pkg.amenities];
                                    } catch {
                                      return [pkg.amenities];
                                    }
                                  })().map(
                                    (a: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        {a}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                            <Button className="w-full" size="lg">
                              Book This Package
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={
                          currentPage === page ? "default" : "outline"
                        }
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No packages found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
