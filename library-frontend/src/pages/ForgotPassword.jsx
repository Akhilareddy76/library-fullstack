import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!/^\S+@\S+\.\S+$/.test(trimmed))
      return alert("Please enter a valid email");

    const otp = generateOtp();
    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { user_email: trimmed, otp }
      );

      navigate("/verify-otp", { state: { email: trimmed, otp } });
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Forgot Password
        </h2>

        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your registered email. We’ll send an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email input */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mt-1 focus:border-blue-600 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Send OTP Button */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Remember your password?{" "}
          <span
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
