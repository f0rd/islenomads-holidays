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
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const itemsPerPage = 12;

  // Fetch all packages
  const { data: packages = [], isLoading } = trpc.packages.list.useQuery();

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
  }, [packages, searchQuery, selectedDestination, priceRange, durationFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPackages.slice(start, start + itemsPerPage);
  }, [filteredPackages, currentPage]);

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleDurationChange = (value: string) => {
    setDurationFilter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDestination("");
    setPriceRange("all");
    setDurationFilter("");
    setSortBy("featured");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 py-12 bg-gradient-to-b from-primary/5 to-background pt-24">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Our Vacation Packages
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our curated selection of unforgettable Maldives experiences.
              Find the perfect package for your dream vacation.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search packages by name, destination, or description..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 py-6 text-base"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* Destination Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <Select value={selectedDestination || "all"} onValueChange={handleDestinationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <Select value={priceRange} onValueChange={handlePriceRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Budget (&lt; $2,000)</SelectItem>
                  <SelectItem value="mid">Mid-Range ($2,000 - $5,000)</SelectItem>
                  <SelectItem value="luxury">Luxury (&gt; $5,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Select value={durationFilter || "all"} onValueChange={handleDurationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Durations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  {durations.map((dur) => (
                    <SelectItem key={dur} value={dur}>
                      {dur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {paginatedPackages.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPackages.length)} of{" "}
            {filteredPackages.length} packages
          </div>

          {/* Packages Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : paginatedPackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedPackages.map((pkg: any) => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Package Image */}
                    {pkg.image && (
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                        {pkg.featured === 1 && (
                          <Badge className="absolute top-4 right-4 bg-accent text-primary">
                            Featured
                          </Badge>
                        )}
                      </div>
                    )}

                    <CardHeader>
                      <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {pkg.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Package Details */}
                      <div className="space-y-2 text-sm">
                        {pkg.destination && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{pkg.destination}</span>
                          </div>
                        )}
                        {pkg.duration && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{pkg.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-accent font-semibold">
                          <DollarSign className="w-4 h-4" />
                          <span>${pkg.price.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Highlights */}
                      {pkg.highlights && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Highlights:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {pkg.highlights
                              .split(",")
                              .slice(0, 3)
                              .map((highlight: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {highlight.trim()}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* View Details Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full bg-accent text-primary hover:bg-accent/90"
                            onClick={() => setSelectedPackage(pkg)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        {selectedPackage?.id === pkg.id && (
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">
                                {selectedPackage.name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Image */}
                              {selectedPackage.image && (
                                <img
                                  src={selectedPackage.image}
                                  alt={selectedPackage.name}
                                  className="w-full h-64 object-cover rounded-lg"
                                />
                              )}

                              {/* Description */}
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-muted-foreground">
                                  {selectedPackage.description}
                                </p>
                              </div>

                              {/* Package Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Destination</p>
                                  <p className="font-semibold">{selectedPackage.destination}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Duration</p>
                                  <p className="font-semibold">{selectedPackage.duration}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Price</p>
                                  <p className="font-semibold text-accent text-lg">
                                    ${selectedPackage.price.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  <p className="font-semibold">
                                    {selectedPackage.published === 1
                                      ? "Available"
                                      : "Coming Soon"}
                                  </p>
                                </div>
                              </div>

                              {/* Highlights */}
                              {selectedPackage.highlights && (
                                <div>
                                  <h4 className="font-semibold mb-3">Highlights</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPackage.highlights
                                      .split(",")
                                      .map((highlight: string, idx: number) => (
                                        <Badge key={idx} variant="secondary">
                                          {highlight.trim()}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Amenities */}
                              {selectedPackage.amenities && (
                                <div>
                                  <h4 className="font-semibold mb-3">Amenities</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPackage.amenities
                                      .split(",")
                                      .map((amenity: string, idx: number) => (
                                        <Badge key={idx} variant="outline">
                                          {amenity.trim()}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Book Now Button */}
                              <Button className="w-full bg-accent text-primary hover:bg-accent/90 py-6 text-lg">
                                Book Now
                              </Button>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-accent text-primary hover:bg-accent/90"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground mb-4">
                No packages found matching your criteria.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
