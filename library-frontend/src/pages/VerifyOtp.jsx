import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Invalid access. Email is missing.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("OTP must be exactly 6 digits");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/password/verify", { email, otp });

      navigate("/reset-password", {
        state: { email, otp },
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      await axios.post("/api/password/forgot", { email });
      alert("A new OTP has been sent to your email!");
    } catch (err) {
      alert("Failed to resend OTP. Try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-16">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Verify OTP
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Enter the 6-digit OTP sent to <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength="6"
            inputMode="numeric"
            className="border rounded-md px-4 py-2 text-center text-lg tracking-widest"
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-blue-400" : "bg-blue-600"
            } text-white py-2 rounded-md font-medium`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Didn’t get OTP?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={resendOtp}
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </span>
        </p>
      </div>
    </div>
  );
}
