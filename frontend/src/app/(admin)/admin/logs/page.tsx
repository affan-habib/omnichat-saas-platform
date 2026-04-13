"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  History, Search, Filter, Loader2, 
  User, Building2, Clock, ShieldCheck,
  RefreshCcw, ArrowRight, Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/api.service";
import { toast } from "sonner";
import { format } from "date-fns";

export default function GlobalAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getLogs();
      setLogs(res.data);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.tenant?.name.toLowerCase().includes(search.toLowerCase()) ||
    log.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-8 font-outfit max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <History className="h-8 w-8 text-rose-600" /> Platform Audit Trail
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Real-time activity log of all critical actions across all tenants
          </p>
        </div>
        <Button onClick={fetchLogs} variant="outline" className="rounded-2xl gap-2 font-bold h-11">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by action, tenant or user..." 
            className="pl-10 h-11 bg-card border-border/50 rounded-2xl" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 rounded-2xl gap-2 font-bold">
          <Filter className="h-4 w-4" /> Filter By Action
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Card className="rounded-3xl border-border/40 shadow-sm hover:border-rose-200/50 transition-all bg-card/60 backdrop-blur-sm group overflow-hidden">
                <div className="h-full w-1.5 bg-rose-500 absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-6">
                  {/* Timestamp */}
                  <div className="flex flex-col min-w-[140px]">
                    <div className="flex items-center gap-1.5 text-rose-600">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Timestamp</span>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground mt-1">
                       {format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}
                    </p>
                  </div>

                  {/* Context: Tenant & User */}
                  <div className="flex flex-col min-w-[200px]">
                    <div className="flex items-center gap-1.5 text-blue-500">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{log.tenant?.name || 'SYSTEM'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground/50" />
                      <p className="text-xs font-bold truncate max-w-[150px]">{log.user?.email || 'Automatic System'}</p>
                    </div>
                  </div>

                  {/* The Action */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-muted text-[10px] font-black uppercase tracking-tighter border-none px-2">
                        {log.resource}
                      </Badge>
                      <span className="text-sm font-black text-foreground">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1">
                      {JSON.stringify(log.details)}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="hidden md:block">
                     <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <ShieldCheck className="h-4 w-4 text-emerald-500" />
                     </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-[3rem] border border-dashed border-border">
              <Info className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-bold text-muted-foreground">No logs found</h3>
              <p className="text-sm text-muted-foreground/60">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Badge({ children, className, variant = "default" }: any) {
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", className)}>
      {children}
    </span>
  );
}
