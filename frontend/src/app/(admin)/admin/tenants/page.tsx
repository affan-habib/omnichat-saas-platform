"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Users, MessageSquare, ShieldCheck, 
  ShieldAlert, ShieldX, Search, Filter, 
  MoreHorizontal, CheckCircle2, XCircle, Ban,
  ExternalLink, Calendar, Loader2, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/api.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SuperadminTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTenants = async () => {
    try {
      const res = await adminService.listTenants();
      setTenants(res.data);
    } catch {
      toast.error("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminService.updateTenantStatus(id, status);
      toast.success(`Tenant status updated to ${status}`);
      fetchTenants();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-emerald-500 text-white border-none">Active</Badge>;
      case 'PENDING': return <Badge className="bg-amber-500 text-white border-none">Pending Approval</Badge>;
      case 'SUSPENDED': return <Badge className="bg-rose-500 text-white border-none">Suspended</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 font-outfit">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Approve new signups and manage existing workspaces
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by company or slug..." 
            className="pl-10 h-11 bg-card border-border/50 rounded-2xl" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 rounded-2xl gap-2 font-bold">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTenants.map((tenant, i) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="rounded-[2rem] border-border/40 shadow-sm hover:shadow-md transition-all overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black">{tenant.name}</h3>
                          {getStatusBadge(tenant.status)}
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">/{tenant.slug}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Owner</span>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold">{tenant.users[0]?.name || 'N/A'}</p>
                          <a href={`mailto:${tenant.users[0]?.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Scale</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs font-bold">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {tenant._count.users}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold">
                            <MessageSquare className="h-3 w-3 text-muted-foreground" />
                            {tenant._count.conversations}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Joined</span>
                        <p className="text-sm font-bold">{new Date(tenant.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {tenant.status === 'PENDING' && (
                        <Button 
                          onClick={() => handleStatusChange(tenant.id, 'ACTIVE')}
                          size="sm" 
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 pb-2">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-xl font-bold cursor-pointer gap-2">
                            <ExternalLink className="h-4 w-4" /> View Workspace
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tenant.status !== 'ACTIVE' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(tenant.id, 'ACTIVE')}
                              className="rounded-xl font-bold cursor-pointer gap-2 text-emerald-500"
                            >
                              <ShieldCheck className="h-4 w-4" /> Activate Tenant
                            </DropdownMenuItem>
                          )}
                          {tenant.status !== 'SUSPENDED' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(tenant.id, 'SUSPENDED')}
                              className="rounded-xl font-bold cursor-pointer gap-2 text-rose-500"
                            >
                              <Ban className="h-4 w-4" /> Suspend Tenant
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
