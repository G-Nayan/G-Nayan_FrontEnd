import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Hospital } from "lucide-react";

interface CreateAdminCardProps {
  onClose: () => void;
}

export default function CreateAdminCard({ onClose }: CreateAdminCardProps) {
  const [form, setForm] = useState({
    id: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    password: "",
    confirm_password: "",
    role: "",
    created_at: new Date().toISOString(),
    password_last_updated: new Date().toISOString(),
    hospital_name: "",
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
    if (!form.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.mobile_number.trim())
      newErrors.mobile_number = "Mobile number is required";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match";
    if (!form.role) newErrors.role = "Role is required";
    if (!form.hospital_name)
      newErrors.hospital_name = "Hospital name is required";
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
        navigate("/");
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

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.detail?.[0]?.msg || "Failed to create admin");
      }

      toast.success("Admin created successfully!");
      setForm({
        id: 0,
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        mobile_number: "",
        password: "",
        confirm_password: "",
        role: "",
        created_at: new Date().toISOString(),
        password_last_updated: new Date().toISOString(),
        hospital_name: "",
      });
      setErrors({});
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start p-6 w-full max-w-4xl">
      <Card className="w-full shadow-xl border rounded-2xl relative bg-white/90 backdrop-blur-md">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        {/* Header */}
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Create Admin
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
          >
            {/* Left column */}
            <div className="space-y-4">
              {/* Username */}
              <div>
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

              {/* First Name */}
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="First name"
                  value={form.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm">{errors.last_name}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input
                  id="mobile_number"
                  name="mobile_number"
                  placeholder="Mobile number"
                  value={form.mobile_number}
                  onChange={handleChange}
                />
                {errors.mobile_number && (
                  <p className="text-red-500 text-sm">{errors.mobile_number}</p>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Email */}
              <div>
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

              {/* Password */}
              <div className="relative">
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
                  className="absolute right-3 top-8 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="confirm password"
                  type={showPassword ? "text" : "password"}
                  value={form.confirm_password}
                  onChange={handleChange}
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm">
                    {errors.confirm_password}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select role</option>
                  <option value="Client">Client</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>

              <div>
                <Label htmlFor="Hospital">Hospital</Label>
                <Input
                  id="hospital_name"
                  name="hospital_name"
                  placeholder="hospital_name"
                  value={form.hospital_name}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.hospital_name}</p>
                )}
              </div>
            </div>

            {/* Submit spans both columns */}
            <div className="col-span-1 md:col-span-2">
              <Button
                type="submit"
                // className="w-full bg-blue-600 text-white"
                className="w-full text-blue-foreground border-white/20 font-medium bg-blue-600 text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
