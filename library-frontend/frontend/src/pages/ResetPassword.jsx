import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [strength, setStrength] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  if (!email || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Invalid access. Missing data.</p>
      </div>
    );
  }

  // strong password rule
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);

    if (!val) setStrength("");
    else if (!strongPasswordRegex.test(val)) setStrength("weak");
    else setStrength("strong");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (strength !== "strong") {
      alert("Password must be strong!");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "https://library-backend-lpkg.onrender.com/api/password/reset",
        {
          email,
          otp,
          newPassword: password,
        },
        { withCredentials: true }
      );

      alert(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-20">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={handlePasswordChange}
          />

          {strength === "weak" && (
            <p className="text-red-600 text-sm">
              ❌ Weak password. Add A-Z, a-z, number & symbol.
            </p>
          )}

          {strength === "strong" && (
            <p className="text-green-600 text-sm">✔ Strong password</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
