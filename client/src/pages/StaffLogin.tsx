/**
 * Staff Login Page
 * Email + password sign-in backed by Supabase Auth.
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Lock, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function StaffLogin() {
  const { user, isAuthenticated, refresh } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = trpc.auth.loginWithPassword.useMutation({
    onSuccess: async () => {
      await refresh();
      navigate("/admin");
    },
    onError: (error) => {
      setErrorMessage(error.message || "Login failed. Check your credentials and try again.");
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Staff Login</CardTitle>
          <CardDescription className="text-base">
            Access the Isle Nomads CMS dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={loginMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loginMutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-6 text-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Don't have staff access? Contact your administrator.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
