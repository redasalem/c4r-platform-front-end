"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/api";
import { Avatar, Rating, Skeleton } from "@mui/material";
import Marquee from "react-fast-marquee";
import { Star, DirectionsCar } from "@mui/icons-material";
import Image from "next/image";

export default function ReviewMarquee() {
  const { data, isLoading } = useQuery({
    queryKey: ["recentReviews"],
    queryFn: () => reviewService.getRecent(),
  });

  const reviews = data?.data || [];

  if (isLoading) {
    return (
      <div className="py-8 bg-midnight overflow-hidden">
        <div className="flex gap-6 overflow-hidden justify-center px-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={300}
              height={150}
              sx={{ borderRadius: 4, bgcolor: "rgba(255,255,255,0.05)" }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section
      className="py-24 bg-transparent relative overflow-hidden w-full max-w-full"
      dir="rtl"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10 overflow-hidden">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tighter">
            تجارب{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              عملاؤنا
            </span>
          </h2>
          <div className="w-16 md:w-24 h-1.5 md:h-2 bg-linear-to-r from-primary to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="relative w-full overflow-hidden no-scrollbar">
          {/* Edge Gradients - Unified with Midnight */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 z-20 bg-linear-to-r from-midnight via-midnight/80 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 z-20 bg-linear-to-l from-midnight via-midnight/80 to-transparent pointer-events-none"></div>

          <Marquee gradient={false} speed={35} pauseOnHover className="py-10">
            {reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="px-5 py-6 sm:px-8 sm:py-8 mx-3 sm:mx-5 rounded-3xl sm:rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-primary/30 transition-all duration-500 w-[85vw] sm:w-[380px] group flex flex-col active:scale-95"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <Avatar
                    src={review.user?.image}
                    alt={review.user?.name}
                    sx={{
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                      bgcolor: "var(--primary)",
                      border: "2px solid rgba(255,255,255,0.1)",
                      fontWeight: "black",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {review.user?.name?.charAt(0)}
                  </Avatar>
                  <div>
                    <h4 className="font-black text-white text-base sm:text-lg group-hover:text-primary transition-colors">
                      {review.user?.name}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      عميل متميز
                    </p>
                  </div>
                </div>

                <Rating
                  value={review.rating}
                  readOnly
                  precision={0.5}
                  size="small"
                  className="mb-6"
                  sx={{
                    "& .MuiRating-iconFilled": { color: "var(--primary)" },
                    "& .MuiRating-iconEmpty": {
                      color: "rgba(255,255,255,0.05)",
                    },
                  }}
                />

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-bold italic mb-6 line-clamp-3 sm:line-clamp-none">
                  "{review.comment}"
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <DirectionsCar sx={{ fontSize: 16 }} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {review.car?.name || "سيارة مميزة"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
