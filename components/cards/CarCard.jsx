"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DirectionsCar,
  Speed,
  Settings,
  AirlineSeatReclineExtra,
  LocalGasStation,
  ArrowBack,
  LocationOn,
} from "@mui/icons-material";

const regionNames = {
  riyadh: "الرياض",
  jeddah: "جدة",
  eastern: "المنطقة الشرقية",
};

const CarCard = ({ car }) => {
  // Use first image or placeholder
  const imageUrl =
    car.image ||
    car.images?.[0]?.url ||
    car.images?.[0] ||
    "/images/car-home.png";

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
      dir="rtl"
    >
      {/* Image Section */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={car.name || "صورة السيارة"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-black/50 backdrop-blur-md text-white text-sm font-bold px-3 py-1.5 rounded-full border border-white/20">
            موديل {car.year || "2024"}
          </span>
        </div>
        {car.region && (
          <div className="absolute top-4 left-4">
            <span className="bg-orange-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <LocationOn style={{ fontSize: 16 }} />
              {regionNames[car.region] || car.region}
            </span>
          </div>
        )}
        {/* Overlays for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-2xl font-black text-slate-800">{car.name}</h3>
            <p className="text-slate-500 text-sm font-bold">
              {car.brand} {car.model}
            </p>
          </div>
          <div className="text-left">
            <span className="text-orange-600 font-black text-3xl">
              {car.pricePerDay}
            </span>
            <span className="text-slate-400 text-sm font-bold mr-1 block">
              ريال / يوم
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-slate-600">
            <Settings style={{ fontSize: 22 }} className="text-orange-500" />
            <span className="text-sm font-bold">أوتوماتيك</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <LocalGasStation
              style={{ fontSize: 22 }}
              className="text-orange-500"
            />
            <span className="text-sm font-bold">بنزين</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <AirlineSeatReclineExtra
              style={{ fontSize: 22 }}
              className="text-orange-500"
            />
            <span className="text-sm font-bold">5 مقاعد</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Speed style={{ fontSize: 22 }} className="text-orange-500" />
            <span className="text-sm font-bold">كم محدود</span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/cars/${car._id}`}
            className="flex-1 bg-slate-900 text-white text-center py-4 rounded-2xl font-bold text-base hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            التفاصيل
          </Link>
          <Link
            href={`/booking/${car._id}`}
            className="flex-1 bg-orange-500 text-white text-center py-4 rounded-2xl font-black text-base hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group/btn"
          >
            احجز الآن
            <ArrowBack
              fontSize="medium"
              className="transition-transform group-hover/btn:-translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
