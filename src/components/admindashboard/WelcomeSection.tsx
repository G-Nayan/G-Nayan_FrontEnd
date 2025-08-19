import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Calendar, Activity } from "lucide-react";

const WelcomeSection = () => {
  return (
    <div className="mb-8">
      <Card className="bg-gradient-primary text-primary-foreground shadow-dashboard border-0">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1 mb-6 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Welcome back, Dr. admin
              </h1>
              <p className="text-primary-foreground/90 text-lg mb-4">
                Here's what's happening with your patients today
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>500 Total Patients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>12 Appointments Today</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>3 Urgent Cases</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20 font-medium"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 text-primary-foreground hover:bg-white/10 font-medium"
              >
                Quick Actions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeSection;
