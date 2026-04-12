"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { KeyRound, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userService } from "@/services/api.service";
import { useUser } from "@/context/user-context";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await userService.update(user.id, { 
        password, 
        needsPasswordChange: false 
      });
      toast.success("Password updated successfully! Welcome to OmniChat.");
      router.push("/inbox");
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 font-outfit">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 mb-6">
             <KeyRound className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Security Update Required</h1>
          <p className="text-muted-foreground font-medium">As this is your first time logging in, please establish a secure password for your account.</p>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl">
           <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase ml-1 text-muted-foreground">New Secure Password</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 h-14 rounded-2xl bg-muted border-none font-bold"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-black uppercase ml-1 text-muted-foreground">Confirm New Password</label>
                 <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 h-14 rounded-2xl bg-muted border-none font-bold"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                 </div>
              </div>

              <div className="space-y-4 pt-2">
                 <div className="space-y-2">
                    {[
                      "Minimum 6 characters",
                      "Include symbols or numbers",
                      "Ensure both passwords match"
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                         <CheckCircle2 className="h-3 w-3 text-primary" />
                         {step}
                      </div>
                    ))}
                 </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
              >
                {loading ? "Updating Security..." : "Establish Secure Password"}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
           </form>
        </div>
      </motion.div>
    </div>
  );
}
