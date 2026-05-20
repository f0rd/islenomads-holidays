import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Lock } from "lucide-react";

function readRecoveryTokenFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  if (params.get("type") !== "recovery") return null;
  return params.get("access_token");
}

export default function StaffResetPassword() {
  const [, navigate] = useLocation();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = readRecoveryTokenFromHash();
    if (token) {
      setAccessToken(token);
      // Clear the hash so the token isn't sitting in the address bar / history.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const requestResetMutation = trpc.auth.sendPasswordResetEmail.useMutation({
    onSuccess: (data) => {
      setErrorMessage(null);
      setMessage(data?.message ?? "Password reset email sent.");
    },
    onError: (error) => {
      setMessage(null);
      setErrorMessage(error.message || "Password reset failed. Please try again.");
    },
  });

  const updatePasswordMutation = trpc.auth.updatePasswordWithRecoveryToken.useMutation({
    onSuccess: (data) => {
      setErrorMessage(null);
      setMessage(data?.message ?? "Password updated.");
      setTimeout(() => navigate("/staff-login"), 1500);
    },
    onError: (error) => {
      setMessage(null);
      setErrorMessage(error.message || "Failed to update password. Please try again.");
    },
  });

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    requestResetMutation.mutate({ email });
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    if (!accessToken) {
      setErrorMessage("Reset token missing. Open the link from your email again.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    updatePasswordMutation.mutate({ accessToken, password });
  };

  const inRecoveryMode = accessToken !== null;
  const isSubmitting = inRecoveryMode
    ? updatePasswordMutation.isPending
    : requestResetMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            {inRecoveryMode ? "Set a new password" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-base">
            {inRecoveryMode
              ? "Choose a new password for your staff account."
              : "Enter your email to receive password reset instructions."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {inRecoveryMode ? (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-6 text-lg"
              >
                {isSubmitting ? "Updating..." : "Update password"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-6 text-lg"
              >
                {isSubmitting ? "Sending..." : "Send reset email"}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
