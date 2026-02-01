"use client";
import React from "react";
import Image from "next/image";
import { Handshake } from "@mui/icons-material";

const Partners = () => {
  const partners = [
    { id: 1, img: "/images/p-1.jpeg", name: "Partner 1" },
    { id: 2, img: "/images/p-2.jpeg", name: "Partner 2" },
    { id: 3, img: "/images/p-3.jpeg", name: "Partner 3" },
    { id: 4, img: "/images/p-4.jpeg", name: "Partner 4" },
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden" dir="ltr">
      <div className="container mx-auto px-6 mb-16" dir="rtl">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            شركاؤنا
          </h2>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full opacity-80 shadow-sm"></div>
        </div>
      </div>

      <div className="relative group">
        {/* Gradients for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-linear-to-r from-slate-50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-linear-to-l from-slate-50 to-transparent pointer-events-none"></div>

        {/* The Animated Track - Duplicating multiple times to ensure full width + seamless transition */}
        <div className="flex animate-scroll w-max py-4">
          {[
            ...partners,
            ...partners,
            ...partners,
            ...partners,
            ...partners,
            ...partners,
            ...partners,
            ...partners,
          ].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="relative shrink-0 w-32 h-20 md:w-60 md:h-32 bg-white rounded-3xl shadow-md border border-slate-100 flex items-center justify-center p-6 mx-4 md:mx-8 transition-all duration-300 hover:scale-110"
            >
              <div className="relative w-full h-full">
                <Image
                  src={partner.img}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
