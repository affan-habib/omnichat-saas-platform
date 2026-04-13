"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, ShieldAlert, Cpu, 
  Globe, Bell, Save, AlertTriangle,
  Database, Radio, Lock, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SuperadminSettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("System configurations updated globally");
    }, 1000);
  };

  return (
    <div className="p-8 space-y-8 font-outfit max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Settings className="h-8 w-8 text-rose-600" /> System Configuration
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Manage global platform behaviors and maintenance settings
          </p>
        </div>
        <Button onClick={handleSave} className="bg-rose-600 text-white font-black rounded-2xl px-8 h-12 shadow-xl shadow-rose-600/20 gap-2">
          {loading ? <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Toggles */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-500" /> Platform Availability
              </CardTitle>
              <CardDescription className="text-xs font-medium">Control the global state of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-3xl bg-rose-500/5 border border-rose-500/10">
                <div className="space-y-1">
                  <p className="text-sm font-black text-rose-600 uppercase tracking-tight">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground font-medium pr-8">
                    Redirect all non-admin users to a maintenance page. Used for deep infrastructure updates.
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 rounded-3xl bg-muted/30">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight">New Registrations</p>
                  <p className="text-xs text-muted-foreground font-medium pr-8">
                    Allow or prevent new users from signing up for the platform.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-3xl bg-muted/30">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight">AI Features (Enterprise)</p>
                  <p className="text-xs text-muted-foreground font-medium pr-8">
                    Enable or disable AI auto-replies across the platform for all tenants.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <Radio className="h-5 w-5 text-blue-500" /> Global Webhooks
              </CardTitle>
              <CardDescription className="text-xs font-medium">Configure top-level API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Master Webhook Override</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="https://api.omnichat.com/webhooks/master" 
                    className="pl-10 h-11 bg-muted/50 border-none rounded-2xl font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Status Cards */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-slate-900 text-white border-none">
            <CardHeader className="pb-2">
              <div className="p-2 w-fit rounded-xl bg-slate-800 mb-2">
                <Database className="h-5 w-5 text-emerald-400" />
              </div>
              <CardTitle className="text-lg font-black">Cluster Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Database Connection</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Healthy
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Cache Layer (Redis)</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-white/50 backdrop-blur-xl border-none">
            <CardHeader>
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Platform Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Max Tenants</label>
                <Input type="number" defaultValue={500} className="h-10 bg-muted/50 border-none rounded-xl font-black text-center" />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic">
                Hard limit for SaaS infrastructure scaling.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
