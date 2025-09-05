import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, BarChart3, FileText } from "lucide-react";
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
  variant = "secondary",
}: ActionButtonProps) => {
  return (
    <Card
      className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div
            className={`
              p-3 rounded-lg transition-all duration-200
              ${
                variant === "primary"
                  ? "bg-blue-600 text-white group-hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 group-hover:bg-blue-600 group-hover:text-white"
              }
            `}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NavigationButtons = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Patient Records",
      description: "View and manage all patient data and medical histories",
      icon: Users,
      onClick: () => window.open("/patient-records", "_blank"),
      variant: "secondary" as const,
    },
    {
      title: "Add New Patient",
      description: "Register a new patient with complete medical information",
      icon: UserPlus,
      onClick: () => window.open("/register-patient", "_blank"),

      variant: "secondary" as const,
    },
    {
      title: "Analytics Reports",
      description: "Detailed analytics and insights for healthcare metrics",
      icon: BarChart3,
      onClick: () => navigate("/analytics"),
      variant: "secondary" as const,
    },
    {
      title: "Medical Records",
      description: "Access and update patient medical documentation",
      icon: FileText,
      onClick: () => window.open("patient-search", "_blank"),
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default NavigationButtons;
