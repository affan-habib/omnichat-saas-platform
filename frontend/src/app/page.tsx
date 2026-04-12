"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/inbox");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-6 font-outfit">
      <div className="relative">
         <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
         <div className="relative w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-xl" />
      </div>
      <div className="flex flex-col items-center gap-1 animate-pulse">
         <p className="text-xl font-black tracking-tight">OmniChat</p>
         <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Initializing workspace...</p>
      </div>
    </div>
  );
}
