"use client";

import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  Command,
  ChevronDown,
  Globe,
  Plus,
  PanelLeft,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { cn } from "@/lib/utils";

export function Header() {
  const { toggleTheme, isSidebarCollapsed, toggleSidebar } = useUser();
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/70 px-8 backdrop-blur-md sticky top-0 z-30">
      <div className="flex w-full max-w-xl items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="h-10 w-10 shrink-0 rounded-xl hover:bg-muted transition-all"
        >
          <PanelLeft className={cn("h-5 w-5 transition-transform", isSidebarCollapsed && "rotate-180")} />
        </Button>

        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search conversations, agents, or knowledge..." 
            className="w-full pl-10 h-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all rounded-xl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-card border border-border px-1.5 py-0.5 rounded shadow-sm">
            <Command className="w-3 h-3" />
            K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 mr-4 bg-muted p-1 rounded-lg">
          <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-card transition-all font-semibold">
            <Globe className="w-4 h-4 text-primary" />
            English
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex h-10 w-px bg-border mx-2" />

        <div className="relative">
          <Button variant="ghost" size="icon" className="relative group">
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          </Button>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <Moon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors block dark:hidden" />
          <Sun className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors hidden dark:block" />
        </Button>
      </div>
    </header>
  );
}
