import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const otpData = JSON.parse(localStorage.getItem("otpData"));

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  if (!otpData?.email)
    return (
      <p className="text-center mt-10 text-red-500 text-xl">
        Invalid Access
      </p>
    );

  const strongPass =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strongPass.test(pass))
      return alert(
        "Password must contain 8+ chars, uppercase, lowercase, number & symbol."
      );

    if (pass !== confirm) return alert("Passwords do not match");

    try {
      await api.post("/api/password/reset", {
        email: otpData.email,
        newPassword: pass,
      });

      alert("Password reset successfully!");
      localStorage.removeItem("otpData");
      navigate("/login");
    } catch {
      alert("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="border rounded-lg px-4 py-3"
            onChange={(e) => setPass(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded-lg px-4 py-3"
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button className="bg-blue-600 text-white py-3 rounded-lg text-lg">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
