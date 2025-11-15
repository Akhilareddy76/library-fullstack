import React, { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!gmailRegex.test(email)) {
    alert("Enter a valid Gmail address!");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post("/api/password/forgot", { email });

    if (res.data === "OTP_SENT") {
      alert("OTP sent to your email!");
      navigate("/verify-otp", { state: { email } });
    } 
  } 
  catch (err) {
    if (err.response?.status === 400 && err.response.data?.message === "Email not registered") {
      alert("This email is not registered!");
    } 
    else if (err.response?.status === 500 && err.response.data?.message === "Failed to send OTP") {
      alert("Failed to send OTP. Please try again.");
    }
    else {
      alert("Something went wrong. Try again later.");
    }
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-20">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-4">Enter your Gmail to receive OTP</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" className="border rounded-md px-4 py-2"/>
          <button type="submit" disabled={loading} className={`${loading ? "bg-gray-400" : "bg-blue-600"} text-white py-2 rounded-md`}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">Remember your password? <span onClick={()=>navigate("/login")} className="text-blue-600 cursor-pointer">Login</span></p>
      </div>
    </div>
  );
}
