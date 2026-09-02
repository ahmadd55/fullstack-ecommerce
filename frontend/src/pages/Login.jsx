import Logo from "../assets/hm-logo.svg";
import { useState,useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.redirectTo || "/";
  const pendingCartItem = location.state?.pendingCartItem;

  const [isRegistering, setIsRegistering] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) {
      setError("Please fill in email and password.");
      return;
    }

    if (isRegistering && (!firstName || !lastName)) {
      setError("Please provide your first and last name for registration.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await api.post("/auth/register", {
          firstName,
          lastName,
          email,
          phone,
          password,
          role: "user",
        });

        setSuccessMsg("Account created successfully! Please sign in.");
        setIsRegistering(false); 
        setPassword("");
      } else {
        const response = await api.post("/auth/login", { email, password });

        const token =
          response.data.token ||
          response.data.data?.token ||
          response.data.accessToken;

        localStorage.setItem("token", token);
        localStorage.setItem("role", "user");

        if (pendingCartItem) {
          try {
            await api.post("/cart", pendingCartItem, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (cartErr) {
            console.log("Failed to add pending cart item:", cartErr);
          }
        }
        navigate(redirectPath);
      }
    } catch (err) {
      console.log("Auth Error:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login">
        <div className="top-image mt-10">
          <Link to="/">
            <img src={Logo} alt="Logo" className="cursor-pointer" />
          </Link>
        </div>

        <div className="login-card w-full max-w-sm mx-auto px-4">
          <div className="login-heading mb-6 text-center">
            <h1 className="text-2xl font-semibold">
              {isRegistering ? "Create Account" : "Sign in"}
            </h1>
            <p className="text-sm text-[rgba(0,0,0,0.56)] mt-2">
              {isRegistering
                ? "Fill in your details to get started"
                : "Sign in or create an account"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-[#8CC63F] text-sm p-3 rounded mb-4 text-center">
              {successMsg}
            </div>
          )}

          {!isRegistering && (
            <>
              <div className="social-btn mb-6">
                <a
                  href="#"
                  className="flex-1 flex justify-center border border-[#E2E2E2] rounded-xl py-3 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    preserveAspectRatio="xMidYMid"
                    viewBox="0 0 256 262"
                    id="google"
                  >
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    ></path>
                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex-1 flex justify-center border border-[#E2E2E2] rounded-xl py-3 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 193 193"
                    id="facebook"
                  >
                    <g transform="translate(-136 -677)">
                      <rect
                        width="193"
                        height="193"
                        fill="#1778f2"
                        rx="96.5"
                        transform="translate(136 677)"
                      ></rect>
                      <path
                        fill="#fdfdfd"
                        d="M240.195 827.969v-51.655h17.339l2.6-20.131h-19.939V743.33c0-5.828 1.619-9.8 9.977-9.8h10.66v-18a142.87 142.87 0 0 0-15.534-.792c-15.37 0-25.892 9.381-25.892 26.61v14.835h-17.383v20.131h17.383v51.655h20.789Z"
                      ></path>
                    </g>
                  </svg>
                </a>
              </div>

              <div className="separtor mb-6">
                <div className="line"></div>
                <div className="text-gray-500 text-sm">or</div>
                <div className="line"></div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
            {isRegistering && (
              <>
                <div className="login-email">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full outline-none bg-transparent"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="login-email">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full outline-none bg-transparent"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="login-email">
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    className="w-full outline-none bg-transparent"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="login-email">
              <input
                type="email"
                placeholder="Email"
                className="w-full outline-none bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-email pr-2">
              <input
                type="password"
                placeholder="Password"
                className="w-full outline-none bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="text-black hover:text-[#8CC63F] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="text-sm font-medium pr-2">...</span>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12H20M20 12L14 6M20 12L14 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
                setSuccessMsg("");
              }}
              className="text-sm font-medium text-[#8CC63F] hover:underline"
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "New user? Create an account"}
            </button>
          </div>

          <div className="checking mb-6">
            <input type="checkbox" name="agree" id="agree" />
            <label htmlFor="agree" className="text-sm">
              Email me with news and offers
            </label>
          </div>

          <p className="text-xs text-center text-[rgba(0,0,0,0.56)]">
            By continuing, you agree to our{" "}
            <a className="underline hover:text-black" href="#">
              Terms of service
            </a>
          </p>
        </div>

        <div className="privacy-policy mb-10 text-center">
          <a href="#" className="hover:underline">
            Privacy policy
          </a>
        </div>
      </div>
    </>
  );
}
