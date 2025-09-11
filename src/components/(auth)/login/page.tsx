"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as jwt_decode from "jwt-decode"; // namespace import
import type { JwtPayload } from "jwt-decode";

interface TokenPayload extends JwtPayload {
  exp: number;
  // add other fields if your token has them
}


// testing

const apiBase = import.meta.env.VITE_API_BASE;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // Auto-login if token exists and is valid
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const { jwtDecode } = await import("jwt-decode");
        const decoded = jwtDecode<TokenPayload>(token);
        const now = Date.now() / 1000;

        if (decoded.exp > now) {
          navigate("/patient-record", { replace: true });
          return;
        } else {
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }

      setChecking(false);
    };

    checkToken();
  }, [navigate]);

  // Handle login form submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiBase}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
          grant_type: "password",
          scope: "",
          client_id: "string",
          client_secret: "password",
        }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/patient-records", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password.");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Background */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="/auth-bg.png"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" />
        <div className="relative z-10 p-10 text-white self-end bg-black/40 w-full">
          <h1 className="text-4xl font-extrabold mb-2">G‑Nayana</h1>
          <p className="text-lg">AI‑Driven Diabetic Retinopathy Detection</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 overflow-y-auto bg-gray-50">
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

        <div className="w-auto md:w-[420px] h-auto m-auto mt-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-500 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4 w-full">
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

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div className="flex justify-end items-center mt-2">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
