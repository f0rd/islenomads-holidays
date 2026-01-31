/**
 * Home Page - Isle Nomads Experiences
 * Design: islenomads.com inspired - Dark teal + Bright cyan, modern travel booking style
 */

import { useAuth } from "@/_core/hooks/useAuth";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
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
import { useEffect, useState } from "react";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/dSNI52ZQPtA9.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/85" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight font-bold transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Your Ultimate Travel
              <br />
              <span className="text-accent">Experience Designer</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Experience luxury island living with pristine beaches, crystal-clear waters, and unforgettable moments. Your dream vacation awaits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="rounded-md px-8 py-6 text-lg font-semibold bg-accent text-primary hover:bg-accent/90 shadow-lg transition-all duration-300 hover:scale-105"
              >
                Plan Your Trip
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-md px-8 py-6 text-lg font-semibold bg-primary-foreground/20 backdrop-blur-md border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/30 transition-all duration-300 hover:scale-105"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Overlay */}
        <div className="absolute bottom-12 left-0 right-0 z-20">
          <div className="container">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { number: "15+", label: "Years Experience" },
                { number: "50+", label: "Island Resorts" },
                { number: "500+", label: "Happy Travelers" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-primary/80 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/20 text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-accent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-primary-foreground/80 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most viewed and all-time top selling services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Ultimate Flexibility",
                description: "You're in control, with free cancellation and payment options.",
              },
              {
                icon: Heart,
                title: "Memorable Experiences",
                description: "Browse and book tours and activities so incredible.",
              },
              {
                icon: Award,
                title: "Quality at your core",
                description: "Choose your own experience with premium selections.",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 border-0 rounded-lg overflow-hidden bg-primary text-primary-foreground hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-foreground mb-4">
              Choose Your Own Experience
            </h2>
            <p className="font-text-lg text-muted-foreground leading-relaxed">
              Explore our carefully curated selection of services and activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Island Specialist",
                description: "Customized itineraries and island-hopping holidays designed around your dreams",
              },
              {
                icon: Ship,
                title: "Luxury Transfers",
                description: "Premium boat and land transfers with experienced guides and modern fleet",
              },
              {
                icon: Heart,
                title: "Weddings & Events",
                description: "Bespoke wedding and special event planning in paradise settings",
              },
              {
                icon: Waves,
                title: "Unique Excursions",
                description: "Carefully curated activities showcasing the best of the Maldives",
              },
              {
                icon: Award,
                title: "Private VIP Tours",
                description: "Personalized island experiences based on deep local knowledge",
              },
              {
                icon: Users,
                title: "Group Handling",
                description: "Professional coordination for large groups and incentive travel",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-accent rounded-lg overflow-hidden bg-card hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-foreground mb-4">
              Find Best Accommodation
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore handpicked island paradises, each offering unique experiences and breathtaking beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "/images/2HotXIyREgcc.jpg",
                title: "Luxury Water Villas",
                location: "North Malé Atoll",
              },
              {
                image: "/images/GrTu06kOyGsW.jpg",
                title: "Private Island Resorts",
                location: "South Ari Atoll",
              },
              {
                image: "/images/qjapGQ7gVlNW.jpg",
                title: "Romantic Getaways",
                location: "Baa Atoll",
              },
            ].map((destination, index) => (
              <Card
                key={index}
                className="group overflow-hidden rounded-lg border-2 hover:border-accent transition-all duration-500 hover:shadow-xl hover:scale-105 bg-card"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                    <h3 className="font-bold text-xl mb-1">
                      {destination.title}
                    </h3>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {destination.location}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-foreground mb-4">
              Vacation Packages
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
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
                className={`overflow-hidden rounded-lg border-2 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
                  pkg.popular
                    ? "border-accent bg-accent/5 ring-2 ring-accent"
                    : "border-border hover:border-accent bg-card"
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 bg-accent text-primary px-4 py-2 rounded-full font-bold text-sm">
                      Most Popular
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-2xl mb-2 text-foreground">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-accent">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground">per person</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {pkg.duration}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent font-bold mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-md font-semibold ${
                      pkg.popular
                        ? "bg-accent text-primary hover:bg-accent/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/images/2HotXIyREgcc.jpg"
                  alt="Luxury island resort in Maldives"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-bold text-4xl md:text-5xl text-foreground">
                About Isle Nomads Experiences
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                For over 15 years, Isle Nomads Experiences has been crafting extraordinary Maldives experiences for travelers seeking paradise. Based in DMCC, Dubai, we specialize in creating personalized island getaways that blend luxury, adventure, and authentic cultural immersion.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our team of Maldives experts has personally visited every resort we recommend, ensuring that your vacation exceeds expectations. From intimate honeymoon escapes to family adventures, we handle every detail so you can focus on creating memories that last a lifetime.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { number: "500+", label: "Happy Clients" },
                  { number: "50+", label: "Partner Resorts" },
                  { number: "15+", label: "Years Experience" },
                  { number: "98%", label: "Satisfaction Rate" },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-accent">
                      {stat.number}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <Button className="rounded-md px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-105">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-bold text-4xl md:text-5xl mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Have questions about our packages? Want to customize your trip? Fill out the form below and our team will respond within 24 hours.
              </p>
            </div>
            <ContactForm />
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
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/85 to-primary/90" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-bold text-4xl md:text-5xl text-primary-foreground">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Let us create your perfect Maldives escape. Contact our travel experts today and turn your island dreams into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="rounded-md px-8 py-6 text-lg font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Call Us Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-md px-8 py-6 text-lg font-semibold bg-accent text-primary hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-xl border-0"
              >
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
