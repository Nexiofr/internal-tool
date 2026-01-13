import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import NotFound from "@/pages/not-found";
import InboxPage from "@/pages/inbox";
import WaitlistPage from "@/pages/waitlist";
import KnowledgePage from "@/pages/knowledge";
import StatisticsPage from "@/pages/statistics";
import SettingsPage from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={InboxPage} />
      <Route path="/waitlist" component={WaitlistPage} />
      <Route path="/knowledge" component={KnowledgePage} />
      <Route path="/statistics" component={StatisticsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="dealership-theme">
        <TooltipProvider>
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between h-12 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-hidden">
                  <Router />
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
