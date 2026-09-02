import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        loginFrom: "admin",
      });

      const userRole =
        response.data?.data?.user?.role ||
        response.data?.user?.role ||
        response.data?.role;

      if (userRole !== "admin") {
        setError("Access Denied. You do not have admin privileges.");
        setLoading(false);
        return; 
      }

      const token =
        response.data.token ||
        response.data.data?.token ||
        response.data.accessToken;
      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");

      navigate("/dashboard");
    } catch (err) {
      console.log("Admin Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 antialiased bg-background text-on-background">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-container/20 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-secondary-fixed/20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[420px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
        
        <div className="pt-10 pb-8 px-8 text-center  border-surface-container">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-container/10 text-primary mb-4">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              checkroom
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2 tracking-tight">
            HM Admin
          </h1>
          <h2 className="text-xl font-semibold text-on-surface mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-on-surface-variant">
            Please enter your details to sign in.
          </p>
        </div>

        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
           
            <div>
              <label
                className="block text-xs font-semibold text-on-surface mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded bg-surface text-on-surface text-sm focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-colors h-10 placeholder:text-outline"
                  id="email"
                  name="email"
                  placeholder="admin@gmail.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            
            <div>
              <label
                className="block text-xs font-semibold text-on-surface mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-2 border border-outline-variant rounded bg-surface text-on-surface text-sm focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-colors h-10 placeholder:text-outline"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline-variant hover:text-on-surface transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

           
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary-container bg-surface"
                  id="remember-me"
                  type="checkbox"
                />
                <label
                  className="ml-2 block text-sm text-on-surface-variant"
                  htmlFor="remember-me"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  className="font-semibold text-xs text-primary hover:text-primary-container transition-colors"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded bg-primary-container text-on-primary font-semibold text-xs hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container shadow-sm hover:shadow-[0_4px_10px_-2px_rgba(16,185,129,0.3)] hover:-translate-y-px transform duration-200 disabled:opacity-70 disabled:transform-none"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
}
