"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/api";
import CarCard from "@/components/cards/CarCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { CircularProgress, Container } from "@mui/material";
import { LocationOn } from "@mui/icons-material";

const cityNames = {
  riyadh: "مدينة الرياض",
  jeddah: "مدينة جدة",
  eastern: "المنطقة الشرقية",
  cars: "السيارات",
};

export default function CityPage() {
  const params = useParams();
  const city = params.city;
  const cityName = cityNames[city] || city;

  const {
    data: carsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars", city],
    queryFn: () => carService.getAll({ region: city }), // Fixed: Use region instead of city
  });

  const cars = carsData?.data?.cars || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20" dir="rtl">
      <Breadcrumbs items={[{ label: cityName }]} />
      <Container maxWidth="xl" className="pt-12">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full mb-4">
            <LocationOn fontSize="small" />
            <span className="font-bold text-sm">{cityName}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            تصفح <span className="text-orange-500">أفضل السيارات</span> المتاحة
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            مجموعة واسعة من السيارات التي تناسب جميع احتياجاتك في {cityName}.
            احجز سيارتك الآن بخطوات بسيطة.
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-bold text-lg">
              لا توجد سيارات متاحة حالياً في هذه المنطقة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
