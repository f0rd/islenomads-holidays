import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { UserPlus } from "lucide-react";

export default function StaffRegister() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registerMutation = trpc.auth.registerWithPassword.useMutation({
    onSuccess: (data) => {
      setErrorMessage(null);
      setMessage(data?.message ?? "Registration successful. Check your email for confirmation.");
      if (data && (data as any).user) {
        navigate("/admin");
      }
    },
    onError: (error) => {
      setMessage(null);
      setErrorMessage(error.message || "Registration failed. Please try again.");
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    registerMutation.mutate({ email, password, name: name || undefined });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Register</CardTitle>
          <CardDescription className="text-base">
            Create staff access for the Isle Nomads CMS.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmed Fuaadh"
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
                {message}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={registerMutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-6 text-lg"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Already have an account?{' '}
                <a href="/staff-login" className="text-accent hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
