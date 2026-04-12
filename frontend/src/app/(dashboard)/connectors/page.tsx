"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  MessageCircle, 
  MessageSquare, 
  Camera, 
  CheckCircle2, 
  Settings2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  ChevronRight,
  Globe,
  MoreHorizontal,
  RefreshCcw,
  Unlink2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const connectors = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Connect your WhatsApp Business API account to receive and send messages.',
    icon: MessageCircle,
    color: 'bg-brand-whatsapp',
    status: 'connected',
    account: '+1 (555) 012-3456',
    uptime: '99.9%',
    lastSync: '2m ago'
  },
  {
    id: 'messenger',
    name: 'Facebook Messenger',
    description: 'Manage messages from your official Facebook Pages directly in the inbox.',
    icon: MessageSquare,
    color: 'bg-brand-messenger',
    status: 'connected',
    account: 'OmniChat Official Page',
    uptime: '100%',
    lastSync: '5m ago'
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    description: 'Sync Instagram DMs and story mentions for your business account.',
    icon: Camera,
    color: 'bg-brand-instagram',
    status: 'disconnected',
    account: '@omnichat_app',
    uptime: '0%',
    lastSync: 'Never'
  },
];

export default function ConnectorsPage() {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Channel Integrations</h1>
          <p className="text-muted-foreground mt-1">Connect and manage your communication channels</p>
        </div>
        <div className="flex items-center gap-4 bg-card p-2 rounded-2xl shadow-sm border border-border">
           <div className="flex -space-x-3 overflow-hidden p-1">
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-brand-whatsapp flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-brand-messenger flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-brand-instagram flex items-center justify-center">
                <Camera className="h-4 w-4 text-white" />
              </div>
           </div>
           <p className="text-xs font-bold px-2">3 Channels Active</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {connectors.map((connector, i) => (
          <motion.div
            key={connector.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border shadow-md bg-card group overflow-hidden relative">
              <div className={cn(
                "absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
                connector.color
              )} />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-3 rounded-2xl text-white shadow-lg", connector.color)}>
                    <connector.icon className="h-6 w-6" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    connector.status === 'connected' 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      connector.status === 'connected' ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                    )} />
                    {connector.status}
                  </div>
                </div>
                <CardTitle>{connector.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">{connector.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connector.status === 'connected' ? (
                  <div className="space-y-3">
                     <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Linked Account</span>
                        <span className="text-xs font-bold">{connector.account}</span>
                     </div>
                     <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-bold text-muted-foreground uppercase">API Uptime</span>
                        <span className="text-xs font-bold text-emerald-500">{connector.uptime}</span>
                     </div>
                     <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Last Sync</span>
                        <span className="text-xs font-bold">{connector.lastSync}</span>
                     </div>
                  </div>
                ) : (
                   <div className="py-6 flex flex-col items-center justify-center text-center gap-3 bg-muted rounded-2xl border border-dashed border-border">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-xs font-medium text-muted-foreground px-6">Connection paused. Please re-authenticate to continue syncing.</p>
                   </div>
                )}
              </CardContent>
              <CardFooter className="gap-2">
                {connector.status === 'connected' ? (
                  <>
                     <Button variant="outline" className="flex-1 gap-2 font-bold h-10 bg-card border-border">
                       <Settings2 className="h-4 w-4" />
                       Configure
                     </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/10">
                      <Unlink2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button className={cn("w-full h-10 font-bold shadow-lg", connector.color)}>
                     Reconnect {connector.name.split(' ')[0]}
                     <RefreshCcw className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        {/* Add New Connector Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-dashed border-border shadow-none bg-transparent hover:bg-muted/50 transition-all cursor-pointer h-full flex flex-col items-center justify-center p-8 text-center group">
             <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-primary" />
             </div>
             <h3 className="text-lg font-bold">Add New Channel</h3>
             <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Expand your reach by connecting Telegram, Twitter or Custom Webhooks.</p>
             <div className="mt-6 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Directory
                <ChevronRight className="h-3 w-3" />
             </div>
          </Card>
        </motion.div>
      </div>

      {/* Guide Section */}
      <Card className="border-none shadow-lg bg-slate-900 text-white overflow-hidden relative mt-4">
         <div className="absolute top-0 right-0 p-12 opacity-5">
           <ShieldCheck className="h-48 w-48" />
         </div>
         <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative">
            <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 shrink-0">
               <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1 space-y-4">
               <div>
                  <h3 className="text-2xl font-bold font-outfit">Enterprise Security First</h3>
                  <p className="text-slate-400 mt-2 font-medium">
                    All your channel connections are encrypted using bank-grade AES-256 standards. We never store personal customer data on our servers beyond what's necessary for message delivery.
                  </p>
               </div>
               <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                     <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                     <span className="text-xs font-bold">End-to-End Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                     <Globe className="h-3.5 w-3.5 text-blue-500" />
                     <span className="text-xs font-bold">GDPR & HIPAA Compliant</span>
                  </div>
               </div>
            </div>
            <Button variant="outline" className="shrink-0 font-bold border-white/20 text-white hover:bg-white/10 gap-2 h-12 px-6 rounded-xl">
               Security Whitepaper
               <ExternalLink className="h-4 w-4" />
            </Button>
         </CardContent>
      </Card>
    </div>
  );
}
