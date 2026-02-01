"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/api";
import {
  CircularProgress,
  Container,
  Button,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import {
  DirectionsCar,
  Settings,
  AirlineSeatReclineExtra,
  LocalGasStation,
  CheckCircle,
  ArrowBack,
  Star,
  EventAvailable,
  LocationOn,
} from "@mui/icons-material";

const regionNames = {
  riyadh: "الرياض",
  jeddah: "جدة",
  eastern: "المنطقة الشرقية",
};
import Image from "next/image";
import Link from "next/link";
import { Avatar, Rating } from "@mui/material"; // Added Avatar, Rating
import { reviewService } from "@/services/api"; // Added reviewService

export default function CarDetailsPage() {
  const params = useParams();
  const id = params.id;

  const { data: carResponse, isLoading: carLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carService.getOne(id),
  });

  const { data: reviewsResponse, isLoading: reviewsLoading } = useQuery({
    queryKey: ["carReviews", id],
    queryFn: () => reviewService.getAllCarReviews(id),
  });

  const car = carResponse?.data?.car || carResponse?.data || carResponse;
  const reviews = reviewsResponse?.data?.reviews || [];
  const reviewsCount = reviewsResponse?.data?.pagination?.total || 0;

  if (carLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">السيارة غير موجودة</h2>
        <Link href="/" className="text-orange-500">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const imageUrl =
    car.image ||
    car.imageUrl ||
    car.images?.[0]?.url ||
    car.images?.[0] ||
    "/images/car-home.png";

  return (
    <div className="min-h-screen bg-white pt-24 pb-20" dir="rtl">
      <Container maxWidth="lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Right: Images Section */}
          <div className="md:col-span-7 order-1 md:order-1">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <Image
                src={imageUrl}
                alt={car.name || "صورة السيارة"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-6 right-6">
                <Chip
                  label={`موديل ${car.year || "2024"}`}
                  sx={{
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              </div>
              {car.region && (
                <div className="absolute top-6 left-6">
                  <Chip
                    icon={<LocationOn style={{ color: "white" }} />}
                    label={regionNames[car.region] || car.region}
                    sx={{
                      bgcolor: "#f97316",
                      color: "white",
                      fontWeight: "bold",
                      boxShadow: "0 4px 12px rgba(249, 115, 22, 0.4)",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Image Gallery (Thumbnails) placeholder */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative h-20 md:h-28 rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-orange-500 transition-colors cursor-pointer opacity-70 hover:opacity-100"
                >
                  <Image
                    src={imageUrl}
                    alt={`Car Thumb ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Left: Info Section */}
          <div className="md:col-span-5 order-2 md:order-2">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Rating
                      value={car.averageRating || 5}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                  </div>
                  <span className="text-slate-400 text-xs font-bold">
                    ({car.averageRating || 5}/5) - {reviewsCount} تقييم
                  </span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">
                  {car.name}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-slate-500 font-medium text-lg italic">
                    {car.brand} • {car.model}
                  </p>
                  {car.category && car.category !== "regular" && (
                    <Chip
                      label={
                        car.category === "with_driver"
                          ? "سيارة بسائق"
                          : "قسم الشركات"
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          car.category === "with_driver"
                            ? "#dbeafe"
                            : "#fef3c7",
                        color:
                          car.category === "with_driver"
                            ? "#2563eb"
                            : "#d97706",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500 font-bold">
                    سعر الإيجار اليومي:
                  </span>
                  <div className="text-left">
                    <span className="text-3xl font-black text-orange-600">
                      {car.pricePerDay}
                    </span>
                    <span className="text-slate-400 font-bold mr-1">ريال</span>
                  </div>
                </div>
                <Divider sx={{ my: 2 }} />
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  <EventAvailable fontSize="small" />
                  <span>متاح للحجز الفوري</span>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">
                    المواصفات الأساسية:
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <Settings className="text-orange-500" />
                      <div>
                        <p className="text-[10px] text-slate-400 leading-none mb-1">
                          ناقل الحركة
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          أوتوماتيك
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <LocalGasStation className="text-orange-500" />
                      <div>
                        <p className="text-[10px] text-slate-400 leading-none mb-1">
                          نوع الوقود
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          بنزين 95
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <AirlineSeatReclineExtra className="text-orange-500" />
                      <div>
                        <p className="text-[10px] text-slate-400 leading-none mb-1">
                          الركاب
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          5 أشخاص
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <DirectionsCar className="text-orange-500" />
                      <div>
                        <p className="text-[10px] text-slate-400 leading-none mb-1">
                          اللون
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          أسود ملكي
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2">الوصف:</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {car.description || "لا يوجد وصف متاح لهذه السيارة حالياً."}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-3">
                    ما يتضمنه الإيجار:
                  </h3>
                  <div className="space-y-2">
                    {[
                      "تأمين شامل",
                      "خدمة المساعدة على الطريق 24/7",
                      "صيانة دورية",
                      "توصيل للمطار (اختياري)",
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle
                          className="text-green-500"
                          style={{ fontSize: 18 }}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href={`/booking/${car._id}`}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3 group"
                >
                  <span>احجز هذه السيارة الآن</span>
                  <ArrowBack className="transition-transform group-hover:-translate-x-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION - Full Width Below */}
        <div className="mt-16 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-black text-slate-800 mb-8 border-r-4 border-orange-500 pr-4">
            تجارب العملاء ({reviewsCount})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Star className="text-slate-300 text-5xl mb-2" />
              <p className="text-slate-500 font-bold">
                لا توجد تقييمات لهذه السيارة بعد.
              </p>
              <p className="text-sm text-slate-400">
                كن أول من يحجز ويقيم هذه السيارة!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <Avatar
                      src={review.user?.image}
                      alt={review.user?.name}
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "#f1f5f9",
                        color: "#64748b",
                        fontWeight: "black",
                        border: "2px solid white",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    >
                      {review.user?.name?.charAt(0)}
                    </Avatar>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">
                        {review.user?.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(review.createdAt).toLocaleDateString(
                          "ar-EG",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Rating
                      value={review.rating}
                      readOnly
                      precision={0.5}
                      size="small"
                      sx={{
                        "& .MuiRating-iconFilled": { color: "#f97316" },
                      }}
                    />
                  </div>

                  <p className="text-slate-600 text-[15px] leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-50 min-h-[100px] italic">
                    "{review.comment || "تجربة مميزة وتعامل محترف جداً."}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
