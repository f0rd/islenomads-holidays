/**
 * Home Page - Isle Nomads Holidays
 * Design: Organic Fluidity - Curved sections, natural flow, earth-meets-ocean palette
 */

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Anchor,
  Award,
  Calendar,
  Heart,
  MapPin,
  Palmtree,
  Phone,
  Sparkles,
  Star,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/dSNI52ZQPtA9.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-background" />
        </div>

        {/* Hero Content */}
        <div
          className={`container relative z-10 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block px-6 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-4">
              <span className="text-white font-display font-medium text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Discover Your Paradise
              </span>
            </div>

            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
              Escape to the
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                Maldives
              </span>
            </h1>

            <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Experience luxury island living with pristine beaches, crystal-clear waters, and unforgettable moments. Your dream vacation awaits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-display font-semibold shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Plan Your Trip
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg font-display font-semibold bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-12">
              {[
                { number: "500+", label: "Happy Travelers" },
                { number: "50+", label: "Island Resorts" },
                { number: "15+", label: "Years Experience" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20"
                >
                  <div className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="font-body text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="wave-divider">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="fill-background"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              Why Choose Isle Nomads?
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              We craft personalized Maldives experiences that exceed expectations, combining luxury, adventure, and authentic island culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Expert Guidance",
                description: "15+ years of Maldives travel expertise at your service",
              },
              {
                icon: Heart,
                title: "Personalized Service",
                description: "Tailored itineraries designed around your dreams",
              },
              {
                icon: Star,
                title: "Best Resorts",
                description: "Exclusive access to 50+ luxury island properties",
              },
              {
                icon: Sparkles,
                title: "Unforgettable Memories",
                description: "Creating moments that last a lifetime",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 rounded-3xl overflow-hidden bg-card hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="relative py-24 bg-gradient-to-br from-accent/10 to-primary/10">
        {/* Top Wave Divider */}
        <div className="wave-divider top-0 rotate-180">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="fill-background"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>

        <div className="container pt-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              Featured Destinations
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Explore handpicked island paradises, each offering unique experiences and breathtaking beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: "/images/2HotXIyREgcc.jpg",
                title: "Luxury Water Villas",
                location: "North Malé Atoll",
                description: "Overwater bungalows with private infinity pools",
              },
              {
                image: "/images/GrTu06kOyGsW.jpg",
                title: "Private Island Resorts",
                location: "South Ari Atoll",
                description: "Exclusive island experiences with pristine beaches",
              },
              {
                image: "/images/qjapGQ7gVlNW.jpg",
                title: "Romantic Getaways",
                location: "Baa Atoll",
                description: "Perfect honeymoon destinations in paradise",
              },
            ].map((destination, index) => (
              <Card
                key={index}
                className="group overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-card"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-body text-sm">{destination.location}</span>
                    </div>
                    <h3 className="font-display font-semibold text-xl text-white">
                      {destination.title}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="font-body text-muted-foreground leading-relaxed mb-4">
                    {destination.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full rounded-full font-display font-semibold"
                  >
                    Explore More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Wave Divider */}
        <div className="wave-divider">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="fill-background"
          >
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
          </svg>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              Vacation Packages
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Carefully curated packages designed to make your Maldives dream vacation effortless and unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Romantic Escape",
                price: "$2,999",
                duration: "5 Days / 4 Nights",
                image: "/images/lnIvrZgcYPLM.jpg",
                features: [
                  "Luxury water villa accommodation",
                  "Private candlelit beach dinner",
                  "Couples spa treatment",
                  "Sunset dolphin cruise",
                  "Airport transfers included",
                ],
                popular: false,
              },
              {
                name: "Ultimate Paradise",
                price: "$4,999",
                duration: "7 Days / 6 Nights",
                image: "/images/dSNI52ZQPtA9.jpg",
                features: [
                  "Premium overwater villa with pool",
                  "All-inclusive dining & drinks",
                  "Snorkeling & diving excursions",
                  "Island hopping adventure",
                  "Spa & wellness package",
                  "Personal concierge service",
                ],
                popular: true,
              },
              {
                name: "Island Explorer",
                price: "$3,499",
                duration: "6 Days / 5 Nights",
                image: "/images/qjapGQ7gVlNW.jpg",
                features: [
                  "Beach villa accommodation",
                  "Daily breakfast included",
                  "Water sports activities",
                  "Guided snorkeling tours",
                  "Cultural island visit",
                ],
                popular: false,
              },
            ].map((pkg, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
                  pkg.popular
                    ? "border-4 border-primary shadow-xl scale-105"
                    : "border-2 hover:border-primary/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-4 py-2 rounded-full font-display font-semibold text-sm shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                </div>

                <CardContent className="p-8">
                  <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display font-bold text-4xl text-primary">
                      {pkg.price}
                    </span>
                    <span className="font-body text-muted-foreground">per person</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <Calendar className="w-4 h-4" />
                    <span className="font-body text-sm">{pkg.duration}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span className="font-body text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-full font-display font-semibold ${
                      pkg.popular ? "shadow-lg" : ""
                    }`}
                    size="lg"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="relative py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        {/* Top Wave Divider */}
        <div className="wave-divider top-0 rotate-180">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="fill-background"
          >
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
          </svg>
        </div>

        <div className="container pt-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              Unique Experiences
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Immerse yourself in activities that showcase the natural beauty and vibrant culture of the Maldives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Waves,
                title: "Water Sports",
                description: "Surfing, jet skiing, parasailing, and more thrilling activities",
              },
              {
                icon: Anchor,
                title: "Diving & Snorkeling",
                description: "Explore vibrant coral reefs and swim with marine life",
              },
              {
                icon: Palmtree,
                title: "Island Hopping",
                description: "Discover multiple islands and experience local culture",
              },
              {
                icon: Heart,
                title: "Spa & Wellness",
                description: "Rejuvenate with traditional treatments and modern therapies",
              },
              {
                icon: Star,
                title: "Sunset Cruises",
                description: "Romantic sailing experiences with dolphin watching",
              },
              {
                icon: Sparkles,
                title: "Fine Dining",
                description: "Gourmet cuisine with ocean views and private beach setups",
              },
            ].map((experience, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 rounded-3xl overflow-hidden bg-card/80 backdrop-blur-sm hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <experience.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-3 text-foreground">
                    {experience.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {experience.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Wave Divider */}
        <div className="wave-divider">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="fill-background"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/2HotXIyREgcc.jpg"
                  alt="Luxury island resort in Maldives"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -z-10" />
            </div>

            <div className="space-y-6">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
                About Isle Nomads Holidays
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                For over 15 years, Isle Nomads Holidays has been crafting extraordinary Maldives experiences for travelers seeking paradise. Based in DMCC, Dubai, we specialize in creating personalized island getaways that blend luxury, adventure, and authentic cultural immersion.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Our team of Maldives experts has personally visited every resort we recommend, ensuring that your vacation exceeds expectations. From intimate honeymoon escapes to family adventures, we handle every detail so you can focus on creating memories that last a lifetime.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { number: "500+", label: "Happy Clients" },
                  { number: "50+", label: "Partner Resorts" },
                  { number: "15+", label: "Years Experience" },
                  { number: "98%", label: "Satisfaction Rate" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary/20"
                  >
                    <div className="font-display font-bold text-3xl text-primary mb-1">
                      {stat.number}
                    </div>
                    <div className="font-body text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="rounded-full font-display font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mt-6"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/GrTu06kOyGsW.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/80 to-primary/90" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="font-body text-xl text-white/90 leading-relaxed">
              Let us create your perfect Maldives escape. Contact our travel experts today and turn your island dreams into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg font-display font-semibold bg-white text-foreground hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg font-display font-semibold bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
