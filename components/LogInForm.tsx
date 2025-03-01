import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = "https://altcredit.onrender.com";

const LogInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/signup`, {
        email: email,
        password: password,
      });
      localStorage.setItem("token", data.access_token);
      setResponseMessage(`Signup Successful: ${data.message}`);
      router.push("/upload");
    } catch (err) {
      setResponseMessage(err.response?.data?.detail || "Signup Failed!");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        setResponseMessage("Login successful! Token received.");
        router.push("/upload");
      } else {
        throw new Error("No access token received");
      }
    } catch (err) {
      setResponseMessage(err.response?.data?.detail || "Login Failed!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignup(e);
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Sign Up" : "Log In"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">{responseMessage}</p>
        <hr className="my-6" />
        <p className="mt-4 text-center text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Log in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LogInForm;
