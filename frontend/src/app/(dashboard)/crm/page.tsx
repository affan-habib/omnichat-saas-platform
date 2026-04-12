"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Tags, 
  ExternalLink,
  ChevronRight,
  Download,
  Plus,
  MessageCircle,
  Clock,
  UserCheck,
  Star,
  X,
  Shield,
  CreditCard,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { contactService } from "@/services/api.service";

export default function CRMPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const fetchContacts = async (query = "") => {
    setLoading(true);
    try {
      const response = await contactService.list(query);
      setContacts(response.data);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="flex min-h-full flex-col bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Directory</h1>
          <p className="text-muted-foreground mt-1">Unified view of all your customers across every channel</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => toast.info("Preparing CSV download")} variant="outline" className="gap-2 bg-card border-border">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => toast.info("Opening add customer form")} className="gap-2 shadow-lg shadow-primary/20 bg-primary font-bold h-11 px-6">
            <Plus className="h-5 w-5" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search by name, email, or tag..." 
            className="pl-10 h-11 border-none bg-muted focus:bg-background transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => toast.info("Opening advanced filters")} variant="outline" className="h-11 gap-2 border-border bg-card">
           <Filter className="h-4 w-4" />
           Advanced Filters
        </Button>
      </div>

      <Card className="border-border shadow-md bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Activity</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Orders</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tags</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contacts.map((contact, i) => (
                  <motion.tr 
                    key={contact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedCustomer(contact)}
                    className="hover:bg-muted/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-xl border-2 border-background shadow-sm bg-muted flex items-center justify-center overflow-hidden">
                             {contact.avatarUrl ? (
                               <img src={contact.avatarUrl} alt="" />
                             ) : (
                               <span className="text-xs font-bold">{contact.name[0]}</span>
                             )}
                          </div>
                          <div className={cn(
                            "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
                            contact.conversations?.length > 0 ? 'bg-green-500' : 'bg-muted-foreground'
                          )} />
                        </div>
                        <div>
                          <p className="text-sm font-bold group-hover:text-primary transition-colors">{contact.name}</p>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                             <MapPin className="h-2.5 w-2.5" />
                             {contact.location || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                           <Mail className="h-3 w-3 text-muted-foreground" />
                           {contact.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                           <Phone className="h-3 w-3 text-muted-foreground" />
                           {contact.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                           <span className="text-xs font-bold">{contact.updatedAt ? new Date(contact.updatedAt).toLocaleDateString() : 'Never'}</span>
                          <span className="text-[10px] font-medium text-muted-foreground">Last updated</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold text-xs">
                             {contact._count?.conversations || 0}
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Convs</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-wrap gap-1">
                           {(contact.tags || []).map((tag: any) => (
                            <span key={tag.id} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-tighter">
                               {tag.name}
                            </span>
                          ))}
                          {(!contact.tags || contact.tags.length === 0) && <span className="text-[9px] text-muted-foreground underline">No tags</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button onClick={(e) => { e.stopPropagation(); toast.info("Customer actions menu"); }} variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                       </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="border-border shadow-md bg-card border-l-4 border-l-primary">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  Top Segments
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {[
                 { label: "VIP (spending > $1k)", count: 124, color: "bg-primary" },
                 { label: "New Customers", count: 85, color: "bg-emerald-500" },
                 { label: "Inactive (> 30 days)", count: 210, color: "bg-amber-500" },
               ].map((seg, i) => (
                 <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                       <span>{seg.label}</span>
                       <span>{seg.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${(seg.count/419)*100}%` }} className={cn("h-full rounded-full", seg.color)} />
                    </div>
                 </div>
               ))}
            </CardContent>
         </Card>

         <Card className="border-border shadow-md bg-card border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-500" />
                  Acquisition
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center p-4">
                  <div className="relative h-24 w-24">
                     <svg className="h-full w-full rotate-[-90deg]">
                        <circle cx="50%" cy="50%" r="40%" className="fill-none stroke-slate-100 dark:stroke-slate-800 stroke-[10]" />
                        <circle cx="50%" cy="50%" r="40%" className="fill-none stroke-emerald-500 stroke-[10]" strokeDasharray="180 251" strokeDashoffset="0" strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">72%</span>
                        <span className="text-[8px] font-bold text-slate-400">Growth</span>
                     </div>
                  </div>
               </div>
               <p className="text-xs text-center text-muted-foreground font-medium px-4">You acquired <span className="text-emerald-500 font-bold">24 new customers</span> this week across all channels.</p>
            </CardContent>
         </Card>

         <Card className="border-none shadow-md bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
            <CardHeader>
               <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Reach Out
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  You have <span className="text-white font-bold text-sm">48 customers</span> waiting for a follow-up. Using automated triggers could increase retention by 15%.
               </p>
               <Button onClick={() => toast.info("Opening campaign editor")} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 rounded-xl shadow-lg shadow-primary/20">
                  Launch Campaign
                  <ChevronRight className="h-4 w-4 ml-1" />
               </Button>
            </CardContent>
         </Card>
      </div>

      {/* Customer Detail Preview Modal */}
      <AnimatePresence>
        {selectedCustomer && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCustomer(null)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-lg bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden font-outfit"
              >
                 <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="h-16 w-16 rounded-2xl shadow-lg border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                          {selectedCustomer.avatarUrl ? (
                            <img src={selectedCustomer.avatarUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xl font-bold">{selectedCustomer.name[0]}</span>
                          )}
                       </div>
                       <div>
                          <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                          <div className="flex gap-1 mt-1">
                             {(selectedCustomer.tags || []).map((t: any) => (
                               <span key={t.id} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">{t.name}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setSelectedCustomer(null)}>
                       <X className="h-5 w-5" />
                    </Button>
                 </div>

                 <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                          <p className="text-xs font-bold truncate">{selectedCustomer.email || 'N/A'}</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                          <p className="text-xs font-bold">{selectedCustomer.phone || 'N/A'}</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center justify-between px-1">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Activity</h4>
                          <span className="text-[8px] font-bold text-primary flex items-center gap-1 cursor-pointer">
                             View Full History
                             <ChevronRight className="h-3 w-3" />
                          </span>
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50">
                             <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-primary">
                                <MessageCircle className="h-4 w-4" />
                             </div>
                             <div className="flex-1">
                                <p className="text-xs font-bold">Omnichannel Support Chat</p>
                                <p className="text-[10px] text-muted-foreground font-medium">Topic: Order Tracking • {selectedCustomer.lastActive}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50">
                             <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-indigo-500">
                                <CreditCard className="h-4 w-4" />
                             </div>
                             <div className="flex-1">
                                <p className="text-xs font-bold">Transaction #49203</p>
                                <p className="text-[10px] text-muted-foreground font-medium">Status: Completed • 4 days ago</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-muted/30 border-t border-border flex gap-3">
                    <Button onClick={() => toast.success("Launching conversation")} className="flex-1 bg-primary text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20">
                       Chat Now
                    </Button>
                    <Button variant="outline" onClick={() => toast.info("Opening CRM profile")} className="flex-1 font-bold h-12 rounded-2xl">
                       View CRM Profile
                    </Button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
