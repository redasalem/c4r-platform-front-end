"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@mui/material";
import {
  Dashboard,
  DirectionsCar,
  EventNote,
  Person,
  Logout,
  Settings,
  AddCircle,
  Star,
  Home,
} from "@mui/icons-material";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null; // Or a loader

  const isAdmin = user.role === "admin";
  const prefix = isAdmin ? "/dashboard/admin" : "/dashboard/user";

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userLinks = [
    { name: "ملفي الشخصي", href: `${prefix}?tab=profile`, icon: <Person /> },
    { name: "حجوزاتي", href: `${prefix}?tab=bookings`, icon: <EventNote /> },
    {
      name: "تغيير كلمة المرور",
      href: `${prefix}?tab=password`,
      icon: <Settings />,
    },
  ];

  const adminLinks = [
    {
      name: "إدارة الحجوزات",
      href: `${prefix}?tab=bookings`,
      icon: <EventNote />,
    },
    {
      name: "إدارة السيارات",
      href: `${prefix}?tab=cars`,
      icon: <DirectionsCar />,
    },
    {
      name: "إدارة التعليقات",
      href: `${prefix}?tab=reviews`,
      icon: <Star />,
    },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const searchParams = useSearchParams();
  const currentTab =
    searchParams.get("tab") || (isAdmin ? "bookings" : "profile");

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex"
      dir="rtl"
    >
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 hidden md:flex flex-col fixed h-full right-0 z-10 shadow-xl pt-20">
        {/* User Info Card */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#f97316",
                fontFamily: "inherit",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{user?.name}</h3>
              <p className="text-xs text-slate-400">
                {isAdmin ? "مدير النظام" : "عميل مسجل"}
              </p>
            </div>
          </div>
        </div>

        {/* Home Link */}
        <div className="px-4 pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 border border-slate-200"
          >
            <Home className="text-slate-500" />
            <span>الصفحة الرئيسية</span>
          </Link>
        </div>

        {/* Navigation Title */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            القائمة الرئيسية
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          {links.map((link) => {
            const linkTab =
              link.href.split("?tab=")[1] || (isAdmin ? "bookings" : "profile");
            const currentTabValue =
              currentTab || (isAdmin ? "bookings" : "profile");
            const isActive = linkTab === currentTabValue;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-l from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/30"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span
                  className={`${isActive ? "text-white" : "text-orange-500"}`}
                >
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-bold text-white bg-gradient-to-l from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 transition-all shadow-lg shadow-red-500/20"
          >
            <Logout />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:mr-72 pt-6">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
