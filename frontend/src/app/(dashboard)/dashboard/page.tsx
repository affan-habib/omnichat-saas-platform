"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Users, MessageSquare, Clock, 
  ArrowUpRight, ArrowDownRight, Activity, 
  Zap, Calendar, MoreHorizontal, MousePointerClick 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const stats = [
    { label: "Active Conversations", value: "842", change: "+12.5%", trending: "up", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Contacts", value: "14,291", change: "+4.3%", trending: "up", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg. Response Time", value: "1m 42s", change: "-18%", trending: "up", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Customer Satisfaction", value: "98.2%", change: "+0.4%", trending: "up", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="p-8 space-y-8 font-outfit max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Workspace Dashboard</h1>
          <p className="text-muted-foreground font-medium mt-1">Real-time performance metrics for your company</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 gap-2 font-bold shadow-sm bg-card">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="rounded-2xl h-12 px-6 gap-2 font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20">
            <TrendingUp className="h-4 w-4" />
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="rounded-[2.5rem] border-border/40 shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-card/60 backdrop-blur-md">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className={`font-black border-none text-[10px] uppercase leading-none px-2.5 py-1 ${
                      stat.trending === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    <h3 className="text-3xl font-black tracking-tighter text-foreground">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <Card className="lg:col-span-2 rounded-[3.5rem] border-border/40 shadow-sm overflow-hidden bg-card/50 backdrop-blur-md">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-foreground">Conversations Volume</CardTitle>
            <CardDescription className="text-sm font-medium">Daily traffic patterns across all integrated channels</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 h-[400px] relative">
            {/* Visual Mock of a Chart */}
            <div className="absolute inset-x-8 bottom-8 top-12 flex items-end justify-between gap-4">
              {[40, 60, 45, 90, 65, 80, 55, 70, 85, 100, 75, 50, 65, 95].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + (i * 0.05) }}
                  className="flex-1 bg-gradient-to-t from-primary/80 to-primary rounded-t-xl group relative"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h * 10}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="h-px w-full bg-border absolute bottom-8 left-0" />
          </CardContent>
        </Card>

        {/* Channel Health */}
        <Card className="rounded-[3.5rem] border-border/40 shadow-sm overflow-hidden bg-slate-900 dark:bg-slate-950 text-white border-none shadow-2xl">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black">Connector Health</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time status</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
             {[
               { name: "WhatsApp Business", status: "Connected", health: 100, color: "bg-emerald-500" },
               { name: "Instagram Direct", status: "Limited", health: 65, color: "bg-amber-500" },
               { name: "Live Chat Widget", status: "Connected", health: 98, color: "bg-emerald-500" },
               { name: "Email Relay", status: "Error", health: 12, color: "bg-rose-500" },
             ].map((channel, i) => (
               <div key={channel.name} className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-200">{channel.name}</span>
                    <span className={channel.health < 50 ? 'text-rose-400' : 'text-emerald-400'}>{channel.status}</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className={`h-full ${channel.color}`} style={{ width: `${channel.health}%` }} />
                 </div>
               </div>
             ))}
             <Button variant="outline" className="w-full mt-4 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-black text-xs gap-2">
               Repair All Connections
               <Activity className="h-3 w-3" />
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
