"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AdminPanelSettings,
  Person,
  Search,
  Language,
  DarkMode, // Representing the moon icon in reference
  Menu,
  Close,
  DirectionsCar,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  Dashboard,
  Logout,
  Home,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showTopBar, setShowTopBar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide top bar after scrolling 50px
      if (window.scrollY > 50) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          TOP BAR (Disappears on Scroll)
          Matches reference: "Corporate", "Policy", "Region"
          Background: Dark Gray (Reference style)
      ───────────────────────────────────────────────────────────── */}
      <div
        className={`bg-gray-800 text-orange-400 text-sm font-medium tracking-wide transition-all duration-500 ease-in-out overflow-hidden ${
          showTopBar ? "h-11 opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div
          className="container mx-auto h-full flex items-center justify-between px-6"
          dir="rtl"
        >
          {/* Right Side: Exact Text from Reference */}
          <div className="flex items-center gap-6">
            <Link
              href="/corporate"
              className="hover:text-orange-200 transition-colors border-l border-orange-700 pl-6"
            >
              <span>قسم الشركات</span>
            </Link>
            <Link
              href="/with-driver"
              className="hover:text-orange-200 transition-colors border-l border-orange-700 pl-6"
            >
              <span>سيارات بسائق</span>
            </Link>
            <Link
              href="/policy"
              className="hover:text-orange-200 transition-colors border-l border-orange-700 pl-6"
            >
              <span>سياسة الاسترجاع والتبديل</span>
            </Link>
            <Link
              href="/region-eastern"
              className="hover:text-orange-200 transition-colors"
            >
              <span>حجز المنطقة الشرقية</span>
            </Link>
          </div>

          {/* Left Side: Language */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-orange-200 transition-colors">
              <span>العربية</span>
              <Language style={{ fontSize: 18, marginTop: -2 }} />
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN NAVBAR (Always Visible)
          Matches reference: City Links (Right), Logo (Center), Icons (Left)
          Background: Dark Gray/Black (Reference) or Light (C4R)? 
          User said "Same picture... but colors will differ". 
          We will use a Dark Blue/Gray theme for "Premium" look.
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-b border-gray-800 transition-all duration-300">
        <div className="container mx-auto px-6 py-3" dir="rtl">
          <div className="flex items-center justify-between">
            {/* RIGHT: City Links + Home */}
            <nav className="hidden md:flex items-center gap-6 min-w-max">
              <Link
                href="/"
                className="text-orange-400 hover:text-orange-300 font-bold text-sm lg:text-base transition-colors flex items-center gap-1"
              >
                <Home fontSize="small" />
                الرئيسية
              </Link>
              <Link
                href="/cars"
                className="text-orange-400 hover:text-orange-300 font-bold text-sm lg:text-base transition-colors flex items-center gap-1 border-l border-orange-700/50 pl-6"
              >
                <DirectionsCar fontSize="small" />
                السيارات
              </Link>
              <Link
                href="/eastern"
                className="text-orange-400 hover:text-orange-300 font-bold text-sm lg:text-base transition-colors"
              >
                حجز المنطقة الشرقية
              </Link>
              <Link
                href="/jeddah"
                className="text-orange-400 hover:text-orange-300 font-bold text-sm lg:text-base transition-colors"
              >
                حجز مدينة جدة
              </Link>
              <Link
                href="/riyadh"
                className="text-orange-400 hover:text-orange-300 font-bold text-sm lg:text-base transition-colors"
              >
                حجز في مدينة الرياض
              </Link>
            </nav>

            {/* CENTER: LOGO */}
            <div className="shrink-0 mx-auto px-4">
              <Link href="/">
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg bg-white flex items-center justify-center">
                  {/* Using a white container logic if logo is transparent/dark, 
                      or just placing it. Assuming logo needs to stand out on dark bg */}
                  <Image
                    src="/images/logo.jpg"
                    alt="C4R Logo"
                    fill
                    className="object-contain p-1"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* LEFT: ICONS (Search, Admin, Login, Moon) */}
            <div className="flex items-center gap-4 min-w-max justify-end text-orange-400">
              {/* Moon Icon (From Reference) */}
              <button className="text-orange-400 hover:text-orange-300 transition-colors">
                <DarkMode fontSize="small" />
              </button>

              {/* Search Icon */}
              <button className="text-orange-400 hover:text-orange-300 transition-colors">
                <Search />
              </button>

              {/* User Dashboard icon / Login Button */}
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href={
                      user.role === "admin"
                        ? "/dashboard/admin"
                        : "/dashboard/user"
                    }
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                    title={user.role === "admin" ? "لوحة الإدارة" : "حسابي"}
                  >
                    {user.role === "admin" ? (
                      <AdminPanelSettings />
                    ) : (
                      <Person />
                    )}
                    <span className="hidden lg:inline text-sm">
                      {user.role === "admin" ? "لوحة الإدارة" : "حسابي"}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors"
                    title="تسجيل الخروج"
                  >
                    <Logout fontSize="small" />
                    <span className="hidden lg:inline text-sm font-bold">
                      خروج
                    </span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                  title="تسجيل الدخول"
                >
                  <Person />
                  <span className="hidden lg:inline text-sm font-bold">
                    تسجيل الدخول
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
