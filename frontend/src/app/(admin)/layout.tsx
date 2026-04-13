"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { useUser } from "@/context/user-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Strict client-side check for Superadmin role
    if (user && role !== "superadmin") {
      router.push("/inbox");
    }
  }, [role, user, router]);

  if (!user || role !== "superadmin") {
    return null; // Or a loading skeleton
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-rose-500/30">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-50/30 dark:bg-slate-950/30">
          {children}
        </main>
      </div>
    </div>
  );
}
