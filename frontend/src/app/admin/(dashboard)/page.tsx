"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FolderHeart,
  Inbox,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import { adminFetch, formatBDT, formatDate } from "@/lib/api";
import { DashboardData } from "@/lib/types";

export default function AdminOverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = () => {
    setLoading(true);
    adminFetch<DashboardData>("/api/admin/dashboard")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const quickApprove = async (id: number) => {
    await adminFetch(`/api/admin/donations/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "completed" }),
    });
    loadDashboard();
  };

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-white animate-pulse" />
        ))}
      </div>
    );
  }

  const { kpis, recent_donations, top_campaigns, payment_breakdown } = data;

  const cards = [
    {
      label: "মোট ভেরিফায়েড অনুদান সংগ্রহ",
      val: formatBDT(kpis.total_raised, "bn"),
      sub: `${kpis.completed_donations} টি সফল ট্রানজেকশন`,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "ভেরিফিকেশন অপেক্ষমাণ (Pending)",
      val: String(kpis.pending_donations),
      sub: "ম্যানুয়াল TrxID যাচাই করুন",
      icon: Clock,
      color: "bg-amber-50 text-amber-700",
      href: "/admin/donations",
    },
    {
      label: "সক্রিয় তহবিল ও প্রকল্পসমূহ",
      val: String(kpis.active_campaigns),
      sub: "ওয়েবসাইটে চলমান ক্যাম্পেইন",
      icon: FolderHeart,
      color: "bg-sky-50 text-[#2375b8]",
      href: "/admin/campaigns",
    },
    {
      label: "স্বেচ্ছাসেবক আবেদন",
      val: `${kpis.volunteers_total} জন`,
      sub: `${kpis.volunteers_pending} জন অনুমোদনের অপেক্ষায়`,
      icon: Users,
      color: "bg-purple-50 text-purple-700",
      href: "/admin/volunteers",
    },
    {
      label: "অপঠিত বার্তা ও ইনবক্স",
      val: String(kpis.unread_messages),
      sub: "যোগাযোগ ও শেল্টারহোম লিড",
      icon: Inbox,
      color: "bg-rose-50 text-rose-700",
      href: "/admin/messages",
    },
    {
      label: "প্রকাশিত নিউজ ও স্টোরিজ",
      val: String(kpis.posts_count),
      sub: "মিডিয়া ও ব্লগ পোস্ট",
      icon: Receipt,
      color: "bg-indigo-50 text-indigo-700",
      href: "/admin/posts",
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          const inner = (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 transition flex items-start justify-between">
              <div>
                <div className="text-xs font-july font-bold text-slate-500">
                  {c.label}
                </div>
                <div className="text-2xl sm:text-3xl font-july font-bold text-slate-900 mt-1">
                  {c.val}
                </div>
                <div className="text-xs text-slate-500 mt-1">{c.sub}</div>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
          return c.href ? (
            <Link key={idx} href={c.href}>
              {inner}
            </Link>
          ) : (
            <div key={idx}>{inner}</div>
          );
        })}
      </div>

      {/* Top Campaigns + Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-july font-bold text-lg text-[#0f4c75]">
              শীর্ষ তহবিলসমূহের অগ্রগতি (Top Funds)
            </h3>
            <Link
              href="/admin/campaigns"
              className="text-xs font-july font-bold text-[#2375b8] hover:underline"
            >
              সকল তহবিল পরিচালনা →
            </Link>
          </div>
          <div className="space-y-4">
            {top_campaigns.map((camp) => {
              const pct =
                camp.goal_amount > 0
                  ? Math.min(100, Math.round((camp.raised_amount / camp.goal_amount) * 100))
                  : 0;
              return (
                <div key={camp.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-july font-bold text-slate-800">
                      {camp.name_bn}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {formatBDT(camp.raised_amount, "bn")} /{" "}
                      {formatBDT(camp.goal_amount, "bn")} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2375b8]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-july font-bold text-lg text-[#0f4c75]">
            পেমেন্ট মাধ্যম অনুযায়ী সংগ্রহ
          </h3>
          <div className="space-y-3">
            {payment_breakdown.map((pm) => (
              <div
                key={pm.method}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm"
              >
                <div>
                  <div className="uppercase font-july font-bold text-slate-800">
                    {pm.method}
                  </div>
                  <div className="text-xs text-slate-500">{pm.count} টি অনুদান</div>
                </div>
                <div className="font-july font-bold text-[#2375b8]">
                  {formatBDT(pm.total, "bn")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-july font-bold text-lg text-[#0f4c75]">
            সাম্প্রতিক অনুদানসমূহ (Recent Donations)
          </h3>
          <Link
            href="/admin/donations"
            className="text-xs font-july font-bold text-[#2375b8] hover:underline"
          >
            সকল অনুদান দেখুন →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-july">
              <tr>
                <th className="px-5 py-3">রশিদ নম্বর</th>
                <th className="px-5 py-3">দাতা ও মোবাইল</th>
                <th className="px-5 py-3">তহবিল</th>
                <th className="px-5 py-3">পরিমাণ</th>
                <th className="px-5 py-3">মাধ্যম / TrxID</th>
                <th className="px-5 py-3">স্ট্যাটাস</th>
                <th className="px-5 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent_donations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#2375b8]">
                    <Link href={`/donation/receipt/${d.receipt_no}`} target="_blank">
                      {d.receipt_no}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900">{d.donor_name}</div>
                    <div className="text-xs text-slate-500">
                      {d.donor_phone} • {formatDate(d.created_at, "bn")}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{d.campaign_title_bn}</td>
                  <td className="px-5 py-3.5 font-july font-bold text-slate-900">
                    {formatBDT(d.amount, "bn")}
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <span className="uppercase font-bold block">{d.payment_method}</span>
                    <span className="font-mono text-slate-500">{d.transaction_id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-july font-bold ${
                        d.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : d.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {d.status === "completed"
                        ? "ভেরিফায়েড"
                        : d.status === "pending"
                        ? "অপেক্ষমাণ"
                        : "বাতিল"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {d.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => quickApprove(d.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-july font-bold cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>অনুমোদন</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
