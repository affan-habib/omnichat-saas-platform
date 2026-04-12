"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  Zap,
  ChevronDown,
  Camera,
  MessageSquare,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { analyticsService } from "@/services/api.service";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [agentStats, setAgentStats] = useState<any[]>([]);
  const [channelStats, setChannelStats] = useState<any[]>([]);
  const [dispositionStats, setDispositionStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovRes, agRes, chRes, diRes] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getAgents(),
          analyticsService.getChannels(),
          analyticsService.getDispositions()
        ]);
        setOverview(ovRes.data);
        setAgentStats(agRes.data);
        setChannelStats(chRes.data);
        setDispositionStats(diRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { 
      name: "Total Conversations", 
      value: overview?.totalConversations || "0", 
      change: "+0%", 
      trend: "up", 
      icon: MessageCircle,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      name: "Open Conversations", 
      value: overview?.openConversations || "0", 
      change: "Active", 
      trend: "up",
      icon: Clock,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      name: "Resolution Rate", 
      value: overview?.resolutionRate ? `${overview.resolutionRate}%` : "0%", 
      change: "+0%", 
      trend: "up", 
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      name: "Total Customers", 
      value: overview?.totalContacts || "0", 
      change: "Total", 
      trend: "neutral", 
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
  ];
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time insights across all communication channels</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-card border-border">
            <Calendar className="h-4 w-4" />
            Last 30 Days
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2 bg-card border-border">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border shadow-md bg-card overflow-hidden relative group">
              <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30", stat.bg)} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                    stat.trend === 'up' ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground bg-muted"
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.name}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart Card (Simplified representation) */}
        <Card className="lg:col-span-2 border-border shadow-md bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Conversation Volume</CardTitle>
                <CardDescription>Daily volume trends across all channels</CardDescription>
              </div>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted">
                   <div className="h-2 w-2 rounded-full bg-primary" />
                   <span className="text-[10px] font-bold">This Period</span>
                 </div>
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted">
                   <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                   <span className="text-[10px] font-bold">Previous Period</span>
                 </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end gap-2 px-2 pb-6">
              {[65, 45, 75, 55, 85, 95, 70, 60, 80, 50, 65, 75].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-sm transition-colors" 
                    />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val * 0.7}%` }}
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="absolute bottom-0 w-full bg-primary group-hover:bg-primary rounded-t-sm shadow-lg shadow-primary/20 transition-colors" 
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md bg-card">
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>Breakdown by communication platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center py-6">
               <div className="relative h-48 w-48 flex items-center justify-center">
                  <svg className="h-full w-full rotate-[-90deg]">
                    <circle cx="50%" cy="50%" r="40%" className="fill-none stroke-muted stroke-[15]" />
                    <circle cx="50%" cy="50%" r="40%" className="fill-none stroke-brand-whatsapp stroke-[15]" strokeDasharray="251 251" strokeDashoffset="0" strokeLinecap="round" />
                    <circle cx="50%" cy="50%" r="38%" className="fill-none stroke-brand-messenger stroke-[15]" strokeDasharray="180 251" strokeDashoffset="0" strokeLinecap="round" />
                    <circle cx="50%" cy="50%" r="36%" className="fill-none stroke-brand-instagram stroke-[15]" strokeDasharray="120 251" strokeDashoffset="0" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">12k</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Total</span>
                  </div>
               </div>
            </div>
            <div className="space-y-3">
              {channelStats.map((channel) => (
                <div key={channel.channel} className="flex items-center justify-between group cursor-pointer hover:bg-muted p-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg text-white shadow-sm",
                      channel.channel === 'WHATSAPP' ? 'bg-brand-whatsapp' : 
                      channel.channel === 'MESSENGER' ? 'bg-brand-messenger' : 'bg-brand-instagram'
                    )}>
                      {channel.channel === 'WHATSAPP' && <MessageCircle className="h-4 w-4" />}
                      {channel.channel === 'MESSENGER' && <MessageSquare className="h-4 w-4" />}
                      {channel.channel === 'INSTAGRAM' && <Camera className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-bold capitalize">{channel.channel.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{channel._count.id}</span>
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                       <div className={cn(
                         "h-full rounded-full transition-all group-hover:scale-x-110",
                         channel.channel === 'WHATSAPP' ? 'bg-brand-whatsapp' : 
                         channel.channel === 'MESSENGER' ? 'bg-brand-messenger' : 'bg-brand-instagram'
                       )} style={{ width: `${(channel._count.id / (overview?.totalConversations || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disposition Breakdown Card */}
        <Card className="lg:col-span-3 border-border shadow-md bg-card">
           <CardHeader>
              <CardTitle>Disposition Distribution</CardTitle>
              <CardDescription>Workload categorized by conversation outcome</CardDescription>
           </CardHeader>
           <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {[
                   { label: "General Inquiry", value: "35%", color: "bg-blue-500" },
                   { label: "Technical Support", value: "28%", color: "bg-amber-500" },
                   { label: "Billing/Refund", value: "15%", color: "bg-emerald-500" },
                   { label: "Sales Lead", value: "12%", color: "bg-indigo-500" },
                   { label: "Other", value: "10%", color: "bg-slate-400" },
                 ].map((d, i) => (
                   <div key={i} className="space-y-3 p-4 rounded-3xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between">
                         <div className={cn("h-2 w-2 rounded-full", d.color)} />
                         <span className="text-[10px] font-black uppercase text-muted-foreground">Volume</span>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground truncate">{d.label}</p>
                      <p className="text-2xl font-black">{d.value}</p>
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: d.value }} className={cn("h-full rounded-full", d.color)} />
                      </div>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Performance Log */}
        <Card className="border-border shadow-md bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Agent Performance</CardTitle>
              <CardDescription>Individual metrics for last 24h</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">View Full Table</Button>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-muted">
                     <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Agent</th>
                     <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resolved</th>
                     <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating</th>
                     <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Activity</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                   {[
                     { name: "Agent Smith", resolved: 42, rating: 4.8, status: "Active" },
                     { name: "Sarah Miller", resolved: 38, rating: 4.9, status: "Active" },
                     { name: "Michael Chen", resolved: 25, rating: 4.5, status: "Away" },
                     { name: "Alex Johnson", resolved: 31, rating: 4.7, status: "Active" },
                   ].map((agent, i) => (
                    <tr key={i} className="hover:bg-muted transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${agent.name}&background=random`} className="h-8 w-8 rounded-full border border-border" alt="" />
                          <span className="text-xs font-bold group-hover:text-primary transition-colors">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold">{agent.resolved} chats</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold">{agent.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          "inline-flex h-1.5 w-1.5 rounded-full mr-2",
                          agent.status === "Active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-amber-500"
                        )} />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">{agent.status}</span>
                      </td>
                    </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>

        {/* Actionable Insights */}
        <div className="space-y-6">
           <Card className="border-border shadow-md bg-primary text-primary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BarChart3 className="h-32 w-32 rotate-12" />
              </div>
              <CardHeader>
                <CardTitle className="text-white">Smart Insights</CardTitle>
                <CardDescription className="text-primary-foreground/70 font-medium">AI-powered recommendations based on your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/15 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                       <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
                       <span className="text-xs font-bold">Optimization Alert</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      WhatsApp volume is 25% higher during 7PM-9PM. Consider increasing agent availability during this slot.
                    </p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/15 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                       <TrendingUp className="h-4 w-4 text-emerald-300" />
                       <span className="text-xs font-bold">Performance Boost</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      Using canned responses for "Shipping Status" queries could reduce resolution time by another 12s.
                    </p>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-border shadow-md bg-card">
              <CardHeader>
                <CardTitle>Customer Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center gap-2">
                       <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                         <span className="text-xl">😊</span>
                       </div>
                       <span className="text-[10px] font-bold uppercase text-muted-foreground">Positive</span>
                       <span className="text-lg font-bold">78%</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                          <div className="h-full bg-emerald-500" style={{ width: '78%' }} />
                          <div className="h-full bg-amber-500" style={{ width: '15%' }} />
                          <div className="h-full bg-red-500" style={{ width: '7%' }} />
                       </div>
                       <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                          <span>Happy</span>
                          <span>Neutral</span>
                          <span>Upset</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
