 "use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { 
  FiGrid, 
  FiShoppingBag, 
  FiLayers, 
  FiTruck, 
  FiUsers, 
  FiHome, 
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logoutUser, loading } = useShop();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authenticate Admin session status
  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/admin/login");
      } else {
        setAuthorized(true);
      }
    }
  }, [user, loading, router, pathname]);

  const handleLogout = () => {
    logoutUser();
    router.push("/admin/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/admin", icon: <FiGrid className="w-4 h-4" /> },
    { label: "Products CRUD", path: "/admin/products", icon: <FiShoppingBag className="w-4 h-4" /> },
    { label: "Categories CRUD", path: "/admin/categories", icon: <FiLayers className="w-4 h-4" /> },
    { label: "Orders Manager", path: "/admin/orders", icon: <FiTruck className="w-4 h-4" /> },
    { label: "Customer Enquiries", path: "/admin/customers", icon: <FiUsers className="w-4 h-4" /> },
  ];

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex text-brand-dark-navy">
      {/* Mobile Sidebar Toggle Button */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 z-40 p-2.5 bg-white border border-brand-border rounded-xl md:hidden shadow-sm hover:text-brand-pink transition"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Sidebar Navigation Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark-navy text-white p-6 shadow-xl flex flex-col justify-between transform md:translate-x-0 transition-transform duration-300 md:static ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="space-y-8">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 overflow-hidden rounded-full flex-shrink-0 bg-white/5 p-0.5 border border-white/10">
                <img 
                  src="/images/logo.png" 
                  alt="niela logo" 
                  className="absolute w-[200%] h-[200%] max-w-none -top-[15%] left-1/2 -translate-x-1/2 object-cover brightness-0 invert" 
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">niela</span>
              <span className="w-1.5 h-1.5 bg-brand-pink rounded-full self-end mb-1"></span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold self-center ml-2 border border-brand-gold/30 px-1.5 py-0.5 rounded">Admin</span>
            </Link>
            {/* Close button mobile */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <FiX className="w-5 h-5 text-white/80 hover:text-white" />
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    active
                      ? "bg-brand-pink text-white shadow-md"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer options */}
        <div className="space-y-2.5 border-t border-white/10 pt-6">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white text-xs font-semibold transition"
          >
            <FiHome className="w-4 h-4" /> Customer Shop Home
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-xs font-semibold transition"
          >
            <FiLogOut className="w-4 h-4" /> Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Workspace Canvas */}
      <main className="flex-grow p-6 sm:p-10 pt-16 md:pt-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
