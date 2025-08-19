import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Edit, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female";
  hospital: string;
  registrationDate: string;
  status: "New" | "Updated" | "Scheduled";
}

const mockRecentActivity: ActivityItem[] = [
  {
    id: "1",
    patientName: "Emily R.",
    age: 28,
    gender: "Female",
    hospital: "General Hospital",
    registrationDate: "2 hours ago",
    status: "New"
  },
  {
    id: "2",
    patientName: "Michael S.",
    age: 45,
    gender: "Male",
    hospital: "City Medical Center",
    registrationDate: "4 hours ago",
    status: "Updated"
  },
  {
    id: "3",
    patientName: "Sarah L.",
    age: 33,
    gender: "Female",
    hospital: "Regional Hospital",
    registrationDate: "6 hours ago",
    status: "New"
  },
  {
    id: "4",
    patientName: "David M.",
    age: 52,
    gender: "Male",
    hospital: "General Hospital",
    registrationDate: "8 hours ago",
    status: "Scheduled"
  },
  {
    id: "5",
    patientName: "Jennifer K.",
    age: 39,
    gender: "Female",
    hospital: "City Medical Center",
    registrationDate: "12 hours ago",
    status: "New"
  }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "New":
      return "default";
    case "Updated":
      return "secondary";
    case "Scheduled":
      return "outline";
    default:
      return "default";
  }
};

const getInitials = (name: string) => {
  const parts = name.split(" ");
  return parts.map(part => part[0]).join("").toUpperCase();
};

const RecentActivity = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Recent Activity
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Latest patient registrations and updates
            </p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {mockRecentActivity.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`
                p-6 border-b border-border last:border-b-0 
                hover:bg-muted/30 transition-colors duration-150
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-medium">
                      {getInitials(activity.patientName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">
                        {activity.patientName}
                      </h4>
                      <Badge variant={getStatusVariant(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{activity.age} years old • {activity.gender}</span>
                      <span>•</span>
                      <span>{activity.hospital}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{activity.registrationDate}</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
