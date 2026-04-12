"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Users, 
  UserPlus, 
  Shield, 
  MoreVertical, 
  Search, 
  Filter, 
  CheckCircle2,
  Lock,
  Eye,
  Settings,
  X,
  Zap,
  ChevronRight,
  ShieldCheck,
  MousePointer2,
  Target,
  Mail,
  Briefcase,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { userService, teamService } from "@/services/api.service";

export default function WorkforcePage() {
  const [activeTab, setActiveTab] = useState("staff"); // "staff" or "teams"
  const [staff, setStaff] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [selectedStaffType, setSelectedStaffType] = useState("agent");

  const permissionCategories = [
    {
      name: "Conversation Management",
      permissions: [
        { id: "p1", name: "Can Resolve Conversations", description: "Allow ending support sessions" },
        { id: "p2", name: "Can Delete History", description: "Permanently remove chat logs", risk: "high" },
        { id: "p3", name: "Can Transfer Chats", description: "Move sessions between agents" },
      ]
    },
    {
      name: "System & Billing",
      permissions: [
        { id: "p4", name: "Access Billing", description: "View invoices and manage plans", risk: "high" },
        { id: "p5", name: "Manage Integrations", description: "Connect WhatsApp, Messenger, etc." },
        { id: "p6", name: "Export Data", description: "Download CSV/JSON reports" },
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [staffRes, teamsRes] = await Promise.all([
          userService.list(),
          teamService.list()
        ]);
        setStaff(staffRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        toast.error("Failed to load workforce data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-background p-8 space-y-8 font-outfit">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <ShieldCheck className="h-8 w-8 text-primary" />
             Workforce Control Center
          </h1>
          <p className="text-muted-foreground font-medium">Unified management of teams, supervisors, and agents in a single command interface.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             onClick={() => setIsPermissionModalOpen(true)} 
             variant="outline" 
             className="h-12 rounded-2xl font-bold border-border bg-card hover:bg-muted"
           >
              Dynamic Permissions
           </Button>
           <Button 
             onClick={() => setIsAddStaffOpen(true)} 
             className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-primary/20"
           >
             <UserPlus className="h-5 w-5" />
             Add Workforce Staff
           </Button>
        </div>
      </div>

      {/* Stats Quick-View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Total Workforce", value: staff.length.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
           { label: "Supervisors", value: staff.filter(s => s.role === 'SUPERVISOR').length.toString(), icon: Shield, color: "text-indigo-500", bg: "bg-indigo-500/10" },
           { label: "Active Teams", value: teams.length.toString(), icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
           { label: "Avg SLA", value: "99.4%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
         ].map((stat, i) => (
           <Card key={i} className="border-border/50 shadow-sm rounded-3xl bg-card">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-2">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", stat.bg)}>
                       <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Real-time</span>
                 </div>
                 <p className="text-xs font-bold text-muted-foreground">{stat.label}</p>
                 <p className="text-2xl font-black">{stat.value}</p>
              </CardContent>
           </Card>
         ))}
      </div>

      {/* View Switcher */}
      <div className="flex gap-4 border-b border-border pb-1">
         {["staff", "teams"].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={cn(
               "pb-3 px-4 text-sm font-black uppercase tracking-widest transition-all relative",
               activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
             )}
           >
             {tab}
             {activeTab === tab && (
               <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
             )}
           </button>
         ))}
      </div>

      <div className="space-y-6">
         {activeTab === "staff" ? (
           <>
             <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input placeholder="Search staff by name or team..." className="pl-10 h-11 rounded-2xl bg-muted border-none font-medium" />
                </div>
                <div className="flex items-center gap-2">
                   {["all", "agent", "supervisor", "admin"].map(role => (
                     <button 
                       key={role}
                       onClick={() => setSelectedRole(role === 'all' ? null : role)}
                       className={cn(
                         "h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                         (selectedRole === role || (role === 'all' && !selectedRole))
                           ? "bg-primary border-primary text-white"
                           : "border-border text-muted-foreground hover:bg-muted"
                       )}
                     >
                       {role}
                     </button>
                   ))}
                </div>
             </div>

             <Card className="rounded-[2.5rem] border-border/50 shadow-xl bg-card overflow-hidden">
                <CardContent className="p-0">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-muted/50 border-b border-border">
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Staff Member</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Team / Role</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Load</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                         {staff.filter(s => !selectedRole || s.role.toLowerCase() === selectedRole).map((person) => (
                            <tr key={person.id} className="hover:bg-muted/20 transition-colors group">
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-4">
                                     <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                                        {person.avatarUrl ? (
                                          <img src={person.avatarUrl} alt="" />
                                        ) : (
                                          <span className="font-bold">{person.name[0]}</span>
                                        )}
                                     </div>
                                     <div>
                                        <p className="font-black text-sm">{person.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">ID: #WK-{person.id.split('-')[0]}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="space-y-1">
                                     <p className="text-xs font-bold text-foreground">{person.team?.name || 'No Team'}</p>
                                     <div className={cn(
                                       "inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                                       person.role === 'SUPERVISOR' || person.role === 'ADMIN' ? "bg-indigo-500/10 text-indigo-500" : "bg-primary/10 text-primary"
                                     )}>
                                        {person.role.toLowerCase()}
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                     <div className="flex-1 max-w-[80px] h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: '40%' }} />
                                     </div>
                                     <span className="text-[10px] font-black">0/8</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-2">
                                     <div className={cn("h-2 w-2 rounded-full", person.status === 'ONLINE' ? 'bg-green-500' : 'bg-amber-500')} />
                                     <span className="text-xs font-bold capitalize">{person.status.toLowerCase()}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5 text-right">
                                  <Button onClick={() => toast.info(`Opening ${person.name} control panel`)} variant="ghost" size="icon" className="group-hover:text-primary rounded-full transition-colors">
                                     <MoreVertical className="h-4 w-4" />
                                  </Button>
                               </td>
                            </tr>
                         ))}
                         {staff.length === 0 && (
                           <tr>
                             <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground font-medium">No staff members found.</td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </CardContent>
             </Card>
           </>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="rounded-[2.5rem] border-border/50 shadow-md bg-card overflow-hidden hover:shadow-xl transition-all group">
                   <div className={cn("h-1.5 w-full bg-primary")} />
                   <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h4 className="text-xl font-black group-hover:text-primary transition-colors">{team.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
                               <Shield className="h-3 w-3 text-primary" />
                               Created: {new Date(team.createdAt).toLocaleDateString()}
                            </p>
                         </div>
                         <Button onClick={() => toast.info("Opening team audit logs")} variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="h-4 w-4" /></Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="p-4 rounded-2xl bg-muted/50 text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Members</p>
                            <p className="text-lg font-black">{team._count?.members || 0}</p>
                         </div>
                         <div className="p-4 rounded-2xl bg-muted/50 text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Routing Rules</p>
                            <p className="text-lg font-black text-primary">{team._count?.routingRules || 0}</p>
                         </div>
                      </div>
                      <Button onClick={() => toast.info(`Managing ${team.name} roster`)} className="w-full h-11 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase">Manage Team</Button>
                   </CardContent>
                </Card>
              ))}
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-[2.5rem] hover:bg-muted/30 transition-all cursor-pointer group" onClick={() => setIsCreateTeamOpen(true)}>
                 <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <UserPlus className="h-8 w-8" />
                 </div>
                 <p className="text-lg font-black">Add Team Profile</p>
              </div>
           </div>
         )}
      </div>

      {/* 1. Dynamic Permissions Modal */}
      <AnimatePresence>
        {isPermissionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPermissionModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-2xl bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden font-outfit">
                <div className="p-8 border-b border-border flex items-center justify-between">
                   <div>
                      <h3 className="text-2xl font-black">Workforce Authorization</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Dynamic Policy Settings</p>
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setIsPermissionModalOpen(false)}><X className="h-5 w-5" /></Button>
                </div>
                
                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                   <div className="flex gap-2 bg-muted p-1 rounded-2xl w-fit mx-auto">
                      {["agent", "supervisor", "admin"].map(r => (
                        <button 
                          key={r}
                          onClick={() => setSelectedStaffType(r)}
                          className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                            selectedStaffType === r ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                   </div>

                   {permissionCategories.map((cat, idx) => (
                      <div key={idx} className="space-y-4">
                         <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            {cat.name}
                         </h4>
                         <div className="grid gap-4">
                            {cat.permissions.map(perm => (
                               <div key={perm.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 group hover:border-primary/20 transition-all">
                                  <div className="flex-1 pr-4">
                                     <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold">{perm.name}</p>
                                        {perm.risk === 'high' && <span className="text-[8px] font-black bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded uppercase">Critical</span>}
                                     </div>
                                     <p className="text-[10px] text-muted-foreground font-medium">{perm.description}</p>
                                  </div>
                                  <Switch checked={selectedStaffType === 'admin' || (selectedStaffType === 'supervisor' && !perm.risk)} />
                               </div>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>

                <div className="p-8 bg-muted/30 border-t border-border flex justify-between items-center">
                   <p className="text-xs text-muted-foreground font-medium">Changes apply instantly to all <span className="text-primary font-bold">{selectedStaffType}s</span> across your org.</p>
                   <Button className="bg-primary text-white font-bold px-8 h-12 rounded-2xl shadow-xl shadow-primary/20" onClick={() => setIsPermissionModalOpen(false)}>Save Policies</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Unified Add Staff Modal */}
      <AnimatePresence>
        {isAddStaffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddStaffOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl p-8 font-outfit">
                <div className="flex justify-between items-center mb-6">
                   <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <UserPlus className="h-8 w-8" />
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setIsAddStaffOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
                <h3 className="text-2xl font-black mb-1">Onboard Workforce</h3>
                <p className="text-muted-foreground text-sm font-medium mb-8">Establish a new agent, supervisor, or administrator profile.</p>

                <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Workforce Role</label>
                       <div className="grid grid-cols-3 gap-3">
                          {["agent", "supervisor", "admin"].map(r => (
                             <button key={r} className="p-3 rounded-2xl border border-border hover:border-primary transition-all text-center group">
                                <p className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-primary">{r}</p>
                             </button>
                          ))}
                       </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Full Name</label>
                      <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input placeholder="Johnathan Doe" className="pl-12 h-12 rounded-2xl bg-muted border-none" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Assign to Team</label>
                      <select className="w-full h-12 rounded-2xl bg-muted px-4 font-bold text-sm outline-none border-none">
                         {teams.map(t => <option key={t.id}>{t.name}</option>)}
                         <option>Unassigned</option>
                      </select>
                   </div>
                </div>

                <div className="mt-10 flex gap-4">
                   <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsAddStaffOpen(false)}>Cancel</Button>
                   <Button className="flex-1 h-12 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20" onClick={() => { toast.success("New staff member has been invited!"); setIsAddStaffOpen(false); }}>Send Invite</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Create Team Modal */}
      <AnimatePresence>
        {isCreateTeamOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateTeamOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl p-8 font-outfit">
                <div className="flex justify-between items-center mb-6">
                   <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Target className="h-8 w-8" />
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setIsCreateTeamOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
                <h3 className="text-2xl font-black mb-1">Establish New Team</h3>
                <p className="text-muted-foreground text-sm font-medium mb-8">Create a specialized group profile for your support organization.</p>

                <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Team Identity</label>
                       <Input placeholder="e.g. VIP Support" className="h-12 rounded-2xl bg-muted border-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Lead Supervisor</label>
                      <select className="w-full h-12 rounded-2xl bg-muted px-4 font-bold text-sm outline-none border-none">
                         {staff.filter(s => s.role === 'SUPERVISOR').map(s => <option key={s.id}>{s.name}</option>)}
                         <option>Unassigned</option>
                      </select>
                   </div>
                </div>

                <div className="mt-10 flex gap-4">
                   <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsCreateTeamOpen(false)}>Cancel</Button>
                   <Button className="flex-1 h-12 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20" onClick={() => { toast.success("Team created!"); setIsCreateTeamOpen(false); }}>Create Profile</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
