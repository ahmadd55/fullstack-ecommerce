import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/users/me");

        setUser(response.data?.data || response.data);
      } catch (error) {
        console.log("Error fetching profile:", error);

        const status = error.response?.status;

        if (status === 401 || status === 403) {
          handleLogout();
        } else {
          setError(
            error.response?.data?.message ||
              "Could not load your profile. Please try again.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            Logout
          </button>
        </div>

        {user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                {user.firstName?.charAt(0) || ""}
                {user.lastName?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t pt-8">
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Phone Number
                </p>
                <p className="text-gray-900 font-medium">
                  {user.phone || "Not provided"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Account Role
                </p>
                <p className="text-gray-900 font-medium capitalize">
                  {user.role || "Customer"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            {error || "Profile data not available."}
          </p>
        )}
      </div>
    </div>
  );
}
