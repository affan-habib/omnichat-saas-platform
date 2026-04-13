"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  BarChart3, 
  Users, 
  Plug2, 
  Settings, 
  UserCircle,
  Hash,
  Clock,
  Inbox,
  LayoutDashboard,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Zap,
  User,
  Shield,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useUser } from "@/context/user-context";

const navigation = [
  // Overview
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["agent", "supervisor", "admin", "superadmin"] },
  // Operations
  { name: "Inbox", href: "/inbox", icon: Inbox, badge: "12", roles: ["agent", "supervisor", "admin", "superadmin"] },
  { name: "CRM", href: "/crm", icon: UserCircle, roles: ["agent", "supervisor", "admin", "superadmin"] },
  // Management
  { name: "Reports", href: "/analytics", icon: BarChart3, roles: ["supervisor", "admin", "superadmin"] },
  { name: "Workforce", href: "/workforce", icon: Users, roles: ["supervisor", "admin", "superadmin"] },
  // Admin
  { name: "Automation", href: "/settings/routing", icon: Zap, roles: ["admin", "superadmin"] },
  { name: "Integrations", href: "/connectors", icon: Plug2, roles: ["admin", "superadmin"] },
  // System
  { name: "Settings", href: "/settings/general", icon: Settings, roles: ["agent", "supervisor", "admin", "superadmin"] },
  // Superadmin Shortcut
  { name: "Superadmin Portal", href: "/admin", icon: Shield, roles: ["superadmin"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, role, isSidebarCollapsed, toggleSidebar } = useUser();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ── Smart Sidebar Filtering ─────────────────────────────────────
  // If Superadmin: Hide all regular workspace tools, show ONLY Admin Portal.
  // Other roles: Show their assigned items.
  const filteredNavigation = role === "superadmin"
    ? navigation.filter((item) => item.name === "Superadmin Portal")
    : navigation.filter((item) => item.roles.includes(role) && item.name !== "Superadmin Portal");

  return (
    <motion.div 
      initial={false}
      animate={{ 
        width: isSidebarCollapsed ? 80 : 260,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
      className="flex h-full flex-col bg-slate-950 text-slate-100 border-r border-white/5 relative z-40"
    >
      <div className="flex h-20 shrink-0 items-center px-5 overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 ring-1 ring-white/10">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-outfit text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden"
              >
                OmniChat
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex flex-1 flex-col px-3 py-4 gap-1.5 custom-scrollbar overflow-y-auto overflow-x-hidden">
        {filteredNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center rounded-xl h-11 px-3 text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400/80 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isSidebarCollapsed ? "mx-auto" : "mr-3",
                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
              )} />
              
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {item.badge && !isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className={cn(
                      "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm ring-1 ring-white/10",
                      isActive ? "bg-white/20" : "bg-primary"
                    )}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive && (
                <motion.div
                  layoutId="active-sidebar-indicator"
                  className="absolute -left-3 h-6 w-1 rounded-r-full bg-white sm:block hidden"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/5 p-3 space-y-4 bg-slate-950/50 backdrop-blur-sm relative">
        {/* Settings Dropdown */}
        <AnimatePresence>
          {isSettingsOpen && !isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute left-4 bottom-16 w-52 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 z-50 overflow-hidden"
            >
              <Link 
                href="/profile"
                onClick={() => setIsSettingsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <User className="h-4 w-4" />
                </div>
                My Profile
              </Link>
              <button 
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                  <Shield className="h-4 w-4" />
                </div>
                Security
              </button>
              <div className="h-px bg-white/5 my-1.5" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                   <Lock className="h-4 w-4" />
                </div>
                Logout Account
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-1">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="relative h-10 w-10 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-800"
                  />
                  <motion.circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 25 }}
                    className="text-primary"
                  />
                </svg>
                <Clock className="absolute h-3 w-3 text-slate-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/5 p-4 border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Target Achievement</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-xl font-bold">75</span>
                <span className="text-xs text-slate-500 font-bold mb-0.5">/ 100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-linear-to-r from-primary to-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                />
              </div>
            </motion.div>
          )}
        </div>

        <div className={cn(
          "flex items-center p-1 rounded-2xl transition-all",
          isSidebarCollapsed ? "justify-center" : "gap-3 hover:bg-white/5"
        )}>
          <div className="relative shrink-0">
            <div className="h-10 w-10 rounded-xl bg-slate-800 ring-2 ring-primary ring-offset-2 ring-offset-slate-950 overflow-hidden group-hover:scale-105 transition-transform">
              <img src={`https://ui-avatars.com/api/?name=${role.charAt(0).toUpperCase() + role.slice(1)}&background=0D8ABC&color=fff`} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
          
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-1 flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate">{user?.name || role}</span>
                  <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Settings className={cn("h-3.5 w-3.5 transition-transform", isSettingsOpen ? "rotate-90 text-primary" : "text-slate-500 hover:text-white")} />
                  </button>
                </div>
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest whitespace-nowrap mt-0.5">
                  {role === 'admin' ? 'System Admin' : role === 'supervisor' ? 'Team Lead' : 'Support Agent'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
