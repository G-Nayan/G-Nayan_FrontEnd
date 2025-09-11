
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "info";
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  variant = "default" 
}: StatsCardProps) => {
  const variantStyles = {
    default: "bg-gradient-card border-border",
    success: "bg-gradient-success border-healthcare-success/20",
    warning: "bg-gradient-to-br from-healthcare-warning/10 to-healthcare-warning/5 border-healthcare-warning/20",
    info: "bg-gradient-to-br from-healthcare-info/10 to-healthcare-info/5 border-healthcare-info/20"
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-healthcare-success",
    warning: "text-healthcare-warning",
    info: "text-healthcare-info"
  };

  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-200", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <div className="flex items-baseline space-x-2 mt-2">
              <h3 className="text-3xl font-bold text-foreground">
                {value}
              </h3>
              {trend && (
                <span 
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive ? "text-healthcare-success" : "text-destructive"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg bg-background/50", iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
