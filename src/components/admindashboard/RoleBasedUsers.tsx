import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  mobile_number: string;
  email: string;
  role: string;
  hospital_name: string | null;
  created_at: string;
}

const RoleBasedUsers: React.FC<{ role: string }> = ({ role }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken")
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
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
          `http://localhost:8000/admin/users?role=${role}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  if (loading) return <p>Loading {role} users...</p>;

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 capitalize">{role} Users</h2>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Mobile</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Hospital</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">
                  {u.first_name} {u.last_name}
                </td>
                <td className="p-2 border">{u.username}</td>
                <td className="p-2 border">{u.mobile_number}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.hospital_name || "N/A"}</td>
                <td className="p-2 border">
                  {new Date(u.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                No {role} users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleBasedUsers;
