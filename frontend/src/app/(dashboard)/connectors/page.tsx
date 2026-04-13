"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MessageCircle, MessageSquare, Camera,
  CheckCircle2, Settings2, AlertCircle, ExternalLink,
  ShieldCheck, Zap, RefreshCcw, Loader2, Trash2,
  ChevronRight, X, Eye, EyeOff, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@/context/user-context";

// ── API Service ───────────────────────────────────────────────────────────────

import api from "@/lib/api-client";

const connectorService = {
  list: () => api.get("/connectors"),
  create: (data: any) => api.post("/connectors", data),
  update: (id: string, data: any) => api.put(`/connectors/${id}`, data),
  remove: (id: string) => api.delete(`/connectors/${id}`),
  test: (id: string) => api.post(`/connectors/${id}/test`, {}),
};

// ── Channel config ────────────────────────────────────────────────────────────

const CHANNEL_META = {
  WHATSAPP: {
    label: "WhatsApp Business",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-500/10 text-green-500",
    fields: [
      { key: "name", label: "Display Name", placeholder: "e.g. WhatsApp Business - Main", type: "text" },
      { key: "waPhoneNumberId", label: "Phone Number ID", placeholder: "From Meta Developer Console", type: "text" },
      { key: "waAccessToken", label: "Access Token", placeholder: "Permanent token from Meta", type: "password" },
      { key: "waBusinessId", label: "Business Account ID", placeholder: "WhatsApp Business Account ID", type: "text" },
      { key: "webhookVerifyToken", label: "Webhook Verify Token", placeholder: "Any secret string you choose", type: "text" },
    ],
  },
  MESSENGER: {
    label: "Facebook Messenger",
    icon: MessageSquare,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-500/10 text-blue-500",
    fields: [
      { key: "name", label: "Display Name", placeholder: "e.g. Messenger - Brand Page", type: "text" },
      { key: "fbPageId", label: "Page ID", placeholder: "Facebook Page ID", type: "text" },
      { key: "fbPageAccessToken", label: "Page Access Token", placeholder: "From Meta Dashboard", type: "password" },
      { key: "fbAppSecret", label: "App Secret", placeholder: "For webhook verification", type: "password" },
      { key: "webhookVerifyToken", label: "Webhook Verify Token", placeholder: "Any secret string you choose", type: "text" },
    ],
  },
  INSTAGRAM: {
    label: "Instagram Direct",
    icon: Camera,
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-500/10 text-pink-500",
    fields: [
      { key: "name", label: "Display Name", placeholder: "e.g. Instagram - @brand", type: "text" },
      { key: "igAccountId", label: "Instagram Account ID", placeholder: "Business IG Account ID", type: "text" },
      { key: "fbPageId", label: "Connected Page ID", placeholder: "Linked Facebook Page ID", type: "text" },
      { key: "fbPageAccessToken", label: "Page Access Token", placeholder: "From Meta Dashboard", type: "password" },
      { key: "fbAppSecret", label: "App Secret", placeholder: "For webhook verification", type: "password" },
      { key: "webhookVerifyToken", label: "Webhook Verify Token", placeholder: "Any secret string you choose", type: "text" },
    ],
  },
};

type Channel = keyof typeof CHANNEL_META;

