import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardHeader = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Branding */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-primary rounded-lg p-2">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">HealthCare Dashboard</h1>
              <p className="text-sm text-muted-foreground">{currentDate}</p>
            </div>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-muted-foreground">Current Time</p>
              <p className="text-sm font-medium text-foreground">{currentTime}</p>
            </div>

            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">Dr. Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">SJ</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
