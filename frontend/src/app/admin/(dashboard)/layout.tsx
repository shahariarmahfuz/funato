"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  FolderHeart,
  Heart,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Users,
  Video,
  X,
} from "lucide-react";
import { adminFetch, getAdminToken, setAdminToken } from "@/lib/api";
import { AdminUser } from "@/lib/types";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    adminFetch<AdminUser>("/api/admin/auth/me")
      .then((user) => {
        setAdmin(user);
        setChecking(false);
      })
      .catch(() => {
        setAdminToken(null);
        router.replace("/admin/login");
      });
  }, [router]);

  const handleLogout = () => {
    setAdminToken(null);
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#2375b8] font-july font-bold">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>অ্যাডমিন প্যানেল লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "ড্যাশবোর্ড ওভারভিউ", icon: LayoutDashboard },
    { href: "/admin/campaigns", label: "তহবিল ও প্রকল্পসমূহ", icon: FolderHeart },
    { href: "/admin/donations", label: "অনুদান ও ভেরিফিকেশন", icon: Receipt },
    { href: "/admin/slides", label: "হোমপেজ স্লাইডার", icon: ImageIcon },
    { href: "/admin/posts", label: "নিউজ ও স্টোরিজ", icon: FileText },
    { href: "/admin/media-team", label: "ভিডিও ও শরিয়াহ বোর্ড", icon: Video },
    { href: "/admin/volunteers", label: "স্বেচ্ছাসেবক তালিকা", icon: Users },
    { href: "/admin/messages", label: "বার্তা ও ইনবক্স", icon: Inbox },
    { href: "/admin/settings", label: "সাইট ও ব্যাংক সেটিংস", icon: Settings },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-68 bg-[#0b2942] text-white flex flex-col justify-between transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="h-17 px-5 flex items-center justify-between border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="ভ্রাতৃত্ব ফাউন্ডেশন লোগো"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-july font-bold text-base leading-tight">
                  ভ্রাতৃত্ব ফাউন্ডেশন
                </div>
                <div className="text-[11px] text-sky-300">অ্যাডমিন ড্যাশবোর্ড</div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-july font-bold text-sm transition ${
                    isActive(item.href)
                      ? "bg-[#2375b8] text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-white/5 text-xs">
            <div className="font-july font-bold text-white truncate">{admin?.name}</div>
            <div className="text-slate-400 truncate">{admin?.email}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-july font-bold text-xs transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-july font-bold text-lg text-[#0f4c75]">
              ফাউন্ডেশন ম্যানেজমেন্ট ড্যাশবোর্ড
            </h2>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f0f7fd] hover:bg-sky-100 text-[#2375b8] font-july font-bold text-xs sm:text-sm transition"
          >
            <span>ওয়েবসাইট দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
