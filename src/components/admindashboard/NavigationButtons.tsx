import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserPlus, 
  BarChart3, 
  Settings, 
  Calendar,
  FileText,
  Activity,
  Shield
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

const ActionButton = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  variant = "secondary" 
}: ActionButtonProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
      <CardContent className="p-6" onClick={onClick}>
        <div className="flex items-start space-x-4">
          <div className={`
            p-3 rounded-lg 
            ${variant === "primary" 
              ? "bg-gradient-primary text-primary-foreground group-hover:shadow-md" 
              : "bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground"
            } 
            transition-all duration-200
          `}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NavigationButtons = () => {
  const actions = [
    {
      title: "Patient Records",
      description: "View and manage all patient data and medical histories",
      icon: Users,
      onClick: () => console.log("Navigate to patient records"),
      variant: "primary" as const
    },
    {
      title: "Add New Patient",
      description: "Register a new patient with complete medical information",
      icon: UserPlus,
      onClick: () => console.log("Navigate to add patient"),
      variant: "secondary" as const
    },
    {
      title: "Analytics Reports",
      description: "Detailed analytics and insights for healthcare metrics",
      icon: BarChart3,
      onClick: () => console.log("Navigate to analytics"),
      variant: "secondary" as const
    },
    {
      title: "Appointments",
      description: "Schedule and manage patient appointments",
      icon: Calendar,
      onClick: () => console.log("Navigate to appointments"),
      variant: "secondary" as const
    },
    {
      title: "Medical Records",
      description: "Access and update patient medical documentation",
      icon: FileText,
      onClick: () => console.log("Navigate to medical records"),
      variant: "secondary" as const
    },
    {
      title: "Health Monitoring",
      description: "Real-time patient health status and vital signs",
      icon: Activity,
      onClick: () => console.log("Navigate to monitoring"),
      variant: "secondary" as const
    },
    {
      title: "Security & Privacy",
      description: "HIPAA compliance and data security management",
      icon: Shield,
      onClick: () => console.log("Navigate to security"),
      variant: "secondary" as const
    },
    {
      title: "System Settings",
      description: "Configure system settings and user preferences",
      icon: Settings,
      onClick: () => console.log("Navigate to settings"),
      variant: "secondary" as const
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default NavigationButtons;
