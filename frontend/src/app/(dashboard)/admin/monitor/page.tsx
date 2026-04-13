"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSocket } from "@/context/socket-context";
import { SOCKET_EVENTS, joinMonitor } from "@/lib/socket-client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminMonitorPage() {
  const { isConnected, socket } = useSocket();
  const [metricsHistory, setMetricsHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);

  useEffect(() => {
    if (isConnected) {
      joinMonitor();
      
      socket?.on(SOCKET_EVENTS.MONITOR_METRICS, (metrics: any) => {
        setCurrentMetrics(metrics);
        setMetricsHistory(prev => {
          const newHistory = [...prev, {
            ...metrics,
            time: new Date(metrics.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          }];
          return newHistory.slice(-20); // Keep last 20 samples
        });
      });

      socket?.on(SOCKET_EVENTS.MONITOR_ALERT, (alert: any) => {
        setAlerts(prev => [alert, ...prev].slice(0, 10));
        toast(alert.message, {
          icon: <AlertTriangle className="text-amber-500" />,
          description: "Capacity threshold exceeded"
        });
      });

      return () => {
        socket?.off(SOCKET_EVENTS.MONITOR_METRICS);
        socket?.off(SOCKET_EVENTS.MONITOR_ALERT);
      };
    }
  }, [isConnected, socket]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="p-8 space-y-8 font-outfit max-w-[1600px] mx-auto min-h-screen bg-transparent relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
             <Zap className="h-4 w-4 fill-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-time Health</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
             Environment Cluster <Badge variant="outline" className="ml-2 border-primary/20 text-primary uppercase text-[10px] px-3">Production</Badge>
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Subscribed to live backend performance metrics and node status.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center gap-3">
              <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
              <span className="text-xs font-bold uppercase tracking-widest">{isConnected ? "Uplink Active" : "Disconnected"}</span>
           </div>
           <Badge className="bg-primary text-white font-black h-10 px-4 rounded-xl shadow-lg shadow-primary/20">
              {isConnected ? "5s Refresh" : "Reconnecting..."}
           </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="rounded-[2.5rem] border-border/50 shadow-sm bg-card/60 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <Cpu className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">CPU Load (1m)</p>
                  <h3 className="text-2xl font-black mt-0.5">{currentMetrics?.cpuLoad.toFixed(2) || "0.00"}</h3>
               </div>
            </CardContent>
         </Card>
         <Card className="rounded-[2.5rem] border-border/50 shadow-sm bg-card/60 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500">
                  <HardDrive className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">RAM Usage</p>
                  <h3 className="text-2xl font-black mt-0.5">{currentMetrics?.memUsage.toFixed(1) || "0.0"}%</h3>
               </div>
            </CardContent>
         </Card>
         <Card className="rounded-[2.5rem] border-border/50 shadow-sm bg-card/60 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Database className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">DB Connectivity</p>
                  <h3 className="text-2xl font-black mt-0.5 flex items-center gap-2">
                     {currentMetrics?.dbStatus || "OFFLINE"}
                     {currentMetrics?.dbStatus === 'HEALTHY' && <CheckCircle2 className="h-4 w-4" />}
                  </h3>
               </div>
            </CardContent>
         </Card>
         <Card className="rounded-[2.5rem] border-border/50 shadow-sm bg-card/60 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
                  <Clock className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Node Uptime</p>
                  <h3 className="text-2xl font-black mt-0.5">{currentMetrics ? formatUptime(currentMetrics.uptime) : "0s"}</h3>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[3rem] border-border/40 shadow-xl bg-card/40 backdrop-blur-xl overflow-hidden">
               <CardHeader className="p-10 pb-0">
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle className="text-2xl font-black tracking-tight">System Resource Load</CardTitle>
                        <CardDescription>Visualizing CPU vs Memory pressure over time</CardDescription>
                     </div>
                     <Activity className="h-6 w-6 text-primary animate-pulse" />
                  </div>
               </CardHeader>
               <CardContent className="p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metricsHistory}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900}}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 900 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cpuLoad" 
                        stroke="#6366f1" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorCpu)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="memUsage" 
                        stroke="#f43f5e" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorMem)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="rounded-[2.5rem] border-border/50 bg-card/60 p-8 space-y-6">
                  <div className="flex items-center gap-3 text-indigo-500">
                     <TrendingUp className="h-5 w-5" />
                     <h4 className="font-black text-lg">Process Heap Health</h4>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <span>Used Heap</span>
                        <span className="text-foreground">{currentMetrics?.heapUsed.toFixed(2) || 0} MB</span>
                     </div>
                     <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentMetrics?.heapUsed / currentMetrics?.heapTotal) * 100}%` }}
                        />
                     </div>
                     <p className="text-[10px] text-muted-foreground font-medium italic">Available Cluster Size: {currentMetrics?.heapTotal.toFixed(0) || 0} MB</p>
                  </div>
               </Card>

               <Card className="rounded-[2.5rem] border-border/50 bg-slate-950 text-white p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldAlert className="h-24 w-24" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400">
                       <CheckCircle2 className="h-5 w-5" />
                       <h4 className="font-black text-lg">Auto-Scaling</h4>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">Auto-scaling engine is currently monitoring load. Threshold for horizontal pod expansion: <span className="text-white font-black">75% CPU load</span>.</p>
                    <div className="flex items-center gap-2">
                       <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[9px] px-2 py-1">BALANCED</Badge>
                       <Badge className="bg-white/5 text-slate-400 border-none font-black text-[9px] px-2 py-1">NODES: 4</Badge>
                    </div>
                  </div>
               </Card>
            </div>
         </div>

         {/* Alerts Sidebar */}
         <div className="space-y-8">
            <Card className="rounded-[3rem] border-border/50 bg-card/60 backdrop-blur-md flex flex-col h-full">
               <CardHeader className="p-8">
                  <div className="flex items-center justify-between">
                     <CardTitle className="font-black text-xl italic underline decoration-primary decoration-4 underline-offset-4">Event Stream</CardTitle>
                     <Badge variant="outline" className="text-[10px] font-black">{alerts.length} Warnings</Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-4 flex-1">
                  <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-hide">
                    {alerts.length === 0 ? (
                      <div className="py-20 text-center space-y-3 opacity-30">
                         <ShieldAlert className="h-10 w-10 mx-auto" />
                         <p className="text-xs font-black uppercase tracking-widest">No anomalies detected</p>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {alerts.map((alert, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1"
                          >
                             <div className="flex items-center gap-2 text-amber-500 uppercase text-[10px] font-black tracking-widest">
                                <AlertTriangle className="h-3 w-3" />
                                Threshold Trigger
                             </div>
                             <p className="text-sm font-bold leading-tight">{alert.message}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none bg-primary text-white p-8">
               <CardTitle className="text-lg font-black mb-2 opacity-90">Capacity Insights</CardTitle>
               <p className="text-sm font-medium opacity-70 leading-relaxed mb-6">Your current node can sustain approximately <span className="opacity-100 font-black">400 additional concurrent users</span> before latency increases.</p>
               <button className="w-full py-3 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/20">
                  Provision New Node
               </button>
            </Card>
         </div>
      </div>

    </div>
  );
}
