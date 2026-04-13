"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogIn, Mail, Lock, Terminal, Globe, 
  MessageSquare, ShieldCheck, HelpCircle, 
  X, ChevronRight, Building2, UserCheck, Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/user-context";
import { authService } from "@/services/api.service";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { setRole, role } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && role ) {
      if (role === "superadmin") window.location.href = "/admin";
      else window.location.href = "/inbox";
    }
  }, [role]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem("token", token);
      const userRole = user.role.toLowerCase();
      setRole(userRole as any);
      
      toast.success("Welcome back!");
      if (userRole === "superadmin") window.location.href = "/admin";
      else window.location.href = "/inbox";
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const setMockCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setIsHelpOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-outfit selection:bg-primary/30">
      
      {/* Help Action: Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center border border-border/50 hover:scale-110 transition-transform group"
        >
          <HelpCircle className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Left Side: Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <Image 
          src="/omnichat_login_hero_1776057609298.png" 
          alt="Login Hero" 
          fill 
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/40">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter leading-none">
              The future of <br /> Communication.
            </h2>
            <p className="text-slate-400 font-medium max-w-sm">
              Manage every channel, customer, and conversation in one unified, AI-powered platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-10 lg:hidden flex flex-col items-center">
             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-4">
               <MessageSquare className="text-white w-7 h-7" />
             </div>
             <h1 className="text-3xl font-black tracking-tight">OmniChat</h1>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-black tracking-tighter">Sign In</h2>
            <p className="text-muted-foreground font-medium">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="name@company.com" 
                  type="email" 
                  required 
                  className="pl-10 h-12 bg-white dark:bg-slate-900 border-border/50 rounded-2xl focus-visible:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Password</label>
                <Link href="#" className="text-[10px] font-black uppercase text-primary hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="pl-10 h-12 bg-white dark:bg-slate-900 border-border/50 rounded-2xl focus-visible:ring-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/25 transition-all active:scale-[0.98] mt-2" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <LogIn className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-sm font-bold text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline underline-offset-4">Create one</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Demo Credentials Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border/50 shadow-2xl rounded-[3rem] overflow-hidden p-10 font-outfit"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Demo Credentials</h2>
                    <p className="text-sm font-medium text-muted-foreground">Quickly switch between personas to test workflows</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsHelpOpen(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Platform Section */}
                <div className="md:col-span-2 p-6 rounded-[2rem] bg-rose-600/5 border border-rose-600/10 mb-2">
                   <div className="flex items-center gap-3 mb-4 text-rose-600">
                     <Shield className="w-5 h-5" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Platform Administration</span>
                   </div>
                   <button 
                    onClick={() => setMockCredentials("superadmin@omnichat.com", "admin123")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-600/20 hover:border-rose-600 shadow-sm transition-all group"
                   >
                     <div className="text-left">
                       <p className="text-sm font-black">Platform Superadmin</p>
                       <p className="text-[10px] font-medium text-muted-foreground italic">Access all tenants & metrics</p>
                     </div>
                     <ChevronRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>

                {/* Tenant A Section */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3 px-2 text-blue-500">
                     <Building2 className="w-5 h-5" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Acme Corp (A)</span>
                   </div>
                   <div className="grid gap-2">
                     {[
                       { role: "Owner/Admin", email: "admin@acme.com", icon: ShieldCheck },
                       { role: "Supervisor", email: "supervisor@acme.com", icon: Terminal },
                       { role: "Agent", email: "agent@acme.com", icon: Globe }
                     ].map((user) => (
                       <button 
                        key={user.email}
                        onClick={() => setMockCredentials(user.email, "password123")}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-primary/5 hover:scale-[1.02] transition-all border border-transparent hover:border-primary/20 text-left"
                       >
                         <user.icon className="w-4 h-4 text-muted-foreground" />
                         <div>
                           <p className="text-[11px] font-black uppercase tracking-tighter text-muted-foreground leading-none">{user.role}</p>
                           <p className="text-xs font-bold mt-1">{user.email}</p>
                         </div>
                       </button>
                     ))}
                   </div>
                </div>

                {/* Tenant B Section */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3 px-2 text-emerald-500">
                     <Building2 className="w-5 h-5" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Globex Core (B)</span>
                   </div>
                   <div className="grid gap-2">
                     {[
                       { role: "Owner/Admin", email: "admin@globex.com", icon: ShieldCheck },
                       { role: "Supervisor", email: "supervisor@globex.com", icon: Terminal },
                       { role: "Agent", email: "agent@globex.com", icon: Globe }
                     ].map((user) => (
                       <button 
                        key={user.email}
                        onClick={() => setMockCredentials(user.email, "password123")}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-emerald-500/5 hover:scale-[1.02] transition-all border border-transparent hover:border-emerald-500/20 text-left"
                       >
                         <user.icon className="w-4 h-4 text-muted-foreground" />
                         <div>
                           <p className="text-[11px] font-black uppercase tracking-tighter text-muted-foreground leading-none">{user.role}</p>
                           <p className="text-xs font-bold mt-1">{user.email}</p>
                         </div>
                       </button>
                     ))}
                   </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
