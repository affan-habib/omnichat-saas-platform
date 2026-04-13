"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Users, MessageSquare, Zap, 
  TrendingUp, Activity, ShieldCheck, ArrowUpRight,
  Loader2, BarChart3, Globe, Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/api.service";
import { toast } from "sonner";

export default function SuperadminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getOverview();
        setData(res.data);
      } catch {
        toast.error("Failed to load platform stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  const stats = [
    { label: "Total Tenants", value: data?.totals?.tenants, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Users", value: data?.totals?.users, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Messages Processed", value: data?.totals?.messages, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Active Connectors", value: data?.totals?.activeConnectors, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="p-8 space-y-8 font-outfit">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Global performance and health metrics across all tenants
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="rounded-[2rem] border-border/40 shadow-sm hover:shadow-lg transition-all overflow-hidden bg-card/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Active</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel Distribution */}
        <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-black">Channel Distribution</CardTitle>
            <CardDescription className="text-xs font-medium">Message volume across different platforms</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="space-y-6 py-4">
              {data?.channelStats.map((cs: any) => (
                <div key={cs.channel} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{cs.channel}</span>
                    </div>
                    <span>{cs._count} msgs</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(cs._count / data.totals.messages) * 100}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Activity */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-rose-600 text-white shadow-xl shadow-rose-600/20 border-none">
            <CardHeader>
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Guard Status
              </CardTitle>
              <CardDescription className="text-xs font-bold text-rose-100/70">
                Platform-wide security systems active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-2xl bg-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">New Registrations</span>
                  <Badge className="bg-white text-rose-600 border-none font-black">3 Waiting</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Failed Webhooks</span>
                  <span className="text-sm font-black">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-slate-900 text-white border-none">
            <CardHeader>
              <CardTitle className="text-lg font-black">Audit Shortcut</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400">Jump to global activity logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold group">
                   <div className="flex items-center gap-3">
                     <div className="bg-slate-700 p-2 rounded-xl group-hover:bg-slate-600 transition-colors">
                       <BarChart3 className="h-4 w-4" />
                     </div>
                     <span className="text-sm">View Full Audit Trail</span>
                   </div>
                   <ArrowUpRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
