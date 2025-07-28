import { motion } from "framer-motion";
import { 
  Building, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Target,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface JobApplication {
  _id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'in_review' | 'interview' | 'technical_test' | 'offer' | 'rejected' | 'withdrawn' | 'ghosted';
  applicationDate: string;
  jobDetails?: {
    url?: string;
  };
  notes?: string;
  location?: 'on_campus' | 'off_campus';
  daysSinceApplication?: number;
}

interface ModernJobCardProps {
  application: JobApplication;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: JobApplication['status']) => void;
  index?: number;
}

const statusIcons = {
  applied: Clock,
  in_review: AlertCircle,
  interview: Users,
  technical_test: Target,
  offer: CheckCircle,
  rejected: XCircle,
  withdrawn: XCircle,
  ghosted: AlertCircle,
};

const statusColors = {
  applied: "text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  in_review: "text-yellow-500 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  interview: "text-purple-500 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
  technical_test: "text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
  offer: "text-green-500 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  rejected: "text-red-500 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  withdrawn: "text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800",
  ghosted: "text-red-400 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
};

const priorityColors = {
  applied: "border-l-blue-500",
  in_review: "border-l-yellow-500",
  interview: "border-l-purple-500",
  technical_test: "border-l-orange-500",
  offer: "border-l-green-500",
  rejected: "border-l-red-500",
  withdrawn: "border-l-gray-500",
  ghosted: "border-l-red-400",
};

export function ModernJobCard({ 
  application, 
  onView, 
  onEdit, 
  onDelete, 
  onStatusChange,
  index = 0 
}: ModernJobCardProps) {
  const StatusIcon = statusIcons[application.status];
  const statusColor = statusColors[application.status];
  const priorityColor = priorityColors[application.status];
  
  const daysSince = application.daysSinceApplication || 
    Math.floor((Date.now() - new Date(application.applicationDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24 
      }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className={cn(
        "glass-card border-0 border-l-4 transition-all duration-300",
        "hover:shadow-elevated hover:scale-[1.02]",
        "cursor-pointer relative overflow-hidden",
        priorityColor
      )}>
        {/* Background gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <motion.h3 
                className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors"
                layoutId={`title-${application._id}`}
              >
                {application.jobTitle}
              </motion.h3>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  variant="outline" 
                  className={cn("capitalize", statusColor)}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {application.status.replace('_', ' ')}
                </Badge>
                
                {daysSince <= 7 && (
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onView && (
                  <DropdownMenuItem onClick={onView}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Company and Date Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <Building className="h-4 w-4" />
              <span className="font-medium">{application.company}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="h-4 w-4" />
              <span>{new Date(application.applicationDate).toLocaleDateString()}</span>
            </motion.div>
            
            {application.location && (
              <motion.div 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="h-4 w-4" />
                <span className="capitalize">{application.location.replace('_', ' ')}</span>
              </motion.div>
            )}
          </div>
          
          {/* Notes Preview */}
          {application.notes && (
            <motion.p 
              className="text-sm text-muted-foreground line-clamp-2 mb-4"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              {application.notes}
            </motion.p>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {daysSince === 0 ? 'Today' : `${daysSince} days ago`}
              </span>
              
              {application.jobDetails?.url && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    asChild 
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  >
                    <a 
                      href={application.jobDetails.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>
            
            {/* Quick Status Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {application.status === 'applied' && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange?.('in_review');
                    }}
                  >
                    Mark In Review
                  </Button>
                </motion.div>
              )}
              
              {application.status === 'in_review' && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange?.('interview');
                    }}
                  >
                    Interview
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}