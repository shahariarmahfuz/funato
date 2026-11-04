import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-clip">
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}
