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
  Users,
  Inbox as InboxIcon,
  Circle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { conversationService, messageService, cannedService, tagService } from "@/services/api.service";
import { useUser } from "@/context/user-context";

export default function InboxPage() {
  const { user, role } = useUser();
  const [convs, setConvs] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('OPEN');
  const [activeScope, setActiveScope] = useState('ALL'); // ALL, MINE, UNASSIGNED
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [cannedReplies, setCannedReplies] = useState<any[]>([]);
  
  const [isDispositionModalOpen, setIsDispositionModalOpen] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState("");
  const [dispositionNote, setDispositionNote] = useState("");
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isCannedOpen, setIsCannedOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const isAdmin = role === 'admin' || role === 'owner';
  const isAgent = role === 'agent';

  // Fetch all available tags
  const fetchAllTags = async () => {
    try {
      const res = await tagService.list();
      setTags(res.data);
    } catch (error) {
       console.error("Failed to fetch tags");
    }
  };

  const handleToggleTag = async (tagId: string) => {
    if (!selectedId || !selectedChat) return;
    const hasTag = selectedChat.tags?.some((t: any) => t.tagId === tagId);
    
    try {
       if (hasTag) {
          await tagService.removeFromConversation(selectedId, tagId);
       } else {
          await tagService.addToConversation(selectedId, tagId);
       }
       // Refresh conversations to get updated tags
       const filters: any = { status: activeTab };
       const response = await conversationService.getAll(filters);
       setConvs(response.data);
    } catch (error) {
       toast.error("Failed to update tags");
    }
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const filters: any = { status: activeTab };
        
        // Apply scope logic
        if (isAgent) {
          filters.assigneeId = user?.id;
        } else if (activeScope === 'MINE') {
          filters.assigneeId = user?.id;
        } else if (activeScope === 'UNASSIGNED') {
          filters.assigneeId = 'null';
        }

        const response = await conversationService.getAll(filters);
        setConvs(response.data);
        if (response.data.length > 0 && !selectedId) {
          setSelectedId(response.data[0].id);
        } else if (response.data.length === 0) {
          setSelectedId(null);
        }
      } catch (error) {
        toast.error("Failed to fetch conversations");
      }
    };
    fetchConvs();
    fetchAllTags();
  }, [activeTab, activeScope, user?.id, isAgent]);

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
      <div className="flex w-80 flex-col border-r border-border bg-muted/30">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black font-outfit uppercase tracking-tighter">Inbox</h2>
            <div className="flex items-center gap-1">
               <span className="h-2 w-2 rounded-full bg-green-500" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase">{role}</span>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 h-10 bg-background border-border rounded-xl font-medium" />
          </div>

          <div className="space-y-3">
             <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
               {['OPEN', 'PENDING', 'RESOLVED'].map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                     activeTab === tab 
                       ? "bg-background text-primary shadow-sm" 
                       : "text-muted-foreground hover:text-foreground"
                   )}
                 >
                   {tab}
                 </button>
               ))}
             </div>

             {!isAgent && (
               <div className="grid grid-cols-3 gap-1 bg-muted/20 p-1 rounded-xl">
                 {['ALL', 'MINE', 'UNASSIGNED'].map(scope => (
                   <button
                     key={scope}
                     onClick={() => setActiveScope(scope)}
                     className={cn(
                       "py-1 text-[9px] font-black uppercase tracking-wider transition-all rounded-lg",
                       activeScope === scope
                         ? "bg-primary text-white shadow-md shadow-primary/20"
                         : "text-muted-foreground hover:text-foreground"
                     )}
                   >
                     {scope}
                   </button>
                 ))}
               </div>
             )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2">
          <div className="space-y-1">
            {convs.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedId(chat.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-[1.5rem] transition-all group relative",
                    selectedId === chat.id 
                      ? "bg-background shadow-xl ring-1 ring-border" 
                      : "hover:bg-muted/50"
                  )}
                >
                  {selectedId === chat.id && (
                    <motion.div layoutId="active-pill" className="absolute left-1 top-4 bottom-4 w-1 bg-primary rounded-full" />
                  )}
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 rounded-2xl border border-border overflow-hidden shadow-sm bg-muted flex items-center justify-center">
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
                      <span className="text-sm font-black truncate group-hover:text-primary transition-colors">{chat.contact.name}</span>
                      <span className="text-[10px] text-muted-foreground font-black">
                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate font-medium mt-0.5">
                      {chat.messages?.[0]?.content || "No messages yet"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[9px] font-black uppercase tracking-tight text-muted-foreground/60">
                         #{chat.id.split('-')[0]}
                       </span>
                       {chat.assignee ? (
                          <div className="flex items-center gap-1">
                             <div className="h-3.5 w-3.5 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="h-2 w-2 text-primary" />
                             </div>
                             <span className="text-[9px] font-bold text-primary truncate max-w-[60px]">{chat.assignee.name.split(' ')[0]}</span>
                          </div>
                       ) : (
                          <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">UNASSIGNED</span>
                       )}
                    </div>
                  </div>
                </button>
              ))}
              {convs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                   <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <InboxIcon className="h-8 w-8 text-muted-foreground/30" />
                   </div>
                   <h3 className="text-sm font-bold text-muted-foreground">No conversations found</h3>
                   <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-[120px]">Check your filters or ensure you are assigned to chats.</p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* 2. Chat Window Area */}
      <div className="flex flex-1 flex-col bg-background relative">
        {selectedId ? (
          <>
            <div className="flex h-16 items-center justify-between border-b border-border px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10 font-outfit">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl border overflow-hidden bg-muted flex items-center justify-center transform -rotate-3 transition-transform hover:rotate-0">
                   {selectedChat?.contact?.avatarUrl ? (
                     <img src={selectedChat.contact.avatarUrl} alt={selectedChat.contact.name} />
                   ) : (
                     <span className="font-bold">{selectedChat?.contact?.name?.[0]}</span>
                   )}
                 </div>
                 <div>
                   <div className="flex items-center gap-2">
                     <h3 className="font-black text-sm leading-none">{selectedChat?.contact?.name}</h3>
                     <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                   </div>
                   <p className="text-[10px] text-muted-foreground font-black flex items-center gap-1 mt-1 uppercase tracking-tight">
                     {selectedChat?.channel} • ID: #{selectedChat?.id.split('-')[0]}
                   </p>
                 </div>
               </div>

               <div className="flex items-center gap-2">
                 <Button 
                   onClick={() => setIsDispositionModalOpen(true)}
                   variant="default" 
                   size="sm" 
                   className="h-9 gap-2 font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 rounded-xl"
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
                     className={cn("h-9 gap-2 font-bold transition-all rounded-xl", isQuickActionsOpen && "bg-muted shadow-inner")}
                   >
                     <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                     Action
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
                           className="absolute right-0 top-12 w-56 rounded-[2rem] bg-card border border-border shadow-2xl p-2 z-50 overflow-hidden font-outfit"
                         >
                         <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/50 mb-1">Queue Management</div>
                         {quickActions.map((action, i) => (
                           <button
                             key={i}
                             onClick={() => {
                               toast.info(`${action.label} initiated`);
                               setIsQuickActionsOpen(false);
                             }}
                             className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-foreground hover:bg-muted transition-all group"
                           >
                             <div className={cn("h-8 w-8 rounded-xl bg-muted flex items-center justify-center group-hover:bg-background transition-colors", action.color)}>
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
                 <Button onClick={() => toast.info("Starting voice call...")} variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                   <Phone className="h-4 w-4" />
                 </Button>
                 <div className="w-px h-6 bg-border mx-1" />
                 <Button onClick={() => toast.info("Additional conversation options")} variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                   <MoreVertical className="h-4 w-4" />
                 </Button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
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
                      "rounded-[1.5rem] px-5 py-3 text-sm shadow-sm transition-all relative font-medium leading-relaxed",
                      msg.senderType === 'CONTACT' 
                        ? "bg-muted text-foreground rounded-tl-none border border-border/50" 
                        : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/20"
                    )}>
                      {msg.content}
                      {msg.senderType !== 'CONTACT' && (
                        <div className="absolute -left-6 bottom-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle2 className={cn("h-3 w-3", msg.isRead ? "text-blue-500" : "text-muted-foreground")} />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground/50 px-2 uppercase tracking-tight">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border bg-background font-outfit">
              <div className="relative bg-muted/40 rounded-[2rem] p-3 border border-border/40 focus-within:bg-background focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner">
                <textarea 
                  rows={1}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder={`Secure direct reply to ${selectedChat?.contact?.name}...`}
                  className="w-full bg-transparent border-none focus:ring-0 resize-none px-4 py-2 text-sm max-h-48 min-h-[48px] font-medium"
                />
                <div className="flex items-center justify-between mt-2 px-3 pb-1 relative">
                  <div className="flex items-center gap-1">
                    <Button 
                      onClick={handleAttachment}
                      variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary transition-colors"
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
                        variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary transition-colors"
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
                              className="absolute bottom-12 left-0 p-3 rounded-[1.5rem] bg-card border border-border shadow-2xl z-50 grid grid-cols-5 gap-2"
                            >
                            {emojis.map(e => (
                              <button 
                                key={e} 
                                onClick={() => insertText(e)}
                                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-muted text-lg transition-all hover:scale-125 hover:rotate-6"
                              >
                                {e}
                              </button>
                            ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="w-px h-5 bg-border mx-2" />
                    
                    <div className="relative">
                      <Button 
                        onClick={() => {
                          setIsCannedOpen(!isCannedOpen);
                          setIsQuickActionsOpen(false);
                          setIsEmojiOpen(false);
                        }}
                        variant="ghost" size="sm" className="h-9 px-3 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all"
                      >
                        Templates
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
                              className="absolute bottom-12 left-0 w-80 max-h-80 overflow-y-auto rounded-[2rem] bg-card border border-border shadow-2xl p-4 z-50 font-outfit space-y-2 custom-scrollbar"
                            >
                             <div className="flex items-center justify-between px-2 pb-2 border-b border-border/50 mb-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Smart Replies</h4>
                                <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                             </div>
                             {cannedReplies.map((reply) => (
                               <button
                                 key={reply.id}
                                 onClick={() => insertText(reply.content)}
                                 className="w-full text-left p-3 rounded-2xl text-[11px] font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-all border border-transparent hover:border-primary/20 group"
                               >
                                 <div className="flex items-center justify-between mb-0.5">
                                   <span className="text-[9px] font-black uppercase text-primary/60">{reply.shortCode}</span>
                                   <span className="text-[8px] font-black bg-muted px-1.5 py-0.5 rounded text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">{reply.category || 'General'}</span>
                                 </div>
                                 <div className="truncate">{reply.title}</div>
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
                    className="h-10 px-6 rounded-[1.2rem] gap-2 font-black shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Send Reply
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-20 text-center space-y-6">
             <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-10 rounded-full border-2 border-dashed border-primary/10"
                />
                <div className="h-32 w-32 rounded-[3rem] bg-muted/30 flex items-center justify-center relative z-10">
                   <MessageSquare className="h-12 w-12 text-primary/30" />
                </div>
             </div>
             <div>
                <h3 className="text-2xl font-black font-outfit">Select a Workspace</h3>
                <p className="text-muted-foreground text-sm font-medium mt-2 max-w-[280px] mx-auto">
                   Pick a conversation from the sidebar to start assisting your customers. 
                   Real-time updates will appear automatically.
                </p>
             </div>
             <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold border-primary/20 text-primary bg-primary/5 hover:bg-primary/10">
                View Onboarding Guide
             </Button>
          </div>
        )}
      </div>

      {/* 3. Contextual Profile Panel */}
      <div className="flex w-80 flex-col border-l border-border bg-muted/10 hide-on-small font-outfit">
        <div className="p-8 flex flex-col items-center text-center border-b border-border/50 bg-card/50">
          <div className="relative mb-6">
             <div className="h-24 w-24 rounded-[2.5rem] border-4 border-background shadow-2xl overflow-hidden transform rotate-6 transition-transform hover:rotate-0 ring-1 ring-border">
               <img src={selectedChat?.contact?.avatarUrl || `https://ui-avatars.com/api/?name=${selectedChat?.contact?.name || 'User'}&background=random&size=512`} alt="" />
             </div>
             <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl border-4 border-background bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                <ShieldCheck className="h-5 w-5" />
             </div>
          </div>
          <h3 className="font-black text-xl">{selectedChat?.contact?.name || 'No Selected Contact'}</h3>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Customer Profile (Verified)</p>
          
          <div className="flex gap-2 w-full mt-6">
            <Button variant="outline" size="sm" className="flex-1 text-[10px] font-black uppercase h-10 rounded-xl border-border bg-background shadow-sm">Details</Button>
            <Button variant="outline" size="sm" className="flex-2 text-[10px] font-black uppercase h-10 rounded-xl bg-primary text-white border-primary shadow-lg shadow-primary/20">Quick CRM</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Attributes</h4>
                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                   <Hash className="h-2 w-2 text-primary" />
                </div>
             </div>
             <div className="flex flex-wrap gap-2 p-1">
                {tags.map((tag) => {
                   const isActive = selectedChat?.tags?.some((t: any) => t.tagId === tag.id);
                   return (
                      <button
                        key={tag.id}
                        onClick={() => handleToggleTag(tag.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border shrink-0",
                          isActive 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                            : "bg-muted/40 text-muted-foreground border-transparent hover:border-border hover:bg-muted"
                        )}
                        style={isActive ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
                      >
                         {tag.name}
                      </button>
                   );
                })}
                {tags.length === 0 && (
                   <p className="text-[10px] italic text-muted-foreground">No platform tags available.</p>
                )}
             </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Customer Identity</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-card border border-border/50 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="overflow-hidden">
                   <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1 text-primary/60">Primary Email</p>
                   <p className="text-xs font-bold truncate">{selectedChat?.contact?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-card border border-border/50 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Hash className="h-5 w-5 text-amber-500" />
                </div>
                <div className="overflow-hidden">
                   <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1 text-amber-600">Verified Phone</p>
                   <p className="text-xs font-bold">{selectedChat?.contact?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Historical Logs</h4>
                <Button variant="ghost" size="icon" className="h-5 w-5"><MoreVertical className="h-3 w-3" /></Button>
             </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="group p-4 rounded-[1.5rem] bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-3 w-3 text-primary" />
                   </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-black text-primary/40">#RES-29302</span>
                    <Circle className="h-2 w-2 text-emerald-500 fill-emerald-500" />
                  </div>
                  <p className="text-[11px] font-black line-clamp-1 group-hover:text-primary transition-colors">Refund requested for item...</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1 flex items-center gap-2">
                     <Clock className="h-2.5 w-2.5" />
                     Resolved • 3d ago
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
             <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Intelligence</span>
                </div>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed relative z-10">
                  Customer is sensitive about shipping times. Always provide tracking ID immediately.
                </p>
                <button className="mt-4 text-[9px] font-black text-primary uppercase tracking-[0.2em] hover:text-white transition-colors">Edit AI Context</button>
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
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden font-outfit"
            >
              <div className="p-8 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">Archive Session</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 text-primary">Outcome Intelligence</p>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setIsDispositionModalOpen(false)}>
                   <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-10 space-y-10">
                <div className="space-y-6">
                  <label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Select Outcome Vector</label>
                  <div className="grid grid-cols-2 gap-4">
                    {dispositions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedDisposition(item.id)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-[1.5rem] border-2 transition-all text-left group",
                          selectedDisposition === item.id 
                            ? "border-primary bg-primary/5 shadow-inner" 
                            : "border-transparent bg-muted/40 hover:bg-muted"
                        )}
                      >
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", item.bg)}>
                          <item.icon className={cn("h-6 w-6", item.color)} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Internal Documentation</label>
                  <textarea 
                    placeholder="Document the resolution context for future AI training..."
                    value={dispositionNote}
                    onChange={(e) => setDispositionNote(e.target.value)}
                    className="w-full h-32 rounded-[2rem] bg-muted/40 border-transparent focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all resize-none p-6 text-sm font-medium shadow-inner"
                  />
                </div>
              </div>

              <div className="p-8 bg-muted/30 border-t border-border flex items-center gap-4">
                <Button variant="outline" className="flex-1 h-14 font-black rounded-[1.5rem] uppercase tracking-tighter" onClick={() => setIsDispositionModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  disabled={!selectedDisposition}
                  onClick={handleResolve}
                  className="flex-2 h-14 font-black rounded-[1.5rem] px-12 bg-primary text-white shadow-2xl shadow-primary/30 uppercase tracking-tighter disabled:opacity-30 disabled:grayscale transition-all"
                >
                  Confirm Resolution
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
