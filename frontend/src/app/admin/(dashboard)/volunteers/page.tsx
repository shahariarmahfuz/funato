"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { adminFetch, formatDate } from "@/lib/api";
import { Volunteer } from "@/lib/types";

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const load = () => {
    adminFetch<Volunteer[]>("/api/admin/volunteers")
      .then(setVolunteers)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await adminFetch(`/api/admin/volunteers/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, admin_note: "" }),
    });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("আবেদনটি মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/volunteers/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
          স্বেচ্ছাসেবক আবেদন তালিকা ({volunteers.length})
        </h1>
        <p className="text-xs text-slate-500">
          ওয়েবসাইটে নিবন্ধিত স্বেচ্ছাসেবকদের তথ্য দেখুন এবং অনুমোদন করুন
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-july">
              <tr>
                <th className="px-4 py-3">নাম ও যোগাযোগ</th>
                <th className="px-4 py-3">জেলা ও রক্তের গ্রুপ</th>
                <th className="px-4 py-3">দক্ষতা ও আগ্রহ</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {volunteers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5">
                    <div className="font-july font-bold text-slate-900">{v.full_name}</div>
                    <div className="text-xs text-slate-500">
                      {v.phone} {v.email ? `• ${v.email}` : ""}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {v.occupation} • {formatDate(v.created_at, "bn")}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs">
                    <span className="font-semibold text-slate-800">{v.district}</span>
                    {v.blood_group && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">
                        {v.blood_group}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 max-w-xs">
                    <div>{v.skills}</div>
                    {v.why_join && (
                      <div className="text-slate-400 italic mt-0.5">{v.why_join}</div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        v.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : v.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => updateStatus(v.id, "approved")}
                      title="Approve"
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(v.id, "rejected")}
                      title="Reject"
                      className="p-1.5 rounded-lg bg-amber-50 text-amber-700 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(v.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
