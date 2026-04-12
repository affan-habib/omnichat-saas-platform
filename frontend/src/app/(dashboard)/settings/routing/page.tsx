"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  Zap, 
  ArrowRight, 
  Split, 
  Clock, 
  Users, 
  Settings2, 
  Plus, 
  CheckCircle2,
  AlertCircle,
  Hash,
  MessageSquare,
  Globe,
  Bot,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { routingService, teamService } from "@/services/api.service";

export default function RoutingPage() {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wfRes, teamsRes] = await Promise.all([
          routingService.list(),
          teamService.list()
        ]);
        setWorkflows(wfRes.data);
        setTeams(teamsRes.data);
        if (wfRes.data.length > 0) setActiveWorkflow(wfRes.data[0].id);
      } catch (error) {
        toast.error("Failed to load routing rules");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await routingService.toggle(id, !current);
      setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, isActive: !current } : wf));
      toast.success(`Workflow ${!current ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error("Failed to update workflow status");
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Zap className="h-8 w-8 text-primary" />
             Automation & Routing
          </h1>
          <p className="text-muted-foreground font-medium">Configure how task distribution and automatic triggers work across your enterprise.</p>
        </div>
        <Button onClick={() => toast.info("Launching workflow builder")} className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-primary/20">
          <Plus className="h-5 w-5" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Workflow List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Active Workflows</h3>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">{workflows.length} Total</span>
          </div>

          <div className="space-y-4">
            {workflows.map((wf) => (
              <motion.div 
                key={wf.id}
                whileHover={{ y: -2 }}
                className={cn(
                  "p-6 rounded-3xl border-2 transition-all cursor-pointer bg-card group",
                  activeWorkflow === wf.id ? "border-primary shadow-lg" : "border-border/50 hover:border-primary/30"
                )}
                onClick={() => setActiveWorkflow(wf.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      wf.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <Split className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{wf.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium line-clamp-1">Created on {new Date(wf.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Switch checked={wf.isActive} onCheckedChange={() => handleToggle(wf.id, wf.isActive)} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Conditions</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-bold truncate">
                        {JSON.stringify(wf.conditions)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Target</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="text-xs font-bold truncate">
                        {teams.find(t => t.id === wf.action?.assignToTeam)?.name || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/50 hidden md:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Priority Score</p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        wf.priority > 50 ? 'bg-red-500' : wf.priority > 0 ? 'bg-amber-500' : 'bg-slate-400'
                      )} />
                      <span className="text-xs font-bold">{wf.priority}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {workflows.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-border rounded-3xl text-muted-foreground">
                No automation workflows defined.
              </div>
            )}
          </div>
        </div>

        {/* Global Routing Settings */}
        <div className="space-y-6">
           <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2 text-center lg:text-left">Global Strategy</h3>
           
           <Card className="rounded-3xl border-border/50 shadow-md bg-card overflow-hidden">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold">Round Robin</p>
                       <p className="text-[10px] text-muted-foreground font-medium">Distribute evenly across available agents</p>
                    </div>
                    <Switch checked={true} />
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold">Sticky Sessions</p>
                       <p className="text-[10px] text-muted-foreground font-medium">Reconnect customers to previous agent</p>
                    </div>
                    <Switch checked={true} />
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold">Capacity Based</p>
                       <p className="text-[10px] text-muted-foreground font-medium">Consider agent concurrent chat load</p>
                    </div>
                    <Switch checked={true} />
                 </div>

                 <div className="pt-6 border-t border-border space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Capacity Cap</p>
                       <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
                       <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                          <MessageSquare className="h-5 w-5 text-primary" />
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-bold">Max Concurrent Chats</p>
                          <p className="text-[10px] text-muted-foreground font-medium">Global limit per agent session</p>
                       </div>
                       <input type="number" defaultValue={5} className="w-12 h-8 rounded-lg bg-background text-center font-bold text-xs border border-border focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                       * When an agent reaches this limit, they will be automatically removed from the active routing pool until a conversation is resolved.
                    </p>
                 </div>

                 <Button onClick={() => toast.info("Opening routing configuration")} variant="outline" className="w-full h-12 rounded-2xl font-bold border-border hover:bg-muted mt-2">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Advanced Config
                 </Button>
              </CardContent>
           </Card>

           <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                 <Bot className="h-20 w-20" />
              </div>
              <h4 className="font-bold text-lg mb-2">AI Routing Beta</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                 Enable intent-based routing to automatically categorize chats and send them to the most skilled agent.
              </p>
              <Button onClick={() => toast.success("Added to AI Routing waitlist!")} className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs">
                 Join Waitlist
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
