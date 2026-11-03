# মাস্তুল-ধাঁচের মানবিক ফাউন্ডেশন ওয়েবসাইট ও অ্যাডমিন প্যানেল (Full-Stack)

`https://www.mastul.net/`-এর আদলে নির্মিত সম্পূর্ণ বাংলা ও ইংরেজি (Bilingual) ফাউন্ডেশন ওয়েবসাইট, ডোনেশন ও রশিদ সিস্টেম, যাকাত ক্যালকুলেটর এবং পূর্ণাঙ্গ অ্যাডমিন প্যানেল।

## ব্যবহৃত সর্বশেষ প্রযুক্তিসমূহ (Tech Stack)
- **Backend:** Python 3.13 + FastAPI + SQLAlchemy 2.1 (Async) + Psycopg v3 + JWT + Bcrypt
- **Database:** Neon Serverless PostgreSQL 18 (`DATABASE_URL` & `DATABASE_URL_POOLED`)
- **Frontend:** Next.js 16 (App Router + Turbopack) + React 19 + TypeScript 5 + Tailwind CSS v4
- **Typography:** কাস্টম ডাউনলোডকৃত **July** (হেডিং/বাটন) ও **Kalpurush** (বডি টেক্সট) ইউনিকোড বাংলা ফন্ট

---

## রান করার নিয়ম (Quick Start)

### ১. এক কমান্ডে চালু করুন:
```bash
chmod +x /root/fundation/start.sh
/root/fundation/start.sh
```

### ২. আলাদাভাবে চালু করতে চাইলে:
**Backend (Port 8000):**
```bash
cd /root/fundation/backend
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend (Port 3000):**
```bash
cd /root/fundation/frontend
npm run dev
```

---

## লিংক ও ডিফল্ট অ্যাডমিন লগইন
- **মূল ওয়েবসাইট:** `http://localhost:3000`
- **অ্যাডমিন প্যানেল:** `http://localhost:3000/admin`
- **API ডকুমেন্টেশন (Swagger):** `http://localhost:8000/docs`
- **ডিফল্ট অ্যাডমিন ইমেইল:** `admin@foundation.org`
- **ডিফল্ট পাসওয়ার্ড:** `Admin@12345`
