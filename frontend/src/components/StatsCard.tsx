import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const variantStyles = {
  default: {
    icon: 'text-primary bg-primary-glow',
    card: 'border-border'
  },
  success: {
    icon: 'text-success bg-success-light',
    card: 'border-success/20 bg-success/5'
  },
  warning: {
    icon: 'text-warning bg-warning-light',
    card: 'border-warning/20 bg-warning/5'
  },
  destructive: {
    icon: 'text-destructive bg-destructive/10',
    card: 'border-destructive/20 bg-destructive/5'
  }
};

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = 'default' 
}: StatsCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <Card className={`${styles.card} transition-all duration-200 hover:shadow-card`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${styles.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          {description && <span>{description}</span>}
          {trend && (
            <span className={trend.isPositive ? 'text-success' : 'text-destructive'}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}