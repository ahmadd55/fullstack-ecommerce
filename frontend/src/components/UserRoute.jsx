import { Navigate, Outlet } from "react-router-dom";

export default function UserRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
