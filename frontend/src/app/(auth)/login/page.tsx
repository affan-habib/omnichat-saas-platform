"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Terminal, Globe, MessageSquare } from "lucide-react";
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
  const { setRole } = useUser();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/inbox";
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem("token", token);
      setRole(user.role.toLowerCase() as any);
      
      toast.success("Login successful!");
      window.location.href = "/inbox";
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (role: "agent" | "supervisor" | "admin") => {
    // For demonstration, use seeded credentials
    const credentials: Record<string, string> = {
      agent: "agent1@acme.com",
      admin: "admin@acme.com",
      supervisor: "admin@acme.com" // assuming same for now
    };
    setEmail(credentials[role]);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-messenger/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <MessageSquare className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">OmniChat</h1>
          <p className="text-muted-foreground text-sm font-medium">The modern omnichannel inbox</p>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials or select a mock role below
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2">
                <Globe className="w-4 h-4" />
                Google
              </Button>
              <Button variant="outline" className="gap-2">
                <Terminal className="w-4 h-4" />
                GitHub
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    placeholder="agent@omnichat.com" 
                    type="email" 
                    required 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary font-semibold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <LogIn className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Mock Roles Login</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
               <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] h-9 font-bold bg-slate-50 dark:bg-slate-900 border-none hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => handleMockLogin("agent")}
                disabled={loading}
               >
                 Agent
               </Button>
               <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] h-9 font-bold bg-indigo-50 dark:bg-indigo-950/30 border-none text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50"
                onClick={() => handleMockLogin("supervisor")}
                disabled={loading}
               >
                 Supervisor
               </Button>
               <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] h-9 font-bold bg-amber-50 dark:bg-amber-950/30 border-none text-amber-600 dark:text-amber-400 hover:bg-amber-100/50"
                onClick={() => handleMockLogin("admin")}
                disabled={loading}
               >
                 Admin
               </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-slate-50 dark:border-slate-800/50 pt-6">
            <p className="px-8 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-primary hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
