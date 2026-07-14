"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Anchor,
  Ship,
  Globe,
} from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setLoading(true);

  const formData = new FormData(e.currentTarget);

  const username = formData.get("username");
  const password = formData.get("password");

  console.log({ username, password });

  try {
 const res = await fetch("/api/login", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username, password }),
});

    const data = await res.json();

    console.log(res.status);
    console.log(data);

    setLoading(false);

    if (res.ok) {
      alert("Login successful");
      window.location.href = "/dashboard";  //router.push("/dasshboard");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    setLoading(false);
    alert("Server error");
  }
};
    
  

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">

      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(193,147,63,0.15) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="relative z-10 min-h-screen flex">

        {/* LEFT PANEL */}

        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

          <div className="absolute inset-0 bg-primary" />

          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-[#102845] to-primary" />

          <div className="absolute right-[-120px] bottom-[-120px] w-[420px] h-[420px] rounded-full border border-white/10" />
          <div className="absolute right-[-60px] bottom-[-60px] w-[280px] h-[280px] rounded-full border border-white/10" />

          <div className="relative z-20 flex flex-col justify-center px-16 text-white">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-xl">

                <Anchor className="w-7 h-7 text-white" />

              </div>

              <div>

                <p className="text-accent uppercase tracking-[0.25em] text-xs font-bold">
                  Seatown
                </p>

                <h2 className="text-3xl font-black">
                  Admin Portal
                </h2>

              </div>

            </div>

            <h1 className="text-5xl font-black leading-tight mb-8">
              Secure
              <br />
              Administration
            </h1>

            <p className="text-white/75 leading-8 max-w-xl mb-14 text-lg">
              Manage customer reviews, website content, and administration
              from one secure dashboard built exclusively for authorized
              personnel.
            </p>

            <div className="space-y-8">

              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <ShieldCheck className="w-7 h-7 text-accent" />

                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    Secure Authentication
                  </h3>

                  <p className="text-white/70">
                    JWT based administrator access.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <Ship className="w-7 h-7 text-accent" />

                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    Review Management
                  </h3>

                  <p className="text-white/70">
                    Moderate testimonials submitted by customers.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <Globe className="w-7 h-7 text-accent" />

                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    Content Control
                  </h3>

                  <p className="text-white/70">
                    Centralized management for the Seatown website.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* RIGHT PANEL */}

        <section className="flex-1 flex items-center justify-center px-6 py-16">

          <div className="w-full max-w-md">

            <div className="bg-white rounded-[32px] shadow-2xl border border-gray-200 p-10">

              <div className="flex justify-center mb-8">

                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg">

                  <Lock className="text-accent w-9 h-9" />

                </div>

              </div>

              <h2 className="text-3xl font-black text-center text-primary">
                Admin Login
              </h2>

              <p className="text-center text-gray-500 mt-3 mb-10">
                Sign in to continue to the administration dashboard.
              </p>

              <form
                onSubmit={handleLogin}
                className="space-y-6"
              >

                {/* Username */}

                <div>

                  <label className="block text-sm font-bold text-primary mb-2">
                    Username
                  </label>

                  <div className="relative">

                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      className="w-full h-14 rounded-2xl border border-gray-300 pl-12 pr-4 outline-none focus:border-accent transition-all"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label className="block text-sm font-bold text-primary mb-2">
                    Password
                  </label>

                  <div className="relative">

                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="w-full h-14 rounded-2xl border border-gray-300 pl-12 pr-14 outline-none focus:border-accent transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Error Placeholder */}

                <div className="min-h-[20px]">

                  <p className="text-sm text-red-500 invisible">
                    Invalid username or password.
                  </p>

                </div>

                {/* Login */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-accent hover:brightness-110 text-white font-bold uppercase tracking-widest flex justify-center items-center gap-3 transition-all shadow-lg disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>

            </div>

            <p className="text-center mt-8 text-sm text-gray-500">
              © {new Date().getFullYear()} Seatown Container Line
            </p>

          </div>

        </section>

      </div>

    </main>
  ); 
}