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
  Award,
  Edit,
  Trash2,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { userService, teamService } from "@/services/api.service";
import { useUser } from "@/context/user-context";

export default function WorkforcePage() {
  const { role: userRole } = useUser();
  const [activeTab, setActiveTab] = useState("staff"); // "staff" or "teams"
  const [staff, setStaff] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  
  const [selectedStaffType, setSelectedStaffType] = useState("AGENT");
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [editingTeam, setEditingTeam] = useState<any>(null);

  // Form States
  const [staffForm, setStaffForm] = useState({ name: "", email: "", role: "AGENT", teamId: "" });
  const [teamForm, setTeamForm] = useState({ name: "", color: "#6366f1" });

  const isAdmin = userRole === 'admin' || userRole === 'owner';

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleInviteStaff = async () => {
    if (!staffForm.name || !staffForm.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await userService.invite(staffForm);
      toast.success("Staff member invited successfully!");
      setIsAddStaffOpen(false);
      setStaffForm({ name: "", email: "", role: "AGENT", teamId: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to invite staff");
    }
  };

  const handleUpdateStaff = async () => {
    try {
      await userService.update(editingStaff.id, staffForm);
      toast.success("Staff member updated!");
      setIsEditStaffOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update staff");
    }
  };

  const handleCreateTeam = async () => {
    if (!teamForm.name) {
      toast.error("Team name is required");
      return;
    }
    try {
      await teamService.create(teamForm);
      toast.success("Team created successfully!");
      setIsCreateTeamOpen(false);
      setTeamForm({ name: "", color: "#6366f1" });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create team");
    }
  };

  const handleUpdateTeam = async () => {
    try {
      await teamService.update(editingTeam.id, teamForm);
      toast.success("Team updated!");
      setIsEditTeamOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update team");
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await userService.remove(id);
      toast.success("User deactivated");
      fetchData();
    } catch (error) {
      toast.error("Failed to deactivate user");
    }
  };

  const openEditStaff = (person: any) => {
    setEditingStaff(person);
    setStaffForm({ name: person.name, email: person.email, role: person.role, teamId: person.teamMemberships?.[0]?.teamId || "" });
    setIsEditStaffOpen(true);
  };

  const openEditTeam = (team: any) => {
    setEditingTeam(team);
    setTeamForm({ name: team.name, color: team.color || "#6366f1" });
    setIsEditTeamOpen(true);
  };

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
           {isAdmin && (
             <>
               <Button 
                 onClick={() => setIsPermissionModalOpen(true)} 
                 variant="outline" 
                 className="h-12 rounded-2xl font-bold border-border bg-card hover:bg-muted px-6"
               >
                  <Key className="h-4 w-4 mr-2" />
                  Policy Manager
               </Button>
               <Button 
                 onClick={() => {
                   setStaffForm({ name: "", email: "", role: "AGENT", teamId: "" });
                   setIsAddStaffOpen(true);
                 }} 
                 className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-primary/20"
               >
                 <UserPlus className="h-5 w-5" />
                 Add Staff Member
               </Button>
             </>
           )}
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
                                        <span className="font-bold">{person.name[0]}</span>
                                     </div>
                                     <div>
                                        <p className="font-black text-sm">{person.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">ID: #WK-{person.id.split('-')[0]}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="space-y-1">
                                     <div className="flex flex-wrap gap-1">
                                        {person.teamMemberships?.map((tm: any) => (
                                          <span key={tm.teamId} className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded">
                                            {tm.team.name}
                                          </span>
                                        )) || <span className="text-muted-foreground text-xs italic">No Team</span>}
                                     </div>
                                     <div className={cn(
                                       "inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                                       person.role === 'SUPERVISOR' || person.role === 'ADMIN' ? "bg-indigo-500/10 text-indigo-500" : "bg-primary/10 text-primary"
                                     )}>
                                        {person.role.toLowerCase()}
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-2">
                                     <div className={cn("h-2 w-2 rounded-full", person.status === 'ONLINE' ? 'bg-green-500' : 'bg-amber-500')} />
                                     <span className="text-xs font-bold capitalize">{person.status.toLowerCase()}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Button onClick={() => openEditStaff(person)} variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                     </Button>
                                     {isAdmin && person.email !== 'admin@acme.com' && (
                                       <Button onClick={() => handleDeactivate(person.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-rose-500/10 transition-colors">
                                          <Trash2 className="h-4 w-4 text-rose-500" />
                                       </Button>
                                     )}
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </CardContent>
             </Card>
           </>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="rounded-[2.5rem] border-border/50 shadow-md bg-card overflow-hidden hover:shadow-xl transition-all group">
                   <div className="h-1.5 w-full" style={{ backgroundColor: team.color || '#6366f1' }} />
                   <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h4 className="text-xl font-black group-hover:text-primary transition-colors">{team.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
                               <Shield className="h-3 w-3 text-primary" />
                               Created: {new Date(team.createdAt).toLocaleDateString()}
                            </p>
                         </div>
                         <div className="flex gap-1">
                            <Button onClick={() => openEditTeam(team)} variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                            {isAdmin && (
                              <Button onClick={() => { if(confirm("Delete team?")) teamService.remove(team.id).then(() => fetchData()) }} variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5 text-rose-500" /></Button>
                            )}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="p-4 rounded-2xl bg-muted/50 text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Members</p>
                            <p className="text-lg font-black">{team._count?.members || 0}</p>
                         </div>
                         <div className="p-4 rounded-2xl bg-muted/50 text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Color</p>
                            <div className="h-5 w-5 rounded-full mx-auto mt-1" style={{ backgroundColor: team.color || '#6366f1' }} />
                         </div>
                      </div>
                      {isAdmin && (
                        <Button onClick={() => openEditTeam(team)} className="w-full h-11 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase">Manage Team</Button>
                      )}
                   </CardContent>
                </Card>
              ))}
              {isAdmin && (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-[2.5rem] hover:bg-muted/30 transition-all cursor-pointer group min-h-[300px]" onClick={() => {
                  setTeamForm({ name: "", color: "#6366f1" });
                  setIsCreateTeamOpen(true);
                }}>
                   <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Target className="h-8 w-8" />
                   </div>
                   <p className="text-lg font-black">Add Team Profile</p>
                </div>
              )}
           </div>
         )}
      </div>

      {/* MODALS */}
      
      {/* 1. Add Staff Modal */}
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
                          {["AGENT", "SUPERVISOR", "ADMIN"].map(r => (
                             <button 
                                key={r} 
                                onClick={() => setStaffForm({...staffForm, role: r})}
                                className={cn(
                                  "p-3 rounded-2xl border transition-all text-center group",
                                  staffForm.role === r ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                                )}
                              >
                                <p className={cn("text-[10px] font-black uppercase", staffForm.role === r ? "text-primary" : "text-muted-foreground group-hover:text-primary")}>{r}</p>
                             </button>
                          ))}
                       </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Full Name</label>
                      <Input 
                        value={staffForm.name} 
                        onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                        placeholder="Johnathan Doe" 
                        className="h-12 rounded-2xl bg-muted border-none" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Email Address</label>
                      <Input 
                        value={staffForm.email} 
                        onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                        placeholder="john@acme.com" 
                        className="h-12 rounded-2xl bg-muted border-none" 
                      />
                   </div>
                </div>

                <div className="mt-10 flex gap-4">
                   <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsAddStaffOpen(false)}>Cancel</Button>
                   <Button className="flex-1 h-12 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20" onClick={handleInviteStaff}>Send Invite</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Edit Staff Modal */}
      <AnimatePresence>
        {isEditStaffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditStaffOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl p-8 font-outfit">
                <div className="flex justify-between items-center mb-6">
                   <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Edit className="h-8 w-8" />
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setIsEditStaffOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
                <h3 className="text-2xl font-black mb-1">Edit Staff Profile</h3>
                <p className="text-muted-foreground text-sm font-medium mb-8">Update credentials or system role for this member.</p>

                <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Role Elevation</label>
                       <div className="grid grid-cols-3 gap-3">
                          {["AGENT", "SUPERVISOR", "ADMIN"].map(r => (
                             <button 
                                key={r} 
                                onClick={() => setStaffForm({...staffForm, role: r})}
                                className={cn(
                                  "p-3 rounded-2xl border transition-all text-center group",
                                  staffForm.role === r ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                                )}
                              >
                                <p className={cn("text-[10px] font-black uppercase", staffForm.role === r ? "text-primary" : "text-muted-foreground group-hover:text-primary")}>{r}</p>
                             </button>
                          ))}
                       </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Display Name</label>
                      <Input 
                        value={staffForm.name} 
                        onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                        className="h-12 rounded-2xl bg-muted border-none" 
                      />
                   </div>
                </div>

                <div className="mt-10 flex gap-4">
                   <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsEditStaffOpen(false)}>Cancel</Button>
                   <Button className="flex-1 h-12 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20" onClick={handleUpdateStaff}>Update Profile</Button>
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
                   <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Target className="h-8 w-8" />
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setIsCreateTeamOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
                <h3 className="text-2xl font-black mb-1">Establish New Team</h3>
                <p className="text-muted-foreground text-sm font-medium mb-8">Define a specialized support group.</p>

                <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Team Name</label>
                       <Input 
                         value={teamForm.name} 
                         onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                         placeholder="e.g. Technical Support" 
                         className="h-12 rounded-2xl bg-muted border-none" 
                       />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Visual Identity (Hex Color)</label>
                      <div className="flex gap-4 items-center">
                        <Input 
                          value={teamForm.color} 
                          onChange={(e) => setTeamForm({...teamForm, color: e.target.value})}
                          className="h-12 rounded-2xl bg-muted border-none flex-1" 
                        />
                        <div className="h-12 w-12 rounded-2xl border border-border shrink-0" style={{ backgroundColor: teamForm.color }} />
                      </div>
                   </div>
                </div>

                <div className="mt-10 flex gap-4">
                   <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsCreateTeamOpen(false)}>Cancel</Button>
                   <Button className="flex-1 h-12 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20" onClick={handleCreateTeam}>Create Team</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Edit Team Modal */}
      <AnimatePresence>
        {isEditTeamOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditTeamOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl p-8 font-outfit">
                <div className="flex justify-between items-center mb-6">
                   <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Settings className="h-8 w-8" />
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setIsEditTeamOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
                <h3 className="text-2xl font-black mb-1">Manage Team Profile</h3>
                <p className="text-muted-foreground text-sm font-medium mb-8">Modify team settings and identity.</p>

                <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Team Name</label>
                       <Input 
                         value={teamForm.name} 
                         onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                         className="h-12 rounded-2xl bg-muted border-none" 
                       />
                   </div>
                   <div className="space-y-4">
                      <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Team Roster</label>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar p-2 bg-muted/20 rounded-2xl border border-border/50">
                         {editingTeam?.members?.map((tm: any) => (
                            <div key={tm.userId} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/30">
                               <span className="text-sm font-bold">{tm.user.name}</span>
                               <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-rose-500 hover:bg-rose-500/10" onClick={async () => {
                                  await teamService.removeMember(editingTeam.id, tm.userId);
                                  toast.success("Member removed");
                                  const updated = await teamService.list().then(res => res.data.find((t: any) => t.id === editingTeam.id));
                                  setEditingTeam(updated);
                                  fetchData();
                               }}>
                                  <Trash2 className="h-3.5 w-3.5" />
                               </Button>
                            </div>
                         ))}
                         {(!editingTeam?.members || editingTeam.members.length === 0) && (
                            <p className="text-[10px] text-center text-muted-foreground py-4 font-bold uppercase italic">No active members in this squad.</p>
                         )}
                      </div>
                      <div className="flex gap-2">
                         <select id="add-member-select" className="flex-1 h-12 rounded-2xl bg-muted px-4 font-bold text-sm outline-none border-none">
                            <option value="">Add member...</option>
                            {staff.filter(s => !editingTeam?.members?.some((tm: any) => tm.userId === s.id)).map(s => (
                               <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                         </select>
                         <Button className="h-12 w-12 rounded-2xl bg-primary text-white" onClick={async () => {
                            const userId = (document.getElementById('add-member-select') as HTMLSelectElement).value;
                            if (!userId) return;
                            await teamService.addMember(editingTeam.id, userId);
                            toast.success("Member added to squad!");
                            const updated = await teamService.list().then(res => res.data.find((t: any) => t.id === editingTeam.id));
                            setEditingTeam(updated);
                            fetchData();
                         }}>
                            <Plus className="h-5 w-5" />
                         </Button>
                      </div>
                   </div>
                </div>

                <div className="mt-10 flex gap-4">
                   <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsEditTeamOpen(false)}>Cancel</Button>
                   <Button className="flex-1 h-12 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20" onClick={handleUpdateTeam}>Apply Changes</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
