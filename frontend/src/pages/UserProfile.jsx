import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
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

        const [profileResult, addressResult] = await Promise.allSettled([
          api.get("/users/me"),
          api.get("/addresses"),
        ]);

        if (profileResult.status === "rejected") {
          throw profileResult.reason;
        }

        const profileResponse = profileResult.value;
        setUser(profileResponse.data?.data || profileResponse.data);

        if (addressResult.status === "fulfilled") {
          const addressResponse = addressResult.value;
          const addresses =
            addressResponse.data?.data || addressResponse.data || [];

          setAddress(Array.isArray(addresses) ? addresses[0] : addresses);
        }
      } catch (err) {
        console.log("Error fetching profile:", err);

        const status = err.response?.status;

        if (status === 401 || status === 403) {
          handleLogout();
        } else {
          setError(
            err.response?.data?.message ||
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

  const addressLines = address
    ? [
        address.addressLine1,
        address.addressLine2,
        [address.city, address.state].filter(Boolean).join(", "),
        address.postalCode,
        address.country,
      ].filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto px-5 pt-28 pb-16 min-h-screen">
        <p className="text-[rgba(0,0,0,0.56)]">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-5 pt-28 pb-20 min-h-screen">
      <div className="flex items-end justify-between border-b border-[#E2E2E2] pb-4 mb-10">
        <h1 className="text-3xl font-normal tracking-tight">Profile</h1>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-[rgba(0,0,0,0.56)] hover:text-black transition-colors underline underline-offset-4"
        >
          Logout
        </button>
      </div>

      {!user ? (
        <p className="text-[rgba(0,0,0,0.56)]">
          {error || "Profile data not available."}
        </p>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-full bg-[#F4F4F4] text-[rgba(0,0,0,0.72)] flex items-center justify-center text-lg font-medium uppercase">
              {user.firstName?.charAt(0) || ""}
              {user.lastName?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-lg font-medium">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-[rgba(0,0,0,0.56)]">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section>
              <div className="flex items-center justify-between border-b border-[#E2E2E2] pb-3 mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
                  Contact Information
                </h3>
              </div>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-[rgba(0,0,0,0.56)] mb-1">Name</dt>
                  <dd className="font-medium">
                    {user.firstName} {user.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-[rgba(0,0,0,0.56)] mb-1">Email</dt>
                  <dd className="font-medium break-all">{user.email}</dd>
                </div>
              </dl>
            </section>

            <section>
              <div className="flex items-center justify-between border-b border-[#E2E2E2] pb-3 mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
                  Address
                </h3>
                {address?.title && (
                  <span className="text-xs text-[rgba(0,0,0,0.56)]">
                    {address.title}
                  </span>
                )}
              </div>

              {addressLines.length > 0 ? (
                <address className="not-italic text-sm font-medium leading-7">
                  {addressLines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </address>
              ) : (
                <p className="text-sm text-[rgba(0,0,0,0.56)]">
                  You have not saved an address yet. Your delivery address is
                  saved when you place an order.
                </p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
