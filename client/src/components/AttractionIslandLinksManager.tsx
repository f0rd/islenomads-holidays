import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Link2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface AttractionIslandLinksManagerProps {
  attractionGuideId: number;
  onUpdate?: () => void;
}

export function AttractionIslandLinksManager({ attractionGuideId, onUpdate }: AttractionIslandLinksManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIslandId, setSelectedIslandId] = useState<string>("");
  const [distance, setDistance] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [transportMethod, setTransportMethod] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch related islands
  const { data: relatedIslands = [], refetch: refetchLinks } = trpc.attractionGuides.getRelatedIslands.useQuery({
    attractionGuideId,
  });

  // Fetch all islands for selection
  const { data: allIslands = [] } = trpc.islandGuides.list.useQuery();

  const linkMutation = trpc.attractionGuides.linkToIsland.useMutation();
  const unlinkMutation = trpc.attractionGuides.unlinkFromIsland.useMutation();

  const handleLink = async () => {
    if (!selectedIslandId) return;

    try {
      await linkMutation.mutateAsync({
        attractionGuideId,
        islandGuideId: parseInt(selectedIslandId),
        distance: distance || undefined,
        travelTime: travelTime || undefined,
        transportMethod: transportMethod || undefined,
        notes: notes || undefined,
      });

      setSelectedIslandId("");
      setDistance("");
      setTravelTime("");
      setTransportMethod("");
      setNotes("");
      setIsOpen(false);
      await refetchLinks();
      onUpdate?.();
    } catch (error) {
      console.error("Error linking island:", error);
    }
  };

  const handleUnlink = async (islandGuideId: number) => {
    if (confirm("Are you sure you want to unlink this island?")) {
      try {
        await unlinkMutation.mutateAsync({
          attractionGuideId,
          islandGuideId,
        });
        await refetchLinks();
        onUpdate?.();
      } catch (error) {
        console.error("Error unlinking island:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Related Islands</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Link Island
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Island to Attraction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="island-select">Island *</Label>
                <Select value={selectedIslandId} onValueChange={setSelectedIslandId}>
                  <SelectTrigger id="island-select">
                    <SelectValue placeholder="Select an island" />
                  </SelectTrigger>
                  <SelectContent>
                    {allIslands.map((island: any) => (
                      <SelectItem key={island.id} value={island.id.toString()}>
                        {island.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="distance">Distance</Label>
                <Input
                  id="distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g., 5 km, 10 mins by boat"
                />
              </div>

              <div>
                <Label htmlFor="travel-time">Travel Time</Label>
                <Input
                  id="travel-time"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                  placeholder="e.g., 15 minutes, 1 hour"
                />
              </div>

              <div>
                <Label htmlFor="transport">Transport Method</Label>
                <Input
                  id="transport"
                  value={transportMethod}
                  onChange={(e) => setTransportMethod(e.target.value)}
                  placeholder="e.g., speedboat, dhoni, walk"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context..."
                />
              </div>

              <Button onClick={handleLink} className="w-full">
                Link Island
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {relatedIslands.length === 0 ? (
        <p className="text-sm text-muted-foreground">No related islands yet. Link one to get started.</p>
      ) : (
        <div className="space-y-2">
          {relatedIslands.map((link: any) => (
            <Card key={link.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{link.island?.name}</p>
                    {link.distance && <p className="text-sm text-muted-foreground">Distance: {link.distance}</p>}
                    {link.travelTime && <p className="text-sm text-muted-foreground">Travel Time: {link.travelTime}</p>}
                    {link.transportMethod && <p className="text-sm text-muted-foreground">Transport: {link.transportMethod}</p>}
                    {link.notes && <p className="text-sm text-muted-foreground">Notes: {link.notes}</p>}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUnlink(link.islandGuideId)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
