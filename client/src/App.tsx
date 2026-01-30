import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InstallPrompt } from "@/components/InstallPrompt";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Faculty from "@/pages/Faculty";
import Students from "@/pages/Students";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import Admin from "@/pages/Admin";
import About from "@/pages/About";
import Map from "@/pages/Map";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/faculty" component={Faculty} />
      <Route path="/students" component={Students} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/map" component={Map} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <InstallPrompt />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
