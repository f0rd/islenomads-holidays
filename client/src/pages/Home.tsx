/**
 * Home Page - Isle Nomads Holidays
 * Design: Matching published version - Clean, minimalist design with light backgrounds
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
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-teal-500 text-white hover:bg-teal-600 shadow-lg transition-all duration-300 hover:scale-105"
              >
                Plan Your Trip
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              >
                Contact Us
              </Button>
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
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
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
                className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-teal-500 font-semibold mb-2">
                    {destination.location}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {destination.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <Button
                    variant="outline"
                    className="w-full border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    Explore More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vacation Packages */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vacation Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carefully curated packages designed to make your Maldives dream vacation effortless and unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Romantic Escape",
                price: 2999,
                duration: "5 Days / 4 Nights",
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
                title: "Ultimate Paradise",
                price: 4999,
                duration: "7 Days / 6 Nights",
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
                title: "Island Explorer",
                price: 3499,
                duration: "6 Days / 5 Nights",
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
                className={`border-2 shadow-sm hover:shadow-lg transition-all duration-300 ${
                  pkg.popular ? "border-teal-500 relative" : "border-gray-200"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.title}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-teal-500">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-600 ml-2">per person</span>
                  </div>
                  <p className="text-gray-600 mb-6">{pkg.duration}</p>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-teal-500 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-full py-6 text-lg font-semibold transition-all duration-300 ${
                      pkg.popular
                        ? "bg-teal-500 text-white hover:bg-teal-600"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
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

      {/* Unique Experiences */}
      <section className="py-20 bg-gray-50">
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
                description: "Surfing, jet skiing, parasailing, and more thrilling activities",
              },
              {
                icon: Ship,
                title: "Diving & Snorkeling",
                description: "Explore vibrant coral reefs and swim with marine life",
              },
              {
                icon: MapPin,
                title: "Island Hopping",
                description: "Discover multiple islands and experience local culture",
              },
              {
                icon: Heart,
                title: "Spa & Wellness",
                description: "Rejuvenate with traditional treatments and modern therapies",
              },
              {
                icon: Palmtree,
                title: "Sunset Cruises",
                description: "Romantic sailing experiences with dolphin watching",
              },
              {
                icon: Sparkles,
                title: "Fine Dining",
                description: "Gourmet cuisine with ocean views and private beach setups",
              },
            ].map((experience, index) => {
              const IconComponent = experience.icon;
              return (
                <Card
                  key={index}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                >
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-teal-100 rounded-full">
                        <IconComponent size={32} className="text-teal-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                      {experience.title}
                    </h3>
                    <p className="text-gray-600 text-center">
                      {experience.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About Isle Nomads Holidays
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                For over 15 years, Isle Nomads Holidays has been crafting extraordinary Maldives experiences for travelers seeking paradise. Based in Malé, Maldives, we specialize in creating personalized island getaways that blend luxury, adventure, and authentic cultural immersion.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our team of Maldives experts has personally visited every resort we recommend, ensuring that your vacation exceeds expectations. From intimate honeymoon escapes to family adventures, we handle every detail so you can focus on creating memories that last a lifetime.
              </p>
              <Button className="bg-teal-500 text-white hover:bg-teal-600 rounded-full px-8 py-6 text-lg">
                Learn More About Us
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "500+", label: "Happy Clients" },
                { number: "50+", label: "Partner Resorts" },
                { number: "15+", label: "Years Experience" },
                { number: "98%", label: "Satisfaction Rate" },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="border border-gray-200 shadow-sm bg-white text-center"
                >
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-teal-500 mb-2">
                      {stat.number}
                    </div>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our packages? Want to customize your trip? Fill out the form below and our team will respond within 24 hours.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Let us create your perfect Maldives escape. Contact our travel experts today and turn your island dreams into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-teal-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold">
              Call Us Now
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg font-semibold"
            >
              Request a Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
