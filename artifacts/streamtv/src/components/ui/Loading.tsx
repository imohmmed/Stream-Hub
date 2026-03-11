import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl bg-primary/30 animate-pulse" />
          <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
        </div>
        <p className="text-xl font-bold text-foreground tracking-widest animate-pulse">
          StreamTV
        </p>
      </motion.div>
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return <Loader2 className={`w-6 h-6 text-primary animate-spin ${className || ""}`} />;
}
