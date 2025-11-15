import React, { useState } from "react";
import api from "../api";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [pass, setPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/password/reset", {
        email: state.email,
        newPassword: pass
      });

      alert("Password reset successful!");
      navigate("/login");
    } catch {
      alert("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-2xl mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New password"
            className="border px-3 py-2 rounded"
            onChange={(e) => setPass(e.target.value)}
          />

          <button className="bg-blue-600 text-white py-2 rounded">Reset</button>
        </form>
      </div>
    </div>
  );
}
