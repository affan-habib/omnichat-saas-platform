"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Clock, 
  BarChart2, 
  MessageSquare, 
  CheckCircle2,
  Settings,
  Bell,
  Lock,
  Zap,
  Star,
  Award,
  Users
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, role } = useUser();

  const statsMap: Record<string, any[]> = {
    agent: [
      { label: "Resolved Today", value: "42", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Avg. Response", value: "1.2m", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "CSAT Score", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    ],
    supervisor: [
      { label: "Team Productivity", value: "94%", icon: BarChart2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
      { label: "Active Agents", value: "18/24", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { label: "Open Issues", value: "12", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
    ],
    admin: [
      { label: "System Uptime", value: "99.98%", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
      { label: "Active Sessions", value: "1,240", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "Security Alerts", value: "0", icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
    ]
  };

  const currentStats = statsMap[role.toLowerCase()] || statsMap.agent;

  return (
    <div className="flex min-h-full flex-col bg-background p-8 pt-6 space-y-8 font-outfit">
      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award className="h-64 w-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="h-32 w-32 rounded-3xl bg-primary ring-4 ring-white/10 overflow-hidden">
               <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || role}&background=2563EB&color=fff&size=512`} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-green-500 border-4 border-slate-900 flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight capitalize">{user?.name || `${role} Account`}</h1>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30">
                {role === 'admin' ? 'Master Access' : role === 'supervisor' ? 'Team Director' : 'Professional Agent'}
              </span>
            </div>
            <p className="text-slate-400 font-medium">Manage your personal information and system preferences</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Mail className="h-4 w-4 text-primary" />
                  {user?.email}
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Shield className="h-4 w-4 text-primary" />
                  ID: #{user?.id?.split('-')[0] || 'N/A'}
               </div>
            </div>
          </div>

          <div className="md:ml-auto flex gap-3">
             <Button onClick={() => toast.info("Personal settings opening")} variant="outline" className="rounded-2xl border-white/10 hover:bg-white/10 text-white font-bold h-12 px-6">
                <Settings className="h-4 w-4 mr-2" />
                Settings
             </Button>
             <Button onClick={() => toast.info("Opening profile editor")} className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 shadow-xl shadow-primary/30">
                Edit Profile
             </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentStats.map((stat: any, i: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border/50 shadow-sm overflow-hidden group hover:shadow-md transition-all rounded-3xl bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <div className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Today's Performance
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                 <UserIcon className="h-6 w-6 text-primary" />
                 Account Information
              </h2>
           </div>
           
           <Card className="border-border/50 rounded-3xl bg-card shadow-sm">
              <CardContent className="p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Display Name</label>
                       <div className="p-4 rounded-2xl bg-muted font-bold capitalize">{user?.name}</div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                       <div className="p-4 rounded-2xl bg-muted font-bold">{user?.email}</div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Department</label>
                       <div className="p-4 rounded-2xl bg-muted font-bold capitalize">{role === 'admin' ? 'Systems' : 'Customer Support'}</div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Account Priority</label>
                       <div className="p-4 rounded-2xl bg-muted font-bold text-primary">Level {role === 'admin' ? 'AAA' : role === 'supervisor' ? 'AA' : 'A'}</div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                          <Shield className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">Two-Factor Authentication</p>
                          <p className="text-[10px] text-muted-foreground font-medium">Protect your account with extra security</p>
                       </div>
                    </div>
                    <Button onClick={() => toast.info("Redirecting to 2FA setup")} variant="outline" className="rounded-xl h-9 text-xs font-bold">Enable 2FA</Button>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Activity Sidebar */}
        <div className="space-y-6">
           <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Recent Activity
           </h2>
           
           <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
                   <div className="h-10 w-10 shrink-0 rounded-xl bg-muted flex items-center justify-center transition-colors">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                   </div>
                   <div className="space-y-1 overflow-hidden">
                      <p className="text-xs font-bold">Logged in from Mumbai, India</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Chrome on MacOS • 2h ago</p>
                   </div>
                </div>
              ))}
              
              <Button onClick={() => toast.info("Fetching login history")} variant="ghost" className="w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                 View Full Login History
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
