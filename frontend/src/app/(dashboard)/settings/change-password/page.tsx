"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password updated successfully!");
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-8 font-outfit">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6">
           <Link href="/settings" className="flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
           </Link>
        </div>

        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Lock className="h-24 w-24 rotate-12" />
          </div>
          <CardHeader>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
               <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle>Update Security</CardTitle>
            <CardDescription>Secure your agent account with a strong password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Password</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input type="password" placeholder="••••••••" className="pl-10 h-11" required />
                </div>
              </div>
              
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-4" />

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">New Password</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input 
                     type={showPassword ? "text" : "password"} 
                     placeholder="••••••••" 
                     className="pl-10 h-11" 
                     required 
                   />
                   <button 
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-primary transition-colors"
                   >
                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Confirm New Password</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input type="password" placeholder="••••••••" className="pl-10 h-11" required />
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Password Requirements</h4>
                 <ul className="space-y-1">
                    {[
                      { label: "At least 8 characters long", met: true },
                      { label: "Must include numbers", met: true },
                      { label: "Must include symbols", met: false },
                    ].map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] font-medium">
                         <div className={cn("h-1.5 w-1.5 rounded-full", req.met ? "bg-green-500" : "bg-slate-300")} />
                         {req.label}
                      </li>
                    ))}
                 </ul>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-12 font-bold bg-primary shadow-lg shadow-primary/20 gap-2" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Updating..." : "Save New Password"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
