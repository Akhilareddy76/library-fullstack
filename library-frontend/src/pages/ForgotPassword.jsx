import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!/^\S+@\S+\.\S+$/.test(trimmed)) return alert("Enter a valid email");

    const otp = generateOtp();
    const expireAt = Date.now() + 15 * 60 * 1000; // 15 mins

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { user_email: trimmed, otp }
      );

      // Save OTP data in local storage
      localStorage.setItem(
        "otpData",
        JSON.stringify({ email: trimmed, otp, expireAt })
      );

      setSent(true);

      setTimeout(() => navigate("/verify-otp"), 1500);
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
              className="border rounded-lg px-4 py-3 text-lg"
              value={email}
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
            OTP sent! Redirecting...
          </p>
        )}
      </div>
    </div>
  );
}
