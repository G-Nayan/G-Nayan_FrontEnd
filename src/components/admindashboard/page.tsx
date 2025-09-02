import React, { useEffect, useState } from "react";
import WelcomeSection from "@/components/admindashboard/WelcomeSection";
import StatsCard from "@/components/admindashboard/StatsCard";
import ChartsSection from "@/components/admindashboard/ChartsSection";
import NavigationButtons from "@/components/admindashboard/NavigationButtons";
import RoleBasedUsers from "@/components/admindashboard/RoleBasedUsers";
import { useNavigate } from "react-router-dom";

import {
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  Heart,
  Shield,
} from "lucide-react";

const Index = () => {
  const [totalPatients, setTotalPatients] = useState<number | null>(null);
  const navigate = useNavigate();
  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken")
    );
  };
  // useEffect(() => {
  //   const token = getAuthToken();

  //   if (!token) {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("access_token");
  //     localStorage.removeItem("authToken");
  //     navigate("/"); // redirect to home
  //     throw new Error("No token found");
  //   }
  //   const fetchPatientsCount = async () => {
  //     try {
  //       const res = await fetch(
  //         "http://localhost:8000/analytics/patients/count",
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //             "ngrok-skip-browser-warning": "true",
  //           },
  //         }
  //       );

  //       if (!res.ok) {
  //         throw new Error(`HTTP error! Status: ${res.status}`);
  //       }

  //       const data = await res.json();
  //       setTotalPatients(data.total_patients);
  //     } catch (error) {
  //       console.error("Error fetching patients count:", error);
  //     }
  //   };

  //   fetchPatientsCount();
  // }, []);

  const statsData = [
    {
      title: "Total Patients",
      // value: totalPatients !== null ? totalPatients.toString() : "...",
      value: "92",
      description: "Registered in system",
      icon: Users,
      //  trend: { value: "12", isPositive: true },
      variant: "default" as const,
    },
    {
      title: "New This Month",
      value: "92",
      description: "Patient registrations",
      icon: UserPlus,
      trend: { value: "8%", isPositive: true },
      variant: "success" as const,
    },
    // {
    //   title: "Appointments Today",
    //   value: "12",
    //   description: "Scheduled consultations",
    //   icon: Calendar,
    //   trend: { value: "3", isPositive: true },
    //   variant: "info" as const,
    // },
    {
      title: "Average Age",
      value: "42",
      description: "Years across all patients",
      icon: TrendingUp,
      variant: "default" as const,
    },
    // {
    //   title: "Critical Cases",
    //   value: "3",
    //   description: "Requiring immediate attention",
    //   icon: Heart,
    //   trend: { value: "2", isPositive: false },
    //   variant: "warning" as const,
    // },
    // {
    //   title: "System Health",
    //   value: "99.9%",
    //   description: "Uptime this month",
    //   icon: Shield,
    //   trend: { value: "0.1%", isPositive: true },
    //   variant: "success" as const,
    // },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        {/*<ChartsSection />  */}

        {/* Navigation Buttons */}
        <NavigationButtons />

        <div className="mt-10">
          <RoleBasedUsers role="Superadmin" />
        </div>

        <div className="mt-10">
          <RoleBasedUsers role="client" />
        </div>


      </main>
    </div>
  );
};

export default Index;
