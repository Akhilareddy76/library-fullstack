import React, { useState } from "react";
import axios from "../api";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [strength, setStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  if (!email || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Invalid access. Missing data.</p>
      </div>
    );
  }

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
      setLoading(true);
      const res = await axios.post("/api/password/reset", {
        email,
        otp,
        newPassword: password,
      });

      alert(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message ?? "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-20">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* New password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={handlePasswordChange}
              className="border rounded-md px-4 py-2 w-full"
            />
            <span
              className="absolute right-4 top-3 text-gray-600 cursor-pointer"
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Password strength */}
          {strength === "weak" && (
            <p className="text-red-600 text-sm">
              ❌ Weak password — Use A-Z, a-z, number & symbol.
            </p>
          )}
          {strength === "strong" && (
            <p className="text-green-600 text-sm">✔ Strong password</p>
          )}

          {/* Confirm password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="border rounded-md px-4 py-2 w-full"
            />
            <span
              className="absolute right-4 top-3 text-gray-600 cursor-pointer"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-md`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
}
