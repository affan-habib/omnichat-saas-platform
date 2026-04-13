"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Settings, 
  Bell, 
  Lock, 
  Shield, 
  User, 
  Globe, 
  MessageCircle, 
  CheckCircle2,
  ChevronRight,
  Zap,
  Eye,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/user-context";
import { tenantService } from "@/services/api.service";

export default function SettingsPage() {
  const { role, user, fetchMe, toggleTheme, theme } = useUser();
  const [isAdminChatting, setIsAdminChatting] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [whiteLabelEnabled, setWhiteLabelEnabled] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);

  // User Settings State
  const [compactMode, setCompactMode] = useState(false);
  const [supervisorOverride, setSupervisorOverride] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [dailyTarget, setDailyTarget] = useState(100);
  const [notifications, setNotifications] = useState({
    browser: true,
    email: true,
    desktop: true,
  });

  // Fetch current tenant & user settings on mount
  useEffect(() => {
    // Populate user settings from user context
    if (user?.settings) {
      setCompactMode(user.settings.compactMode ?? false);
      setSupervisorOverride(user.settings.supervisorOverride ?? true);
      setReadReceipts(user.settings.readReceipts ?? true);
      setAutoTranslate(user.settings.autoTranslate ?? false);
      setDailyTarget(user.settings.dailyTarget ?? 100);
      if (user.settings.notifications) {
        setNotifications(user.settings.notifications);
      }
    }

    const fetchTenant = async () => {
      try {
        const res = await tenantService.get();
        const { name, settings } = res.data;
        setOrgName(name || "");
        if (settings) {
          setBrandColor(settings.brandColor || "#6366f1");
          setWhiteLabelEnabled(settings.whiteLabelEnabled || false);
          setIsAdminChatting(settings.adminChatting || false);
        }
      } catch {
        // Not critical — just show defaults
      }
    };
    fetchTenant();
  }, []);

  const handleSaveOrg = async () => {
    setSavingOrg(true);
    try {
      await tenantService.update({
        name: orgName,
        settings: {
          brandColor,
          whiteLabelEnabled,
          adminChatting: isAdminChatting,
        }
      });
      toast.success("Organization settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSavingOrg(false);
    }
  };

  const handleSaveUserSettings = async (updatedSettings: any) => {
    try {
      // Merge new settings with existing user settings
      const newSettings = { ...user?.settings, ...updatedSettings };
      const { userService } = await import('@/services/api.service');
      await userService.update(user!.id, { settings: newSettings });
      await fetchMe(); // Refresh context
      toast.success("Preferences saved successfully");
    } catch {
      toast.error("Failed to save preferences");
    }
  };

  const sections = [
    { id: 'profile', label: 'General Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: Lock },
    { id: 'organization', label: 'Organization (SaaS)', icon: Globe, show: role === 'admin' },
    { id: 'chat', label: 'Chat Preferences', icon: MessageCircle },
  ];

  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="flex h-full flex-col bg-background font-outfit overflow-hidden">
      <div className="p-8 border-b border-border bg-card/50 backdrop-blur-md">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
           <Settings className="h-8 w-8 text-primary animate-spin-slow" />
           System Settings
        </h1>
        <p className="text-muted-foreground font-medium mt-1">Configure your workspace, security, and enterprise preferences.</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-muted/30 p-4 space-y-1">
          {sections.filter(s => s.show !== false).map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                activeSection === section.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12">
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-black">Profile Customization</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</label>
                    <div className="p-4 rounded-2xl bg-muted font-bold">{role}@omnichat.com</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Language</label>
                    <div className="p-4 rounded-2xl bg-muted font-bold font-sans">English (US)</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Daily Resolution Target</label>
                    <Input 
                      type="number"
                      value={dailyTarget}
                      onChange={(e) => setDailyTarget(Number(e.target.value))}
                      onBlur={() => handleSaveUserSettings({ dailyTarget })}
                      className="h-14 font-bold rounded-2xl bg-muted border-none"
                    />
                  </div>
                </div>
              </div>

              <Card className="rounded-[2rem] border-border/50 shadow-md">
                 <CardHeader>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                    <CardDescription>Customize how OmniChat looks on your device.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50">
                       <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-primary" />
                          <span className="text-sm font-bold">Dark Mode</span>
                       </div>
                       <Switch checked={theme === 'dark'} onCheckedChange={() => { toggleTheme(); handleSaveUserSettings({ darkMode: theme !== 'dark' }); }} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50">
                       <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-indigo-500" />
                          <span className="text-sm font-bold">Compact Mode</span>
                       </div>
                       <Switch checked={compactMode} onCheckedChange={(val) => { setCompactMode(val); handleSaveUserSettings({ compactMode: val }); }} />
                    </div>
                 </CardContent>
              </Card>
            </motion.div>
          )}

          {activeSection === 'organization' && role === 'admin' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl space-y-8">
               <div className="space-y-4">
                  <h2 className="text-2xl font-black">Enterprise Access Control</h2>
                  <p className="text-muted-foreground font-medium">Global rules for how your team interacts with the system.</p>
               </div>

                <Card className="rounded-[2.5rem] border-border/50 shadow-md bg-slate-950 text-white overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Shield className="h-32 w-32" />
                   </div>
                   <CardHeader>
                      <CardTitle className="text-white">Admin Capabilities</CardTitle>
                      <CardDescription className="text-slate-500">Enable or disable core functions for System Administrators.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                         <div>
                            <p className="text-sm font-bold">Allow Admin to Handle Conversations</p>
                            <p className="text-[10px] text-slate-500 font-medium">When enabled, admins will appear in the routing pool for incoming chats.</p>
                         </div>
                         <Switch 
                           checked={isAdminChatting} 
                           onCheckedChange={(val) => { setIsAdminChatting(val); }}
                           className="data-[state=checked]:bg-primary"
                         />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 opacity-50">
                         <div>
                            <p className="text-sm font-bold">Supervisor Override</p>
                            <p className="text-[10px] text-slate-500 font-medium">Allow supervisors to take over any active agent session.</p>
                         </div>
                          <Switch checked={supervisorOverride} onCheckedChange={(val) => { setSupervisorOverride(val); handleSaveUserSettings({ supervisorOverride: val }); }} />
                       </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-xl font-black italic flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Tenant Branding
                    </h3>

                    <div className="space-y-3">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Organization Name</label>
                          <Input
                            value={orgName}
                            onChange={e => setOrgName(e.target.value)}
                            placeholder="Acme Corp"
                            className="bg-muted border-none h-12 rounded-2xl font-bold"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold">Brand Primary Color</span>
                             <div className="h-8 w-8 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: brandColor }} />
                          </div>
                          <Input
                            value={brandColor}
                            onChange={e => setBrandColor(e.target.value)}
                            placeholder="#6366f1"
                            className="bg-muted border-none h-11 rounded-xl font-bold font-mono"
                          />
                       </div>
                       <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold">White-labeling</span>
                             <Switch checked={whiteLabelEnabled} onCheckedChange={setWhiteLabelEnabled} />
                          </div>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Remove 'Powered by OmniChat' branding from consumer touchpoints.</p>
                       </div>
                    </div>
                    <Button onClick={handleSaveOrg} disabled={savingOrg} className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl shadow-xl shadow-primary/20">
                       {savingOrg ? "Saving..." : "Commit Identity Changes"}
                    </Button>
                 </div>

               <div className="p-8 border border-amber-500/30 bg-amber-500/10 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 text-amber-500">
                     <Zap className="h-6 w-6" />
                     <h3 className="font-black">Auto-Scaling Notification</h3>
                  </div>
                  <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                     Your platform is currently configured to automatically distribute tasks among 24 active agents. If your queue exceeds 50 messages, AI routing will prioritize VIP customers automatically.
                  </p>
                  <Button onClick={() => toast.info("Opening auto-scaling editor")} variant="outline" className="border-amber-500/50 text-amber-700 font-bold hover:bg-amber-500/20 rounded-xl h-9 px-4 text-[10px] uppercase tracking-widest">
                     Adjust Thresholds
                  </Button>
               </div>

               <Card className="rounded-[2rem] border-border/50 shadow-md bg-indigo-900 text-white overflow-hidden relative">
                  <CardHeader>
                     <CardTitle className="text-white text-lg">Compliance Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p className="text-sm text-indigo-100/70">Access full SOC2, GDPR, and system audit logs for quarterly reviews.</p>
                     <Button onClick={() => toast.info("Opening compliance dashboard")} className="w-full bg-white text-indigo-900 hover:bg-white/90 font-bold h-12 rounded-2xl">
                        View Compliance Dashboard
                     </Button>
                  </CardContent>
               </Card>
            </motion.div>
          )}

          {activeSection === 'chat' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl space-y-8">
                <div className="space-y-4">
                   <h2 className="text-2xl font-black">Chat Experience</h2>
                   <p className="text-muted-foreground font-medium">Customize how you interact with customers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="rounded-3xl border-border/50 shadow-sm">
                      <CardContent className="p-6">
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold">Read Receipts</span>
                             <Switch checked={readReceipts} onCheckedChange={(val) => { setReadReceipts(val); handleSaveUserSettings({ readReceipts: val }); }} />
                          </div>
                          <p className="text-[10px] text-muted-foreground font-medium">Customers can see when you have read their messages.</p>
                       </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-border/50 shadow-sm">
                       <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                             <span className="text-sm font-bold">Auto-Translate</span>
                             <Switch checked={autoTranslate} onCheckedChange={(val) => { setAutoTranslate(val); handleSaveUserSettings({ autoTranslate: val }); }} />
                          </div>
                          <p className="text-[10px] text-muted-foreground font-medium">Automatically translate non-English messages using AI.</p>
                       </CardContent>
                   </Card>
                </div>
             </motion.div>
          )}

          {activeSection === 'notifications' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl space-y-8">
                <div className="space-y-4">
                   <h2 className="text-2xl font-black">Notification Channels</h2>
                   <p className="text-muted-foreground font-medium">Control how you get alerted for new interaction events.</p>
                </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
                       <span className="font-bold text-sm">Browser Push Notifications</span>
                       <Switch checked={notifications.browser} onCheckedChange={(val) => { 
                         const n = { ...notifications, browser: val }; setNotifications(n); handleSaveUserSettings({ notifications: n }); 
                       }} />
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
                       <span className="font-bold text-sm">Email Digest Notifications</span>
                       <Switch checked={notifications.email} onCheckedChange={(val) => { 
                         const n = { ...notifications, email: val }; setNotifications(n); handleSaveUserSettings({ notifications: n }); 
                       }} />
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
                       <span className="font-bold text-sm">Desktop Sound Notifications</span>
                       <Switch checked={notifications.desktop} onCheckedChange={(val) => { 
                         const n = { ...notifications, desktop: val }; setNotifications(n); handleSaveUserSettings({ notifications: n }); 
                       }} />
                    </div>
                 </div>
             </motion.div>
          )}

          {activeSection === 'security' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl space-y-8">
                <div className="space-y-4">
                   <h2 className="text-2xl font-black">Security Protocol</h2>
                   <p className="text-muted-foreground font-medium">Manage your authentication methods and session security.</p>
                </div>

                <Card className="rounded-3xl border-border/50 shadow-md p-8 text-center space-y-6">
                   <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="h-8 w-8 text-primary" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">Adding a second layer of security ensures that only you can access your support account.</p>
                   </div>
                   <Button onClick={() => toast.info("Redirecting to MFA configuration")} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-2xl">
                      Configure MFA
                   </Button>
                </Card>

                <div className="flex items-center justify-between p-6 rounded-3xl border border-red-500/20 bg-red-500/5">
                   <div>
                      <p className="font-bold text-sm text-red-600">Terminate All Sessions</p>
                      <p className="text-[10px] text-red-600/70 font-medium">Log out of every device current connected to this account.</p>
                   </div>
                   <Button onClick={() => toast.warning("All other sessions terminated")} variant="outline" className="border-red-500/30 text-red-600 hover:bg-red-500/10 rounded-xl h-10 px-4 text-xs font-bold">Terminate</Button>
                </div>
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
