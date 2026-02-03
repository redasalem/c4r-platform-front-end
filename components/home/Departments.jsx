"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Business, DirectionsCar, ArrowBack, Star } from "@mui/icons-material";

const Departments = () => {
  return (
    <section
      className="py-24 bg-transparent relative overflow-hidden"
      dir="rtl"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tighter">
            ارتقِ{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-primary">
              بتجربتك
            </span>
          </h2>
          <div className="w-16 md:w-24 h-1.5 md:h-2 bg-linear-to-r from-primary to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {/* Card 1: Chauffeur Service */}
          <Link
            href="/with-driver"
            className="group relative h-[300px] sm:h-[350px] md:h-[450px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 active:scale-95 border border-white/10"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/car-with-driver.webp"
                alt="Car with driver"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Professional Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-l from-midnight/95 via-midnight/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10 z-10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors duration-500">
                  <DirectionsCar
                    sx={{ fontSize: { xs: 24, md: 36 } }}
                    className="text-white"
                  />
                </div>
                <Star
                  className="text-white/50 group-hover:text-accent transition-colors duration-500"
                  sx={{ fontSize: { xs: 24, md: 32 } }}
                />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-linear-to-r from-accent to-primary transition-all duration-500">
                  سيارة مع سائق
                </h3>
                <p className="text-slate-200 text-sm sm:text-lg md:text-xl mb-4 max-w-sm leading-relaxed font-bold opacity-90 line-clamp-2 md:line-clamp-none">
                  استمتع براحة تامة مع طاقم من السائقين المحترفين المدربين على
                  أعلى المستويات.
                </p>

                <div className="flex items-center gap-3 text-white font-black group-hover:gap-5 transition-all duration-300">
                  <span className="text-sm sm:text-xl group-hover:text-primary">
                    اكتشف الخدمة
                  </span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ArrowBack className="transform scale-75 sm:scale-100" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Corporate Section */}
          <Link
            href="/corporate"
            className="group relative h-[300px] sm:h-[350px] md:h-[450px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 active:scale-95 border border-white/10"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/car-companys.jpg"
                alt="Corporate Services"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Professional Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-l from-midnight/95 via-midnight/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10 z-10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors duration-500">
                  <Business
                    sx={{ fontSize: { xs: 24, md: 36 } }}
                    className="text-white"
                  />
                </div>
                <div className="px-3 md:px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] md:text-xs font-black text-white uppercase tracking-widest">
                  قطاع الأعمال
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-linear-to-r from-accent to-primary transition-all duration-500">
                  قسم الشركات
                </h3>
                <p className="text-slate-300 text-sm sm:text-lg md:text-xl mb-4 max-w-sm leading-relaxed font-bold opacity-90 line-clamp-2 md:line-clamp-none">
                  حلول سيارات متكاملة وعقود مرنة مصممة خصيصاً لتناسب حجم وتطلعات
                  أعمالك.
                </p>

                <div className="flex items-center gap-3 text-white font-black group-hover:gap-5 transition-all duration-300">
                  <span className="text-sm sm:text-xl group-hover:text-primary">
                    شراكة الأعمال
                  </span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ArrowBack className="transform scale-75 sm:scale-100" />
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
