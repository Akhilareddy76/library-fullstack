import React, { useContext, useState } from "react";
import { BookContext } from "../contexts/BookContext";
import { useNavigate } from "react-router-dom";
import axios from "../api";

export default function Login() {
  const { setUser } = useContext(BookContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return alert("Enter a valid Gmail address");
    }

    try {
      const res = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md animate-fadeIn">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter Email"
            className="border rounded-lg px-4 py-3 text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="border rounded-lg px-4 py-3 text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p
           className="text-right text-blue-600 cursor-pointer text-sm"
           onClick={() => {
           if (!email.trim()) {
           return alert("Please enter your email first.");
          }
          const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    
          if (!gmailRegex.test(trimmed)) {
          return alert("Please enter a valid Gmail address (example@gmail.com).");
           }
          navigate("/forgot-password", { state: { email } });
  }}
> Forgot Password?
</p>


          <button
            className="bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?
          <span
            className="text-blue-600 cursor-pointer ml-1 font-semibold hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}
