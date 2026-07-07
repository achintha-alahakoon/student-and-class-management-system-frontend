import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginpic from "../../Images/loginpic.png";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [values, setValues] = useState({
    organisationCode: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      username: values.username,
      password: values.password,
      TenantID: values.organisationCode,
    };

    axios
      .post("http://localhost:8081/api/auth/login", payload)
      .then((res) => {
        const { status, token, user } = res.data;
        const role = user?.Role;

        if (status === "success" && token) {
          login(token);
          navigate("/dashboard");
        } else {
          setError("Invalid username or password.");
        }
      })
      .catch((err) => {
        console.error("Login API error:", err);
        setError("Unable to connect. Please try again.");
      });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      {/* Left panel */}
      <div className="flex w-1/2 shrink-0 flex-col justify-center items-center overflow-y-auto bg-white px-14 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-1.5 text-4xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="mb-9 text-sm text-gray-500">
            Sign in to continue to your account
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Organisation Code"
              value={values.organisationCode}
              onChange={(e) =>
                setValues({ ...values, organisationCode: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={values.username}
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <input
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500">
                <input type="checkbox" className="h-4 w-4 accent-indigo-600" />
                Remember me
              </label>
              <Link
                to="#"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-4 w-full flex items-center justify-center">
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:opacity-95"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200 p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-400/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-indigo-600/10" />

        <img
          src={loginpic}
          alt="Student learning illustration"
          className="relative z-10 w-full max-w-md object-contain"
        />

        <div className="relative z-10 mt-8 text-center">
          <p className="text-xl font-bold text-indigo-900">
            Start learning today
          </p>
          <p className="mt-1 text-sm text-indigo-500">
            Access your classes, track progress, and grow.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

