"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, LocalOffer, ArrowBack } from "@mui/icons-material";

const HeroAd = () => {
  return (
    <div className="w-full pt-[4.5rem] md:pt-[5.5rem] bg-gray-50 pb-8">
      {" "}
      {/* Padding top to clear fixed navbar */}
      <div className="container mx-auto px-4 md:px-6">
        {/* Ad Container */}
        <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/car-home.png"
              alt="Luxury Car Fleet"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Strong Dark Overlay for Contrast */}
            <div className="absolute inset-0 bg-slate-900/50"></div>
          </div>

          {/* Ad Content Overlay */}
          <div
            className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-12 text-white"
            dir="rtl"
          >
            {/* Main Headlines with Background for Clarity */}
            <div className="bg-black/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 mb-6 max-w-2xl">
              <div className="mb-2 md:mb-4 inline-block bg-red-600 text-white font-black text-xs md:text-sm px-4 py-1 rounded-full shadow-lg animate-pulse">
                <LocalOffer
                  className="text-yellow-300 inline-block ml-1"
                  fontSize="small"
                />
                <span>خصم 30% لفترة محدودة</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-black leading-tight mb-2">
                <span className="text-orange-400">انطلق بفخامة..</span> وسهولة!
              </h1>
              <p className="text-base md:text-lg font-medium text-gray-200">
                سيارات حديثة وخيارات متعددة تناسب جميع احتياجاتك.
              </p>
            </div>

            {/* Distinct Region Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-4xl">
              {/* Eastern Region */}
              <Link
                href="/eastern"
                className="group/card relative h-16 md:h-20 rounded-xl overflow-hidden shadow-lg border border-transparent hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-slate-800/90 group-hover/card:bg-slate-900 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-lg md:text-xl font-black text-orange-500 group-hover/card:text-orange-400 transition-colors">
                    المنطقة الشرقية
                  </h3>
                </div>
              </Link>

              {/* Riyadh */}
              <Link
                href="/riyadh"
                className="group/card relative h-16 md:h-20 rounded-xl overflow-hidden shadow-lg border border-transparent hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-slate-800/90 group-hover/card:bg-slate-900 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-lg md:text-xl font-black text-orange-500 group-hover/card:text-orange-400 transition-colors">
                    مدينة الرياض
                  </h3>
                </div>
              </Link>

              {/* Jeddah */}
              <Link
                href="/jeddah"
                className="group/card relative h-16 md:h-20 rounded-xl overflow-hidden shadow-lg border border-transparent hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-slate-800/90 group-hover/card:bg-slate-900 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-lg md:text-xl font-black text-orange-500 group-hover/card:text-orange-400 transition-colors">
                    مدينة جدة
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAd;
