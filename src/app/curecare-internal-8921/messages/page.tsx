"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  ChevronRight,
  Send,
  MessageCircle,
} from "lucide-react";
import { SupportMessage } from "@/lib/store/messageStore";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery.trim()) params.set("query", searchQuery.trim());

      const res = await fetch(`/api/curecare-internal-8921/messages?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectMessage = (msg: SupportMessage) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.adminNotes || "");
  };

  const handleUpdateStatus = async (
    status: SupportMessage["status"],
    replyMethod?: SupportMessage["replyMethod"]
  ) => {
    if (!selectedMessage) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/curecare-internal-8921/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMessage.id,
          status,
          adminNotes,
          replyMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedMessage(data.message);
        setMessages((prev) =>
          prev.map((m) => (m.id === data.message.id ? data.message : m))
        );
        showNotification(`Status updated to "${status}".`);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Permanently delete this customer message?")) return;
    try {
      const res = await fetch(`/api/curecare-internal-8921/messages?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
        showNotification("Message deleted.");
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  // Metrics
  const totalCount = messages.length;
  const newCount = messages.filter((m) => m.status === "new").length;
  const inProgressCount = messages.filter((m) => m.status === "in_progress").length;
  const resolvedCount = messages.filter((m) => m.status === "resolved" || m.status === "replied").length;

  const cleanPhoneForWhatsApp = (phoneStr?: string) => {
    if (!phoneStr) return "";
    let clean = phoneStr.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "88" + clean;
    } else if (!clean.startsWith("880") && clean.length === 10) {
      clean = "880" + clean;
    }
    return clean;
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Customer Concierge & Inquiries
            </h1>
            <Badge variant="accent" size="sm">
              Live Inbox
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time customer inquiries, product consultations, and contact submissions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          isLoading={loading}
          className="border-zinc-700 hover:bg-zinc-800 text-zinc-200"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Refresh Inbox
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Inquiries</span>
            <MessageSquare className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{totalCount}</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium">
            <span>Awaiting Reply</span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-2">{newCount}</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-blue-400 text-xs font-medium">
            <span>In Progress</span>
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-300 mt-2">{inProgressCount}</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
            <span>Replied / Resolved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 mt-2">{resolvedCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, phone, ticket ID or message..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6857]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All" },
            { id: "new", label: `New (${newCount})` },
            { id: "in_progress", label: "In Progress" },
            { id: "replied", label: "Replied" },
            { id: "resolved", label: "Resolved" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                statusFilter === tab.id
                  ? "bg-[#FF6857] text-white font-semibold"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inbox Layout: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List (Left column) */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/60">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <MessageSquare className="h-8 w-8 text-zinc-600 mx-auto" />
              <div className="text-sm font-semibold text-zinc-300">No inquiries found</div>
              <p className="text-xs text-zinc-500">
                {statusFilter !== "all"
                  ? `No messages with status "${statusFilter}".`
                  : "Customer inquiries submitted on the storefront will appear here."}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-zinc-800/50 ${
                    isSelected ? "bg-zinc-800/80 border-l-4 border-l-[#FF6857]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-zinc-200 truncate">{msg.name}</span>
                    <span className="text-[10px] text-zinc-500 shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                      {msg.ticketId}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        msg.status === "new"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : msg.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : msg.status === "replied"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {msg.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                      {msg.topic}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Message Details & Reply Panel (Right column) */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header with Ticket ID & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white font-mono">
                      {selectedMessage.ticketId}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        selectedMessage.status === "new"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : selectedMessage.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : selectedMessage.status === "replied"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {selectedMessage.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs">
                <div>
                  <span className="text-zinc-500 block mb-0.5">Customer Name</span>
                  <span className="font-semibold text-zinc-100">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">Inquiry Topic</span>
                  <span className="font-semibold text-zinc-100">{selectedMessage.topic}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">Email Address</span>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Reply to Ticket ${selectedMessage.ticketId} - Cure-Care`}
                    className="text-[#FF6857] hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">Phone / WhatsApp</span>
                  {selectedMessage.phone ? (
                    <span className="text-zinc-200 flex items-center gap-1 font-mono">
                      <Phone className="h-3 w-3 text-emerald-400" />
                      <span>{selectedMessage.phone}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-500">Not provided</span>
                  )}
                </div>
                {selectedMessage.orderNumber && (
                  <div className="sm:col-span-2">
                    <span className="text-zinc-500 block mb-0.5">Related Order #</span>
                    <span className="font-mono text-zinc-200 font-semibold">
                      {selectedMessage.orderNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Customer Message
                </span>
                <div className="p-4 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Instant Concierge Reply Actions */}
              <div className="space-y-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6857] block">
                  Quick Reply Channels
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedMessage.phone && (
                    <a
                      href={`https://wa.me/${cleanPhoneForWhatsApp(selectedMessage.phone)}?text=${encodeURIComponent(
                        `Hello ${selectedMessage.name}, thank you for contacting Cure-Care Support regarding ticket ${selectedMessage.ticketId}. `
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleUpdateStatus("replied", "whatsapp")}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      `[${selectedMessage.ticketId}] Cure-Care Concierge Support: ${selectedMessage.topic}`
                    )}&body=${encodeURIComponent(
                      `Dear ${selectedMessage.name},\n\nThank you for reaching out to Cure-Care Customer Care.\n\nRegarding your inquiry:\n"${selectedMessage.message}"\n\n[Type your response here]\n\nWarm regards,\nCure-Care Concierge Team\nhttps://curecarebd.com`
                    )}`}
                    onClick={() => handleUpdateStatus("replied", "email")}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      onClick={() => handleUpdateStatus("in_progress", "phone")}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Hotline</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Status & Admin Notes */}
              <div className="space-y-4 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Update Ticket Status
                  </span>
                  <div className="flex gap-1.5">
                    {(["new", "in_progress", "replied", "resolved"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        disabled={isUpdating}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          selectedMessage.status === st
                            ? "bg-[#FF6857] text-white font-bold"
                            : "bg-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {st.replace("_", " ").toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Internal Admin Notes / Resolution</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes on this inquiry (e.g. called customer, confirmed delivery date, refund issued, etc.)..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6857]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedMessage.status)}
                      isLoading={isUpdating}
                    >
                      Save Admin Note
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center space-y-3">
              <MessageSquare className="h-10 w-10 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-300">No inquiry selected</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Select an inquiry from the inbox on the left to read the full message, reply directly via WhatsApp or Email, and track resolution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
