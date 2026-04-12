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
  const { user, role, fetchMe } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, email: user.email });
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
       await workforceService.update(user!.id, { name: profileForm.name });
       toast.success("Identity updated successfully");
       setIsEditing(false);
       fetchMe();
    } catch (error) {
       toast.error("Failed to update identity");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) return toast.error("Passwords do not match");
    if (passwordForm.new.length < 6) return toast.error("Password must be at least 6 characters");
    
    try {
       await workforceService.update(user!.id, { password: passwordForm.new });
       toast.success("Security credentials rotated");
       setIsChangingPass(false);
       setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error) {
       toast.error("Failed to rotate credentials");
    }
  };

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
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award className="h-64 w-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="h-40 w-40 rounded-[2.5rem] bg-primary ring-8 ring-white/5 overflow-hidden shadow-2xl">
               <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || role}&background=2563EB&color=fff&size=512`} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-2xl bg-green-500 border-4 border-slate-900 flex items-center justify-center shadow-lg">
               <Zap className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h1 className="text-4xl font-black tracking-tight capitalize italic">{user?.name || `${role} Account`}</h1>
              <span className="px-4 py-1.5 rounded-xl bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/30 backdrop-blur-md">
                {role === 'admin' ? 'Strategic Architect' : role === 'supervisor' ? 'Operations Lead' : 'Frontline Specialist'}
              </span>
            </div>
            <p className="text-slate-400 font-medium text-lg">Managing critical infrastructure node since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-6">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  {user?.email}
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  Privilege Level: GOLD
               </div>
            </div>
          </div>

          <div className="md:ml-auto flex flex-col gap-3">
             <Button onClick={() => setIsEditing(true)} className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black h-14 px-8 shadow-2xl shadow-primary/30 uppercase tracking-widest text-[10px]">
                Refine Identity
             </Button>
             <Button onClick={() => setIsChangingPass(true)} variant="outline" className="rounded-2xl border-white/10 hover:bg-white/5 text-white font-black h-14 px-8 uppercase tracking-widest text-[10px]">
                Rotate Credentials
             </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {currentStats.map((stat: any, i: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border shadow-md overflow-hidden group hover:shadow-xl transition-all rounded-[2.5rem] bg-card border-t-8 border-t-transparent hover:border-t-primary">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className={cn("h-14 w-14 rounded-[1.25rem] flex items-center justify-center transition-all group-hover:rotate-12", stat.bg)}>
                    <stat.icon className={cn("h-7 w-7", stat.color)} />
                  </div>
                  <div className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                    Live Telemetry
                  </div>
                </div>
                <div className="mt-6">
                   <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                   <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3 italic">
                 <UserIcon className="h-7 w-7 text-primary" />
                 Node Configuration
              </h2>
           </div>
           
           <Card className="border-border rounded-[2.5rem] bg-card shadow-lg">
              <CardContent className="p-10 space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Legal Name (Read Only)</label>
                       <div className="p-5 rounded-2xl bg-muted font-black text-lg h-16 flex items-center">{user?.name}</div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">System Identity</label>
                       <div className="p-5 rounded-2xl bg-muted font-black text-lg h-16 flex items-center">{user?.email}</div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Division</label>
                       <div className="p-5 rounded-2xl bg-muted font-black text-lg h-16 flex items-center italic">{role === 'admin' ? 'Strategic Intelligence' : 'Operational Support'}</div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px) font-black uppercase tracking-widest text-muted-foreground ml-1">Clearance Protocol</label>
                       <div className="p-5 rounded-2xl bg-primary/10 font-black text-lg h-16 flex items-center text-primary uppercase tracking-widest">Level {role === 'admin' ? 'OMEGA' : 'SIGMA'}</div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                       <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-sm font-black italic">Active Security Session</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Your connection is encrypted via AES-256 state.</p>
                       </div>
                    </div>
                    <Button variant="outline" className="rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/5">Check Status</Button>
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

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl p-10 font-outfit">
               <h2 className="text-3xl font-black mb-2 italic">Refine Identity</h2>
               <p className="text-muted-foreground font-medium mb-10">Update your public display name within the organization.</p>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">New Display Name</label>
                     <Input 
                       className="h-14 rounded-2xl bg-muted border-none font-bold text-lg" 
                       value={profileForm.name}
                       onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                     />
                  </div>
               </div>

               <div className="flex gap-4 mt-12">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setIsEditing(false)}>Discard</Button>
                  <Button onClick={handleUpdateProfile} className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20">Apply Changes</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {isChangingPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsChangingPass(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl p-10 font-outfit">
               <h2 className="text-3xl font-black mb-2 italic">Security Rotation</h2>
               <p className="text-muted-foreground font-medium mb-10">Updating your cryptographic access credentials.</p>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">New Secure Password</label>
                     <Input 
                       type="password"
                       className="h-14 rounded-2xl bg-muted border-none font-bold" 
                       value={passwordForm.new}
                       onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Confirm Identity Key</label>
                     <Input 
                       type="password"
                       className="h-14 rounded-2xl bg-muted border-none font-bold" 
                       value={passwordForm.confirm}
                       onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                     />
                  </div>
               </div>

               <div className="flex gap-4 mt-12">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setIsChangingPass(false)}>Cancel Rotation</Button>
                  <Button onClick={handleChangePassword} className="flex-1 h-14 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-500/20">Rotate Password</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
