import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function DashboardLayout({ role, children }: { role: "student" | "recruiter"; children: ReactNode }) {
  const navigate = useNavigate();
  
  const { data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => api.get('/auth/me')
  });

  const name = user ? (role === "student" ? `${user.firstName} ${user.lastName}` : user.recruiterName) : "";
  const initials = user ? (role === "student" ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : `${user.recruiterName?.[0] || ""}`) : "";
  
  const accent = role === "student" ? "bg-gradient-primary" : "bg-gradient-to-br from-info to-primary";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border px-4 sm:px-6 glass sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-4">
              {name && <span className="text-sm font-medium hidden sm:inline-block">Welcome, <span className="text-primary">{name}</span></span>}
              <div className={`h-9 w-9 rounded-full ${accent} flex items-center justify-center text-sm font-semibold text-primary-foreground shadow-glow uppercase`}>
                {initials || (role === "student" ? "ST" : "HR")}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                Sign Out
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
