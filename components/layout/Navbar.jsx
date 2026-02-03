"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AdminPanelSettings,
  Person,
  Language,
  DarkMode,
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
  Business,
  EventNote,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import Tooltip from "@/components/ui/Tooltip";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showTopBar, setShowTopBar] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
          {/* Right Side: Optimized for Mobile */}
          <div className="flex items-center gap-2 sm:gap-6 h-full">
            <Link
              href="/corporate"
              className="hover:text-orange-200 transition-all duration-300 border-l border-orange-700/30 pl-3 sm:pl-6 h-full flex items-center active:scale-95"
            >
              <Tooltip text="قسم الشركات" position="bottom">
                <Business className="md:hidden" style={{ fontSize: 20 }} />
                <span className="hidden md:inline">قسم الشركات</span>
              </Tooltip>
            </Link>
            <Link
              href="/with-driver"
              className="hover:text-orange-200 transition-all duration-300 border-l border-orange-700/30 pl-3 sm:pl-6 h-full flex items-center active:scale-95"
            >
              <Tooltip text="سيارات بسائق" position="bottom">
                <Person className="md:hidden" style={{ fontSize: 20 }} />
                <span className="hidden md:inline">سيارات بسائق</span>
              </Tooltip>
            </Link>
            <Link
              href="/policy"
              className="hover:text-orange-200 transition-all duration-300 border-l border-orange-700/30 pl-3 sm:pl-6 h-full flex items-center active:scale-95"
            >
              <Tooltip text="سياسة الاسترجاع" position="bottom">
                <EventNote className="md:hidden" style={{ fontSize: 20 }} />
                <span className="hidden md:inline">
                  سياسة الاسترجاع والتبديل
                </span>
              </Tooltip>
            </Link>
          </div>

          {/* Left Side: Language (Hidden on mobile to save space) */}
          <div className="hidden sm:flex items-center gap-4">
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
      <div className="bg-midnight border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto px-6 py-3" dir="rtl">
          <div className="flex items-center justify-between">
            {/* RIGHT: City Links + Home */}
            <nav className="hidden md:flex items-center gap-6 min-w-max">
              <Link
                href="/"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors flex items-center gap-1"
              >
                <Home fontSize="small" />
                الرئيسية
              </Link>
              <Link
                href="/cars"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors flex items-center gap-1 border-l border-white/10 pl-6"
              >
                <DirectionsCar fontSize="small" />
                السيارات
              </Link>
              <Link
                href="/jeddah"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors"
              >
                حجز مدينة جدة
              </Link>
              <Link
                href="/riyadh"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors"
              >
                حجز في مدينة الرياض
              </Link>
            </nav>

            {/* CENTER: LOGO - Centered and Scale-Optimized */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-auto md:top-auto md:translate-x-0 md:translate-y-0 shrink-0 px-2 sm:px-4">
              <Link
                href="/"
                className="block active:scale-95 transition-transform"
              >
                <div className="relative h-14 w-14 sm:h-18 sm:w-18 md:h-28 md:w-28 rounded-full overflow-hidden border-2 sm:border-4 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] sm:shadow-[0_0_25px_rgba(249,115,22,0.4)] bg-white flex items-center justify-center group hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] transition-all duration-500">
                  <Image
                    src="/images/logo.jpg"
                    alt="C4R Logo"
                    fill
                    className="object-contain p-1 sm:p-1.5 group-hover:scale-110 transition-transform duration-500"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* LEFT: ICONS (Admin, Login) - Strictly Role-Gated */}
            <div className="flex items-center gap-2 sm:gap-6 min-w-max justify-end z-10">
              {/* User Dashboard icon / Login Button */}
              {mounted && (
                <>
                  {user ? (
                    <div className="flex items-center gap-1 sm:gap-4 border-r border-white/10 pr-1 sm:pr-4">
                      <Link
                        href={
                          user.role === "admin"
                            ? "/dashboard/admin"
                            : "/dashboard/user"
                        }
                        className="flex items-center justify-center gap-2 text-primary hover:text-primary-hover transition-colors active:scale-95 min-h-[44px] min-w-[44px]"
                        title={user.role === "admin" ? "لوحة الإدارة" : "حسابي"}
                      >
                        {user.role === "admin" ? (
                          <AdminPanelSettings className="text-orange-500" />
                        ) : (
                          <Person />
                        )}
                        <span className="hidden lg:inline text-sm font-extrabold">
                          {user.role === "admin" ? "لوحة الإدارة" : "حسابي"}
                        </span>
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center justify-center text-red-500 hover:text-red-400 transition-colors active:scale-95 min-h-[44px] min-w-[44px]"
                        title="تسجيل الخروج"
                      >
                        <Logout fontSize="small" />
                        <span className="hidden lg:inline text-sm font-extrabold mr-1">
                          خروج
                        </span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center gap-2 text-primary hover:text-primary-hover transition-colors border-r border-white/10 pr-2 sm:pr-4 active:scale-95 min-h-[44px] min-w-[44px]"
                      title="تسجيل الدخول"
                    >
                      <Person />
                      <span className="hidden lg:inline text-sm font-extrabold">
                        تسجيل الدخول
                      </span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
