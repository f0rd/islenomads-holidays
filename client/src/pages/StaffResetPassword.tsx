import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Lock } from "lucide-react";

export default function StaffResetPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetMutation = trpc.auth.sendPasswordResetEmail.useMutation({
    onSuccess: (data) => {
      setErrorMessage(null);
      setMessage(data?.message ?? "Password reset email sent.");
    },
    onError: (error) => {
      setMessage(null);
      setErrorMessage(error.message || "Password reset failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    resetMutation.mutate({ email });
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
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
          <CardDescription className="text-base">
            Enter your email to receive password reset instructions.
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
                disabled={resetMutation.isPending}
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
              disabled={resetMutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-6 text-lg"
            >
              {resetMutation.isPending ? "Sending..." : "Send reset email"}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Remember your password?{' '}
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
