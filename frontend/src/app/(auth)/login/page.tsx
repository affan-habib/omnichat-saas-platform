"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Terminal, Globe, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useUser } from "@/context/user-context";

import { authService } from "@/services/api.service";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRole, role } = useUser();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decode or check role from context/token if possible
      // For now, if role is superadmin in context, go to /admin
      if (role === "superadmin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/inbox";
      }
    }
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem("token", token);
      const userRole = user.role.toLowerCase();
      setRole(userRole as any);
      
      toast.success("Login successful!");
      
      // Intelligent Redirect
      if (userRole === "superadmin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/inbox";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (role: "agent" | "supervisor" | "admin" | "superadmin") => {
    // For demonstration, use seeded credentials
    const emails: Record<string, string> = {
      agent: "agent1@acme.com",
      admin: "admin@acme.com",
      supervisor: "admin@acme.com",
      superadmin: "superadmin@omnichat.com"
    };
    setEmail(emails[role]);
    setPassword(role === "superadmin" ? "admin123" : "password123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden relative">
      {/* Background decoration - more sophisticated */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-messenger/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="flex flex-col items-center mb-10 gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 0 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 transform rotate-3 cursor-pointer"
          >
            <MessageSquare className="text-white w-9 h-9" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold font-outfit tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
              OmniChat
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">Unified communication for modern teams</p>
          </div>
        </div>

        <Card className="border-white/20 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-brand-messenger to-primary animate-gradient-x" />
          <CardHeader className="space-y-1.5 pb-2">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-4">
            <form onSubmit={handleLogin} className="grid gap-5">
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    placeholder="name@company.com" 
                    type="email" 
                    required 
                    className="pl-10 h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="password">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    required 
                    className="pl-10 h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In to OmniChat"}
                {!loading && <LogIn className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Quick Access Roles</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button 
                type="button"
                className="flex flex-row items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                onClick={() => handleMockLogin("agent")}
                disabled={loading}
               >
                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                   <Globe className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">Agent</span>
               </button>
               <button 
                type="button"
                className="flex flex-row items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                onClick={() => handleMockLogin("supervisor")}
                disabled={loading}
               >
                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                   <Terminal className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">Supr.</span>
               </button>
               <button 
                type="button"
                className="flex flex-row items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                onClick={() => handleMockLogin("admin")}
                disabled={loading}
               >
                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                   <Lock className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">Admin</span>
               </button>
               <button 
                type="button"
                className="flex flex-row items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                onClick={() => handleMockLogin("superadmin")}
                disabled={loading}
               >
                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                   <ShieldCheck className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">Super</span>
               </button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 py-6">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              New to OmniChat?{" "}
              <Link
                href="/register"
                className="font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
