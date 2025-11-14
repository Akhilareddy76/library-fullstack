import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  if (!email) {
    return <p className="text-red-600">Invalid access. Email missing.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("OTP must be 6 digits");
      return;
    }

    try {
      const res = await axios.post(
        "https://librarybackend-woev.onrender.com/api/password/verify",
        {},
        { params: { email, otp } }
      );

      if (res.data !== "valid") {
        alert(res.data);
        return;
      }

      // OTP is valid → go to reset-password
      navigate("/reset-password", { state: { email, otp } });

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-20">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
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
            placeholder="Enter OTP"
            className="border rounded-md px-4 py-2 text-center tracking-widest text-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
