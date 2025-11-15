import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const correctOtp = location.state?.otp;

  if (!email || !correctOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Invalid access.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp === correctOtp) {
      navigate("/reset-password", { state: { email } });
    } else {
      alert("Incorrect OTP!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-20">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            className="border rounded-md px-4 py-2 text-center"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="bg-blue-600 text-white py-2 rounded-md">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
