import React, { useState } from "react";
import api from "../api";
import { useLocation, useNavigate } from "react-router-dom";

const strongRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [strength, setStrength] = useState("");

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (strongRegex.test(value)) {
      setStrength("strong");
    } else if (value.length >= 6) {
      setStrength("medium");
    } else {
      setStrength("weak");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strongRegex.test(password)) {
      alert("Password must be strong — include A-Z, a-z, 0-9 and a symbol.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await api.post("/api/password/reset", {
        email: state.email,
        newPassword: password
      });

      alert("Password reset successful!");
      navigate("/login");
    } catch {
      alert("Error resetting password. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* New Password */}
          <input
            type="password"
            placeholder="New Password"
            className="border rounded-md px-4 py-2"
            value={password}
            onChange={handlePasswordChange}
          />

          {/* Strength Indicator */}
          {password && (
            <p
              className={`text-sm ${
                strength === "strong"
                  ? "text-green-600"
                  : strength === "medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {strength === "strong" && "✔ Strong Password"}
              {strength === "medium" && "⚠ Medium — add symbols & uppercase"}
              {strength === "weak" && "✖ Weak — make it stronger"}
            </p>
          )}

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded-md px-4 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
