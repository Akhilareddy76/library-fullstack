import React, { useState, useContext } from "react";
import axios from "../api";
import { BookContext } from "../contexts/BookContext";
import { useNavigate } from "react-router-dom";

const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export default function Login() {
  const { setUser } = useContext(BookContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gmailRegex.test(email)) {
      alert("Please enter a valid Gmail address (example@gmail.com)");
      return;
    }
    try {
      const res = await axios.post("/login", { email, password });
      if (!res.data) {
        alert("Invalid email or password!");
        return;
      }
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Invalid email or password!");
      } else {
        alert("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email" className="border rounded-md px-4 py-2"/>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" className="border rounded-md px-4 py-2"/>
          <p className="text-right text-blue-600 cursor-pointer text-sm" onClick={()=>navigate("/forgot-password")}>Forgot Password?</p>
          <button type="submit" className="bg-blue-600 text-white py-2 rounded-md">Login</button>
        </form>
        <p className="text-center mt-4 text-gray-600">Don't have an account? <span onClick={()=>navigate("/signup")} className="text-blue-600 cursor-pointer">Signup</span></p>
      </div>
    </div>
  );
}
