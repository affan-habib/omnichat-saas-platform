"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Settings,
  ChevronRight,
  ShieldAlert,
  History,
  Info,
  Users,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const auditLogs = [
  { 
    id: 1, 
    action: "Conversation Transferred", 
    agent: "Agent Smith", 
    details: "Transferred #ORD-1294 to Sarah Miller", 
    time: "2m ago", 
    type: "action",
    severity: "info"
  },
  { 
    id: 2, 
    action: "Security Warning", 
    agent: "System", 
    details: "Multiple failed login attempts detected from IP 192.168.1.1", 
    time: "15m ago", 
    type: "security",
    severity: "high"
  },
  { 
    id: 3, 
    action: "Settings Updated", 
    agent: "Admin John", 
    details: "Changed auto-response business hours", 
    time: "1h ago", 
    type: "settings",
    severity: "medium"
  },
  { 
    id: 4, 
    action: "Channel Connected", 
    agent: "Admin John", 
    details: "Connected new WhatsApp Business account", 
    time: "3h ago", 
    type: "connector",
    severity: "info"
  },
  { 
    id: 5, 
    action: "Message Deleted", 
    agent: "Sarah Miller", 
    details: "Deleted outgoing message in #ORD-8213", 
    time: "5h ago", 
    type: "action",
    severity: "medium"
  },
];

const severityColors = {
  info: "text-blue-500 bg-blue-500/10",
  medium: "text-amber-500 bg-amber-500/10",
  high: "text-red-500 bg-red-500/10",
};

const typeIcons = {
  action: MessageSquare,
  security: ShieldAlert,
  settings: Settings,
  connector: History,
};

export default function AuditLogsPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit & Security Logs</h1>
          <p className="text-muted-foreground mt-1">Global record of all system events and agent actions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-card border-border">
            <Download className="h-4 w-4" />
            Download Log Report
          </Button>
          <Button className="gap-2 shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6">
            <ShieldCheck className="h-4 w-4" />
            Verify Database
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  System Health
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-3 text-emerald-500 font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                  All Systems Operational
               </div>
               <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">Uptime: 99.99% • Latency: 42ms</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
               <CardTitle className="text-base flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  Active Warnings
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-3 text-amber-500 font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  2 Pending Reviews
               </div>
               <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">Latest: IP restriction bypass attempt</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
               <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  Admin Sessions
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-3 text-indigo-500 font-bold">
                  <Users className="h-5 w-5" />
                  3 Active Admins
               </div>
               <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">Concurrent sessions within limits</p>
            </CardContent>
         </Card>
      </div>

      <Card className="border-border shadow-md bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
           <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Filter logs by action, agent or IP..." className="pl-10 h-10 border-border bg-background shadow-sm" />
           </div>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-2 border-border bg-background font-bold">
                 <Filter className="h-4 w-4" />
                 Severity
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2 border-border bg-background font-bold">
                 <Calendar className="h-4 w-4" />
                 Date Range
              </Button>
           </div>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log, i) => {
              const Icon = typeIcons[log.type as keyof typeof typeIcons] || Info;
              const color = severityColors[log.severity as keyof typeof severityColors] || severityColors.info;

              return (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-6 px-6 py-4 hover:bg-muted/50 transition-colors group cursor-pointer"
                >
                  <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                     <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold truncate">{log.action}</span>
                        <div className={cn("px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider", color)}>
                           {log.severity}
                        </div>
                     </div>
                     <p className="text-xs text-muted-foreground font-medium truncate">{log.details}</p>
                  </div>
                  <div className="shrink-0 text-left w-32">
                     <span className="text-xs font-bold block">{log.agent}</span>
                     <span className="text-[10px] text-muted-foreground font-medium">Performed by</span>
                  </div>
                  <div className="shrink-0 flex items-center gap-4 text-right">
                     <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                           <Clock className="h-3 w-3" />
                           {log.time}
                        </span>
                        <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Full Details</span>
                     </div>
                     <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
        <div className="p-4 border-t border-border bg-muted/50 flex items-center justify-center">
           <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest gap-2">
              Load Older Logs
              <History className="h-4 w-4" />
           </Button>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="border-border shadow-md bg-card">
            <CardHeader>
               <CardTitle className="text-lg">Security Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                     <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-red-700 dark:text-red-400">Suspicious Login Pattern</h4>
                     <p className="text-xs text-red-700/70 dark:text-red-400/70 font-medium leading-relaxed mt-1">
                        We detected 15 failed login attempts for user 'admin' from a new location (Kyiv, UA).
                     </p>
                  </div>
               </div>
               <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0">
                     <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Health Check Passed</h4>
                     <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 font-medium leading-relaxed mt-1">
                        Automated vulnerability scan completed with 0 high-risk findings.
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-md bg-indigo-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <ShieldCheck className="h-32 w-32" />
            </div>
            <CardHeader>
               <CardTitle className="text-white">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-bold text-slate-300 uppercase leading-none mb-2">GDPR Readiness</p>
                     <p className="text-2xl font-bold">100%</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-bold text-slate-300 uppercase leading-none mb-2">SOC2 Type II</p>
                     <p className="text-2xl font-bold">Verified</p>
                  </div>
               </div>
               <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Your current logging configuration meets all international standards for session persistence and data auditability.
               </p>
               <Button className="w-full bg-white text-indigo-900 hover:bg-white/90 font-bold h-10 rounded-xl shadow-lg">
                  View Compliance Dashboard
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
