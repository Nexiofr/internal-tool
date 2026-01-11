import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Mail, Users, Database, BarChart3, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { EmailCase, WaitlistRequest } from "@shared/schema";

export function AppSidebar() {
  const [location] = useLocation();

  const { data: emails = [] } = useQuery<EmailCase[]>({
    queryKey: ["/api/emails"],
  });

  const { data: waitlist = [] } = useQuery<WaitlistRequest[]>({
    queryKey: ["/api/waitlist"],
  });

  const newEmailsCount = emails.filter((e) => e.status === "new").length;
  const activeWaitlistCount = waitlist.filter((w) => w.status === "waiting").length;

  const navigationItems = [
    {
      title: "À répondre",
      url: "/",
      icon: Mail,
      badge: newEmailsCount,
    },
    {
      title: "Liste d'attente",
      url: "/waitlist",
      icon: Users,
      badge: activeWaitlistCount,
    },
    {
      title: "Base IA",
      url: "/knowledge",
      icon: Database,
    },
    {
      title: "Statistiques",
      url: "/statistics",
      icon: BarChart3,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-bold">AC</span>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">AutoConcession</span>
              <span className="text-xs text-muted-foreground">Gestion interne</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url} data-testid={`nav-${item.url.replace("/", "") || "inbox"}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge 
                            variant="secondary" 
                            className="ml-auto text-xs group-data-[collapsible=icon]:hidden"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Paramètres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Paramètres">
                  <Link href="/settings" data-testid="nav-settings">
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">Jean Dupont</span>
            <span className="text-xs text-muted-foreground">Vendeur</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
