import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Authmodel from "@/components/(auth)/Model/page";
import { useNavigate } from "react-router-dom";
interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile_number: string;
  role: string;
  hospital_name?: string | null;
  tenant_id: string;
  created_at: string;
  password_last_updated: string;
}

const apiBase = import.meta.env.VITE_API_BASE;

const WelcomeSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken")
    );
  };
  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("authToken");
      navigate("/"); // redirect to home
      throw new Error("No token found");
    }


    fetch(`${apiBase}/Get_patient_Clinical_and_PREDICTION_data/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("🔹 Fetch response status:", res.status);
        return res.json();
      })
      .then((data: any) => {
        console.log("🔹 Raw Profile API response:", data);
        setUser(data);
      })
      .catch((err) => console.error("❌ Fetch user failed:", err));
  }, []);


  return (
    <div className="mb-8">
      <Card className="bg-gradient-blue text-blue-foreground shadow-dashboard border-0">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1 mb-6 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Welcome back, {user ? user.username : "Loading..."}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <Button
                variant="secondary"
                className="text-blue-foreground border-white/20 font-medium bg-blue-600 text-white hover:bg-blue-700"
                onClick={openModal}
              >
                Create Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Authmodel onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
