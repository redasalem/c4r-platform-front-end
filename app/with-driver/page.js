"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/api";
import CarCard from "@/components/cards/CarCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { CircularProgress, Container } from "@mui/material";
import { Person } from "@mui/icons-material";

export default function WithDriverPage() {
  const {
    data: carsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars", "with_driver"],
    queryFn: () => carService.getAll({ category: "with_driver" }),
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
      <Breadcrumbs items={[{ label: "سيارات بسائق" }]} />
      <Container maxWidth="xl" className="pt-12">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full mb-4">
            <Person fontSize="small" />
            <span className="font-bold text-sm">سيارات بسائق</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            رحلات مريحة <span className="text-blue-500">مع سائق خاص</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            استمتع برحلتك ودع القيادة لمحترفينا. خدمة راقية وسائقين مدربين.
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-bold text-lg">
              لا توجد سيارات بسائق متاحة حالياً.
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
