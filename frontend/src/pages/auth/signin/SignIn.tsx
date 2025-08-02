import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../../config/axios";
import { handleLoginResponse } from "../../../utils/auth";
import { Eye, EyeOff } from "lucide-react";
import AnimatedBlobBackground from "@/components/Blobbg"; // Using the visual branch's path

// --- Reusable Color Palette ---
// **Resolution**: Kept from Anuj's-Branch for consistent styling.
const COLORS = {
  lightYellow: "#ffffe3",
  midnightGreen: "#003642",
  teaGreen: "#d0e6a5",
  nyanza: "#f1ffe3",
  cadetGray: "#83a0a0",
};

// --- Reusable Custom Cursor Component ---
// **Resolution**: Kept from Anuj's-Branch for consistent styling.
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) =>
      setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);
  return (
    <>
      <div
        className="custom-cursor-glow"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className="custom-cursor-dot"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
};

// --- Helper component for a styled input ---
// **Resolution**: Kept from Anuj's-Branch for consistent styling.
const StyledInput = React.forwardRef<HTMLInputElement, any>(
  ({ ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className="w-full px-4 py-3 bg-transparent border rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-2"
      style={
        {
          borderColor: `${COLORS.cadetGray}30`,
          color: COLORS.nyanza,
          "--tw-ring-color": COLORS.teaGreen,
        } as React.CSSProperties
      }
    />
  )
);

type AuthMethod = "phone" | "email";

export default function SignInPage() {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("phone");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePhoneNumber = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhoneNumber(contact)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/users/send-phone-otp-login", {
        phoneNo: contact,
      });

      setIsOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to send OTP";
      toast.error(
        message.includes("does not exist")
          ? "This phone number is not registered."
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/users/login-phone-otp", {
        phoneNo: contact,
        otp,
      });

      const tokens = handleLoginResponse(res);
      if (tokens) {
        toast.success("Signed in successfully!");
        window.dispatchEvent(new Event("storage"));
        navigate("/dashboard");
      } else {
        toast.error("Login failed - no tokens received");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/users/login", {
        email: contact,
        password,
      });
      const tokens = handleLoginResponse(res);
      if (tokens) {
        toast.success("Signed in successfully!");
        window.dispatchEvent(new Event("storage"));
        navigate("/dashboard");
      } else {
        toast.error("Login failed - no tokens received");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(
        err.response?.status === 404 ? "This email is not registered." : message
      );
    } finally {
      setLoading(false);
    }
  };

  // **Resolution**: The entire return statement is taken from Anuj's-Branch to keep the new UI.
  return (
    <div
      style={{ background: COLORS.midnightGreen }}
      className="relative min-h-screen flex items-center justify-center p-4 hide-default-cursor overflow-hidden"
    >
      <CustomCursor />
      <AnimatedBlobBackground />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className="p-8 md:p-10 rounded-2xl"
          style={{
            background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
            border: `1px solid ${COLORS.cadetGray}20`,
            backdropFilter: "blur(12px)",
            boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`,
          }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-extrabold mb-2"
              style={{ color: COLORS.nyanza }}
            >
              Welcome Back
            </h1>
            <p style={{ color: COLORS.cadetGray }}>
              Sign in to continue your contribution.
            </p>
          </div>

          <div
            className="flex p-1 rounded-xl mb-8"
            style={{ background: `${COLORS.midnightGreen}40` }}
          >
            <button
              onClick={() => setAuthMethod("phone")}
              className={`w-1/2 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                authMethod === "phone" ? "text-midnightGreen" : "text-white"
              }`}
              style={{
                background:
                  authMethod === "phone" ? COLORS.teaGreen : "transparent",
              }}
            >
              Phone
            </button>
            <button
              onClick={() => setAuthMethod("email")}
              className={`w-1/2 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                authMethod === "email" ? "text-midnightGreen" : "text-white"
              }`}
              style={{
                background:
                  authMethod === "email" ? COLORS.teaGreen : "transparent",
              }}
            >
              Email
            </button>
          </div>

          {authMethod === "email" ? (
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div>
                <StyledInput
                  type="email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <div className="relative">
                  <StyledInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff
                        className="h-5 w-5"
                        style={{ color: COLORS.cadetGray }}
                      />
                    ) : (
                      <Eye
                        className="h-5 w-5"
                        style={{ color: COLORS.cadetGray }}
                      />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: COLORS.teaGreen,
                  color: COLORS.midnightGreen,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : !isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <StyledInput
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter 10-digit number"
                  required
                  maxLength={10}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: COLORS.teaGreen,
                  color: COLORS.midnightGreen,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <StyledInput
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  maxLength={6}
                  className="text-center text-2xl tracking-[0.5em]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: COLORS.teaGreen,
                  color: COLORS.midnightGreen,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="w-full text-sm text-center"
                style={{ color: COLORS.cadetGray }}
              >
                Change phone number
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-8" style={{ color: COLORS.cadetGray }}>
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="font-semibold hover:underline"
            style={{ color: COLORS.teaGreen }}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
