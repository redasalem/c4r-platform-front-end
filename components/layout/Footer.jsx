"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Email,
  LocationOn,
  Instagram,
  Twitter,
  YouTube,
  DirectionsCar,
  KeyboardArrowLeft,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer
      className="bg-slate-900 text-gray-300 font-sans border-t border-gray-800"
      dir="rtl"
    >
      {/* 
        Hero Footer Section - CTA 
        Adds a nice visual break before the main footer 
      */}
      {/* Decorative Gradient Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 via-amber-500 to-orange-500"></div>
      <div className="bg-linear-to-r from-orange-600 to-orange-500 py-10 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              جاهز لانطلاقتك القادمة؟
            </h3>
            <p className="text-orange-100 text-sm md:text-base">
              احجز سيارتك الآن واستمتع بأفضل الأسعار والخدمات المميزة في
              المملكة.
            </p>
          </div>
          <Link
            href="/cars"
            className="group bg-white text-orange-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <span>عرض السيارات</span>
            <DirectionsCar className="transform group-hover:translate-x-[-4px] transition-transform" />
          </Link>
        </div>

        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            {/* Circular Logo Container */}
            <Link href="/" className="block relative h-20 w-20 mx-auto md:mx-0">
              <div className="absolute inset-0 bg-white rounded-full border-2 border-orange-500 overflow-hidden flex items-center justify-center shadow-lg">
                <Image
                  src="/images/logo.jpg"
                  alt="C4R Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-300 font-medium">
              منصة C4R هي وجهتك الأولى لتأجير السيارات الفاخرة والاقتصادية في
              المملكة. نقدم تجربة حجز سلسة، آمنة، وخدمة عملاء على مدار الساعة
              لتلبية كافة احتياجاتك.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {[
                { icon: <Instagram />, href: "#" },
                { icon: <Twitter />, href: "#" },
                { icon: <YouTube />, href: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-md"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 border-r-4 border-orange-500 pr-3">
              روابط سريعة
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: "من نحن", href: "/about" },
                { label: "الأسئلة الشائعة", href: "/faq" },
                { label: "الشروط والأحكام", href: "/terms" },
                { label: "سياسة الخصوصية", href: "/privacy" },
                { label: "تواصل معنا", href: "/contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors group"
                  >
                    <KeyboardArrowLeft
                      fontSize="small"
                      className="text-gray-500 group-hover:text-orange-500 transition-colors"
                    />
                    <span className="group-hover:translate-x-[-4px] transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Booking Locations */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 border-r-4 border-orange-500 pr-3">
              أماكن الحجز
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: "حجز المنطقة الشرقية", href: "/eastern" },
                { label: "حجز مدينة جدة", href: "/jeddah" },
                { label: "حجز مدينة الرياض", href: "/riyadh" },
                { label: "عروض خاصة", href: "/offers" },
                { label: "قسم الشركات", href: "/corporate" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors group"
                  >
                    <KeyboardArrowLeft
                      fontSize="small"
                      className="text-gray-500 group-hover:text-orange-500 transition-colors"
                    />
                    <span className="group-hover:translate-x-[-4px] transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 border-r-4 border-orange-500 pr-3">
              معلومات الاتصال
            </h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0 shadow-sm">
                  <Phone fontSize="small" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-1 font-semibold">
                    خدمة العملاء (24/7)
                  </span>
                  <a
                    href="tel:920000000"
                    className="text-lg font-bold text-white hover:text-orange-400 dir-ltr transition-colors"
                  >
                    920000000
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0 shadow-sm">
                  <Email fontSize="small" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-1 font-semibold">
                    البريد الإلكتروني
                  </span>
                  <a
                    href="mailto:support@c4r.com"
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    support@c4r.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-800 bg-black/20">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-orange-500 font-bold">C4R PLATFORM</span>.
            جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              الشروط والأحكام
            </Link>
            <span className="flex items-center gap-1">
              Powered by{" "}
              <span className="font-bold text-gray-400">C4R Tech</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
