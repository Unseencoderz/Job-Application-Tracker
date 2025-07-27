import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, Calendar, ExternalLink, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface JobApplication {
  id: string;
  title: string;
  company: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  url?: string;
  notes?: string;
}

interface JobCardProps {
  application: JobApplication;
  onStatusChange: (id: string, status: JobApplication['status']) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  applied: { 
    variant: 'pending' as const, 
    label: 'Applied',
    color: 'bg-pending-light text-pending'
  },
  interview: { 
    variant: 'warning' as const, 
    label: 'Interview',
    color: 'bg-warning-light text-warning'
  },
  offer: { 
    variant: 'success' as const, 
    label: 'Offer',
    color: 'bg-success-light text-success'
  },
  rejected: { 
    variant: 'destructive' as const, 
    label: 'Rejected',
    color: 'bg-destructive/10 text-destructive'
  }
};

export function JobCard({ application, onStatusChange, onEdit, onDelete }: JobCardProps) {
  const config = statusConfig[application.status];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-none tracking-tight">
              {application.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">{application.company}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={config.color}>
              {config.label}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(application.id)}>
                  Edit Application
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(application.id)} className="text-destructive">
                  Delete Application
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Applied {formatDate(application.appliedDate)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {application.url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={application.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View Job
                </a>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <DropdownMenuItem 
                    key={status} 
                    onClick={() => onStatusChange(application.id, status as JobApplication['status'])}
                    disabled={application.status === status}
                  >
                    <Badge variant="outline" className={`mr-2 ${config.color}`}>
                      {config.label}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {application.notes && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {application.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}