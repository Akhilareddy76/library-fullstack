import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const otpData = JSON.parse(localStorage.getItem("otpData"));
  const [inputOtp, setInputOtp] = useState("");
  const [message, setMessage] = useState("");

  if (!otpData?.email || !otpData?.otp || !otpData?.expireAt)
    return (
      <p className="text-center mt-10 text-red-500 text-xl font-semibold">
        Invalid Access
      </p>
    );

  const isExpired = Date.now() > otpData.expireAt;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isExpired) return alert("OTP has expired. Please resend.");

    if (inputOtp === otpData.otp) {
      navigate("/reset-password");
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

  const resendOtp = async () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpireAt = Date.now() + 15 * 60 * 1000;

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { user_email: otpData.email, otp: newOtp }
      );

      otpData.otp = newOtp;
      otpData.expireAt = newExpireAt;
      localStorage.setItem("otpData", JSON.stringify(otpData));

      setMessage("New OTP has been sent!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Verify OTP
        </h2>

        <p className="text-center text-gray-600 mb-4">
          OTP sent to <span className="font-semibold">{otpData.email}</span>
        </p>

        {isExpired && (
          <p className="text-red-600 text-center mb-3 font-semibold">
            OTP Expired — Please Resend
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            className="border rounded-lg px-4 py-3 text-center text-xl tracking-widest"
            onChange={(e) => setInputOtp(e.target.value)}
          />

          <button className="bg-blue-600 text-white py-3 rounded-lg text-lg">
            Verify
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Didn’t get the OTP?{" "}
          <button
            onClick={resendOtp}
            className="text-blue-600 font-semibold"
          >
            Resend OTP
          </button>
        </p>

        {message && (
          <p className="text-green-600 text-center mt-3 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
