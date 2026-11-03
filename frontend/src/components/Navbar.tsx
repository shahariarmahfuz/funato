"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  X,
  Phone,
  ShieldCheck,
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
      {/* Top Utility Bar - Ultra sleek & thin */}
      <div className="bg-[#0b2942] text-white text-[11px] sm:text-xs py-1 px-3 sm:px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${settings.phone_hotline}`}
              className="inline-flex items-center gap-1.5 text-sky-200 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span>{settings.phone_hotline}</span>
            </a>
            <Link
              href="/gov-tax-rebate"
              className="hidden md:inline-flex items-center gap-1 text-amber-200 hover:text-amber-100"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>অনুদানে আয়কর রেয়াত (Tax Rebate)</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <Link
              href="/be-a-volunteer"
              className="inline-flex items-center gap-1 hover:text-sky-200 transition"
            >
              <UserPlus className="w-3 h-3 text-sky-400" />
              <span>স্বেচ্ছাসেবক হোন</span>
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/shariah-board"
              className="hidden sm:inline-flex items-center gap-1 hover:text-sky-200 transition"
            >
              <span>শরিয়াহ বোর্ড</span>
            </Link>
            <span className="hidden sm:inline text-white/20">|</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[10px] sm:text-[11px] transition"
            >
              <Lock className="w-2.5 h-2.5 text-sky-300" />
              <span>অ্যাডমিন</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation - Sleek, thin header (h-14 / 56px) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-15 flex items-center justify-between gap-2 sm:gap-4">
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
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-july font-bold transition ${
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
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-lg animate-in fade-in duration-150">
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
          </div>
        )}
      </div>
    </header>
  );
}
