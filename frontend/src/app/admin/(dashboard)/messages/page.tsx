"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Trash2 } from "lucide-react";
import { adminFetch, formatDate } from "@/lib/api";
import { ContactMessage } from "@/lib/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const load = () => {
    adminFetch<ContactMessage[]>("/api/admin/messages")
      .then(setMessages)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const markResolved = async (id: number) => {
    await adminFetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "resolved" }),
    });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("বার্তাটি মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
          বার্তা ও শেল্টারহোম লিড ইনবক্স ({messages.length})
        </h1>
        <p className="text-xs text-slate-500">
          দাতা ও শুভানুধ্যায়ীদের পাঠানো যোগাযোগ বার্তা এবং শেল্টারহোম সদস্যপদ জিজ্ঞাসা
        </p>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
              m.status === "unread" ? "border-sky-300 shadow-xs" : "border-slate-200"
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#2375b8] text-xs font-july font-bold uppercase">
                  {m.inquiry_type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    m.status === "unread"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {m.status}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDate(m.created_at, "bn")}
                </span>
              </div>
              <h3 className="font-july font-bold text-base text-slate-900">
                {m.subject || "সাধারণ জিজ্ঞাসা"} — {m.name} ({m.phone})
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-line">{m.message}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {m.status !== "resolved" && (
                <button
                  type="button"
                  onClick={() => markResolved(m.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-july font-bold cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>সমাধান হয়েছে</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
