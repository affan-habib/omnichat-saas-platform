"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Copy, 
  Tag, 
  Filter,
  MoreVertical,
  Zap,
  Globe,
  Star,
  ZapIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const initialReplies = [
  { 
    id: 1, 
    title: "Greeting (Generic)", 
    shortcut: "/hi", 
    content: "Hi there! Welcome to OmniChat. How can I assist you today?", 
    category: "General",
    usage: 1240 
  },
  { 
    id: 2, 
    title: "Shipping Status", 
    shortcut: "/ship", 
    content: "Your order is currently in transit. You can track it here: {{tracking_url}}. We expect delivery within 3-5 business days.", 
    category: "Sales",
    usage: 850 
  },
  { 
    id: 3, 
    title: "Refund Policy", 
    shortcut: "/refund", 
    content: "Our policy allows for refunds within 30 days of purchase. Please provide your order number to proceed.", 
    category: "Support",
    usage: 420 
  },
  { 
    id: 4, 
    title: "Meeting Link", 
    shortcut: "/meet", 
    content: "I'd love to jump on a call. Here is my calendar link: {{calendar_link}}", 
    category: "Sales",
    usage: 120 
  },
];

export default function CannedResponsesPage() {
  const [search, setSearch] = useState("");
  const [replies, setReplies] = useState(initialReplies);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background p-8 space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Canned Responses</h1>
          <p className="text-muted-foreground mt-1">Manage quick-reply templates for your entire team</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary font-bold h-11 px-6">
          <Plus className="h-5 w-5" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search responses by title, shortcut, or content..." 
            className="pl-10 h-11 border-none bg-muted focus:bg-background transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 border-border bg-card">
           <Filter className="h-4 w-4" />
           Categories
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {replies.map((reply, i) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border shadow-md bg-card h-full flex flex-col group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                      <Zap className="h-3 w-3 fill-primary" />
                      {reply.shortcut}
                   </div>
                   <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                         <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive">
                         <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                   </div>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{reply.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{reply.category}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="p-4 rounded-xl bg-muted/50 border border-border relative">
                   <p className="text-xs text-foreground font-medium leading-relaxed italic">
                     "{reply.content}"
                   </p>
                   <button className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-background border border-border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="h-3 w-3 text-primary" />
                   </button>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-between">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <ZapIcon className="h-3 w-3" />
                    Used {reply.usage} times
                 </div>
                 <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-5 w-5 rounded-full ring-2 ring-background bg-muted border border-border overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=Agent+${i}&background=random`} alt="" />
                       </div>
                    ))}
                 </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Card className="border-2 border-dashed border-border shadow-none bg-transparent hover:bg-card/50 transition-all cursor-pointer h-full flex flex-col items-center justify-center p-8 text-center group">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-primary" />
             </div>
             <h3 className="text-lg font-bold">New Template</h3>
             <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Create a new quick-reply for your team to use in the inbox.</p>
          </Card>
        </motion.div>
      </div>

      <Card className="border-none shadow-lg bg-primary text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-10">
           <Zap className="h-64 w-64 rotate-12 fill-white" />
         </div>
         <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative">
            <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl shrink-0">
               <Globe className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1 space-y-4">
               <div>
                  <h3 className="text-3xl font-bold font-outfit">Multi-Language Support</h3>
                  <p className="text-primary-foreground/80 mt-2 font-medium text-lg leading-relaxed">
                    Personalize your responses in over 40 languages. The system automatically detects the customer's language and suggests appropriate templates.
                  </p>
               </div>
               <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-10 px-4 font-bold">Manage Translations</Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10 h-10 px-4 font-bold gap-2">
                    <Star className="h-4 w-4 fill-white" />
                    Bestselling Templates
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
