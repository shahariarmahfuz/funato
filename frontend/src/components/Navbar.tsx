"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  X,
  Phone,
  Calculator,
  UserPlus,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { settings } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "হোম" },
    { href: "/donate", label: "কার্যক্রমসমূহ" },
    { href: "/zakat-calculator", label: "যাকাত ক্যালকুলেটর" },
    { href: "/about-mastul", label: "আমাদের সম্পর্কে" },
    { href: "/be-a-volunteer", label: "স্বেচ্ছাসেবক হোন" },
    { href: "/news-stories", label: "নিউজ & স্টোরিজ" },
    { href: "/mastul-media", label: "ভিডিও গ্যালারি" },
    { href: "/contact", label: "যোগাযোগ" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full no-print">
      {/* Main Navigation - Clean, modern, slim single-tier header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo without any border or box */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="ভ্রাতৃত্ব ফাউন্ডেশন লোগো"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <span className="font-july font-bold text-[16px] sm:text-[20px] text-[#0f4c75] tracking-tight group-hover:text-[#2375b8] transition">
                {settings.org_name_bn}
              </span>
              <span className="text-[10px] text-slate-500 hidden md:block">
                মানবতার কল্যাণে নিবেদিত
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] xl:text-sm font-july font-bold transition ${
                  isActive(item.href)
                    ? "bg-[#f0f7fd] text-[#2375b8]"
                    : "text-slate-700 hover:text-[#2375b8] hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls: Compact Donate Button + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2375b8] to-[#1788bf] hover:from-[#1b619c] hover:to-[#1374a6] text-white font-july font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm shadow-xs hover:shadow-sm transition cursor-pointer shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>দান করুন</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-xl animate-in fade-in duration-150">
            {/* Quick Hotline Call Card */}
            <a
              href={`tel:${settings.phone_hotline}`}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 text-[#0f4c75] border border-sky-100 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2375b8] text-white flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">২৪/৭ হটলাইন সহায়তা</span>
                  <span className="font-bold text-xs text-[#0f4c75]">{settings.phone_hotline}</span>
                </div>
              </div>
              <span className="text-[11px] font-july font-bold text-[#2375b8] bg-white px-2 py-1 rounded-md border border-sky-200">
                কল করুন
              </span>
            </a>

            {/* Navigation Links */}
            <div className="space-y-1 pt-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-july font-bold text-sm ${
                    isActive(item.href)
                      ? "bg-[#f0f7fd] text-[#2375b8]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Quick Actions (Zakat & Volunteer) */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                href="/zakat-calculator"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 text-amber-800 font-july font-bold text-xs"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>যাকাত হিসাব</span>
              </Link>
              <Link
                href="/be-a-volunteer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-sky-50 text-[#2375b8] font-july font-bold text-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>স্বেচ্ছাসেবক</span>
              </Link>
            </div>

            {/* Discreet Admin Login at the very bottom of the drawer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 px-1">
              <Link
                href="/gov-tax-rebate"
                onClick={() => setMobileOpen(false)}
                className="hover:text-slate-600 transition"
              >
                আয়কর রেয়াত
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 transition"
              >
                <Lock className="w-3 h-3" />
                <span>অ্যাডমিন পোর্টাল</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
