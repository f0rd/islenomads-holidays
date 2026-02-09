/**
 * Home Page - Isle Nomads Holidays
 * Design: Matching published version - Clean, minimalist design with light backgrounds
 */

import { useAuth } from "@/_core/hooks/useAuth";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Anchor,
  Award,
  Heart,
  MapPin,
  Palmtree,
  Ship,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import ContactFormEnhanced from "@/components/ContactFormEnhanced";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  // Fetch featured packages from database
  const { data: allPackages = [], isLoading: packagesLoading } = trpc.packages.list.useQuery();

  // Fetch featured island guides from database
  const { data: featuredIslandGuides = [], isLoading: guidesLoading } = trpc.islandGuides.featured.useQuery({ limit: 3 });

  // Get featured packages (limit to 3 for display)
  const featuredPackages = useMemo(() => {
    return allPackages
      .filter((pkg: any) => pkg.featured)
      .slice(0, 3);
  }, [allPackages]);

  // Fallback to first 3 packages if no featured packages
  const displayPackages = useMemo(() => {
    return featuredPackages.length > 0 ? featuredPackages : allPackages.slice(0, 3);
  }, [featuredPackages, allPackages]);

  useEffect(() => {
    setIsVisible(true);
    // Set dynamic page title and meta tags for SEO
    document.title = "Maldives Luxury Vacations | Isle Nomads Travel Specialist";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Discover luxury Maldives vacations with Isle Nomads. Expert travel planning, premium resorts, and unforgettable island experiences.');
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'Maldives vacations, luxury travel, island resorts, Maldives holidays, travel specialist, Maldives packages');
    
    // Add Product/Service schema for vacation packages
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Maldives Vacation Packages",
      "description": "Premium vacation packages for Maldives island experiences",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Romantic Escape",
          "item": {
            "@type": "Product",
            "name": "Romantic Escape - 5 Days Maldives Vacation",
            "description": "Perfect for couples seeking an intimate getaway with luxury accommodations and private experiences",
            "price": "2999",
            "priceCurrency": "USD",
            "duration": "P5D",
            "image": "https://islenomads.com/images/romantic-escape.jpg",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "120"
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Ultimate Paradise",
          "item": {
            "@type": "Product",
            "name": "Ultimate Paradise - 7 Days Maldives Vacation",
            "description": "The ultimate all-inclusive Maldives experience with premium amenities and exclusive island hopping adventures",
            "price": "4999",
            "priceCurrency": "USD",
            "duration": "P7D",
            "image": "https://islenomads.com/images/ultimate-paradise.jpg",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "250"
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Island Explorer",
          "item": {
            "@type": "Product",
            "name": "Island Explorer - 6 Days Maldives Vacation",
            "description": "Discover the hidden gems of the Maldives with guided tours and authentic cultural experiences",
            "price": "3499",
            "priceCurrency": "USD",
            "duration": "P6D",
            "image": "https://islenomads.com/images/island-explorer.jpg",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "180"
            }
          }
        }
      ]
    };
    
    let productSchemaScript = document.querySelector('script[data-schema="products"]') as HTMLScriptElement | null;
    if (!productSchemaScript) {
      productSchemaScript = document.createElement('script');
      productSchemaScript.type = 'application/ld+json';
      productSchemaScript.setAttribute('data-schema', 'products');
      productSchemaScript.textContent = JSON.stringify(productSchema);
      document.head.appendChild(productSchemaScript);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-gray-100 to-white">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('/images/dSNI52ZQPtA9.jpg')",
          }}
        />

        {/* Hero Content */}
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
              <Sparkles size={16} />
              Discover Your Paradise
            </div>

            {/* Main Title */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-tight font-bold transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Escape to the
              <br />
              <span className="text-teal-500">Maldives</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Experience luxury island living with pristine beaches, crystal-clear waters, and unforgettable moments. Your dream vacation awaits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/packages">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold bg-teal-500 text-white hover:bg-teal-600 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Plan Your Trip
                </Button>
              </Link>
              <Link href="#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Overlay */}
        <div className="absolute -bottom-24 left-0 right-0 z-20">
          <div className="container">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { number: "500+", label: "Happy Travelers" },
                { number: "50+", label: "Island Resorts" },
                { number: "15+", label: "Years Experience" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-gray-200 text-center shadow-sm"
                >
                  <div className="text-3xl md:text-4xl font-bold text-teal-500">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white pt-32">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Isle Nomads?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We craft personalized Maldives experiences that exceed expectations, combining luxury, adventure, and authentic island culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Anchor,
                title: "Expert Guidance",
                description: "15+ years of Maldives travel expertise at your service",
              },
              {
                icon: Heart,
                title: "Personalized Service",
                description: "Tailored itineraries designed around your dreams",
              },
              {
                icon: Award,
                title: "Best Resorts",
                description: "Exclusive access to 50+ luxury island properties",
              },
              {
                icon: Sparkles,
                title: "Unforgettable Memories",
                description: "Creating moments that last a lifetime",
              },
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card
                  key={index}
                  className="border border-teal-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-teal-50 hover:border-teal-400"
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-teal-100 rounded-full">
                        <IconComponent size={32} className="text-teal-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore handpicked island paradises, each offering unique experiences and breathtaking beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guidesLoading ? (
              <div className="col-span-3 flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              </div>
            ) : featuredIslandGuides.length > 0 ? (
              featuredIslandGuides.map((guide: any) => {
                const images = typeof guide.images === 'string' ? JSON.parse(guide.images || '[]') : (guide.images || []);
                const firstImage = images.length > 0 ? images[0] : '/images/default-island.jpg';
                
                return (
                  <Card
                    key={guide.id}
                    className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-64 overflow-hidden">
                      <img
                        src={firstImage}
                        alt={guide.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-teal-500 font-semibold mb-2">
                        {guide.atoll || 'Maldives'}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {guide.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {guide.overview || 'Discover the beauty of this island paradise'}
                      </p>
                      <Link href={`/island-guide/${guide.slug}`}>
                        <Button
                          variant="outline"
                          className="w-full border-teal-500 text-teal-500 hover:bg-teal-50"
                        >
                          Explore More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600">No featured destinations available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vacation Packages - Dynamic from Database */}
      <section className="py-20 bg-gradient-to-b from-teal-50 via-cyan-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vacation Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carefully curated packages designed to make your Maldives dream vacation effortless and unforgettable.
            </p>
          </div>

          {packagesLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
          ) : displayPackages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No packages available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {displayPackages.map((pkg: any, index: number) => (
                  <Card
                    key={pkg.id || index}
                    className={`border-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                      pkg.featured ? "border-teal-500 relative" : "border-gray-200"
                    }`}
                  >
                    {pkg.featured && (
                      <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-20">
                        Featured
                      </div>
                    )}
                    {pkg.image && (
                      <div className="w-full h-48 overflow-hidden bg-gray-200">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-teal-500">
                          ${pkg.price}
                        </span>
                        <span className="text-gray-600 ml-2">per person</span>
                      </div>
                      <p className="text-gray-600 mb-6">{pkg.duration}</p>

                      <div className="mb-8">
                        <p className="text-gray-700 text-sm line-clamp-3">{pkg.description}</p>
                      </div>

                      {pkg.highlights && (
                        <ul className="space-y-3 mb-8">
                          {(Array.isArray(pkg.highlights) ? pkg.highlights : []).slice(0, 3).map((highlight: any, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-teal-500 mt-1">✓</span>
                              <span className="text-gray-700 text-sm">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <Link href="/packages">
                        <Button
                          className={`w-full rounded-full py-6 text-lg font-semibold transition-all duration-300 ${
                            pkg.featured
                              ? "bg-teal-500 text-white hover:bg-teal-600"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          Book Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* View All Packages Button */}
              <div className="text-center mt-12">
                <Link href="/packages">
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-lg font-semibold bg-teal-500 text-white hover:bg-teal-600 shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    View All Packages
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Unique Experiences */}
      <section className="py-20 bg-gradient-to-b from-white via-teal-50 to-cyan-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Unique Experiences
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in activities that showcase the natural beauty and vibrant culture of the Maldives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Waves,
                title: "Water Sports",
                description: "Snorkeling, diving, surfing, and jet skiing in crystal-clear waters",
              },
              {
                icon: Ship,
                title: "Island Hopping",
                description: "Explore multiple islands and discover hidden gems",
              },
              {
                icon: Palmtree,
                title: "Beach Relaxation",
                description: "Unwind on pristine white sand beaches with turquoise waters",
              },
              {
                icon: Users,
                title: "Cultural Tours",
                description: "Experience local Maldivian culture and traditions",
              },
              {
                icon: Heart,
                title: "Wellness Retreats",
                description: "Spa treatments and yoga sessions in paradise",
              },
              {
                icon: MapPin,
                title: "Adventure Activities",
                description: "Fishing, dolphin watching, and sunset cruises",
              },
            ].map((experience, index) => {
              const IconComponent = experience.icon;
              return (
                <Card
                  key={index}
                  className="border border-teal-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-teal-50 hover:border-teal-400"
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-teal-100 rounded-full">
                        <IconComponent size={32} className="text-teal-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {experience.title}
                    </h3>
                    <p className="text-gray-600">{experience.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-cyan-50 via-teal-50 to-teal-100">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Plan Your Dream Vacation?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Get in touch with our travel experts to create your perfect Maldives experience.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <ContactFormEnhanced />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
