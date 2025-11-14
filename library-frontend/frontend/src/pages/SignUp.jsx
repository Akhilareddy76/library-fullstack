import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BookContext } from "../contexts/BookContext";

const API_BASE = "https://library-backend-lpkg.onrender.com/api";

export default function Signup() {
  const { setUser } = useContext(BookContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const navigate = useNavigate();

  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    setStrength(strongRegex.test(value) ? "strong" : "weak");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (strength !== "strong") {
      alert("Please enter a strong password.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      alert("Email already exists!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Signup
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password (Strong)"
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={handlePassword}
          />

          {strength === "weak" && (
            <p className="text-red-600 text-sm">
              ❌ Weak password — Use A-Z, a-z, 0-9 & symbols
            </p>
          )}

          {strength === "strong" && (
            <p className="text-green-600 text-sm">✔ Strong password</p>
          )}

          <button
            type="submit"
            disabled={strength !== "strong"}
            className={`py-2 rounded-md text-white font-semibold transition ${
              strength === "strong"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Signup
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
