import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  GraduationCap, 
  Calendar, 
  Settings,
  Menu,
  X,
  BookOpenText,
  MapPinCheck

} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Faculty", href: "/faculty", icon: Users },
  { label: "Students", href: "/students", icon: GraduationCap },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Map", href: "/map", icon: MapPinCheck },
  { label: "About", href: "/about", icon: BookOpenText },
  { label: "Admin", href: "/admin", icon: Settings },
];

export function Navigation() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-50">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <GraduationCap className="h-6 w-6" />
          <span>SchoolSys</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
            <div className="h-full flex flex-col bg-background">
              <div className="p-6 border-b">
                <h2 className="font-display font-bold text-2xl text-primary flex items-center gap-2">
                  <GraduationCap className="h-8 w-8" />
                  SchoolSys
                </h2>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                    <div className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                      location === item.href 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}>
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
        <div className="p-8">
          <h2 className="font-display font-bold text-2xl text-primary flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            SchoolSys
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium cursor-pointer",
                location === item.href 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
              )}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t text-xs text-muted-foreground text-center">
          v1.0.0 School System
        </div>
      </div>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/20">
      <Navigation />
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
