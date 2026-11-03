"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, KeyRound, Loader2, Lock, ArrowLeft } from "lucide-react";
import { apiFetch, setAdminToken } from "@/lib/api";
import { AdminUser } from "@/lib/types";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@foundation.org");
  const [password, setPassword] = useState("Admin@12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ access_token: string; admin: AdminUser }>(
        "/api/admin/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      setAdminToken(res.access_token);
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2942] via-[#0f4c75] to-[#1788bf] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-8 text-center border-b border-slate-100 space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center mx-auto shadow-md border border-slate-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="ভ্রাতৃত্ব ফাউন্ডেশন লোগো"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
            ভ্রাতৃত্ব ফাউন্ডেশন অ্যাডমিন
          </h1>
          <p className="text-xs text-slate-500">
            ফাউন্ডেশন ওয়েবসাইট ও ডোনেশন ম্যানেজমেন্ট সিস্টেম
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-4">
          <div>
            <label className="block text-xs font-july font-bold text-slate-700 mb-1">
              অ্যাডমিন ইমেইল
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2375b8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-july font-bold text-slate-700 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2375b8] focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#2375b8] hover:bg-[#195d96] text-white font-july font-bold text-base flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>লগইন করুন (Sign In)</span>
          </button>

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs text-slate-600 flex items-center justify-between gap-2">
            <div>
              <span className="font-bold text-[#0f4c75] block">Default Admin:</span>
              <span className="font-mono">admin@foundation.org / Admin@12345</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@foundation.org");
                setPassword("Admin@12345");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-sky-200 text-[#2375b8] font-july font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>অটোফিল</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-july font-bold text-slate-500 hover:text-[#2375b8]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল ওয়েবসাইটে ফিরে যান</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
