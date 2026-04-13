"use client";

import { useState } from "react";
import { Building2, User, Mail, Lock, Link as LinkIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/api.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTenantModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tenantName: "",
    slug: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    setForm({ ...form, tenantName: val, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createTenant(form);
      toast.success("Tenant created successfully!");
      onSuccess();
      onClose();
      setForm({
        tenantName: "",
        slug: "",
        ownerName: "",
        ownerEmail: "",
        ownerPassword: "",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden p-8 font-outfit"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-600 rounded-xl">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black">Provision New Tenant</h2>
                  <p className="text-xs font-medium text-muted-foreground">Internal SaaS Onboarding</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input 
                      required 
                      className="pl-10 rounded-2xl bg-muted/50 border-none h-11"
                      placeholder="Acme Corp"
                      value={form.tenantName}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">URL Slug</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input 
                      required 
                      className="pl-10 rounded-2xl bg-muted/50 border-none h-11 font-mono text-xs"
                      placeholder="acme-corp"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/40 my-4" />

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Owner Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input 
                    required 
                    className="pl-10 rounded-2xl bg-muted/50 border-none h-11"
                    placeholder="John Doe"
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Owner Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input 
                    required 
                    type="email"
                    className="pl-10 rounded-2xl bg-muted/50 border-none h-11"
                    placeholder="john@acme.com"
                    value={form.ownerEmail}
                    onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Initial Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input 
                    required 
                    type="password"
                    className="pl-10 rounded-2xl bg-muted/50 border-none h-11"
                    placeholder="••••••••"
                    value={form.ownerPassword}
                    onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-rose-600 font-black rounded-2xl shadow-xl shadow-rose-600/20 mt-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Provision"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
