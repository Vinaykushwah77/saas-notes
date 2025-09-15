import React from "react";
import Link from "next/link";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">SaaS Notes</h1>
        <nav className="space-x-4">
          <Link href="/" className="text-blue-500 hover:underline">
            Home
          </Link>
          <Link href="/notes" className="text-blue-500 hover:underline">
            Notes
          </Link>
          <Link href="/profile" className="text-blue-500 hover:underline">
            Profile
          </Link>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto p-6">{children}</main>
    </div>
  );
}
