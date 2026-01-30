import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if app is already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    };
    
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <ToastProvider>
      <Toast open={showPrompt} onOpenChange={setShowPrompt} className="bg-primary text-primary-foreground border-none">
        <div className="flex items-center gap-4">
          <div className="grid gap-1">
            <ToastTitle>Install App</ToastTitle>
            <ToastDescription>
              Install for a better experience
            </ToastDescription>
          </div>
          <Button onClick={handleInstall} variant="secondary" size="sm" className="ml-auto gap-2">
            <Download className="h-4 w-4" />
            Install
          </Button>
        </div>
        <ToastClose className="text-primary-foreground hover:text-primary-foreground/80" />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
