/**
 * CRM Query Detail Page
 * View and manage an individual customer query
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, useRoute, Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Send,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Clock,
  AlertCircle,
} from "lucide-react";

type QueryStatus = "new" | "in_progress" | "waiting_customer" | "resolved" | "closed";
type QueryPriority = "low" | "medium" | "high" | "urgent";

function formatDateTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleString();
}

export default function AdminCRMDetail() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/crm/:id");
  const queryId = params?.id ? Number(params.id) : NaN;

  const [noteContent, setNoteContent] = useState("");
  const [isInternal, setIsInternal] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/staff-login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const queryQuery = trpc.crm.queries.get.useQuery(
    { id: queryId },
    { enabled: Number.isFinite(queryId) }
  );
  const interactionsQuery = trpc.crm.interactions.list.useQuery(
    { queryId },
    { enabled: Number.isFinite(queryId) }
  );
  const staffQuery = trpc.staff.list.useQuery();

  const updateMutation = trpc.crm.queries.update.useMutation({
    onSuccess: () => queryQuery.refetch(),
  });

  const addInteractionMutation = trpc.crm.interactions.create.useMutation({
    onSuccess: () => {
      interactionsQuery.refetch();
      setNoteContent("");
    },
  });

  const query = queryQuery.data;
  const interactions = interactionsQuery.data ?? [];
  const staffList = staffQuery.data ?? [];

  const staffById = useMemo(() => {
    const map = new Map<number, any>();
    for (const s of staffList) map.set(s.id, s);
    return map;
  }, [staffList]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "waiting_customer": return "bg-purple-100 text-purple-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  if (!Number.isFinite(queryId)) {
    return <div className="p-8 text-red-600">Invalid query id.</div>;
  }

  if (queryQuery.isLoading) {
    return <div className="p-8 text-gray-500">Loading…</div>;
  }

  if (queryQuery.error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load query: {queryQuery.error.message}
      </div>
    );
  }

  if (!query) {
    return (
      <div className="p-8">
        <Link href="/admin/crm"><a className="text-primary">← Back to CRM</a></Link>
        <p className="mt-4 text-gray-600">Query not found.</p>
      </div>
    );
  }

  const handleStatusChange = (next: QueryStatus) => {
    updateMutation.mutate({
      id: query.id,
      status: next,
      ...(next === "resolved" && !query.resolvedAt ? { resolvedAt: new Date() } : {}),
      ...(next === "closed" && !query.closedAt ? { closedAt: new Date() } : {}),
    });
  };

  const handlePriorityChange = (next: QueryPriority) => {
    updateMutation.mutate({ id: query.id, priority: next });
  };

  const handleAssignChange = (value: string) => {
    if (value === "") {
      updateMutation.mutate({ id: query.id, assignedTo: undefined });
    } else {
      updateMutation.mutate({ id: query.id, assignedTo: Number(value) });
    }
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addInteractionMutation.mutate({
      queryId: query.id,
      type: "note",
      content: noteContent.trim(),
      isInternal,
    });
  };

  const assignedStaff = query.assignedTo ? staffById.get(query.assignedTo) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/admin/crm">
            <a className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </a>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Query #{query.id}</h1>
        </div>
        <p className="text-gray-600">{query.subject}</p>
        {updateMutation.error && (
          <p className="mt-2 text-sm text-red-600">Update failed: {updateMutation.error.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Details */}
          <Card>
            <CardHeader>
              <CardTitle>Query Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Subject</p>
                <p className="text-gray-900">{query.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Message</p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{query.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Query Type</p>
                  <p className="text-gray-900 capitalize">{query.queryType.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Related Package</p>
                  <p className="text-gray-900">{query.packageId ? `Package #${query.packageId}` : "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactions */}
          <Card>
            <CardHeader>
              <CardTitle>Interaction History</CardTitle>
              <CardDescription>All notes, emails, and communications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {interactionsQuery.isLoading ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : interactions.length === 0 ? (
                <p className="text-sm text-gray-500">No interactions yet.</p>
              ) : (
                interactions.map((it: any) => {
                  const author = staffById.get(it.staffId);
                  return (
                    <div
                      key={it.id}
                      className={`p-4 rounded-lg border ${
                        it.isInternal ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900">
                            {author?.user?.name || author?.user?.email || `Staff #${it.staffId}`}
                          </span>
                          <span className="text-xs text-gray-500 uppercase">{it.type}</span>
                          {it.isInternal ? (
                            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Internal</span>
                          ) : null}
                        </div>
                        <span className="text-xs text-gray-500">{formatDateTime(it.createdAt)}</span>
                      </div>
                      {it.subject ? (
                        <p className="text-sm font-medium text-gray-900 mb-1">{it.subject}</p>
                      ) : null}
                      <p className="text-gray-700 whitespace-pre-wrap">{it.content}</p>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Add Note */}
          <Card>
            <CardHeader>
              <CardTitle>Add Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add a note about this query…"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={4}
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                  />
                  Internal note (not visible to customer)
                </label>
                {addInteractionMutation.error && (
                  <p className="text-sm text-red-600">{addInteractionMutation.error.message}</p>
                )}
                <Button
                  onClick={handleAddNote}
                  disabled={!noteContent.trim() || addInteractionMutation.isPending}
                  className="bg-accent hover:bg-accent/90 text-primary font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {addInteractionMutation.isPending ? "Adding…" : "Add Note"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
                <p className="text-gray-900">{query.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <a
                  href={`mailto:${query.customerEmail}`}
                  className="text-primary hover:underline break-all"
                >
                  {query.customerEmail}
                </a>
              </div>
              {query.customerPhone && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </p>
                  <a href={`tel:${query.customerPhone}`} className="text-primary hover:underline">
                    {query.customerPhone}
                  </a>
                </div>
              )}
              {query.customerCountry && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Country
                  </p>
                  <p className="text-gray-900">{query.customerCountry}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Status</p>
                <select
                  value={query.status}
                  onChange={(e) => handleStatusChange(e.target.value as QueryStatus)}
                  className={`w-full px-3 py-2 rounded-lg border ${getStatusColor(query.status)} focus:outline-none focus:ring-2 focus:ring-accent`}
                  disabled={updateMutation.isPending}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_customer">Waiting Customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Priority</p>
                <select
                  value={query.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as QueryPriority)}
                  className={`w-full px-3 py-2 rounded-lg border ${getPriorityColor(query.priority)} focus:outline-none focus:ring-2 focus:ring-accent`}
                  disabled={updateMutation.isPending}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Assign To</p>
                <select
                  value={query.assignedTo ?? ""}
                  onChange={(e) => handleAssignChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={updateMutation.isPending}
                >
                  <option value="">Unassigned</option>
                  {staffList.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.user?.name || s.user?.email || `Staff #${s.id}`}
                    </option>
                  ))}
                </select>
                {staffList.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No staff yet. Add one in{" "}
                    <Link href="/admin/staff">
                      <a className="text-primary hover:underline">Staff Management</a>
                    </Link>
                    .
                  </p>
                )}
                {assignedStaff && (
                  <p className="text-xs text-gray-500 mt-1">
                    Currently assigned to {assignedStaff.user?.name || assignedStaff.user?.email}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Created</p>
                  <p className="text-gray-600">{formatDateTime(query.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">First Response</p>
                  <p className="text-gray-600">{formatDateTime(query.firstResponseAt) ?? "Not yet"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Resolved</p>
                  <p className="text-gray-600">{formatDateTime(query.resolvedAt) ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Closed</p>
                  <p className="text-gray-600">{formatDateTime(query.closedAt) ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
