"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({ isOpen, onClose, title, subtitle, icon, children, footer, size = "md" }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className={cn(
              "relative w-full bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden font-outfit",
              sizes[size]
            )}
          >
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                {icon}
                <div>
                  <h3 className="text-2xl font-black">{title}</h3>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">{children}</div>
            {footer && <div className="p-6 bg-muted/30 border-t border-border">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
