"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "agent" | "supervisor" | "admin";
export type Theme = "light" | "dark";

interface UserContextType {
  role: UserRole;
  theme: Theme;
  isSidebarCollapsed: boolean;
  setRole: (role: UserRole) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("agent");
  const [theme, setThemeState] = useState<Theme>("light");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
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
    
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Apply theme to document
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

  return (
    <UserContext.Provider value={{ 
      role, 
      theme, 
      isSidebarCollapsed, 
      setRole, 
      toggleTheme, 
      toggleSidebar 
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
