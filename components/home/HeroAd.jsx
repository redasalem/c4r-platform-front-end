"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LocalOffer } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const HeroAd = () => {
  const { t, i18n } = useTranslation("common");
  return (
    <div className="w-full pt-18 md:pt-22 bg-transparent pb-8 overflow-hidden">
      {" "}
      {/* Container with overflow-hidden to prevent horizontal scroll */}
      <div className="container mx-auto px-4 md:px-6">
        {/* Ad Container */}
        <div className="relative w-full h-[420px] md:h-[520px] rounded-[3rem] overflow-hidden shadow-2xl group border border-white/5">
          {/* Background Image - Restore Original */}
          <div className="absolute inset-0">
            <Image
              src="/images/car1.jpg"
              alt="Luxury Car Fleet"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-10000"
              priority
              sizes="100vw"
            />
            {/* Dark Overlay for Contrast */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
          </div>

          {/* Ad Content Overlay - Original Structure */}
          <div
            className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-12 text-white py-8 sm:py-10 md:py-12"
            dir={i18n.dir()}
          >
            {/* Main Headlines with Glassmorphism for Clarity */}
            <div className="bg-white/5 backdrop-blur-xl p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/10 mb-4 md:mb-6 max-w-2xl shadow-2xl relative w-full">
              <div className="mb-4 inline-flex items-center gap-2 bg-primary/20 text-primary font-black text-[10px] sm:text-xs md:text-sm px-4 py-1.5 rounded-full border border-primary/30 shadow-lg animate-pulse">
                <LocalOffer className="text-accent" sx={{ fontSize: 16 }} />
                <span className="tracking-wide">{t("hero.discount")}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tighter text-white">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                  {t("hero.titlePart1")}
                </span>{" "}
                <br />
                {t("hero.titlePart2")}
              </h1>
              <p className="text-base sm:text-xl md:text-2xl font-bold text-slate-200 leading-relaxed">
                {t("hero.description")}
              </p>
            </div>

            {/* Distinct Region Cards - Optimized for Mobile (Stack on small) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-6 w-full max-w-5xl">
              {/* Eastern Region */}
              <Link
                href="/Cars"
                className="group/card relative h-14 sm:h-20 md:h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 active:scale-95"
              >
                <div className="absolute inset-0 bg-midnight/80 group-hover/card:bg-midnight/90 backdrop-blur-md transition-colors"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover/card:scale-x-100 transition-transform"></div>
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <h3 className="text-sm sm:text-lg md:text-xl font-black text-white group-hover/card:text-primary transition-colors">
                    {t("hero.eastern")}
                  </h3>
                </div>
              </Link>

              {/* Riyadh */}
              <Link
                href="/Cars"
                className="group/card relative h-14 sm:h-20 md:h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 active:scale-95"
              >
                <div className="absolute inset-0 bg-midnight/80 group-hover/card:bg-midnight/90 backdrop-blur-md transition-colors"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover/card:scale-x-100 transition-transform"></div>
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <h3 className="text-sm sm:text-lg md:text-xl font-black text-white group-hover/card:text-primary transition-colors">
                    {t("hero.riyadh")}
                  </h3>
                </div>
              </Link>

              {/* Jeddah */}
              <Link
                href="/Cars"
                className="group/card relative h-14 sm:h-20 md:h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 active:scale-95"
              >
                <div className="absolute inset-0 bg-midnight/80 group-hover/card:bg-midnight/90 backdrop-blur-md transition-colors"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover/card:scale-x-100 transition-transform"></div>
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <h3 className="text-sm sm:text-lg md:text-xl font-black text-white group-hover/card:text-primary transition-colors">
                    {t("hero.jeddah")}
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
