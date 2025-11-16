import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import axios from "../api";
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

    try {
      // backend email verification
       const res = await axios.post("/api/password/verify-mail",
       { email },  // JSON body
       { withCredentials: true }
       )
      const otp = generateOtp();
      const expireAt = Date.now() + 15 * 60 * 1000;

      setLoading(true);

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { user_email: email, otp }
      );

      localStorage.setItem(
        "otpData",
        JSON.stringify({ email, otp, expireAt })
      );

      setSent(true);
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (err) {
      alert("Email not registered");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

        <h2 className="text-3xl font-bold text-blue-700 mb-4">Forgot Password</h2>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              className="border rounded-lg px-4 py-3 text-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              disabled={loading}
              className="bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
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
