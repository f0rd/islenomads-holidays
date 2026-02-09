import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function AdminTransports() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    fromLocation: "",
    toLocation: "",
    transportType: "ferry" as const,
    durationMinutes: 0,
    priceUSD: 0,
    capacity: 0,
    operator: "",
    departureTime: "",
    schedule: "",
    amenities: "",
    description: "",
    image: "",
    published: 1,
  });

  const utils = trpc.useUtils();
  const { data: transports, isLoading } = trpc.transports.listAdmin.useQuery();
  const createMutation = trpc.transports.create.useMutation({
    onSuccess: () => {
      utils.transports.listAdmin.invalidate();
      resetForm();
      setIsOpen(false);
    },
  });
  const updateMutation = trpc.transports.update.useMutation({
    onSuccess: () => {
      utils.transports.listAdmin.invalidate();
      resetForm();
      setIsOpen(false);
    },
  });
  const deleteMutation = trpc.transports.delete.useMutation({
    onSuccess: () => {
      utils.transports.listAdmin.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      fromLocation: "",
      toLocation: "",
      transportType: "ferry",
      durationMinutes: 0,
      priceUSD: 0,
      capacity: 0,
      operator: "",
      departureTime: "",
      schedule: "",
      amenities: "",
      description: "",
      image: "",
      published: 1,
    });
    setEditingId(null);
  };

  const handleEdit = (transport: any) => {
    setFormData({
      name: transport.name,
      fromLocation: transport.fromLocation,
      toLocation: transport.toLocation,
      transportType: transport.transportType,
      durationMinutes: transport.durationMinutes,
      priceUSD: transport.priceUSD,
      capacity: transport.capacity,
      operator: transport.operator,
      departureTime: transport.departureTime || "",
      schedule: transport.schedule || "",
      amenities: transport.amenities || "",
      description: transport.description || "",
      image: transport.image || "",
      published: transport.published,
    });
    setEditingId(transport.id);
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this transport?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Transport
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Transport" : "Add New Transport"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Male to Maafushi Ferry"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Transport Type *</label>
                    <Select value={formData.transportType} onValueChange={(value: any) => setFormData({ ...formData, transportType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ferry">Ferry</SelectItem>
                        <SelectItem value="speedboat">Speedboat</SelectItem>
                        <SelectItem value="dhoni">Dhoni</SelectItem>
                        <SelectItem value="seaplane">Seaplane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">From Location *</label>
                    <Input
                      value={formData.fromLocation}
                      onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                      placeholder="e.g., male"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">To Location *</label>
                    <Input
                      value={formData.toLocation}
                      onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                      placeholder="e.g., maafushi-island"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Duration (minutes) *</label>
                    <Input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price (USD) *</label>
                    <Input
                      type="number"
                      value={formData.priceUSD}
                      onChange={(e) => setFormData({ ...formData, priceUSD: parseInt(e.target.value) })}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Capacity *</label>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Operator *</label>
                    <Input
                      value={formData.operator}
                      onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                      placeholder="Public Ferry"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Departure Time</label>
                    <Input
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      placeholder="06:00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Published</label>
                    <Select value={formData.published.toString()} onValueChange={(value) => setFormData({ ...formData, published: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Published</SelectItem>
                        <SelectItem value="0">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Transport details..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingId ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading transports...</div>
        ) : (
          <div className="grid gap-4">
            {transports?.map((transport) => (
              <Card key={transport.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{transport.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {transport.fromLocation} → {transport.toLocation}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(transport)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(transport.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-medium capitalize">{transport.transportType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-medium">{transport.durationMinutes} mins</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-medium">${transport.priceUSD}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Capacity:</span>
                      <p className="font-medium">{transport.capacity} pax</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Operator:</span>
                      <p className="font-medium">{transport.operator}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Departure:</span>
                      <p className="font-medium">{transport.departureTime || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-medium">
                        {transport.published ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
