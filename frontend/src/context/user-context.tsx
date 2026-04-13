"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/api.service";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

export type UserRole = "agent" | "supervisor" | "admin" | "owner" | "superadmin";
export type Theme = "light" | "dark";

interface UserContextType {
  user: any | null;
  role: UserRole;
  theme: Theme;
  isSidebarCollapsed: boolean;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRoleState] = useState<UserRole>("agent");
  const [theme, setThemeState] = useState<Theme>("light");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await authService.getMe();
        const userData = res.data;
        setUser(userData);
        setRoleState(userData.role.toLowerCase() as UserRole);

        // Force password change if needed
        if (userData.needsPasswordChange && pathname !== '/reset-password') {
          router.push('/reset-password');
        } else if (!userData.needsPasswordChange && pathname === '/reset-password') {
          router.push('/inbox');
        }
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.removeItem("token");
        if (!pathname.startsWith('/(auth)') && pathname !== '/login') {
           router.push('/login');
        }
      }
    } else {
      // Only redirect if we are not on auth pages
      if (!pathname.startsWith('/register') && pathname !== '/login' && pathname !== '/') {
         router.push('/login');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Load local settings
    const savedRole = localStorage.getItem("omnichat-role") as UserRole;
    const savedTheme = localStorage.getItem("omnichat-theme") as Theme;
    const savedSidebar = localStorage.getItem("omnichat-sidebar-collapsed");
    
    if (savedRole) setRoleState(savedRole);
    if (savedSidebar) setIsSidebarCollapsed(savedSidebar === "true");
    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }
    
    fetchMe();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("omnichat-theme", theme);
  }, [theme, isMounted]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("omnichat-role", newRole);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("omnichat-sidebar-collapsed", String(newState));
      return newState;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
    toast.success("Successfully logged out");
  };

  return (
    <UserContext.Provider value={{ 
      user,
      role, 
      theme, 
      isSidebarCollapsed, 
      isLoading,
      setRole, 
      toggleTheme, 
      toggleSidebar,
      logout,
      fetchMe
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
