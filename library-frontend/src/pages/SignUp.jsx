import React, { useState, useContext } from "react";
import axios from "../api";
import { BookContext } from "../contexts/BookContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { setUser } = useContext(BookContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
     if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(trimmed)) {
      return alert("Enter a valid Gmail address");
    }
    if (!strongRegex.test(password)) return alert("Weak password");
    if (password !== confirm) return alert("Passwords do not match");

    try {
      const res = await axios.post(
        "/api/signup",
        { username: name, email, password },
        { withCredentials: true }
      );

      setUser(res.data);
      navigate("/");
    } catch (err) {
      alert("Signup failed.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Signup</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border rounded-lg px-4 py-3 text-lg"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="border rounded-lg px-4 py-3 text-lg"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border rounded-lg px-4 py-3 text-lg"
            placeholder="Password (Strong)"
            value={password}
            onChange={handlePassword}
          />

          {strength === "weak" && (
            <p className="text-red-500 text-sm -mt-2">Password is too weak</p>
          )}
          {strength === "strong" && (
            <p className="text-green-600 text-sm -mt-2">Strong password ✔</p>
          )}

          <input
            type="password"
            className="border rounded-lg px-4 py-3 text-lg"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            disabled={strength !== "strong"}
          >
            Signup
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?
          <span
            className="text-blue-600 cursor-pointer ml-1 font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
