import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;
  if (!email)
    return (
      <p className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Invalid Access
      </p>
    );

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [strength, setStrength] = useState("");

  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePassword = (e) => {
    const value = e.target.value;
    setPass(value);
    setStrength(strongRegex.test(value) ? "strong" : "weak");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strongRegex.test(pass)) return alert("Weak password");
    if (pass !== confirm) return alert("Passwords do not match");

    try {
      await axios.post("/api/password/reset", {
        email,
        newPassword: pass,
      });

      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">

        <h2 className="text-3xl text-center text-blue-700 font-bold mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="border px-4 py-3 rounded-lg text-lg"
            value={pass}
            onChange={handlePassword}
          />

          {strength === "weak" && (
            <p className="text-red-500 text-sm -mt-2">
              Password must contain A-Z, a-z, 0-9 & symbols
            </p>
          )}
          {strength === "strong" && (
            <p className="text-green-600 text-sm -mt-2">Strong password ✔</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="border px-4 py-3 rounded-lg text-lg"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white rounded-lg py-3 text-lg font-semibold hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
