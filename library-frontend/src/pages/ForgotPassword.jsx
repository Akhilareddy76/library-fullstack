import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api";

export default function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-fill email if passed from Login
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(trimmed)) {
      return alert("Enter a valid Gmail address");
    }

    // Backend check - is email registered?
    try {
      const res = await axios.post(
        "/api/password/verify-mail",
        { email: trimmed },
        { withCredentials: true }
      );
    } catch (err) {
      if (err.response?.status === 404) {
        return alert("This email is not registered!");
      }
      return alert("Something went wrong. Try again.");
    }

    const otp = generateOtp();
    const expireAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { user_email: trimmed, otp }
      );

      // Save OTP locally
      localStorage.setItem(
        "otpData",
        JSON.stringify({ email: trimmed, otp, expireAt })
      );

      setSent(true);

      setTimeout(() => navigate("/verify-otp"), 1000);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          Forgot Password
        </h2>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your Gmail"
              value={email}
              className="border rounded-lg px-4 py-3 text-lg"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              disabled={loading}
              className="bg-blue-600 text-white py-3 rounded-lg text-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <p className="text-green-600 font-semibold animate-pulse">
            OTP sent! Redirecting…
          </p>
        )}
      </div>
    </div>
  );
}
