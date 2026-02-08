/**
 * Staff Login Page
 * Provides OAuth login for staff members to access the CMS dashboard
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LogIn } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function StaffLogin() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    if (isAuthenticated && user) {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
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

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Staff members only:</strong> Click below to login with your account and access the CMS dashboard for managing content, SEO tags, and more.
            </p>
          </div>

          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-6 text-lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login with Manus Account
          </Button>

          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-start gap-2">
              <span className="text-accent font-bold mt-0.5">✓</span>
              <span>Secure OAuth authentication</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-accent font-bold mt-0.5">✓</span>
              <span>Access to blog, packages, and SEO management</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-accent font-bold mt-0.5">✓</span>
              <span>Role-based permissions and controls</span>
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Don't have staff access? Contact your administrator for credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
