"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  GitMerge, 
  Plus, 
  Trash2, 
  Settings, 
  Zap, 
  Shield, 
  ArrowRight,
  Filter,
  Users,
  MessageCircle,
  X,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { routingService, teamService, workforceService } from "@/services/api.service";

export default function RoutingSettingsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    priority: 0,
    conditions: [{ field: "channel", operator: "eq", value: "WHATSAPP" }],
    action: { assignToTeam: "" }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rulesRes, teamsRes, staffRes] = await Promise.all([
        routingService.list(),
        teamService.list(),
        workforceService.list()
      ]);
      setRules(rulesRes.data);
      setTeams(teamsRes.data);
      setStaff(staffRes.data);
    } catch (error) {
      toast.error("Failed to load routing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRule = async () => {
    if (!formData.name) return toast.error("Rule name is required");
    try {
      await routingService.create(formData);
      toast.success("Routing rule established");
      setIsModalOpen(false);
      setFormData({
        name: "",
        priority: 0,
        conditions: [{ field: "channel", operator: "eq", value: "WHATSAPP" }],
        action: { assignToTeam: "" }
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to create rule");
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Permanently disable and delete this routing logic?")) return;
    try {
      await routingService.remove(id);
      toast.success("Rule deactivated");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete rule");
    }
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { field: "content", operator: "contains", value: "" }]
    });
  };

  const removeCondition = (index: number) => {
    const newConds = [...formData.conditions];
    newConds.splice(index, 1);
    setFormData({ ...formData, conditions: newConds });
  };

  const updateCondition = (index: number, key: string, val: any) => {
    const newConds = [...formData.conditions];
    newConds[index] = { ...newConds[index], [key]: val };
    setFormData({ ...formData, conditions: newConds });
  };

  return (
    <div className="flex flex-col bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 italic">
             <GitMerge className="h-8 w-8 text-primary" />
             Intelligent Routing
          </h1>
          <p className="text-muted-foreground font-medium">Automate conversation assignment based on real-time triggers and metadata.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white font-black h-12 px-6 rounded-2xl uppercase tracking-widest text-xs">
          <Plus className="h-5 w-5" />
          Establish Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {rules.map((rule, idx) => (
            <motion.div 
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
               <Card className="rounded-[2.5rem] border-border shadow-xl bg-card overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="flex flex-col md:flex-row">
                     <div className="flex-1 p-8 space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                              {rule.priority}
                           </div>
                           <h3 className="text-xl font-black italic">{rule.name}</h3>
                           {!rule.isActive && (
                              <span className="text-[10px] font-black uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Inactive</span>
                           )}
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                           {rule.conditions?.map((cond: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 text-[10px] font-black uppercase tracking-tight">
                                 <span className="text-primary">{cond.field}</span>
                                 <span className="text-muted-foreground">{cond.operator}</span>
                                 <span className="text-foreground">"{cond.value}"</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="w-px bg-border/50 my-8 hidden md:block" />

                     <div className="p-8 bg-muted/10 flex flex-col justify-center gap-4">
                        <div className="flex items-center gap-4">
                           <div className="flex flex-col items-center">
                              <div className="h-10 w-10 rounded-2xl bg-background border border-border flex items-center justify-center">
                                 <Zap className="h-5 w-5 text-amber-500" />
                              </div>
                              <div className="h-4 w-0.5 bg-border/50" />
                              <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                 {rule.action.assignToTeam ? <Users className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
                              </div>
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 leading-none tracking-widest">Execute Action</p>
                              <p className="text-sm font-black italic">
                                 {rule.action.assignToTeam 
                                    ? `Assign to Team: ${teams.find(t => t.id === rule.action.assignToTeam)?.name || 'Unknown'}` 
                                    : `Assign to Agent: ${staff.find(s => s.id === rule.action.assignToAgent)?.name || 'Unknown'}`
                                 }
                              </p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <Button onClick={() => toast.info("Rule editing coming soon")} variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase">Refine</Button>
                           <Button onClick={() => handleDeleteRule(rule.id)} variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500/10">Deactivate</Button>
                        </div>
                     </div>
                  </div>
               </Card>
            </motion.div>
         ))}

         {rules.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-[3rem] space-y-4">
               <div className="h-20 w-20 rounded-[2rem] bg-muted/50 flex items-center justify-center text-muted-foreground">
                  <Filter className="h-10 w-10 opacity-20" />
               </div>
               <div className="text-center">
                  <h3 className="text-xl font-black italic">No Active Automation</h3>
                  <p className="text-muted-foreground font-medium text-sm">All incoming conversations will require manual assignment.</p>
               </div>
               <Button onClick={() => setIsModalOpen(true)} variant="outline" className="rounded-xl font-bold uppercase text-[10px] tracking-widest h-10 border-primary/20 text-primary">Establish First Rule</Button>
            </div>
         )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-2xl bg-card border border-border rounded-[3rem] shadow-2xl p-10 font-outfit max-h-[90vh] overflow-y-auto custom-scrollbar">
               <div className="flex justify-between items-center mb-10">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
                     <Zap className="h-10 w-10 shadow-lg" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-12 w-12 rounded-full"><X className="h-6 w-6" /></Button>
               </div>
               
               <h2 className="text-3xl font-black mb-2 italic">Automation Node</h2>
               <p className="text-muted-foreground font-medium mb-8">Define the triggers and outcome for this routing rule.</p>

               <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Logic Label</label>
                        <Input 
                           placeholder="WhatsApp Support Assignment" 
                           className="h-14 rounded-2xl bg-muted border-none font-bold italic" 
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Rank / Priority</label>
                        <Input 
                           type="number"
                           className="h-14 rounded-2xl bg-muted border-none font-black" 
                           value={formData.priority}
                           onChange={e => setFormData({...formData, priority: parseInt(e.target.value)})}
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Triggers (All must match)</label>
                        <Button variant="ghost" size="sm" onClick={addCondition} className="text-[10px] font-black uppercase text-primary hover:bg-primary/5 rounded-lg">Add Input</Button>
                     </div>
                     <div className="space-y-3">
                        {formData.conditions.map((cond, i) => (
                           <div key={i} className="flex gap-2 items-center bg-muted/30 p-2 rounded-2xl border border-border/50">
                              <select 
                                 className="flex-1 bg-muted rounded-xl h-10 px-3 text-xs font-bold outline-none border-none"
                                 value={cond.field}
                                 onChange={e => updateCondition(i, 'field', e.target.value)}
                              >
                                 <option value="channel">Internal Channel</option>
                                 <option value="content">Message Content</option>
                                 <option value="subject">Subject Line</option>
                              </select>
                              <select 
                                 className="w-32 bg-muted rounded-xl h-10 px-3 text-[10px] font-black uppercase outline-none border-none"
                                 value={cond.operator}
                                 onChange={e => updateCondition(i, 'operator', e.target.value)}
                              >
                                 <option value="eq">Equals</option>
                                 <option value="contains">Contains</option>
                                 <option value="ne">Not Equals</option>
                              </select>
                              <Input 
                                 placeholder="Value..." 
                                 className="flex-1 h-10 rounded-xl bg-muted border-none font-bold text-xs"
                                 value={cond.value}
                                 onChange={e => updateCondition(i, 'value', e.target.value)}
                              />
                              <Button variant="ghost" size="icon" onClick={() => removeCondition(i)} className="h-8 w-8 text-rose-500 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Outcome Action</label>
                     <div className="p-6 rounded-[2rem] bg-muted/50 border border-primary/20 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                           <Zap className="h-4 w-4 text-primary opacity-20" />
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none mb-2">Assign Destination</p>
                           <select 
                              className="w-full bg-background rounded-2x border border-border h-12 px-4 text-sm font-bold outline-none"
                              value={formData.action.assignToTeam}
                              onChange={e => setFormData({...formData, action: { assignToTeam: e.target.value }})}
                           >
                              <option value="">Select Target Team...</option>
                              {teams.map(t => (
                                 <option key={t.id} value={t.id}>{t.name} (Team)</option>
                              ))}
                           </select>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 mt-12 pt-8 border-t border-border/50">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => setIsModalOpen(false)}>Discard</Button>
                  <Button onClick={handleCreateRule} className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30">Activate Routing Node</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
