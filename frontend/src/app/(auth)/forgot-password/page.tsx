"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-6 gap-2 text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Recovery</h1>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1">
            <CardTitle>{submitted ? "Check your email" : "Forgot Password"}</CardTitle>
            <CardDescription>
              {submitted 
                ? "We've sent a password reset link to your email address"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="grid gap-4">
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
                <Button type="submit" className="w-full bg-primary font-semibold" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <Send className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            ) : (
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium text-center">
                  Success! If an account exists for that email, you will receive reset instructions shortly.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link
              href="/login"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
