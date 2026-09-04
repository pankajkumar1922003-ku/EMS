import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowDown,
  FaRocket,
  FaStar,
  FaSpinner,
} from "react-icons/fa";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const demoEmail = "admin@ems.com";
  const demoPassword = "Admin@123";

  const handleLogin = async (
    loginEmail: string,
    loginPassword: string
  ) => {
    try {
      setLoading(true);


      const response = await loginUser(loginEmail, loginPassword);

      login(response.token, response.employee);

      toast.success("Welcome to EMS! Demo login successful");

      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }


  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  const handleDemoLogin = async () => {
    setEmail(demoEmail);
    setPassword(demoPassword);


    await handleLogin(demoEmail, demoPassword);


  };

  return (<div className="flex min-h-screen items-center justify-center bg-slate-100 px-4"> <form
    onSubmit={handleSubmit}
    className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
  > <div className="mb-8 text-center"> <div className="mb-4 flex justify-center"> <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg"> <FaStar size={24} /> </div> </div>


      <h1 className="text-3xl font-bold text-slate-800">
        Employee Management System
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Explore the complete Employee Management Dashboard
      </p>
    </div>

    <input
      type="email"
      placeholder="Email"
      autoComplete="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="mb-4 w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

    <input
      type="password"
      placeholder="Password"
      autoComplete="current-password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="mb-6 w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

    <div className="mb-3 flex flex-col items-center text-center">
      <p className="flex items-center gap-2 text-sm font-semibold text-blue-600">
        <FaRocket size={15} />
        New here? Click below to explore the project!
      </p>

      <FaArrowDown
        className="mt-2 animate-bounce text-blue-600"
        size={24}
      />
    </div>

    <button
      type="button"
      onClick={handleDemoLogin}
      disabled={loading}
      className="w-full rounded-xl bg-blue-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-blue-500"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <FaSpinner className="animate-spin" size={18} />
          Please wait, starting the demo...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <FaRocket size={18} />
          Explore Demo
        </span>
      )}
    </button>

    {loading && (
      <p className="mt-3 text-center text-xs text-slate-500">
        The server may take a few seconds to wake up. Please wait...
      </p>
    )}

    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200"></div>
      <span className="text-xs text-gray-400">OR</span>
      <div className="h-px flex-1 bg-gray-200"></div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-xl border border-slate-300 p-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Login with Credentials
    </button>

    <p className="mt-5 text-center text-xs text-slate-400">
      Demo environment • Explore all features safely
    </p>
  </form>
  </div>


  );
};

export default Login;
