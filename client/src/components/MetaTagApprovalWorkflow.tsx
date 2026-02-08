import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type GeneratedMetaTags } from "@/utils/aiMetaTagGenerator";
import {
  CheckCircle,
  AlertCircle,
  Edit2,
  Save,
  X,
  Clock,
  User,
} from "lucide-react";

interface MetaTagApprovalItem {
  id: number;
  title: string;
  generated: GeneratedMetaTags;
  current?: GeneratedMetaTags;
  status: "pending" | "approved" | "rejected" | "modified";
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}

interface MetaTagApprovalWorkflowProps {
  items: MetaTagApprovalItem[];
  onApprove?: (itemId: number) => void;
  onReject?: (itemId: number, reason: string) => void;
  onSave?: (itemId: number, tags: GeneratedMetaTags) => void;
}

export default function MetaTagApprovalWorkflow({
  items,
  onApprove,
  onReject,
  onSave,
}: MetaTagApprovalWorkflowProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTags, setEditedTags] = useState<GeneratedMetaTags | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [showRejectForm, setShowRejectForm] = useState<number | null>(null);

  const handleEdit = (item: MetaTagApprovalItem) => {
    setEditingId(item.id);
    setEditedTags(item.generated);
  };

  const handleSaveEdit = (itemId: number) => {
    if (editedTags) {
      onSave?.(itemId, editedTags);
      setEditingId(null);
      setEditedTags(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedTags(null);
  };

  const handleReject = (itemId: number) => {
    if (rejectReason.trim()) {
      onReject?.(itemId, rejectReason);
      setShowRejectForm(null);
      setRejectReason("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "modified":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4" />;
      case "modified":
        return <Edit2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tag Approval Workflow</CardTitle>
          <CardDescription>
            Review and approve generated meta tags before publishing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                Pending ({items.filter((i) => i.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({items.filter((i) => i.status === "approved").length})
              </TabsTrigger>
              <TabsTrigger value="modified">
                Modified ({items.filter((i) => i.status === "modified").length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({items.filter((i) => i.status === "rejected").length})
              </TabsTrigger>
            </TabsList>

            {/* Pending Tab */}
            <TabsContent value="pending" className="space-y-4 mt-4">
              {items
                .filter((i) => i.status === "pending")
                .map((item) => (
                  <ApprovalCard
                    key={item.id}
                    item={item}
                    isEditing={editingId === item.id}
                    editedTags={editedTags}
                    onEdit={() => handleEdit(item)}
                    onSave={() => handleSaveEdit(item.id)}
                    onCancel={handleCancelEdit}
                    onApprove={() => onApprove?.(item.id)}
                    onReject={() => setShowRejectForm(item.id)}
                    onEditChange={setEditedTags}
                    showRejectForm={showRejectForm === item.id}
                    rejectReason={rejectReason}
                    onRejectReasonChange={setRejectReason}
                    onRejectSubmit={() => handleReject(item.id)}
                    onRejectCancel={() => {
                      setShowRejectForm(null);
                      setRejectReason("");
                    }}
                  />
                ))}
              {items.filter((i) => i.status === "pending").length === 0 && (
                <p className="text-center text-muted-foreground py-8">No pending items</p>
              )}
            </TabsContent>

            {/* Approved Tab */}
            <TabsContent value="approved" className="space-y-4 mt-4">
              {items
                .filter((i) => i.status === "approved")
                .map((item) => (
                  <ApprovalCard key={item.id} item={item} readonly />
                ))}
              {items.filter((i) => i.status === "approved").length === 0 && (
                <p className="text-center text-muted-foreground py-8">No approved items</p>
              )}
            </TabsContent>

            {/* Modified Tab */}
            <TabsContent value="modified" className="space-y-4 mt-4">
              {items
                .filter((i) => i.status === "modified")
                .map((item) => (
                  <ApprovalCard key={item.id} item={item} readonly />
                ))}
              {items.filter((i) => i.status === "modified").length === 0 && (
                <p className="text-center text-muted-foreground py-8">No modified items</p>
              )}
            </TabsContent>

            {/* Rejected Tab */}
            <TabsContent value="rejected" className="space-y-4 mt-4">
              {items
                .filter((i) => i.status === "rejected")
                .map((item) => (
                  <ApprovalCard key={item.id} item={item} readonly />
                ))}
              {items.filter((i) => i.status === "rejected").length === 0 && (
                <p className="text-center text-muted-foreground py-8">No rejected items</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface ApprovalCardProps {
  item: MetaTagApprovalItem;
  isEditing?: boolean;
  editedTags?: GeneratedMetaTags | null;
  readonly?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onEditChange?: (tags: GeneratedMetaTags) => void;
  showRejectForm?: boolean;
  rejectReason?: string;
  onRejectReasonChange?: (reason: string) => void;
  onRejectSubmit?: () => void;
  onRejectCancel?: () => void;
}

function ApprovalCard({
  item,
  isEditing,
  editedTags,
  readonly,
  onEdit,
  onSave,
  onCancel,
  onApprove,
  onReject,
  onEditChange,
  showRejectForm,
  rejectReason,
  onRejectReasonChange,
  onRejectSubmit,
  onRejectCancel,
}: ApprovalCardProps) {
  const tags = editedTags || item.generated;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "modified":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4" />;
      case "modified":
        return <Edit2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className={isEditing ? "border-blue-200 bg-blue-50/50" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
              {getStatusIcon(item.status)}
                <span className="capitalize">{item.status}</span>
              </div>
              {item.approvedBy && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>Approved by {item.approvedBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Meta Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Meta Title</label>
          {isEditing ? (
            <Input
              value={tags.title}
              onChange={(e) =>
                onEditChange?.({
                  ...tags,
                  title: e.target.value,
                })
              }
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded text-sm">{tags.title}</div>
          )}
          <p className="text-xs text-muted-foreground">
            {tags.title.length} characters (optimal: 30-60)
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Meta Description</label>
          {isEditing ? (
            <Textarea
              value={tags.description}
              onChange={(e) =>
                onEditChange?.({
                  ...tags,
                  description: e.target.value,
                })
              }
              rows={3}
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded text-sm">{tags.description}</div>
          )}
          <p className="text-xs text-muted-foreground">
            {tags.description.length} characters (optimal: 120-160)
          </p>
        </div>

        {/* Reject Form */}
        {showRejectForm && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
            <label className="text-sm font-semibold text-red-900">Rejection Reason</label>
            <Textarea
              value={rejectReason}
              onChange={(e) => onRejectReasonChange?.(e.target.value)}
              placeholder="Explain why you're rejecting these meta tags..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={onRejectSubmit}
                size="sm"
                variant="destructive"
                className="flex-1"
              >
                Reject
              </Button>
              <Button
                onClick={onRejectCancel}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!readonly && (
          <div className="flex gap-2 pt-4 border-t">
            {isEditing ? (
              <>
                <Button onClick={onSave} size="sm" className="flex-1 gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button onClick={onCancel} size="sm" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onApprove}
                  size="sm"
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  onClick={onEdit}
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={onReject}
                  size="sm"
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
