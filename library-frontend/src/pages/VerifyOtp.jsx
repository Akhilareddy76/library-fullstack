import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otpInput, setOtpInput] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // Get OTP data stored earlier
  const otpData = JSON.parse(localStorage.getItem("otpData"));

  if (!otpData)
    return (
      <p className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Invalid Access
      </p>
    );

  const { email, otp, expireAt } = otpData;

  // ---------------- TIMER ----------------
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expireAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isExpired = Date.now() > expireAt;

  // ---------------- VERIFY ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isExpired) return alert("OTP expired. Please resend.");

    if (otpInput === otp) {
      navigate("/reset-password", { state: { email } });
    } else {
      alert("Invalid OTP");
    }
  };

  // ---------------- RESEND OTP ----------------
  const resendOtp = async () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpire = Date.now() + 15 * 60 * 1000;

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { user_email: email, otp: newOtp }
      );

      // Update new data
      localStorage.setItem(
        "otpData",
        JSON.stringify({ email, otp: newOtp, expireAt: newExpire })
      );

      setMessage("New OTP sent!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("OTP resend failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">

        <h1 className="text-3xl font-bold text-blue-700 mb-2">Verify OTP</h1>

        <p className="text-gray-600 mb-4">
          OTP sent to <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="border rounded-lg px-4 py-3 text-center text-xl tracking-widest"
            onChange={(e) => setOtpInput(e.target.value)}
          />

          <button className="bg-blue-600 text-white rounded-lg py-3 text-lg font-semibold hover:bg-blue-700">
            Verify OTP
          </button>
        </form>

        {/* TIMER */}
        {!isExpired ? (
          <p className="text-gray-600 mt-3 text-sm">
            OTP expires in: <span className="font-semibold">{timeLeft}s</span>
          </p>
        ) : (
          <p className="text-red-600 font-semibold mt-3">OTP expired</p>
        )}

        {/* RESEND */}
        <button
          onClick={resendOtp}
          className="mt-4 text-blue-600 font-semibold hover:underline"
        >
          Resend OTP
        </button>

        {message && (
          <p className="text-green-600 mt-3 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}
