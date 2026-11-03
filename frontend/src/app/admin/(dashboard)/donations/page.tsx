"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { adminFetch, formatBDT, formatDate } from "@/lib/api";
import { Donation } from "@/lib/types";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDonations = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    adminFetch<Donation[]>(`/api/admin/donations?${params.toString()}`)
      .then(setDonations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter, search]);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const changeStatus = async (id: number, status: string) => {
    await adminFetch(`/api/admin/donations/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    loadDonations();
  };

  const removeDonation = async (id: number) => {
    if (!confirm("আপনি কি এই অনুদান রেকর্ডটি মুছে ফেলতে নিশ্চিত?")) return;
    await adminFetch(`/api/admin/donations/${id}`, { method: "DELETE" });
    loadDonations();
  };

  const exportCsv = () => {
    const header = [
      "ReceiptNo",
      "DonorName",
      "Phone",
      "Fund",
      "Amount",
      "Method",
      "TrxID",
      "Status",
      "CreatedAt",
    ];
    const rows = donations.map((d) => [
      d.receipt_no,
      `"${d.donor_name.replace(/"/g, '""')}"`,
      d.donor_phone,
      `"${d.campaign_title_en.replace(/"/g, '""')}"`,
      d.amount,
      d.payment_method,
      d.transaction_id || "",
      d.status,
      d.created_at,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
            অনুদান ও ট্রানজেকশন ভেরিফিকেশন
          </h1>
          <p className="text-xs text-slate-500">
            সকল অনলাইন ও ম্যানুয়াল সেন্ড-মানি অনুদান যাচাই, অনুমোদন ও CSV এক্সপোর্ট করুন
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f4c75] text-white font-july font-bold text-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>CSV এক্সপোর্ট</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: "all", label: "সকল অনুদান" },
            { id: "pending", label: "অপেক্ষমাণ (Pending)" },
            { id: "completed", label: "ভেরিফায়েড (Completed)" },
            { id: "rejected", label: "বাতিল (Rejected)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-july font-bold text-xs cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#2375b8] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="রশিদ, নাম, মোবাইল বা TrxID খুঁজুন..."
            className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-july">
              <tr>
                <th className="px-4 py-3">রশিদ</th>
                <th className="px-4 py-3">দাতার তথ্য</th>
                <th className="px-4 py-3">তহবিল</th>
                <th className="px-4 py-3">পরিমাণ</th>
                <th className="px-4 py-3">পেমেন্ট ও TrxID</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    কোনো অনুদান রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/donation/receipt/${d.receipt_no}`}
                        target="_blank"
                        className="font-mono text-xs font-bold text-[#2375b8] inline-flex items-center gap-1 hover:underline"
                      >
                        {d.receipt_no}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <div className="text-[11px] text-slate-400">
                        {formatDate(d.created_at, "bn")}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{d.donor_name}</div>
                      <div className="text-xs text-slate-500">{d.donor_phone}</div>
                      {d.note && (
                        <div className="text-xs text-amber-700 mt-0.5 italic">
                          &ldquo;{d.note}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{d.campaign_title_bn}</td>
                    <td className="px-4 py-3.5 font-july font-bold text-slate-900">
                      {formatBDT(d.amount, "bn")}
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      <span className="uppercase font-bold text-slate-800">
                        {d.payment_method}
                      </span>
                      {d.sender_number && (
                        <div className="text-slate-500">From: {d.sender_number}</div>
                      )}
                      <div className="font-mono text-slate-600">
                        Trx: {d.transaction_id || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-july font-bold ${
                          d.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : d.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {d.status !== "completed" && (
                          <button
                            type="button"
                            onClick={() => changeStatus(d.id, "completed")}
                            title="Approve"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {d.status !== "rejected" && (
                          <button
                            type="button"
                            onClick={() => changeStatus(d.id, "rejected")}
                            title="Reject"
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeDonation(d.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
