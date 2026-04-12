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
  Hash
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
  
  // Create state
  const [newResponse, setNewResponse] = useState({
    title: "",
    shortCode: "/",
    content: "",
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
    if (!newResponse.title || !newResponse.content || !newResponse.shortCode) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await cannedService.create(newResponse);
      toast.success("Canned response created!");
      setIsModalOpen(false);
      setNewResponse({ title: "", shortCode: "/", content: "" });
      fetchReplies();
    } catch (error) {
      toast.error("Failed to create canned response");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await cannedService.delete(id);
      toast.success("Response deleted");
      fetchReplies();
    } catch (error) {
      toast.error("Failed to delete response");
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Canned Responses</h1>
          <p className="text-muted-foreground mt-1">Manage quick-reply templates for your entire team</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20 bg-primary font-bold h-11 px-6">
          <Plus className="h-5 w-5" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search responses by title, shortcut, or content..." 
            className="pl-10 h-11 border-none bg-muted focus:bg-background transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 border-border bg-card">
           <Filter className="h-4 w-4" />
           Categories
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
            <Card className="border-border shadow-md bg-card h-full flex flex-col group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                      <Zap className="h-3 w-3 fill-primary" />
                      {reply.shortCode}
                   </div>
                   <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                         <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(reply.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive">
                         <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                   </div>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{reply.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{reply.category || 'General'}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="p-4 rounded-xl bg-muted/50 border border-border relative">
                   <p className="text-xs text-foreground font-medium leading-relaxed italic">
                     "{reply.content}"
                   </p>
                   <button onClick={() => { navigator.clipboard.writeText(reply.content); toast.success("Copied to clipboard"); }} className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-background border border-border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="h-3 w-3 text-primary" />
                   </button>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-between border-t border-border/50 py-3 mt-4">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <ZapIcon className="h-3 w-3" />
                    Used {reply.usage || 0} times
                 </div>
                 <div className="text-[10px] font-medium text-muted-foreground">
                    {new Date(reply.createdAt).toLocaleDateString()}
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
          <Card onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-border shadow-none bg-transparent hover:bg-card/50 transition-all cursor-pointer h-full flex flex-col items-center justify-center p-8 text-center group">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-primary" />
             </div>
             <h3 className="text-lg font-bold">New Template</h3>
             <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Create a new quick-reply for your team to use in the inbox.</p>
          </Card>
        </motion.div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                     <Plus className="h-6 w-6" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></Button>
               </div>
               <h2 className="text-2xl font-black mb-2">Create Response</h2>
               <p className="text-muted-foreground text-sm font-medium mb-8">Save standard replies to resolve customers faster.</p>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Template Title</label>
                     <Input 
                       placeholder="e.g. Welcome Message" 
                       className="h-12 rounded-2xl bg-muted border-none" 
                       value={newResponse.title}
                       onChange={e => setNewResponse({...newResponse, title: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Shortcut Code</label>
                     <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="/welcome" 
                          className="pl-12 h-12 rounded-2xl bg-muted border-none" 
                          value={newResponse.shortCode}
                          onChange={e => setNewResponse({...newResponse, shortCode: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Body Content</label>
                     <textarea 
                       rows={4}
                       placeholder="Enter the automated response text..." 
                       className="w-full p-4 rounded-2xl bg-muted border-none outline-none text-sm font-medium resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                       value={newResponse.content}
                       onChange={e => setNewResponse({...newResponse, content: e.target.value})}
                     />
                     <p className="text-[10px] text-muted-foreground italic px-2">Use placeholder keys like &#123;&#123;customer_name&#125;&#125; for personalization.</p>
                  </div>
               </div>

               <div className="flex gap-4 mt-10">
                  <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate} className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20">Save Template</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Card className="border-none shadow-lg bg-primary text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-10">
           <Zap className="h-64 w-64 rotate-12 fill-white" />
         </div>
         <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative">
            <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl shrink-0">
               <Globe className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1 space-y-4">
               <div>
                  <h3 className="text-3xl font-bold font-outfit">Multi-Language Support</h3>
                  <p className="text-primary-foreground/80 mt-2 font-medium text-lg leading-relaxed">
                    Personalize your responses in over 40 languages. The system automatically detects the customer's language and suggests appropriate templates.
                  </p>
               </div>
               <div className="flex wrap gap-4">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-10 px-4 font-bold">Manage Translations</Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10 h-10 px-4 font-bold gap-2">
                    <Star className="h-4 w-4 fill-white" />
                    Bestselling Templates
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
