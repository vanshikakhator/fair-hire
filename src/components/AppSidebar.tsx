import { Briefcase, FileText, Sparkles, User, LayoutDashboard, Users, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const studentItems = [
  { title: "Browse Jobs", url: "/student", icon: Briefcase },
  { title: "My Applications", url: "/student/applications", icon: FileText },
  { title: "AI Resume Help", url: "/student/resume", icon: Sparkles },
  { title: "My Profile", url: "/student/profile", icon: User },
];

const recruiterItems = [
  { title: "Dashboard", url: "/recruiter", icon: LayoutDashboard },
  { title: "Candidates", url: "/recruiter/candidates", icon: Users },
  { title: "Analytics", url: "/recruiter/analytics", icon: BarChart3 },
  { title: "Company Profile", url: "/recruiter/profile", icon: User },
];

export function AppSidebar({ role }: { role: "student" | "recruiter" }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const items = role === "student" ? studentItems : recruiterItems;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className={cn("flex h-16 items-center px-4 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        {collapsed ? <Logo size="sm" /> : <Logo />}
      </div>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-11">
                      <NavLink
                        to={item.url}
                        end
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 transition-all",
                          active
                            ? "bg-primary/15 text-primary font-medium shadow-glow"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
