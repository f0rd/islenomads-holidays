import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function AdminActivitySpots() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Activity spots management was unified into Attractions/AttractionGuides.
    // Redirect to the attractions admin so users land in the correct place.
    navigate("/admin/attractions", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity Spots (Redirecting)</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Management of activity spots is now handled under Attractions. If you are not
          redirected automatically, <Link href="/admin/attractions"><a className="text-primary">click here</a></Link>.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Redirecting...</CardTitle>
        </CardHeader>
        <CardContent>
          You are being redirected to the Attractions admin where activity spots are managed.
        </CardContent>
      </Card>
    </div>
  );
}
