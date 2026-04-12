"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Copy, 
  Tag, 
  Filter,
  MoreVertical,
  Zap,
  Globe,
  Star,
  ZapIcon,
  X,
  Hash,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cannedService } from "@/services/api.service";

export default function CannedResponsesPage() {
  const [search, setSearch] = useState("");
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    shortCode: "/",
    content: "",
    category: "General"
  });

  useEffect(() => {
    fetchReplies();
  }, []);

  const fetchReplies = async () => {
    setLoading(true);
    try {
      const res = await cannedService.list();
      setReplies(res.data);
    } catch (error) {
      toast.error("Failed to load canned responses");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.content || !formData.shortCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await cannedService.create(formData);
      toast.success("Canned response created!");
      setIsModalOpen(false);
      setFormData({ title: "", shortCode: "/", content: "", category: "General" });
      fetchReplies();
    } catch (error) {
      toast.error("Failed to create canned response");
    }
  };

  const handleUpdate = async () => {
    try {
      await cannedService.update(editingResponse.id, formData);
      toast.success("Response updated!");
      setIsEditModalOpen(false);
      fetchReplies();
    } catch (error) {
      toast.error("Failed to update response");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this response template?")) return;
    try {
      await cannedService.remove(id);
      toast.success("Response deleted");
      fetchReplies();
    } catch (error) {
      toast.error("Failed to delete response");
    }
  };

  const openEdit = (reply: any) => {
    setEditingResponse(reply);
    setFormData({
      title: reply.title,
      shortCode: reply.shortCode || "/",
      content: reply.content,
      category: reply.category || "General"
    });
    setIsEditModalOpen(true);
  };

  const filteredReplies = replies.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.shortCode?.toLowerCase().includes(search.toLowerCase()) ||
    r.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <MessageSquare className="h-8 w-8 text-primary" />
             Content Repository
          </h1>
          <p className="text-muted-foreground font-medium">Manage quick-reply templates for your entire team's omnichannel strategy.</p>
        </div>
        <Button onClick={() => { setFormData({ title: "", shortCode: "/", content: "", category: "General" }); setIsModalOpen(true); }} className="gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-2xl">
          <Plus className="h-5 w-5" />
          New Template
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-[2rem] shadow-sm border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search responses by title, shortcut, or content..." 
            className="pl-11 h-12 border-none bg-muted focus:bg-background transition-all font-medium rounded-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-6 gap-2 border-border bg-card rounded-2xl font-bold">
           <Filter className="h-4 w-4" />
           Filter Categories
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReplies.map((reply, i) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border shadow-md bg-card h-full flex flex-col group hover:shadow-xl transition-all rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pb-2 p-8">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                      <Zap className="h-3.5 w-3.5 fill-primary" />
                      {reply.shortCode}
                   </div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button onClick={() => openEdit(reply)} variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
                         <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button onClick={() => handleDelete(reply.id)} variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors">
                         <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
                <CardTitle className="text-xl font-black leading-tight group-hover:text-primary transition-colors">{reply.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{reply.category || 'General'}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 px-8">
                <div className="p-5 rounded-[1.5rem] bg-muted/40 border border-border/40 relative min-h-[100px] flex items-center">
                   <p className="text-sm text-foreground font-medium leading-relaxed italic">
                     "{reply.content}"
                   </p>
                   <button onClick={() => { navigator.clipboard.writeText(reply.content); toast.success("Copied to clipboard"); }} className="absolute bottom-3 right-3 p-2 rounded-xl bg-card border border-border shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <Copy className="h-3.5 w-3.5 text-primary" />
                   </button>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-between border-t border-border/50 p-8 pt-4 mt-6">
                 <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <ZapIcon className="h-3.5 w-3.5 text-amber-500" />
                    Used {reply.usage || 0} times
                 </div>
                 <div className="text-[10px] font-bold text-muted-foreground uppercase">
                    MOD: {new Date(reply.createdAt).toLocaleDateString()}
                 </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Card onClick={() => { setFormData({ title: "", shortCode: "/", content: "", category: "General" }); setIsModalOpen(true); }} className="border-2 border-dashed border-border shadow-none bg-transparent hover:bg-muted/30 transition-all cursor-pointer h-full flex flex-col items-center justify-center p-8 text-center group rounded-[2.5rem] min-h-[350px]">
             <div className="h-20 w-20 rounded-[2rem] bg-muted flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <Plus className="h-10 w-10" />
             </div>
             <h3 className="text-xl font-black">New Repository Template</h3>
             <p className="text-xs text-muted-foreground mt-3 max-w-[200px] font-medium leading-relaxed">Save standard replies to resolve customers with lethal efficiency.</p>
          </Card>
        </motion.div>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl p-8 font-outfit">
               <div className="flex justify-between items-center mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                     <Plus className="h-8 w-8" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></Button>
               </div>
               <h2 className="text-2xl font-black mb-2">Create Response</h2>
               <p className="text-muted-foreground text-sm font-medium mb-8">Save standard replies to resolve customers faster.</p>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Template Title</label>
                     <Input 
                       placeholder="e.g. Welcome Message" 
                       className="h-12 rounded-2xl bg-muted border-none font-bold" 
                       value={formData.title}
                       onChange={e => setFormData({...formData, title: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Shortcut Code</label>
                     <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="/welcome" 
                          className="pl-12 h-12 rounded-2xl bg-muted border-none font-bold" 
                          value={formData.shortCode}
                          onChange={e => setFormData({...formData, shortCode: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Body Content</label>
                     <textarea 
                       rows={4}
                       placeholder="Enter the automated response text..." 
                       className="w-full p-4 rounded-2xl bg-muted border-none outline-none text-sm font-bold resize-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
                       value={formData.content}
                       onChange={e => setFormData({...formData, content: e.target.value})}
                     />
                     <p className="text-[10px] text-muted-foreground italic px-2 font-medium">Use markers like &#123;&#123;name&#125;&#125; for personalization.</p>
                  </div>
               </div>

               <div className="flex gap-4 mt-10">
                  <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate} className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20">Establish Template</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl p-8 font-outfit">
               <div className="flex justify-between items-center mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                     <Settings className="h-8 w-8" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}><X className="h-6 w-6" /></Button>
               </div>
               <h2 className="text-2xl font-black mb-2">Edit Template</h2>
               <p className="text-muted-foreground text-sm font-medium mb-8">Refine your standard messaging for this repository item.</p>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Template Title</label>
                     <Input 
                       className="h-12 rounded-2xl bg-muted border-none font-bold" 
                       value={formData.title}
                       onChange={e => setFormData({...formData, title: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Shortcut Code</label>
                     <Input 
                       className="h-12 rounded-2xl bg-muted border-none font-bold" 
                       value={formData.shortCode}
                       onChange={e => setFormData({...formData, shortCode: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Body Content</label>
                     <textarea 
                       rows={4}
                       className="w-full p-4 rounded-2xl bg-muted border-none outline-none text-sm font-bold resize-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
                       value={formData.content}
                       onChange={e => setFormData({...formData, content: e.target.value})}
                     />
                  </div>
               </div>

               <div className="flex gap-4 mt-10">
                  <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdate} className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20">Apply Changes</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Card className="border-none shadow-2xl bg-gradient-to-br from-primary to-indigo-600 text-white overflow-hidden relative rounded-[3rem]">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Zap className="h-64 w-64 rotate-12 fill-white" />
         </div>
         <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10 relative">
            <div className="h-28 w-28 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center shadow-2xl shrink-0 border border-white/20">
               <Globe className="h-14 w-14 text-white" />
            </div>
            <div className="flex-1 space-y-6">
               <div>
                  <h3 className="text-4xl font-black font-outfit tracking-tight">Global Content Engine</h3>
                  <p className="text-primary-foreground/90 mt-3 font-bold text-xl leading-relaxed max-w-2xl">
                    Standardize your across 40 languages. Your omnichannel strategy scales instantly when your templates are perfect.
                  </p>
               </div>
               <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary h-12 px-8 rounded-2xl font-black text-xs uppercase transition-all">Manage Localizations</Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10 h-12 px-6 rounded-2xl font-black text-xs uppercase gap-2">
                    <Star className="h-4 w-4 fill-white" />
                    Marketplace Top Sellers
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
