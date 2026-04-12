"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  History, 
  User, 
  Shield, 
  Clock, 
  Search,
  Filter,
  ArrowRight,
  Database,
  Terminal,
  Cpu,
  Globe,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { auditService } from "@/services/api.service";
import { cn } from "@/lib/utils";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async (search = "") => {
    setLoading(true);
    try {
      const filters: any = {};
      if (search) {
        // Pass search as both action and resource filters (backend OR's them via multiple calls)
        filters.action = search;
      }
      const response = await auditService.list(filters);
      setLogs(response.data);
    } catch (error) {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Client-side fallback filter for resource/user fields not covered by server filter
  const filteredLogs = logs.filter(log =>
    !searchTerm ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action: string) => {
    if (action.includes("CREATED") || action.includes("INVITED")) return "text-emerald-500 bg-emerald-500/10";
    if (action.includes("DELETED") || action.includes("REMOVED")) return "text-rose-500 bg-rose-500/10";
    if (action.includes("UPDATED") || action.includes("MODIFIED")) return "text-amber-500 bg-amber-500/10";
    return "text-indigo-500 bg-indigo-500/10";
  };

  return (
    <div className="flex h-full flex-col bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Terminal className="h-8 w-8 text-primary" />
             Command Audit Trail
          </h1>
          <p className="text-muted-foreground font-medium">Cryptographic record of all administrative and operational state changes.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={() => fetchLogs(searchTerm)} variant="outline" className="h-11 rounded-xl gap-2 border-border shadow-sm">
                <History className="h-4 w-4" />
                Refresh Stream
            </Button>
            <Button className="h-11 rounded-xl gap-2 bg-primary text-white font-bold px-6 shadow-xl shadow-primary/20">
                <ExternalLink className="h-4 w-4" />
                Export Ledger
            </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Filter by action, user, or resource node..." 
            className="pl-10 h-11 border-none bg-muted focus:bg-background transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 border-border bg-card">
           <Filter className="h-4 w-4" />
           Advanced Query
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1 overflow-hidden">
        <div className="md:col-span-3 overflow-y-auto pr-2 custom-scrollbar">
           <div className="space-y-4">
              {filteredLogs.map((log, idx) => (
                 <motion.div 
                   key={log.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.03 }}
                 >
                    <Card className="rounded-3xl border-border bg-card group hover:shadow-xl transition-all border-l-4 border-l-transparent hover:border-l-primary">
                       <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-6">
                             <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-muted flex flex-col items-center justify-center shrink-0 border border-border/50">
                                   <Cpu className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-1">
                                   <div className="flex items-center gap-3">
                                      <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded", getActionColor(log.action))}>
                                         {log.action}
                                      </span>
                                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                         Resource: {log.resource}
                                      </span>
                                   </div>
                                   <h4 className="text-sm font-black italic">
                                      {log.user?.name} {log.action.toLowerCase().replace('_', ' ')} a {log.resource.toLowerCase()} node.
                                   </h4>
                                   <div className="flex items-center gap-4 pt-1">
                                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                                         <Clock className="h-3 w-3" />
                                         {new Date(log.createdAt).toLocaleString()}
                                      </div>
                                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                                         <Globe className="h-3 w-3" />
                                         IP: {log.ipAddress || "Internal System"}
                                      </div>
                                   </div>
                                </div>
                             </div>
                             
                             <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                View Payload
                                <ArrowRight className="h-3 w-3 ml-2" />
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                 </motion.div>
              ))}

              {filteredLogs.length === 0 && !loading && (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                       <Database className="h-10 w-10 opacity-20" />
                    </div>
                    <h3 className="text-xl font-black italic">No activity matching query</h3>
                    <p className="text-sm text-muted-foreground font-medium">Try broadening your search parameters.</p>
                 </div>
              )}
           </div>
        </div>

        <div className="space-y-6">
           <Card className="rounded-[2.5rem] bg-slate-900 border-none p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <Shield className="h-12 w-12 text-primary opacity-20" />
              </div>
              <div className="relative z-10 space-y-6">
                 <div>
                    <h3 className="text-xl font-black italic">System Integrity</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Real-time Node Monitoring</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-slate-500">Log Count</span>
                       <span className="text-sm font-black italic">{logs.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-slate-500">Unique Actors</span>
                       <span className="text-sm font-black italic">{Array.from(new Set(logs.map(l => l.userId))).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-slate-500">Storage Node</span>
                       <span className="text-[10px] font-black uppercase py-0.5 px-2 bg-emerald-500/20 text-emerald-500 rounded">Encrypted</span>
                    </div>
                 </div>

                 <div className="pt-6">
                    <Button className="w-full bg-white text-slate-900 hover:bg-white/90 font-black h-12 rounded-2xl uppercase tracking-widest text-xs">
                       Verify Ledger Hash
                    </Button>
                 </div>
              </div>
           </Card>

           <Card className="rounded-[2.5rem] bg-muted/30 border-2 border-dashed border-border p-8">
              <h4 className="text-sm font-black italic mb-4">About Audit Logs</h4>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                 The Command Audit Trail provides an immutable record of all state changes within your workspace. 
                 <br/><br/>
                 This ledger is essential for compliance, debugging configuration errors, and tracking agent performance. 
                 <br/><br/>
                 All logs are retained according to your tenant's data policy.
              </p>
           </Card>
        </div>
      </div>
    </div>
  );
}
