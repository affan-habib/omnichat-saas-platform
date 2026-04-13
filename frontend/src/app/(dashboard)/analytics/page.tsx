"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Search, Filter, MessageSquare, 
  Users, Calendar, ChevronLeft, ChevronRight,
  ArrowUpDown, ExternalLink, Globe, Hash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TabType = "conversations" | "agents" | "messages";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("conversations");
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "conversations", label: "Conversations", icon: MessageSquare },
    { id: "agents", label: "Agent Performance", icon: Users },
    { id: "messages", label: "System Messages", icon: Hash },
  ];

  // ── Dynamic Data & Columns ─────────────────────────────────────
  
  const getTableContent = () => {
    switch (activeTab) {
      case "agents":
        return {
          headers: ["Agent", "Role", "Chats", "Avg. Response", "CSAT", "Status"],
          data: [
            { id: 1, name: "Alice Admin", role: "ADMIN", chats: 142, response: "45s", csat: "4.9/5", status: "Online" },
            { id: 2, name: "Sam Supervisor", role: "SUPERVISOR", chats: 89, response: "1m 12s", csat: "4.7/5", status: "Away" },
            { id: 3, name: "Andy Agent", role: "AGENT", chats: 210, response: "2m 05s", csat: "4.8/5", status: "Online" },
            { id: 4, name: "Annie Agent", role: "AGENT", chats: 156, response: "1m 45s", csat: "4.6/5", status: "Offline" },
          ],
          renderRow: (row: any) => (
            <tr key={row.id} className="hover:bg-muted/10 transition-colors">
              <td className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs text-primary">
                    {row.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">{row.name}</span>
                    <span className="text-[10px] text-muted-foreground">Staff Member</span>
                  </div>
                </div>
              </td>
              <td className="p-6">
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none font-bold text-[10px]">
                  {row.role}
                </Badge>
              </td>
              <td className="p-6 text-sm font-black">{row.chats}</td>
              <td className="p-6 text-sm font-bold text-muted-foreground">{row.response}</td>
              <td className="p-6">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                   ★ {row.csat}
                </div>
              </td>
              <td className="p-6">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", row.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-400')} />
                  <span className="text-xs font-bold">{row.status}</span>
                </div>
              </td>
            </tr>
          )
        };

      case "messages":
        return {
          headers: ["ID", "Direction", "Platform", "Content Preview", "Type", "Timestamp"],
          data: [
            { id: "MSG-8821", dir: "IN", platform: "WhatsApp", msg: "Hi, I have a question about my order...", type: "Text", time: "10:24:15" },
            { id: "MSG-8822", dir: "OUT", platform: "Instagram", msg: "Your order #123 has been shipped!", type: "Image", time: "10:25:02" },
            { id: "MSG-8823", dir: "IN", platform: "Live Chat", msg: "Can I get a refund?", type: "Text", time: "10:28:44" },
            { id: "MSG-8824", dir: "OUT", platform: "WhatsApp", msg: "Sure, let me check that for you.", type: "Text", time: "10:30:12" },
          ],
          renderRow: (row: any) => (
            <tr key={row.id} className="hover:bg-muted/10 transition-colors">
              <td className="p-6 text-xs font-mono font-bold text-rose-600">{row.id}</td>
              <td className="p-6">
                <Badge className={cn("font-black text-[10px] border-none", row.dir === 'IN' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600')}>
                  {row.dir === 'IN' ? 'Incoming' : 'Outgoing'}
                </Badge>
              </td>
              <td className="p-6 text-sm font-bold">{row.platform}</td>
              <td className="p-6 max-w-[200px] truncate text-sm font-medium text-muted-foreground">{row.msg}</td>
              <td className="p-6 text-xs font-bold text-slate-400">{row.type}</td>
              <td className="p-6 text-xs font-mono">{row.time}</td>
            </tr>
          )
        };

      default: // conversations
        return {
          headers: ["Reference", "User / Contact", "Channel", "Status", "Assigned To", "Date"],
          data: [
            { id: "CONV-1029", contact: "John Smith", channel: "WhatsApp", status: "Closed", agent: "Alice Admin", date: "2026-04-12 14:00" },
            { id: "CONV-1030", contact: "Sarah Connor", channel: "Instagram", status: "Active", agent: "Sam Supervisor", date: "2026-04-13 10:20" },
            { id: "CONV-1031", contact: "Bruce Wayne", channel: "Live Chat", status: "Pending", agent: "Andy Agent", date: "2026-04-13 11:45" },
          ],
          renderRow: (row: any) => (
            <tr key={row.id} className="hover:bg-muted/10 transition-colors">
              <td className="p-6 text-sm font-black text-rose-600 font-mono tracking-tighter">{row.id}</td>
              <td className="p-6">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">{row.contact}</span>
                  <span className="text-[10px] text-muted-foreground">Member since 2024</span>
                </div>
              </td>
              <td className="p-6">
                <Badge variant="outline" className="bg-primary/5 text-primary border-none font-bold">
                   <Globe className="w-3 h-3 mr-1" /> {row.channel}
                </Badge>
              </td>
              <td className="p-6">
                 <span className={cn(
                   "text-xs font-black px-2.5 py-1 rounded-full",
                   row.status === "Closed" ? "bg-slate-100 dark:bg-slate-800 text-slate-500" :
                   row.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                 )}>
                   {row.status}
                 </span>
              </td>
              <td className="p-6 text-sm font-bold text-foreground">{row.agent}</td>
              <td className="p-6 text-sm font-medium text-muted-foreground">{row.date}</td>
            </tr>
          )
        };
    }
  };

  const { headers, data: filteredData, renderRow } = getTableContent();

  return (
    <div className="p-8 space-y-8 font-outfit max-w-[1600px] mx-auto">
      {/* Header & Main Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Reporting Engine</h1>
          <p className="text-muted-foreground font-medium mt-1">Deep dive into your workspace data and exports</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold shadow-sm bg-card">
             <Calendar className="h-4 w-4 mr-2" />
             Apr 1, 2026 - Apr 30, 2026
           </Button>
           <Button onClick={handleExport} className="rounded-2xl h-12 px-6 gap-2 font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20">
            <Download className="h-4 w-4" />
            Export CSV
           </Button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-3xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-[1.25rem] text-sm font-black transition-all",
              activeTab === tab.id 
                ? "bg-card shadow-lg text-primary scale-105" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
        <CardHeader className="p-8 pb-4">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={`Search ${activeTab}...`} 
                  className="pl-10 h-11 bg-muted/30 border-transparent rounded-2xl focus:bg-card transition-all font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-2xl h-11 gap-2 font-bold px-5 bg-card">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {headers.map((h) => (
                    <th key={h} className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="flex items-center gap-1">{h} <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                  ))}
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <AnimatePresence mode="popLayout">
                  {filteredData.map(renderRow)}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-6 border-t border-border/50 flex items-center justify-between bg-muted/5">
            <p className="text-xs font-bold text-muted-foreground">Showing 1 to {filteredData.length} of 842 entries</p>
            <div className="flex items-center gap-1">
              <Button disabled variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-card">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-10 w-10 rounded-xl bg-card shadow-sm font-bold text-xs border-primary/20 text-primary">1</Button>
              <Button variant="ghost" className="h-10 w-10 rounded-xl font-bold text-xs text-muted-foreground">2</Button>
              <Button variant="ghost" className="h-10 w-10 rounded-xl font-bold text-xs text-muted-foreground">3</Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-card shadow-sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
