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
  Edit2,
  Trash2,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", phone: "", location: "" });

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

  const handleCreate = async () => {
    if (!customerForm.name) return toast.error("Name is required");
    try {
       await contactService.create(customerForm);
       toast.success("Customer profile created");
       setIsModalOpen(false);
       setCustomerForm({ name: "", email: "", phone: "", location: "" });
       fetchContacts();
    } catch (error) {
       toast.error("Failed to create customer");
    }
  };

  const handleUpdate = async () => {
    try {
       await contactService.update(selectedCustomer.id, customerForm);
       toast.success("Customer profile updated");
       setIsEditModalOpen(false);
       fetchContacts();
    } catch (error) {
       toast.error("Failed to update profile");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this customer record?")) return;
    try {
       await contactService.remove(id);
       toast.success("Customer removed from CRM");
       fetchContacts();
    } catch (error) {
       toast.error("Failed to delete record");
    }
  };

  const openEdit = (e: React.MouseEvent, contact: any) => {
    e.stopPropagation();
    setSelectedCustomer(contact);
    setCustomerForm({
       name: contact.name,
       email: contact.email || "",
       phone: contact.phone || "",
       location: contact.location || ""
    });
    setIsEditModalOpen(true);
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
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20 bg-primary font-bold h-11 px-6 rounded-2xl">
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

      <Card className="border-border shadow-md bg-card overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Activity</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Conversations</th>
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
                          <div className="h-12 w-12 rounded-2xl border-2 border-background shadow-sm bg-muted flex items-center justify-center overflow-hidden">
                             {contact.avatarUrl ? (
                               <img src={contact.avatarUrl} alt="" className="h-full w-full object-cover" />
                             ) : (
                               <span className="text-sm font-black">{contact.name[0]}</span>
                             )}
                          </div>
                          <div className={cn(
                            "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background shadow-sm",
                            i % 3 === 0 ? 'bg-green-500' : 'bg-muted-foreground'
                          )} />
                        </div>
                        <div>
                          <p className="text-sm font-black group-hover:text-primary transition-colors">{contact.name}</p>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                             <MapPin className="h-2.5 w-2.5" />
                             {contact.location || 'Identity Verified'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                           <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                           {contact.email || 'no-email@crm.com'}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                           <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                           {contact.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary">Last Transaction</span>
                           <span className="text-xs font-black">{contact.updatedAt ? new Date(contact.updatedAt).toLocaleDateString() : 'Never'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <div className="flex items-center gap-2">
                           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                              {contact._count?.conversations || 0}
                           </div>
                           <span className="text-[9px] font-black text-muted-foreground uppercase vertical-writing">Active</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-wrap gap-1">
                           {(contact.tags || []).map((tag: any) => (
                            <span key={tag.id} className="text-[9px] font-black px-2 py-1 rounded-lg bg-primary/5 text-primary uppercase tracking-tighter border border-primary/10">
                               {tag.name}
                            </span>
                          ))}
                          {(!contact.tags || contact.tags.length === 0) && <span className="text-[9px] text-muted-foreground font-black uppercase underline decoration-primary/30">Standard User</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <Button onClick={(e) => openEdit(e, contact)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                             <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button onClick={(e) => handleDelete(contact.id, e)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500">
                             <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-3">
         <Card className="rounded-[2.5rem] border-border shadow-md bg-card border-l-8 border-l-primary">
            <CardHeader className="pb-2">
               <CardTitle className="text-xl font-black italic flex items-center gap-3">
                  <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                  Market Segments
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
               {[
                 { label: "High Value (VIP)", count: 124, color: "bg-primary" },
                 { label: "Newly Acquired", count: 85, color: "bg-emerald-500" },
                 { label: "Churn Risk", count: 210, color: "bg-rose-500" },
               ].map((seg, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>{seg.label}</span>
                       <span className="text-foreground">{seg.count} Profile{seg.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${(seg.count/419)*100}%` }} className={cn("h-full rounded-full shadow-lg", seg.color)} />
                    </div>
                 </div>
               ))}
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-border shadow-md bg-card border-l-8 border-l-emerald-500">
            <CardHeader className="pb-2">
               <CardTitle className="text-xl font-black italic flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-emerald-500" />
                  Growth Matrix
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center p-6">
                  <div className="relative h-32 w-32">
                     <svg className="h-full w-full rotate-[-90deg]">
                        <circle cx="50%" cy="50%" r="40%" className="fill-none stroke-muted stroke-[12]" />
                        <circle cx="50%" cy="50%" r="40%" className="fill-none stroke-emerald-500 stroke-[12] shadow-xl" strokeDasharray="180 251" strokeDashoffset="0" strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black">72%</span>
                        <span className="text-[10px] font-black text-slate-400">Week on Week</span>
                     </div>
                  </div>
               </div>
               <p className="text-xs text-center text-muted-foreground font-bold px-4 uppercase tracking-tighter">Acquisition Velocity <span className="text-emerald-500 underline">+24 Profile Vectors</span></p>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
               <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
               </div>
               <CardTitle className="text-white text-xl font-black italic">Lead Retargeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
               <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-wide">
                  Identified <span className="text-white">48 high-intent profiles</span> who haven't converted. Launching an automated follow-up sequence is recommended.
               </p>
               <Button onClick={() => toast.info("Opening campaign editor")} className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl shadow-xl shadow-primary/30 uppercase tracking-widest text-xs">
                  Launch Outreach Node
                  <ChevronRight className="h-4 w-4 ml-2" />
               </Button>
            </CardContent>
         </Card>
      </div>

      {/* CREATE CUSTOMER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-xl bg-card border border-border rounded-[3rem] shadow-2xl p-10 font-outfit">
               <div className="flex justify-between items-center mb-10">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
                     <Plus className="h-10 w-10" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-12 w-12 rounded-full"><X className="h-6 w-6" /></Button>
               </div>
               
               <h2 className="text-3xl font-black mb-2 italic">New Customer Profile</h2>
               <p className="text-muted-foreground font-medium mb-10">Establish a new contact record in the master CRM database.</p>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Full Legal Name</label>
                     <Input 
                       placeholder="Jane Cooper" 
                       className="h-14 rounded-2xl bg-muted border-none font-bold text-lg" 
                       value={customerForm.name}
                       onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Email Node</label>
                     <Input 
                       placeholder="jane@example.com" 
                       className="h-14 rounded-2xl bg-muted border-none font-bold" 
                       value={customerForm.email}
                       onChange={e => setCustomerForm({...customerForm, email: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Phone Line</label>
                     <Input 
                       placeholder="+1 (555) 000-0000" 
                       className="h-14 rounded-2xl bg-muted border-none font-bold" 
                       value={customerForm.phone}
                       onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Location / Territory</label>
                     <Input 
                       placeholder="New York, USA" 
                       className="h-14 rounded-2xl bg-muted border-none font-bold" 
                       value={customerForm.location}
                       onChange={e => setCustomerForm({...customerForm, location: e.target.value})}
                     />
                  </div>
               </div>

               <div className="flex gap-4 mt-12">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setIsModalOpen(false)}>Discard</Button>
                  <Button onClick={handleCreate} className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20">Establish Profile</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CUSTOMER MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-xl bg-card border border-border rounded-[3rem] shadow-2xl p-10 font-outfit">
               <div className="flex justify-between items-center mb-10">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                     <Edit2 className="h-10 w-10" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)} className="h-12 w-12 rounded-full"><X className="h-6 w-6" /></Button>
               </div>
               
               <h2 className="text-3xl font-black mb-2 italic">Refine Identity</h2>
               <p className="text-muted-foreground font-medium mb-10">Update the cryptographic profile records for this contact.</p>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Current Name</label>
                     <Input 
                       className="h-14 rounded-2xl bg-muted border-none font-bold text-lg" 
                       value={customerForm.name}
                       onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">New Email</label>
                     <Input 
                       className="h-14 rounded-2xl bg-muted border-none font-bold" 
                       value={customerForm.email}
                       onChange={e => setCustomerForm({...customerForm, email: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">New Phone</label>
                     <Input 
                       className="h-14 rounded-2xl bg-muted border-none font-bold" 
                       value={customerForm.phone}
                       onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
                     />
                  </div>
               </div>

               <div className="flex gap-4 mt-12">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdate} className="flex-1 h-14 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-500/20">Commit Changes</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
