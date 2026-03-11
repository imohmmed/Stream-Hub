import { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/50 mt-12 bg-black/40">
        <p>© {new Date().getFullYear()} StreamTV. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
