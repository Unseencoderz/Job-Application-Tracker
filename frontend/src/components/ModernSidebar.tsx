import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  FileText,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth";
import { ThemeToggle } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  isActive?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Briefcase,
    label: "Applications",
    path: "/applications",
    badge: 3,
  },
  {
    icon: TrendingUp,
    label: "Analytics",
    path: "/analytics",
  },
  {
    icon: FileText,
    label: "Documents",
    path: "/documents",
  },
  {
    icon: Bell,
    label: "Notifications",
    path: "/notifications",
    badge: 2,
  },
  {
    icon: User,
    label: "Profile",
    path: "/profile",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

const sidebarVariants = {
  open: {
    width: "280px",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
  closed: {
    width: "80px",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const contentVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      duration: 0.2,
    },
  },
  closed: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.1,
    },
  },
};

interface ModernSidebarProps {
  className?: string;
}

export function ModernSidebar({ className }: ModernSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const getUserInitials = () => {
    if (user?.profile.firstName && user?.profile.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
    }
    return user?.username[0]?.toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (user?.profile.firstName && user?.profile.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user?.username || 'User';
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen glass-card border-r border-border/50",
        "flex flex-col bg-gradient-glass backdrop-blur-xl",
        className
      )}
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      initial="open"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                JobTracker
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-primary/10 transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.div>
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border/50">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={user?.profile?.avatar} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11 transition-all duration-200",
                  isActive 
                    ? "bg-gradient-primary shadow-glow text-primary-foreground" 
                    : "hover:bg-primary/10 hover:shadow-soft",
                  !isOpen && "justify-center px-0"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary-foreground")} />
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      variants={contentVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="flex-1 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant={isActive ? "secondary" : "default"}
                          className="h-5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {isOpen && (
              <motion.span
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="text-xs text-muted-foreground"
              >
                Theme
              </motion.span>
            )}
          </AnimatePresence>
          <ThemeToggle />
        </div>
        
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10",
            !isOpen && "justify-center px-0"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="text-sm font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.aside>
  );
}