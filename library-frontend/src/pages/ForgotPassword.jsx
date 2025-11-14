import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
     `https://librarybackend-woev.onrender.com/api/password/forgot?email=${email}`,
     {},
      { withCredentials: true }
);
      if (res.data === "Email not registered") {
     alert("This email has no account. Please sign up first!");
     return;
      }
      
      alert("OTP sent to your email!");
      navigate("/verify-otp", { state: { email } }); // pass email
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-20">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Forgot Password
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Enter your email to receive OTP
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 rounded-md transition`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Remember your password?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
