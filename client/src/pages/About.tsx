import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Globe,
  Heart,
  MapPin,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const teamMembers = [
    {
      name: "Ahmed Hassan",
      role: "Founder & CEO",
      bio: "Travel enthusiast with 15+ years of experience in luxury hospitality and island resort management.",
      image: "👨‍💼",
    },
    {
      name: "Fatima Ali",
      role: "Head of Experiences",
      bio: "Expert in curating personalized travel experiences and managing premium island packages.",
      image: "👩‍💼",
    },
    {
      name: "Mohamed Ibrahim",
      role: "Destination Specialist",
      bio: "Local Maldivian guide with deep knowledge of atolls, marine life, and cultural experiences.",
      image: "👨‍🌾",
    },
    {
      name: "Sarah Johnson",
      role: "Travel Consultant",
      bio: "Passionate about matching travelers with their perfect island destination and creating unforgettable memories.",
      image: "👩‍💼",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description:
        "We love what we do and it shows in every interaction with our clients.",
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description:
        "Understanding diverse travel needs from clients around the world.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Committed to delivering the highest quality service and experiences.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building lasting relationships with our clients, partners, and local communities.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Constantly improving our services with cutting-edge technology and creative solutions.",
    },
    {
      icon: MapPin,
      title: "Local Expertise",
      description:
        "Deep knowledge of the Maldives and its hidden gems, shared with authenticity.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Isle Nomads</h1>
          <p className="text-lg md:text-xl opacity-90">
            Your gateway to paradise. Discover the Maldives with personalized travel experiences and unforgettable memories.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Isle Nomads Holidays was founded with a simple mission: to help travelers discover the true beauty and magic of the Maldives. What started as a passion project has grown into a trusted travel specialist serving thousands of happy clients from around the world.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              We believe that the Maldives is more than just luxury resorts and pristine beaches. It's a destination of incredible diversity, rich culture, and unforgettable experiences. Our team works tirelessly to uncover hidden gems, connect you with local experiences, and create personalized itineraries that match your unique travel style.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're seeking adventure, relaxation, romance, or cultural immersion, we're here to make your Maldives dream a reality.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            {[
              { number: "15+", label: "Years Experience" },
              { number: "500+", label: "Happy Travelers" },
              { number: "50+", label: "Island Resorts" },
              { number: "20", label: "Atolls Covered" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Icon className="w-10 h-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4 text-center">{member.image}</div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-accent font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Custom Trip Planning",
                description:
                  "Personalized itineraries tailored to your preferences, budget, and travel style.",
              },
              {
                title: "Luxury Resort Selection",
                description:
                  "Expert recommendations for the best resorts and accommodations in the Maldives.",
              },
              {
                title: "Island Hopping Design",
                description:
                  "Multi-island experiences that showcase the diversity and beauty of the Maldives.",
              },
              {
                title: "Water Sports Coordination",
                description:
                  "Arrange diving, snorkeling, surfing, and other water activities with local experts.",
              },
              {
                title: "Wellness Experiences",
                description:
                  "Spa treatments, yoga retreats, and wellness programs for ultimate relaxation.",
              },
              {
                title: "Diving Expeditions",
                description:
                  "Professional diving guides and expeditions to the best dive sites in the Maldives.",
              },
            ].map((service, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-foreground">Ready to Explore the Maldives?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Let us help you plan your perfect island getaway. Contact us today to start your journey to paradise.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/trip-planner">
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Plan Your Trip
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
