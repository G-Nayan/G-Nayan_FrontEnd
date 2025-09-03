import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  mobile_number: string;
  email: string;
  role: string;
  hospital_name: string;
  tenant_id: string;
  created_at: string;
  password_last_updated: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [original, setOriginal] = useState<UserProfile | null>(null); // for cancel
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);

  const getAuthToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("authToken");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("No token found");

        const res = await fetch(
          "http://localhost:8000/Get_patient_Clinical_and_PREDICTION_data/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
        const data = await res.json();
        setProfile(data);
        setOriginal(data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // No update API yet — placeholder behavior
    toast.success("Save not implemented on backend — preview only.");
    setEditing(false);
    // keep the profile state as-is so UI reflects changes until actual save implemented
  };

  const handleCancel = () => {
    setProfile(original);
    setEditing(false);
  };

  const handleCopyTenant = () => {
    if (!profile?.tenant_id) return;
    navigator.clipboard
      .writeText(profile.tenant_id)
      .then(() => toast.success("Tenant ID copied"))
      .catch(() => toast.error("Copy failed"));
  };

  const initials = (p?: UserProfile) => {
    if (!p) return "U";
    const a = (p.first_name || "").trim();
    const b = (p.last_name || "").trim();
    if (!a && !b) return (p.username || "U").charAt(0).toUpperCase();
    return `${a.charAt(0) || ""}${b.charAt(0) || ""}`.toUpperCase();
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center mt-10 text-red-500">No profile data found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 py-8 mb-10">
      {/* Header / actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">My Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account details
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!editing ? (
            <Button variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: avatar & meta */}
        <aside className="flex flex-col items-center gap-4">
          <div
            aria-hidden
            className="flex items-center justify-center w-28 h-28 rounded-full bg-slate-700 text-white text-3xl font-semibold"
          >
            {initials(profile)}
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium">
              {profile.first_name} {profile.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>

          <div className="w-full bg-white/5 rounded-md p-3 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Role</span>
              <span className="text-sm font-medium capitalize">{profile.role}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Hospital</span>
              <span className="text-sm max-w-xs text-right">
                {profile.hospital_name || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tenant ID</span>
              <div className="flex items-center gap-2">
                <code className="text-xs truncate max-w-[10rem]">{profile.tenant_id}</code>
                <button
                  onClick={handleCopyTenant}
                  className="text-xs underline text-muted-foreground"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* <div className="text-xs text-muted-foreground">
            <div>Created: {new Date(profile.created_at).toLocaleString()}</div>
            <div>Pwd updated: {new Date(profile.password_last_updated).toLocaleString()}</div>
          </div> */}
        </aside>

        {/* Right: form fields */}
        <main className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={profile.first_name || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={profile.last_name || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={profile.username || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email || ""} disabled />
            </div>

            <div>
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input
                id="mobile_number"
                name="mobile_number"
                value={profile.mobile_number || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={profile.role || ""} disabled />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="hospital_name">Hospital Name</Label>
              <Input
                id="hospital_name"
                name="hospital_name"
                value={profile.hospital_name || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          {/* optional help text */}
          {/* <div className="mt-6 text-sm text-muted-foreground">
            <p>
              Changes are local only — saving is not implemented because the backend endpoint is not available.
            </p>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default Profile;
