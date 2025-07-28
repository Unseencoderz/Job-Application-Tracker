import { motion } from "framer-motion";
import { ModernSidebar } from "./ModernSidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-subtle overflow-hidden">
      <ModernSidebar />
      
      {/* Main Content */}
      <motion.main
        className={cn(
          "flex-1 overflow-auto",
          "ml-[280px]", // Adjusted for open sidebar
          "bg-gradient-subtle",
          className
        )}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="min-h-full">
          {children}
        </div>
      </motion.main>
    </div>
  );
}