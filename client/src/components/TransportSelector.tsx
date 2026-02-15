import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Trash2, Plus, Search } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export interface SelectedTransport {
  id: number;
  name: string;
  type: 'ferry' | 'speedboat';
  fromLocation: string;
  toLocation: string;
  displayOrder: number;
}

interface TransportSelectorProps {
  islandGuideId: number;
  onTransportsChange?: (transports: SelectedTransport[]) => void;
}

export function TransportSelector({
  islandGuideId,
  onTransportsChange,
}: TransportSelectorProps) {
  const [selectedTransports, setSelectedTransports] = useState<SelectedTransport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all available transports
  const { data: allTransports = [] } = trpc.transports.list.useQuery();

  // Fetch transports linked to this island guide
  const { data: linkedTransports = [], refetch: refetchLinked } =
    trpc.islandGuides.getLinkedTransports.useQuery(
      { islandGuideId },
      { enabled: !!islandGuideId }
    );

  // Initialize selected transports when linked data loads
  useEffect(() => {
    if (linkedTransports.length > 0) {
      setSelectedTransports(linkedTransports);
    }
  }, [linkedTransports]);

  // Notify parent of changes
  useEffect(() => {
    onTransportsChange?.(selectedTransports);
  }, [selectedTransports, onTransportsChange]);

  // Filter available transports (exclude already selected)
  const selectedIds = new Set(selectedTransports.map((t) => t.id));
  const availableTransports = allTransports.filter((t: any) => !selectedIds.has(t.id));
  const filteredTransports = availableTransports.filter((t: any) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.toLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add transport to selection
  const handleAddTransport = (transport: any) => {
    const newTransport: SelectedTransport = {
      id: transport.id,
      name: transport.name,
      type: transport.type,
      fromLocation: transport.fromLocation,
      toLocation: transport.toLocation,
      displayOrder: selectedTransports.length,
    };
    setSelectedTransports([...selectedTransports, newTransport]);
    setSearchQuery('');
  };

  // Remove transport from selection
  const handleRemoveTransport = (id: number) => {
    const updated = selectedTransports
      .filter((t) => t.id !== id)
      .map((t, idx) => ({ ...t, displayOrder: idx }));
    setSelectedTransports(updated);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newTransports = [...selectedTransports];
    const [draggedTransport] = newTransports.splice(draggedItem, 1);
    newTransports.splice(dropIndex, 0, draggedTransport);

    // Update display order
    const updated = newTransports.map((t, idx) => ({
      ...t,
      displayOrder: idx,
    }));

    setSelectedTransports(updated);
    setDraggedItem(null);
  };

  // Save changes to database
  const saveMutation = trpc.islandGuides.updateTransportLinks?.useMutation({
    onSuccess: () => {
      refetchLinked();
    },
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!saveMutation) return;
      await saveMutation.mutateAsync({
        islandGuideId,
        transports: selectedTransports.map((t) => ({
          transportId: t.id,
          displayOrder: t.displayOrder,
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transportation Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Transport Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add Transport</label>
            <div className="flex gap-2">
              <Input
                placeholder="Search transports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Available Transports Dropdown */}
            {searchQuery && filteredTransports.length > 0 && (
              <div className="border rounded-md bg-white shadow-lg z-10">
                {filteredTransports.slice(0, 5).map((transport: any) => (
                  <button
                    key={transport.id}
                    onClick={() => handleAddTransport(transport)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-sm">{transport.name}</div>
                      <div className="text-xs text-gray-500">
                        {transport.fromLocation} → {transport.toLocation}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {transport.type}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && filteredTransports.length === 0 && (
              <div className="text-sm text-gray-500 p-2">No transports found</div>
            )}
          </div>

          {/* Selected Transports List */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Selected Transports ({selectedTransports.length})
            </label>

            {selectedTransports.length === 0 ? (
              <div className="text-sm text-gray-500 p-4 border border-dashed rounded-md">
                No transports selected. Search and add transports above.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedTransports.map((transport, index) => (
                  <div
                    key={`${transport.id}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center gap-3 p-3 border rounded-md bg-white cursor-move transition-all ${
                      draggedItem === index ? 'opacity-50 bg-gray-100' : ''
                    } hover:bg-gray-50`}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{transport.name}</div>
                      <div className="text-xs text-gray-500">
                        {transport.fromLocation} → {transport.toLocation}
                      </div>
                    </div>

                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {transport.type}
                    </Badge>

                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      #{index + 1}
                    </Badge>

                    <button
                      onClick={() => handleRemoveTransport(transport.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 flex-shrink-0"
                      title="Remove transport"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isLoading || selectedTransports.length === 0}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Transport Links'}
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-500">
            Drag to reorder transports. The order determines display priority on the island
            guide page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
