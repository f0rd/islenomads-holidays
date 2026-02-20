/**
 * Contact Page - Isle Nomads
 * Get in touch with our team
 */

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "(+960) 799 0636",
      link: "tel:+9607990636",
    },
    {
      icon: Mail,
      title: "Email",
      details: "hello@islenomads.com",
      link: "mailto:hello@islenomads.com",
    },
    {
      icon: MapPin,
      title: "Office",
      details: "Malé, Maldives",
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon - Fri: 9AM - 6PM",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-cover bg-center bg-no-repeat overflow-hidden" style={{
        backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/WxnWODZEhsjSxYWJ.jpg')"
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/75 to-primary/85" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground">
              Get in Touch
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <Icon className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="font-bold text-foreground">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-accent hover:text-accent/80 transition-colors"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.details}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-primary/5">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-background rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select a subject</option>
                      <option value="inquiry">General Inquiry</option>
                      <option value="booking">Booking Question</option>
                      <option value="support">Customer Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent text-primary hover:bg-accent/90"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-bold text-foreground">How quickly will you respond to my inquiry?</h3>
                  <p className="text-muted-foreground">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-bold text-foreground">Can you customize my trip?</h3>
                  <p className="text-muted-foreground">
                    Absolutely! We specialize in creating personalized itineraries tailored to your preferences and budget.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-bold text-foreground">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, bank transfers, and online payment methods. Contact us for details.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-bold text-foreground">Do you offer group discounts?</h3>
                  <p className="text-muted-foreground">
                    Yes! We offer special rates for groups. Please contact us directly for group booking inquiries.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
