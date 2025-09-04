"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, Link, Router } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load Google Identity Services
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://d2313bf3e038.ngrok-free.app/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: "admin",
          password: "admin123",
          grant_type: "password",
          scope: "",
          client_id: "string",
          client_secret: "password", // Make sure this is the correct secret
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Optional: Save the token
      localStorage.setItem("token", data.access_token);

      // Redirect to dashboard
      navigate("/admindashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Background Section */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="/auth-bg.png"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" />
        <div className="relative z-10 p-10 text-white self-end bg-black/40  w-full">
          <h1 className="text-4xl font-extrabold mb-2">G‑Nayana</h1>
          <p className="text-lg">AI‑Driven Diabetic Retinopathy Detection</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 overflow-y-auto bg-gray-50">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/">
            <img
              src="/logo.svg"
              alt="Logo"
              loading="lazy"
              width={200}
              height={200}
              className="w-200 h-200"
            />
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-auto md:w-[420px] h-auto m-auto mt-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-500 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4 w-full">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username*
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm mb-1 focus:ring-1 focus:outline-none ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password*
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm mb-1 focus:ring-1 focus:outline-none ring-blue-500"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Forgot */}
            <div className="flex justify-end items-center mt-2">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Continue
            </button>

            {/* Sign up */}
            {/* <p className="text-center text-gray-500 mt-5 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>{" "}
              now.
            </p> */}
          </form>

          {/* Google Sign-In */}
          {/* <div className="mt-6 flex justify-center">
            <div
              id="g_id_onload"
              data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
              data-auto_prompt="false"
            ></div>
            <div
              className="g_id_signin"
              data-type="standard"
              data-size="large"
              data-theme="outline"
              data-text="signin_with"
              data-shape="rectangular"
              data-logo_alignment="left"
            ></div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
