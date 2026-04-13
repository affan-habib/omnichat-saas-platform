"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  History, LayoutDashboard, Settings, 
  Users, Building2, ShieldCheck, 
  MessageSquare, BarChart3, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Building2, label: "Tenants", href: "/admin/tenants" },
  { icon: History, label: "Audit Logs", href: "/admin/logs" },
  { icon: Settings, label: "System Config", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-border/50 bg-card flex flex-col h-full font-outfit">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tighter block leading-none">SUPERADMIN</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform Control</span>
          </div>
        </div>

        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                  isActive 
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground")} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-border/50 space-y-2">
        <Link href="/inbox">
          <Button variant="outline" className="w-full justify-start rounded-xl gap-2 font-bold text-xs">
            <LayoutDashboard className="h-3.5 w-3.5" /> Back to Dashboard
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start rounded-xl gap-2 font-bold text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10">
          <LogOut className="h-3.5 w-3.5" /> Logout
        </Button>
      </div>
    </div>
  );
}
