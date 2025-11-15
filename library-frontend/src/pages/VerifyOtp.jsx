import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [inputOtp, setInputOtp] = useState("");
  const [message, setMessage] = useState("");

  if (!state?.email || !state?.otp || !state?.expireAt)
    return <p className="text-center mt-10 text-red-500">Invalid Access</p>;

  const isExpired = Date.now() > state.expireAt;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isExpired) {
      return alert("OTP expired. Please resend.");
    }

    if (inputOtp === state.otp) {
      navigate("/reset-password", { state });
    } else {
      alert("Invalid OTP");
    }
  };

  const resendOtp = async () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpireAt = Date.now() + 15 * 60 * 1000;

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { user_email: state.email, otp: newOtp }
      );

      setMessage("A new OTP has been sent!");
      setTimeout(() => setMessage(""), 3000);

      // Update state values
      state.otp = newOtp;
      state.expireAt = newExpireAt;

    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Verify OTP
        </h2>

        <p className="text-center text-gray-600 mb-4">
          OTP sent to <span className="font-semibold">{state.email}</span>
        </p>

        {isExpired && (
          <p className="text-red-500 text-center mb-3 font-semibold">
            OTP expired. Please resend.
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-xl text-center tracking-widest"
            onChange={(e) => setInputOtp(e.target.value)}
          />

          <button className="bg-blue-600 text-white py-3 rounded-lg text-lg">
            Verify
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Didn’t get the OTP?{" "}
          <button onClick={resendOtp} className="text-blue-600 font-semibold">
            Resend OTP
          </button>
        </p>

        {message && (
          <p className="text-green-600 text-center mt-3 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}
