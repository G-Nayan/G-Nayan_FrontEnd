import React from "react";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import WelcomeSection from "@/components/admindashboard/WelcomeSection";
import StatsCard from "@/components/admindashboard/StatsCard";
import ChartsSection from "@/components/admindashboard/ChartsSection";
import NavigationButtons from "@/components/admindashboard/NavigationButtons";
import RecentActivity from "@/components/admindashboard/RecentActivity";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  Heart,
  Shield
} from "lucide-react";

const Index = () => {
  // Mock data for stats cards
  const statsData = [
    {
      title: "Total Patients",
      value: "500",
      description: "Registered in system",
      icon: Users,
      trend: { value: "12%", isPositive: true },
      variant: "default" as const
    },
    {
      title: "New This Month",
      value: "92", 
      description: "Patient registrations",
      icon: UserPlus,
      trend: { value: "8%", isPositive: true },
      variant: "success" as const
    },
    {
      title: "Appointments Today",
      value: "12",
      description: "Scheduled consultations",
      icon: Calendar,
      trend: { value: "3", isPositive: true },
      variant: "info" as const
    },
    {
      title: "Average Age",
      value: "42",
      description: "Years across all patients",
      icon: TrendingUp,
      variant: "default" as const
    },
    {
      title: "Critical Cases",
      value: "3",
      description: "Requiring immediate attention",
      icon: Heart,
      trend: { value: "2", isPositive: false },
      variant: "warning" as const
    },
    {
      title: "System Health",
      value: "99.9%",
      description: "Uptime this month",
      icon: Shield,
      trend: { value: "0.1%", isPositive: true },
      variant: "success" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* <DashboardHeader /> */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />
        
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <ChartsSection />
        
        {/* Navigation Buttons */}
        <NavigationButtons />
        
        {/* Recent Activity */}
        <RecentActivity />
      </main>
    </div>
  );
};

export default Index;