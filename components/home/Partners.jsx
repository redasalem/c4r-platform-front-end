"use client";
import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const Partners = () => {
  const partners = [
    { id: 1, img: "/images/p-1.jpeg", name: "Partner 1" },
    { id: 2, img: "/images/p-2.jpeg", name: "Partner 2" },
    { id: 3, img: "/images/p-3.jpeg", name: "Partner 3" },
    { id: 4, img: "/images/p-4.jpeg", name: "Partner 4" },
    { id: 5, img: "/images/p5.JPEG", name: "Partner 5" },
  ];

  return (
    <section
      className="py-24 bg-transparent relative overflow-hidden"
      dir="ltr"
    >
      <div className="container mx-auto px-6 mb-16" dir="rtl">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tighter">
            شركاء <span className="text-primary">النجاح</span>
          </h2>
          <div className="w-24 h-2 bg-linear-to-r from-primary to-transparent mx-auto rounded-full"></div>
        </div>
      </div>

      <div className="relative group overflow-hidden">
        {/* Edge Gradients - Unified with Midnight */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 z-10 bg-linear-to-r from-midnight via-midnight/80 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 z-10 bg-linear-to-l from-midnight via-midnight/80 to-transparent pointer-events-none"></div>

        <Marquee
          gradient={false}
          speed={40}
          direction="left"
          pauseOnHover={true}
        >
          {partners.map((partner) => (
            <div key={partner.id} className="mx-3 md:mx-12 group/item">
              <div className="relative w-[90vw] max-w-xs md:w-80 h-32 md:h-40 bg-white rounded-4xl shadow-xl border border-white/10 flex items-center justify-center p-6 transition-all duration-300 hover:scale-105">
                <div className="relative w-full h-full">
                  <Image
                    src={partner.img}
                    alt={partner.name}
                    fill
                    className="object-contain transition-all duration-500" // Removed grayscale and opacity
                  />
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Partners;