export default function ConnectorsPage() {
  const { role } = useUser();
  const isAdmin = role === "admin" || role === "owner";

  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedWebhook, setCopiedWebhook] = useState<string | null>(null);
  const [editConnector, setEditConnector] = useState<any | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const fetchConnectors = async () => {
    try {
      const res = await connectorService.list();
      setConnectors(res.data);
    } catch {
      toast.error("Failed to load connectors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConnectors(); }, []);

  const handleSave = async () => {
    if (!selectedChannel) return;
    if (!formData.name?.trim()) return toast.error("Display name is required");

    setSaving(true);
    try {
      const payload = { ...formData, channel: selectedChannel };
      if (editConnector) {
        await connectorService.update(editConnector.id, payload);
        toast.success("Connector updated");
      } else {
        await connectorService.create(payload);
        toast.success("Connector created — verify your webhook in Meta Dashboard");
      }
      setShowAdd(false);
      setEditConnector(null);
      setFormData({});
      setSelectedChannel(null);
      fetchConnectors();
    } catch {
      toast.error("Failed to save connector");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this connector? Existing conversations will not be deleted.")) return;
    try {
      await connectorService.remove(id);
      toast.success("Connector removed");
      fetchConnectors();
    } catch {
      toast.error("Failed to remove connector");
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const res = await connectorService.test(id);
      if (res.data.healthy) {
        toast.success("Connection healthy ✓");
      } else {
        toast.warning("Connector is inactive — check credentials");
      }
    } catch {
      toast.error("Test failed — verify your credentials");
    } finally {
      setTestingId(null);
    }
  };

  const handleActivate = async (connector: any) => {
    const newStatus = connector.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await connectorService.update(connector.id, { status: newStatus });
      toast.success(`Connector ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`);
      fetchConnectors();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openEdit = (connector: any) => {
    setEditConnector(connector);
    setSelectedChannel(connector.channel as Channel);
    setFormData({
      name: connector.name || "",
      waPhoneNumberId: connector.waPhoneNumberId || "",
      waBusinessId: connector.waBusinessId || "",
      fbPageId: connector.fbPageId || "",
      igAccountId: connector.igAccountId || "",
      webhookVerifyToken: connector.webhookVerifyToken || "",
    });
    setShowAdd(true);
  };

  const copyWebhookUrl = (channel: string, id: string) => {
    const url = `${backendUrl}/webhooks/${channel.toLowerCase()}`;
    navigator.clipboard.writeText(url);
    setCopiedWebhook(id);
    setTimeout(() => setCopiedWebhook(null), 2000);
    toast.success("Webhook URL copied!");
  };

  const getStatusColor = (status: string) => {
    if (status === "ACTIVE") return "text-emerald-500 bg-emerald-500/10";
    if (status === "ERROR") return "text-rose-500 bg-rose-500/10";
    return "text-amber-500 bg-amber-500/10";
  };

  return (
    <div className="flex min-h-full flex-col bg-background p-8 space-y-8 font-outfit">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Channel Connectors</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Connect Meta channels — messages flow directly into your inbox
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => { setShowAdd(true); setEditConnector(null); setFormData({}); setSelectedChannel(null); }}
            className="h-12 px-6 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Connector
          </Button>
        )}
      </div>

      {/* Webhook URL Banner */}
      <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-4">
        <ShieldCheck className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-indigo-300">Your Webhook Base URL</p>
          <p className="text-xs text-muted-foreground font-mono mt-1">{backendUrl}/webhooks/[whatsapp|messenger|instagram]</p>
          <p className="text-xs text-muted-foreground mt-1">Paste channel-specific URLs in Meta Developer Dashboard → Webhook settings</p>
        </div>
        <a
          href="https://developers.facebook.com/apps"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300 transition-colors"
        >
          Open Meta <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Connector List */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : connectors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
          <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
            <Zap className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-black">No connectors yet</h3>
          <p className="text-muted-foreground font-medium max-w-sm">
            Add your first Meta channel connector to start receiving messages
          </p>
          {isAdmin && (
            <Button onClick={() => setShowAdd(true)} className="mt-2 bg-primary text-white font-black rounded-2xl px-8">
              Add Connector
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {connectors.map((c, i) => {
            const meta = CHANNEL_META[c.channel as Channel];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="rounded-[2rem] border-border/60 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex items-start justify-between">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", meta.bg)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full", getStatusColor(c.status))}>
                        {c.status}
                      </span>
                    </div>
                    <CardTitle className="text-base mt-3">{c.name}</CardTitle>
                    <CardDescription className="text-xs">{meta.label}</CardDescription>
                    {c.waPhoneNumberId && (
                      <p className="text-[11px] text-muted-foreground font-mono mt-1">ID: {c.waPhoneNumberId}</p>
                    )}
                    {c.fbPageId && (
                      <p className="text-[11px] text-muted-foreground font-mono mt-1">Page: {c.fbPageId}</p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {/* Webhook URL + copy */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/50">
                      <p className="text-[10px] font-mono text-muted-foreground flex-1 truncate">
                        {backendUrl}/webhooks/{c.channel.toLowerCase()}
                      </p>
                      <button onClick={() => copyWebhookUrl(c.channel, c.id)} className="text-muted-foreground hover:text-primary transition-colors">
                        {copiedWebhook === c.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    {/* Action buttons */}
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-xl text-xs font-bold"
                          onClick={() => handleTest(c.id)}
                          disabled={testingId === c.id}
                        >
                          {testingId === c.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCcw className="h-3 w-3 mr-1" />}
                          Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-xl text-xs font-bold"
                          onClick={() => openEdit(c)}
                        >
                          <Settings2 className="h-3 w-3 mr-1" /> Configure
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs font-bold text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {/* Activate toggle */}
                    {isAdmin && (
                      <Button
                        size="sm"
                        onClick={() => handleActivate(c)}
                        className={cn(
                          "w-full rounded-xl text-xs font-black",
                          c.status === "ACTIVE"
                            ? "bg-muted text-foreground hover:bg-muted/80"
                            : "bg-primary text-white shadow-lg shadow-primary/20"
                        )}
                      >
                        {c.status === "ACTIVE" ? "Deactivate" : "Activate Connector"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => { setShowAdd(false); setSelectedChannel(null); setFormData({}); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black">
                      {editConnector ? "Edit Connector" : "Add Connector"}
                    </h2>
                    <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => { setShowAdd(false); setSelectedChannel(null); setFormData({}); }}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Channel Picker (only on create) */}
                  {!editConnector && (
                    <div className="space-y-2 mb-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Channel</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(Object.keys(CHANNEL_META) as Channel[]).map((ch) => {
                          const m = CHANNEL_META[ch];
                          const Icon = m.icon;
                          return (
                            <button
                              key={ch}
                              onClick={() => { setSelectedChannel(ch); setFormData({ name: m.label }); }}
                              className={cn(
                                "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                                selectedChannel === ch
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/40"
                              )}
                            >
                              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", m.bg)}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <span className="text-[10px] font-bold text-center leading-tight">{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Fields */}
                  {selectedChannel && (
                    <div className="space-y-4">
                      {CHANNEL_META[selectedChannel].fields.map((field) => (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {field.label}
                          </label>
                          <div className="relative">
                            <Input
                              type={field.type === "password" && !showPasswords[field.key] ? "password" : "text"}
                              placeholder={field.placeholder}
                              value={formData[field.key] || ""}
                              onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                              className="h-11 rounded-2xl bg-muted border-none font-medium pr-10"
                            />
                            {field.type === "password" && (
                              <button
                                type="button"
                                onClick={() => setShowPasswords((p) => ({ ...p, [field.key]: !p[field.key] }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              >
                                {showPasswords[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Webhook guide */}
                      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Your Webhook URL</p>
                        <p className="text-xs font-mono text-muted-foreground break-all">
                          {backendUrl}/webhooks/{selectedChannel.toLowerCase()}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Paste this URL in Meta Developer Console → Webhooks → Callback URL
                        </p>
                      </div>

                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-12 font-black rounded-2xl bg-primary text-white shadow-xl shadow-primary/20"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {saving ? "Saving..." : editConnector ? "Update Connector" : "Create Connector"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
