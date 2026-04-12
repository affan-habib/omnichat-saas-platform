"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  User, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  Info,
  MessageSquare,
  Camera,
  MessageCircle,
  Hash,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { conversationService, messageService, cannedService } from "@/services/api.service";


export default function InboxPage() {
  const [convs, setConvs] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('OPEN');
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [cannedReplies, setCannedReplies] = useState<any[]>([]);
  
  const [isDispositionModalOpen, setIsDispositionModalOpen] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState("");
  const [dispositionNote, setDispositionNote] = useState("");
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isCannedOpen, setIsCannedOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  // Fetch conversations
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const response = await conversationService.getAll({ status: activeTab });
        setConvs(response.data);
        if (response.data.length > 0 && !selectedId) {
          setSelectedId(response.data[0].id);
        }
      } catch (error) {
        toast.error("Failed to fetch conversations");
      }
    };
    fetchConvs();
  }, [activeTab]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedId) return;
    const fetchMessages = async () => {
      try {
        const response = await messageService.getByConversation(selectedId);
        setMessages(response.data.reverse()); // Chronological
      } catch (error) {
        toast.error("Failed to fetch messages");
      }
    };
    fetchMessages();
  }, [selectedId]);

  // Fetch canned responses
  useEffect(() => {
    const fetchCanned = async () => {
      try {
        const response = await cannedService.list();
        setCannedReplies(response.data);
      } catch (error) {
        console.error("Failed to fetch canned replies");
      }
    };
    fetchCanned();
  }, []);

  const selectedChat = convs.find(c => c.id === selectedId);

  const handleResolve = async () => {
    if (!selectedId) return;
    try {
      await conversationService.updateStatus(selectedId, 'RESOLVED', selectedDisposition);
      toast.success("Conversation resolved");
      setIsDispositionModalOpen(false);
      // Refresh list
      const response = await conversationService.getAll({ status: activeTab });
      setConvs(response.data);
    } catch (error) {
      toast.error("Failed to resolve conversation");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedId || !messageText.trim()) return;
    try {
      const response = await messageService.send(selectedId, messageText);
      setMessages([...messages, response.data]);
      setMessageText("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const insertText = (text: string) => {
    setMessageText(prev => prev + text);
    setIsCannedOpen(false);
    setIsEmojiOpen(false);
  };

  const handleAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) toast.success(`File "${file.name}" attached`);
    };
    input.click();
  };

  const quickActions = [
    { label: "Transfer Conversation", icon: Users, color: "text-blue-500" },
    { label: "Create CRM Ticket", icon: ExternalLink, color: "text-indigo-500" },
    { label: "Send Payment Link", icon: Hash, color: "text-emerald-500" },
    { label: "Block Contact", icon: ShieldCheck, color: "text-rose-500" },
  ];


  const emojis = ["😊", "👋", "🙏", "⭐", "📦", "💰", "✅", "⚠️", "🕒", "📞"];

  const dispositions = [
    { id: 'inquiry', label: 'General Inquiry', icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'tech', label: 'Technical Issue', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'billing', label: 'Billing/Payment', icon: Hash, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'sales', label: 'Lead/Sales', icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'refund', label: 'Refund/Return', icon: ExternalLink, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* 1. Conversation List Sidebar */}
      <div className="flex w-80 flex-col border-r border-border bg-muted/50">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit">Inbox</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 bg-background border-border" />
          </div>
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {['OPEN', 'PENDING', 'RESOLVED'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold capitalize transition-all rounded-md",
                  activeTab === tab 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="space-y-1">
            {convs.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedId(chat.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl transition-all group relative",
                    selectedId === chat.id 
                      ? "bg-background shadow-md border-l-4 border-primary ring-1 ring-border" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 rounded-full border border-border overflow-hidden shadow-sm bg-muted flex items-center justify-center">
                      {chat.contact.avatarUrl ? (
                         <img src={chat.contact.avatarUrl} alt={chat.contact.name} />
                      ) : (
                         <span className="text-sm font-bold">{chat.contact.name[0]}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm border border-border">
                      {chat.channel === 'WHATSAPP' && <MessageCircle className="h-3 w-3 text-brand-whatsapp fill-brand-whatsapp" />}
                      {chat.channel === 'MESSENGER' && <MessageSquare className="h-3 w-3 text-brand-messenger fill-brand-messenger" />}
                      {chat.channel === 'INSTAGRAM' && <Camera className="h-3 w-3 text-brand-instagram" />}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col overflow-hidden text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{chat.contact.name}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-medium mt-0.5">
                      {chat.messages?.[0]?.content || "No messages yet"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                       {/* chat.unread logic deferred */}
                       <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                         ID: #{chat.id.split('-')[0]}
                       </span>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* 2. Chat Window Area */}
      <div className="flex flex-1 flex-col bg-background relative">
        <div className="flex h-16 items-center justify-between border-b border-border px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10 font-outfit">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full border overflow-hidden bg-muted flex items-center justify-center">
               {selectedChat?.contact?.avatarUrl ? (
                 <img src={selectedChat.contact.avatarUrl} alt={selectedChat.contact.name} />
               ) : (
                 <span className="font-bold">{selectedChat?.contact?.name?.[0]}</span>
               )}
             </div>
             <div>
               <div className="flex items-center gap-2">
                 <h3 className="font-bold text-sm leading-none">{selectedChat?.contact?.name}</h3>
                 <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               </div>
               <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-1">
                 {selectedChat?.channel === 'WHATSAPP' && <MessageCircle className="h-2.5 w-2.5 text-brand-whatsapp fill-brand-whatsapp" />}
                 {selectedChat?.channel === 'MESSENGER' && <MessageSquare className="h-2.5 w-2.5 text-brand-messenger fill-brand-messenger" />}
                 {selectedChat?.channel === 'INSTAGRAM' && <Camera className="h-2.5 w-2.5 text-brand-instagram" />}
                 via {selectedChat?.channel?.toLowerCase()} • ID: #{selectedChat?.id.split('-')[0]}
               </p>
             </div>
           </div>

           <div className="flex items-center gap-2">
             <Button 
               onClick={() => setIsDispositionModalOpen(true)}
               variant="default" 
               size="sm" 
               className="h-8 gap-2 font-bold bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
             >
               <CheckCircle2 className="h-3.5 w-3.5" />
               Resolve
             </Button>
             <div className="w-px h-6 bg-border mx-1" />
             <div className="relative">
               <Button 
                 onClick={() => {
                   setIsQuickActionsOpen(!isQuickActionsOpen);
                   setIsEmojiOpen(false);
                   setIsCannedOpen(false);
                 }}
                 variant="outline" size="sm" 
                 className={cn("h-8 gap-2 font-semibold transition-all", isQuickActionsOpen && "bg-muted shadow-inner")}
               >
                 <Zap className="h-3.5 w-3.5 text-amber-500" />
                 Quick Actions
               </Button>
               
               <AnimatePresence>
                 {isQuickActionsOpen && (
                   <>
                     <div 
                       className="fixed inset-0 z-40 cursor-default" 
                       onClick={() => setIsQuickActionsOpen(false)} 
                     />
                     <motion.div
                       initial={{ opacity: 0, scale: 0.95, y: 10 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95, y: 10 }}
                       className="absolute right-0 top-10 w-56 rounded-2xl bg-card border border-border shadow-2xl p-2 z-50 overflow-hidden font-outfit"
                     >
                     <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/50 mb-1">Agent Workflow</div>
                     {quickActions.map((action, i) => (
                       <button
                         key={i}
                         onClick={() => {
                           toast.info(`${action.label} initiated`);
                           setIsQuickActionsOpen(false);
                         }}
                         className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-all group"
                       >
                         <div className={cn("h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-background transition-colors", action.color)}>
                           <action.icon className="h-4 w-4" />
                         </div>
                         {action.label}
                       </button>
                     ))}
                   </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
             <Button onClick={() => toast.info("Starting voice call...")} variant="ghost" size="icon" className="h-8 w-8">
               <Phone className="h-4 w-4" />
             </Button>
             <Button onClick={() => toast.info("Initiating video conference...")} variant="ghost" size="icon" className="h-8 w-8">
               <Video className="h-4 w-4" />
             </Button>
             <div className="w-px h-6 bg-border mx-1" />
             <Button onClick={() => toast.info("Additional conversation options")} variant="ghost" size="icon" className="h-8 w-8">
               <MoreVertical className="h-4 w-4" />
             </Button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex w-full group",
              msg.senderType === 'CONTACT' ? "justify-start" : "justify-end"
            )}>
              <div className={cn(
                "flex max-w-[70%] flex-col gap-1",
                msg.senderType !== 'CONTACT' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all relative",
                  msg.senderType === 'CONTACT' 
                    ? "bg-muted text-foreground rounded-tl-none" 
                    : "bg-primary text-primary-foreground rounded-tr-none"
                )}>
                  {msg.content}
                  {msg.senderType !== 'CONTACT' && (
                    <div className="absolute -left-6 bottom-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 className={cn("h-3 w-3", msg.isRead ? "text-blue-500" : "text-muted-foreground")} />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center">
            <span className="bg-muted text-[10px] font-bold text-muted-foreground px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background font-outfit">
          <div className="relative bg-muted rounded-2xl p-2 border border-transparent focus-within:border-primary/30 transition-all shadow-sm">
            <textarea 
              rows={1}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Reply to ${selectedChat?.name}...`}
              className="w-full bg-transparent border-none focus:ring-0 resize-none px-3 py-2 text-sm max-h-32 min-h-[44px]"
            />
            <div className="flex items-center justify-between mt-1 px-3 py-1 relative">
              <div className="flex items-center gap-1">
                <Button 
                  onClick={handleAttachment}
                  variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Button 
                    onClick={() => {
                      setIsEmojiOpen(!isEmojiOpen);
                      setIsQuickActionsOpen(false);
                      setIsCannedOpen(false);
                    }}
                    variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <AnimatePresence>
                    {isEmojiOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40 cursor-default" 
                          onClick={() => setIsEmojiOpen(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -10 }}
                          className="absolute bottom-10 left-0 p-3 rounded-2xl bg-card border border-border shadow-2xl z-50 grid grid-cols-5 gap-2"
                        >
                        {emojis.map(e => (
                          <button 
                            key={e} 
                            onClick={() => insertText(e)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted text-lg transition-all hover:scale-110 active:scale-90"
                          >
                            {e}
                          </button>
                        ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-px h-4 bg-border mx-1" />
                
                <div className="relative">
                  <Button 
                    onClick={() => {
                      setIsCannedOpen(!isCannedOpen);
                      setIsQuickActionsOpen(false);
                      setIsEmojiOpen(false);
                    }}
                    variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    Canned Replies
                  </Button>
                  
                  <AnimatePresence>
                    {isCannedOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40 cursor-default" 
                          onClick={() => setIsCannedOpen(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -20 }}
                          className="absolute bottom-10 left-0 w-80 max-h-64 overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl p-4 z-50 font-outfit space-y-2 custom-scrollbar"
                        >
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 pb-2 border-b">Select Template</h4>
                         {cannedReplies.map((reply) => (
                           <button
                             key={reply.id}
                             onClick={() => insertText(reply.content)}
                             className="w-full text-left p-2 rounded-xl text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                           >
                             <div className="font-bold text-[10px] text-primary uppercase">{reply.shortCode}</div>
                             {reply.title}
                           </button>
                         ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <Button 
                onClick={handleSendMessage}
                size="sm" 
                className="h-9 px-4 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 bg-primary"
              >
                Send
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Contextual Profile Panel */}
      <div className="flex w-72 flex-col border-l border-border bg-muted/50 hide-on-small font-outfit">
        <div className="p-6 flex flex-col items-center text-center border-b">
          <div className="relative mb-4">
             <div className="h-20 w-20 rounded-2xl border-2 border-background shadow-xl overflow-hidden transform rotate-3">
               <img src={selectedChat?.avatar} alt={selectedChat?.name} />
             </div>
             <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                <ShieldCheck className="h-4 w-4" />
             </div>
          </div>
          <h3 className="font-bold text-lg">{selectedChat?.name}</h3>
          <p className="text-xs text-muted-foreground font-medium mb-4">Silver Member since 2023</p>
          
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1 text-xs font-bold h-8 rounded-lg">Profile</Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs font-bold h-8 rounded-lg">Orders</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Customer Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center shadow-sm border border-border">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Email</p>
                   <p className="text-xs font-bold truncate">{selectedChat?.contact?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center shadow-sm border border-border">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Phone</p>
                   <p className="text-xs font-bold">{selectedChat?.contact?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Previous Interactions</h4>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="group p-3 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-muted-foreground">#RES-29302</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                  <p className="text-xs font-bold line-clamp-1 group-hover:text-primary transition-colors">Refund requested for item...</p>
                  <p className="text-[10px] font-medium text-muted-foreground mt-1">Resolved by Sarah • 3d ago</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5">View All History</Button>
          </div>

          <div className="pt-4 border-t">
             <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Agent Note</span>
                </div>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 font-medium leading-relaxed">
                  Customer is sensitive about shipping times. Always provide tracking ID immediately.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Disposition Modal */}
      <AnimatePresence>
        {isDispositionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDispositionModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden font-outfit"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Resolve Conversation</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Final Disposition</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsDispositionModalOpen(false)}>
                   <MoreVertical className="h-5 w-5 rotate-90" />
                </Button>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold ml-1">Select Interaction Outcome</label>
                  <div className="grid grid-cols-2 gap-3">
                    {dispositions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedDisposition(item.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group",
                          selectedDisposition === item.id 
                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                            : "border-border hover:border-primary/30 hover:bg-muted"
                        )}
                      >
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                          <item.icon className={cn("h-5 w-5", item.color)} />
                        </div>
                        <span className="text-xs font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold ml-1">Closing Summary (Optional)</label>
                  <textarea 
                    placeholder="Add any internal notes regarding this resolution..."
                    value={dispositionNote}
                    onChange={(e) => setDispositionNote(e.target.value)}
                    className="w-full h-24 rounded-2xl bg-muted border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all resize-none p-4 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="p-6 bg-muted/50 border-t border-border flex items-center gap-3">
                <Button variant="outline" className="flex-1 h-12 font-bold rounded-2xl" onClick={() => setIsDispositionModalOpen(false)}>
                  Keep Open
                </Button>
                <Button 
                  disabled={!selectedDisposition}
                  onClick={handleResolve}
                  className="flex-2 h-12 font-bold rounded-2xl px-12 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 disabled:opacity-50"
                >
                  Finish & Resolve
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
