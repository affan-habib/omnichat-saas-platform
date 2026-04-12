"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Tag, 
  Plus, 
  Edit2, 
  Trash2, 
  Hash, 
  Palette, 
  X, 
  Check,
  Search,
  Filter,
  Zap,
  ShieldCheck,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tagService } from "@/services/api.service";

export default function TagsSettingsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: "", color: "#6366f1" });

  const colors = [
    "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", 
    "#8b5cf6", "#06b6d4", "#22c55e", "#f43f5e", "#3b82f6"
  ];

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await tagService.list();
      setTags(res.data);
    } catch (error) {
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async () => {
    if (!formData.name) {
       toast.error("Tag name is required");
       return;
    }
    try {
      await tagService.create(formData);
      toast.success("Tag created successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", color: "#6366f1" });
      fetchTags();
    } catch (error) {
      toast.error("Failed to create tag");
    }
  };

  const handleUpdate = async () => {
    try {
      await tagService.update(editingTag.id, formData);
      toast.success("Tag updated!");
      setIsEditModalOpen(false);
      fetchTags();
    } catch (error) {
      toast.error("Failed to update tag");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this tag? All linkings will be removed.")) return;
    try {
      await tagService.remove(id);
      toast.success("Tag deleted");
      fetchTags();
    } catch (error) {
      toast.error("Failed to delete tag");
    }
  };

  const openEdit = (tag: any) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color || "#6366f1" });
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex h-full flex-col bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Hash className="h-8 w-8 text-primary" />
             Taxonomy Manager
          </h1>
          <p className="text-muted-foreground font-medium">Standardize categorization across your omnichannel conversations.</p>
        </div>
        <Button onClick={() => { setFormData({ name: "", color: "#6366f1" }); setIsModalOpen(true); }} className="gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-2xl">
          <Plus className="h-5 w-5" />
          Create New Tag
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
           <Card className="rounded-[2.5rem] border-border/50 shadow-xl bg-card overflow-hidden">
              <CardContent className="p-0">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-muted/50 border-b border-border">
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Label</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visual Identity</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {tags.map((tag) => (
                          <tr key={tag.id} className="hover:bg-muted/20 transition-colors group">
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                   <div className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.color }} />
                                   <span className="font-black text-sm">{tag.name}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className={cn(
                                   "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                   "border border-border bg-muted/50"
                                )} style={{ color: tag.color, borderColor: tag.color + '40' }}>
                                   {tag.color}
                                </span>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button onClick={() => openEdit(tag)} variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                                   </Button>
                                   <Button onClick={() => handleDelete(tag.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-rose-500/10 transition-colors">
                                      <Trash2 className="h-4 w-4 text-rose-500" />
                                   </Button>
                                </div>
                             </td>
                          </tr>
                       ))}
                       {tags.length === 0 && (
                         <tr>
                            <td colSpan={3} className="px-8 py-12 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest">No tags established. Start by creating one.</td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="rounded-[2.5rem] bg-muted/30 border-dashed border-2 border-border p-8">
              <div className="space-y-6">
                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Zap className="h-6 w-6" />
                 </div>
                 <h4 className="text-lg font-black italic">Categorization Alpha</h4>
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   Tags allow your team to slice and dice conversations for reporting. 
                   <br/><br/>
                   Pro-tip: Use colors to represent urgency levels (Red for Urgent, Green for Resolved).
                 </p>
                 <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase">Role-based Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase">Global Sync</span>
                    </div>
                 </div>
              </div>
           </Card>
        </div>
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
               <h2 className="text-2xl font-black mb-2">Create Taxonomy Tag</h2>
               <p className="text-muted-foreground text-sm font-medium mb-8">Define a new label and visual indicator for your organization.</p>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Tag Identity</label>
                     <Input 
                       placeholder="e.g. VIP Customer" 
                       className="h-14 rounded-2xl bg-muted border-none font-bold text-lg" 
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                     />
                  </div>
                  <div className="space-y-4">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1 flex items-center gap-2">
                        <Palette className="h-3 w-3" />
                        Color Profile
                     </label>
                     <div className="grid grid-cols-5 gap-3">
                        {colors.map(c => (
                           <button 
                             key={c} 
                             onClick={() => setFormData({...formData, color: c})}
                             className={cn(
                               "h-10 rounded-xl transition-all border-4",
                               formData.color === c ? "border-primary scale-110" : "border-transparent"
                             )}
                             style={{ backgroundColor: c }}
                           />
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 mt-10">
                  <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate} className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20">Establish Tag</Button>
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
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                     <Settings2 className="h-8 w-8" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}><X className="h-6 w-6" /></Button>
               </div>
               <h2 className="text-2xl font-black mb-2">Modify Tag</h2>
               <p className="text-muted-foreground text-sm font-medium mb-8">Update visuals or naming for this taxonomy item.</p>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Tag Name</label>
                     <Input 
                       className="h-14 rounded-2xl bg-muted border-none font-bold text-lg" 
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                     />
                  </div>
                  <div className="space-y-4">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">Update Color</label>
                     <div className="grid grid-cols-5 gap-3">
                        {colors.map(c => (
                           <button 
                             key={c} 
                             onClick={() => setFormData({...formData, color: c})}
                             className={cn(
                               "h-10 rounded-xl transition-all border-4",
                               formData.color === c ? "border-primary scale-110" : "border-transparent"
                             )}
                             style={{ backgroundColor: c }}
                           />
                        ))}
                     </div>
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
    </div>
  );
}
