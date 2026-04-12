"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Terminal, Globe, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/inbox";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-whatsapp/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-6 gap-2 text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <MessageSquare className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Create Account</h1>
          <p className="text-muted-foreground text-sm font-medium">Join the omnichannel future</p>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1">
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your agent profile to start managing conversations
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
                <span className="bg-card px-2 text-muted-foreground font-medium">Or create an account</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="fullName" 
                    placeholder="John Doe" 
                    type="text" 
                    required 
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    placeholder="name@company.com" 
                    type="email" 
                    required 
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary font-semibold" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
                {!loading && <UserPlus className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="px-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
