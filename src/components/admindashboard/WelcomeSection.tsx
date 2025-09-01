// import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { TrendingUp, Users, Calendar, Activity } from "lucide-react";
// import Authmodel from "@/components/(auth)/Model/page"; // your modal component

// const WelcomeSection = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <div className="mb-8">
//       <Card className="bg-gradient-blue text-blue-foreground shadow-dashboard border-0">
//         <CardContent className="p-8">
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
//             <div className="flex-1 mb-6 lg:mb-0">
//               <h1 className="text-3xl lg:text-4xl font-bold mb-2">
//                 Welcome back, Dr. admin
//               </h1>
//               <p className="text-blue-foreground/90 text-lg mb-4">
//                 Here's what's happening with your patients today
//               </p>
//               <div className="flex flex-wrap gap-4 text-sm">
//                 <div className="flex items-center space-x-2">
//                   <Users className="h-5 w-5" />
//                   <span>500 Total Patients</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Calendar className="h-5 w-5" />
//                   <span>12 Appointments Today</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Activity className="h-5 w-5" />
//                   <span>3 Urgent Cases</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col space-y-3">
//               {/* <Button 
//                   variant="secondary" 
//                   className="bg-white/10 hover:bg-white/20 text-blue-foreground border-white/20 font-medium"
//                 >
//                   <TrendingUp className="h-4 w-4 mr-2" />
//                   View Analytics
//                 </Button> */}
//               <Button
//                 variant="secondary"
//                 className="text-blue-foreground border-white/20 font-medium bg-blue-600 text-white hover:bg-blue-700"
//                 onClick={openModal}
//               >
//                 Create Admin
//               </Button>
//               <Button
//                 variant="outline"
//                 className="border-white/30 text-blue-foreground hover:bg-white/10 font-medium"
//               >
//                 Quick Actions
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Render the modal */}

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
//           <Authmodel onClose={closeModal} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default WelcomeSection;



import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Activity } from "lucide-react";
import Authmodel from "@/components/(auth)/Model/page"; // modal

type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile_number: string;
  role: string;
  hospital_name?: string | null;
  created_at: string;
};

const WelcomeSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ✅ Fetch logged-in user details from API
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // stored after login
    if (!token) return;

    fetch("http://localhost:8000/admin/users?role=admin", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: User[]) => {
        if (data && data.length > 0) {
          // Assuming you want the first admin (logged-in one)
          setUser(data[0]);
        }
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
                Welcome back, {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
              </h1>
              {/* <p className="text-blue-foreground/90 text-lg mb-4">
                Role: {user?.role} | Email: {user?.email}
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
              </div> */}
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
              {/* <Button
                variant="outline"
                className="border-white/30 text-blue-foreground hover:bg-white/10 font-medium"
              >
                Quick Actions
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <Authmodel onClose={closeModal} />
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
