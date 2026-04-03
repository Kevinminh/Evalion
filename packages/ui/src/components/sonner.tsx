import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-card border-border text-foreground shadow-lg",
          error: "text-destructive",
        },
      }}
    />
  );
}
