"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Search, Filter, MessageSquare, 
  Users, Calendar, ChevronLeft, ChevronRight,
  ArrowUpDown, ExternalLink, Globe, Hash, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { analyticsService } from "@/services/api.service";
import { toast } from "sonner";
import { format } from "date-fns";

type TabType = "conversations" | "agents" | "messages";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("conversations");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getReports({
        type: activeTab,
        page,
        search,
        limit: 10
      });
      setData(res.data.data);
      setTotal(res.data.total);
      setLastPage(res.data.lastPage);
    } catch (err) {
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReport();
    }, search ? 500 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [activeTab, page, search]);

  const handleExport = () => {
    toast.info("Generating CSV for " + activeTab + "...");
  };

  const tabs = [
    { id: "conversations", label: "Conversations", icon: MessageSquare },
    { id: "agents", label: "Agent Performance", icon: Users },
    { id: "messages", label: "System Messages", icon: Hash },
  ];

  const getTableConfig = () => {
    switch (activeTab) {
      case "agents":
        return {
          headers: ["Agent", "Email", "Total Chats", "Role", "Joined"],
          renderRow: (row: any) => (
            <tr key={row.id} className="hover:bg-muted/10 transition-colors">
              <td className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs text-primary capitalize">
                    {row.name?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-bold text-foreground">{row.name}</span>
                </div>
              </td>
              <td className="p-6 text-sm font-medium text-muted-foreground">{row.email}</td>
              <td className="p-6 text-sm font-black">{row._count?.assignedConversations || 0}</td>
              <td className="p-6">
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none font-bold text-[10px]">
                  {row.role}
                </Badge>
              </td>
              <td className="p-6 text-xs text-muted-foreground">{row.createdAt ? format(new Date(row.createdAt), 'MMM d, yyyy') : 'N/A'}</td>
            </tr>
          )
        };

      case "messages":
        return {
          headers: ["ID", "Direction", "Sender", "Platform", "Preview", "Time"],
          renderRow: (row: any) => (
            <tr key={row.id} className="hover:bg-muted/10 transition-colors">
              <td className="p-6 text-[10px] font-mono font-bold text-rose-600 truncate max-w-[80px]">{row.id}</td>
              <td className="p-6">
                 <Badge className={cn("font-black text-[10px] border-none", row.senderId ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600')}>
                   {row.senderId ? "Outgoing" : "Incoming"}
                 </Badge>
              </td>
              <td className="p-6 text-sm font-bold">{row.sender?.name || "Customer"}</td>
              <td className="p-6">
                <Badge variant="outline" className="border-none bg-muted font-bold text-[10px]">{row.platform || 'System'}</Badge>
              </td>
              <td className="p-6 max-w-[200px] truncate text-sm text-muted-foreground">{row.content}</td>
              <td className="p-6 text-xs font-mono">{row.createdAt ? format(new Date(row.createdAt), 'HH:mm:ss') : 'N/A'}</td>
            </tr>
          )
        };

      default:
        return {
          headers: ["Ref", "Customer", "Channel", "Status", "Assignee", "Date"],
          renderRow: (row: any) => (
            <tr key={row.id} className="hover:bg-muted/10 transition-colors">
              <td className="p-6 text-xs font-black text-rose-600 font-mono italic">{row.id.slice(-8)}</td>
              <td className="p-6 text-sm font-bold">{row.customerId || "Unknown"}</td>
              <td className="p-6">
                <Badge variant="outline" className="bg-primary/5 text-primary border-none font-bold">
                   <Globe className="w-3 h-3 mr-1" /> {row.channel}
                </Badge>
              </td>
              <td className="p-6">
                 <span className={cn(
                   "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                   row.status === "RESOLVED" ? "bg-slate-100 dark:bg-slate-800 text-slate-500" :
                   row.status === "OPEN" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                 )}>
                   {row.status}
                 </span>
              </td>
              <td className="p-6 text-sm font-bold">{row.assignee?.name || "Unassigned"}</td>
              <td className="p-6 text-xs text-muted-foreground">{row.updatedAt ? format(new Date(row.updatedAt), 'MMM d, HH:mm') : 'N/A'}</td>
            </tr>
          )
        };
    }
  };

  const { headers, renderRow } = getTableConfig();

  return (
    <div className="p-8 space-y-8 font-outfit max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Reporting Engine</h1>
          <p className="text-muted-foreground font-medium mt-1">Direct access to real-time communication logs</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold shadow-sm bg-card">
             <Calendar className="h-4 w-4 mr-2" />
             Past 24 Hours
           </Button>
           <Button onClick={handleExport} className="rounded-2xl h-12 px-6 gap-2 font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20">
            <Download className="h-4 w-4" />
            Export CSV
           </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-3xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setPage(1);
            }}
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
                  placeholder={`Filter ${activeTab}...`} 
                  className="pl-10 h-11 bg-muted/30 border-transparent rounded-2xl focus:bg-card transition-all font-medium"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {loading ? (
                  <tr>
                    <td colSpan={headers.length} className="p-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary opacity-50" />
                      <p className="text-xs font-black mt-4 text-muted-foreground uppercase tracking-widest">Fetching live data...</p>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length} className="p-20 text-center">
                      <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-black">No records found</p>
                      <p className="text-xs text-muted-foreground">Try adjusting your filters or search terms</p>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {data.map(renderRow)}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-border/50 flex items-center justify-between bg-muted/5">
            <p className="text-xs font-bold text-muted-foreground">
              Total Records: <span className="text-foreground font-black">{total}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button 
                disabled={page <= 1 || loading} 
                onClick={() => setPage(page - 1)}
                variant="outline" className="h-10 px-4 rounded-xl bg-card border-none shadow-sm gap-2 font-bold"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center justify-center h-10 px-4 rounded-xl bg-primary/10 text-primary font-black text-xs">
                Page {page} of {lastPage}
              </div>
              <Button 
                disabled={page >= lastPage || loading} 
                onClick={() => setPage(page + 1)}
                variant="outline" className="h-10 px-4 rounded-xl bg-card border-none shadow-sm gap-2 font-bold"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
