"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Business, DirectionsCar, ArrowBack, Star } from "@mui/icons-material";

const Departments = () => {
  return (
    <section className="py-12 md:py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
            اختر <span className="text-orange-500">خدمتك</span>
          </h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full opacity-80"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Card 1: Chauffeur Service */}
          <Link
            href="/chauffeur"
            className="group relative h-[280px] md:h-[320px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-orange-500/20 hover:-translate-y-2 border border-slate-200"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/car-with-driver.webp"
                alt="Car with driver"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Professional Gradient Overlay - Dark on Right (for text), Fade to Left */}
              <div className="absolute inset-0 bg-linear-to-l from-slate-900/90 via-slate-900/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 z-10">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-orange-500 transition-colors duration-500">
                  <DirectionsCar
                    style={{ fontSize: 36 }}
                    className="text-white"
                  />
                </div>
                <Star
                  className="text-white/50 group-hover:text-yellow-400 transition-colors duration-500"
                  style={{ fontSize: 32 }}
                />
              </div>

              <div>
                <h3 className="text-3xl md:text-4xl font-black mb-3 text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-orange-400 group-hover:from-orange-400 group-hover:to-amber-300 transition-all duration-500">
                  سيارة مع سائق
                </h3>
                <p className="text-gray-200 text-lg mb-4 max-w-sm leading-relaxed font-medium">
                  رفاهية بلا حدود.. استمتع برحلتك ودع القيادة لمحترفينا.
                </p>

                <div className="flex items-center gap-3 text-white font-bold group-hover:gap-5 transition-all duration-300">
                  <span className="text-lg group-hover:text-orange-400">
                    احجز خدمتك
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <ArrowBack fontSize="small" className="transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Corporate Section */}
          <Link
            href="/corporate"
            className="group relative h-[280px] md:h-[320px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-orange-500/20 hover:-translate-y-2 border border-slate-200"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/car-companys.jpg"
                alt="Corporate Services"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Professional Gradient Overlay - Dark on Right (for text), Fade to Left */}
              <div className="absolute inset-0 bg-linear-to-l from-slate-900/90 via-slate-900/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 z-10">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-orange-500 transition-colors duration-500">
                  <Business style={{ fontSize: 36 }} className="text-white" />
                </div>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white">
                  قطاع الأعمال
                </div>
              </div>

              <div>
                <h3 className="text-3xl md:text-4xl font-black mb-3 text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-orange-400 group-hover:from-orange-400 group-hover:to-amber-300 transition-all duration-500">
                  قسم الشركات
                </h3>
                <p className="text-gray-300 text-lg mb-4 max-w-sm leading-relaxed font-medium">
                  حلول سيارات متكاملة، عقود مرنة، وخدمة تناسب حجم أعمالك.
                </p>

                <div className="flex items-center gap-3 text-white font-bold group-hover:gap-5 transition-all duration-300">
                  <span className="text-lg group-hover:text-orange-400">
                    شراكة الأعمال
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <ArrowBack fontSize="small" className="transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Departments;
