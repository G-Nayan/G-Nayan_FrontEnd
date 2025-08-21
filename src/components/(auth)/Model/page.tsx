// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "react-hot-toast";

// interface CreateAdminCardProps {
//   onClose: () => void;
// }

// export default function CreateAdminCard({ onClose }: CreateAdminCardProps) {
//   const [form, setForm] = useState({
//     id: 0,
//     username: "",
//     email: "",
//     password: "",
//     role: "",
//     created_at: new Date().toISOString(),
//     password_last_updated: new Date().toISOString(),
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const newErrors: { [key: string]: string } = {};
//     if (!form.username.trim()) newErrors.username = "Username is required";
//     if (!form.email.includes("@")) newErrors.email = "Invalid email";
//     if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
//     if (!form.role) newErrors.role = "Role is required";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_BASE}/admin/create-user`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (!res.ok) throw new Error("Failed to create admin");
//       toast.success("Admin created successfully!");
//       setForm({
//         id: 0,
//         username: "",
//         email: "",
//         password: "",
//         role: "",
//         created_at: new Date().toISOString(),
//         password_last_updated: new Date().toISOString(),
//       });
//       setErrors({});
//       onClose(); // close modal after success
//     } catch (err: any) {
//       toast.error(err.message || "Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-start p-6">
//       <Card className="w-full shadow-xl border rounded-xl relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg"
//         >
//           ×
//         </button>
//         <CardHeader>
//           <CardTitle className="text-2xl font-semibold">Create Admin</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-1">
//               <Label htmlFor="username">Username</Label>
//               <Input id="username" name="username" value={form.username} onChange={handleChange} />
//               {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" name="email" value={form.email} onChange={handleChange} />
//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//             </div>
//             <div className="space-y-1 relative">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={form.password}
//                 onChange={handleChange}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//               {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="role">Role</Label>
//               <select
//                 id="role"
//                 name="role"
//                 value={form.role}
//                 onChange={handleChange}
//                 className="w-full border rounded-md p-2"
//               >
//                 <option value="">Select role</option>
//                 <option value="admin">Admin</option>
//               </select>
//               {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
//             </div>
//             <Button type="submit" className="w-full bg-blue-600 text-white" disabled={isSubmitting}>
//               {isSubmitting ? "Creating..." : "Create Admin"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CreateAdminCardProps {
  onClose: () => void;
}

export default function CreateAdminCard({ onClose }: CreateAdminCardProps) {
  const [form, setForm] = useState({
    id: 0,
    username: "",
    email: "",
    password: "",
    role: "",
    created_at: new Date().toISOString(),
    password_last_updated: new Date().toISOString(),
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.includes("@")) newErrors.email = "Invalid email";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.role) newErrors.role = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const getAuthToken = () => {
      return (
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("authToken")
      );
    };

    try {
      const token = getAuthToken();

      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("authToken");
        navigate("/"); // redirect to home
        throw new Error("No token found");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/admin/create-user`,

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed to create admin");
      toast.success("Admin created successfully!");
      setForm({
        id: 0,
        username: "",
        email: "",
        password: "",
        role: "",
        created_at: new Date().toISOString(),
        password_last_updated: new Date().toISOString(),
      });
      setErrors({});
      onClose(); // closes modal after success
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start p-6 w-full max-w-lg ">
      <Card className="w-full shadow-xl border rounded-xl relative bg-white/80 backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg"
        >
          ×
        </button>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Create Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="username"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="space-y-1 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
