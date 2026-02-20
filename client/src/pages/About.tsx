/**
 * About Page - Isle Nomads
 * Learn about our company, mission, and team
 */

import { Heart, Users, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Passion for Travel",
      description: "We love what we do and it shows in every experience we create",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building lasting relationships with our guests and local partners",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly improving our services with cutting-edge technology",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Committed to preserving the Maldives for future generations",
    },
  ];

  const team = [
    {
      name: "Ahmed Hassan",
      role: "Founder & CEO",
      bio: "15+ years of Maldives travel expertise",
    },
    {
      name: "Fatima Mohamed",
      role: "Head of Operations",
      bio: "Expert in luxury resort management",
    },
    {
      name: "Ibrahim Ali",
      role: "Travel Specialist",
      bio: "Specializes in adventure and water sports",
    },
    {
      name: "Zainab Ibrahim",
      role: "Customer Relations",
      bio: "Dedicated to exceptional guest experiences",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-cover bg-center bg-no-repeat overflow-hidden" style={{
        backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/FzTxajRsSmMvDaPc.jpg')"
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/75 to-primary/85" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground">
              About Isle Nomads
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Your trusted partner in creating unforgettable Maldives experiences since 2009
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Isle Nomads, we believe that travel is more than just visiting a destination—it's about creating meaningful connections, experiencing authentic cultures, and discovering the beauty of our world. Our mission is to craft personalized Maldives experiences that exceed expectations and create memories that last a lifetime.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2009, Isle Nomads started as a small travel agency with a big dream: to revolutionize how people experience the Maldives. Over the years, we've grown into a trusted partner for thousands of travelers, combining local expertise with international standards to deliver exceptional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-primary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <Icon className="w-12 h-12 text-accent" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals dedicated to your perfect Maldives experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-20 h-20 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                  <p className="text-sm font-medium text-accent">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Experience Paradise?</h2>
            <p className="text-lg opacity-90">
              Let our team of experts create your perfect Maldives adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-accent text-primary hover:bg-accent/90"
                onClick={() => window.location.href = "/contact"}
              >
                Get in Touch
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => window.location.href = "/trip-planner"}
              >
                Plan Your Trip
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
