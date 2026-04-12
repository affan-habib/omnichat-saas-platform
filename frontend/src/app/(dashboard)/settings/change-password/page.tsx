"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowLeft, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { authService } from "@/services/api.service";
import { useUser } from "@/context/user-context";

export default function ChangePasswordPage() {
  const { logout } = useUser();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const requirements = [
    { label: "At least 6 characters", met: form.newPassword.length >= 6 },
    { label: "Does not match current password", met: form.newPassword !== form.currentPassword && form.newPassword.length > 0 },
    { label: "Passwords match", met: form.newPassword === form.confirmPassword && form.newPassword.length > 0 },
  ];

  const allMet = requirements.every(r => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allMet) return toast.error("Please meet all password requirements");

    setLoading(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      toast.success("Password updated successfully! Please log in again.");
      // Force re-login for security
      setTimeout(() => logout(), 1500);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Failed to update password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-8 font-outfit">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6">
          <Link href="/settings" className="flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Link>
        </div>

        <Card className="border-border shadow-2xl rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none" />
          <CardHeader className="p-8">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-black">Security Rotation</CardTitle>
            <CardDescription className="font-medium">Verify your current credentials to set a new password</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <form onSubmit={handleSubmit} className="space-y-5" id="change-password-form">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-password-input"
                    type={showCurrent ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-12 rounded-2xl bg-muted border-none font-medium"
                    value={form.currentPassword}
                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="w-full h-px bg-border my-2" />

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password-input"
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-12 rounded-2xl bg-muted border-none font-medium"
                    value={form.newPassword}
                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password-input"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 h-12 rounded-2xl bg-muted border-none font-medium"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="rounded-2xl bg-muted/50 border border-border p-4 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Requirements</p>
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {req.met
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      : <XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    }
                    <span className={cn("text-xs font-medium", req.met ? "text-foreground" : "text-muted-foreground")}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </form>
          </CardContent>
          <CardFooter className="px-8 pb-8">
            <Button
              form="change-password-form"
              type="submit"
              className="w-full h-12 font-black rounded-2xl bg-primary text-white shadow-2xl shadow-primary/20 uppercase tracking-widest text-xs"
              disabled={loading || !allMet}
            >
              {loading ? "Rotating Credentials..." : "Rotate Password"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
