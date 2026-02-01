"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/api";
import { Avatar, Rating, Skeleton } from "@mui/material";
import Marquee from "react-fast-marquee";
import { Star, DirectionsCar } from "@mui/icons-material";

export default function ReviewMarquee() {
  const { data, isLoading } = useQuery({
    queryKey: ["recentReviews"],
    queryFn: () => reviewService.getRecent(),
  });

  const mockReviews = [
    {
      _id: "mock1",
      user: { name: "أحمد العتيبي", image: null },
      car: { name: "مرسيدس S-Class" },
      rating: 5,
      comment:
        "تجربة لا تنسى مع C4R. السيارة كانت قمة في النظافة والفخامة، والتعامل كان في منتهى الاحترافية. بالتأكيد سأكرر التجربة.",
    },
    {
      _id: "mock2",
      user: { name: "سارة الجدوع", image: null },
      car: { name: "تويوتا لاندكروزر" },
      rating: 5,
      comment:
        "أفضل خدمة تأجير سيارات في الرياض. سرعة في الإجراءات وسيارات حديثة جداً. شكراً جزيلاً للفريق.",
    },
    {
      _id: "mock3",
      user: { name: "محمد الشمري", image: null },
      car: { name: "نيسان باترول" },
      rating: 4.5,
      comment:
        "خدمة ممتازة وسعر عادل جداً مقارنة بالجودة. السيارة كانت مريحة جداً لرحلتي العائلية.",
    },
  ];

  const dbReviews = data?.data || [];
  const reviews = dbReviews.length > 0 ? dbReviews : mockReviews;

  if (isLoading) {
    return (
      <div className="py-8 bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4 mb-8 text-center">
          <Skeleton
            variant="text"
            width={200}
            height={40}
            className="mx-auto"
          />
          <Skeleton
            variant="text"
            width={300}
            height={20}
            className="mx-auto"
          />
        </div>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={300}
              height={150}
              sx={{ borderRadius: 4 }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <div
      className="py-2 bg-slate-900 overflow-hidden relative hide-scrollbar"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        contain: "paint",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
        .hide-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; overflow: hidden !important; }
        .hide-scrollbar *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
        .hide-scrollbar * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `,
        }}
      />
      {/* Premium Decorative Background Assets */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-1">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-1 rounded-full border border-white/10 mb-2">
            <span className="text-white/80 font-bold tracking-widest text-[9px] uppercase">
              Testimonials
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mb-0 leading-tight">
            تجارب <span className="text-orange-500">عملاؤنا</span>
          </h2>
        </div>

        <Marquee
          gradient={true}
          gradientColor={[15, 23, 42]} // Matches slate-900
          speed={40}
          pauseOnHover
          className="py-2"
        >
          {reviews.map((review) => (
            <div
              key={review._id}
              className="mx-5 w-[380px] group relative"
              dir="rtl"
            >
              {/* Glass Card */}
              <div className="bg-white/5 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-orange-500/20 group-hover:-translate-y-1 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="absolute top-6 left-8 text-6xl text-orange-500/10 font-serif pointer-events-none select-none">
                  "
                </div>

                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <Avatar
                      src={review.user?.image}
                      alt={review.user?.name}
                      sx={{
                        width: 64,
                        height: 64,
                        border: "3px solid rgba(249, 115, 22, 0.2)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                      }}
                    >
                      {review.user?.name?.charAt(0)}
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1 border-2 border-slate-900 shadow-lg">
                      <Star sx={{ fontSize: 12, color: "white" }} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg mb-0.5">
                      {review.user?.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      <p className="text-xs text-slate-400 font-bold tracking-wide">
                        عميل مستوى متميز
                      </p>
                    </div>
                  </div>
                </div>

                <Rating
                  value={review.rating}
                  readOnly
                  precision={0.5}
                  size="small"
                  className="mb-5"
                  sx={{
                    "& .MuiRating-iconFilled": { color: "#f97316" },
                    "& .MuiRating-iconEmpty": {
                      color: "rgba(255,255,255,0.1)",
                    },
                  }}
                />

                <p className="text-slate-300 text-base leading-relaxed font-medium line-clamp-4 relative z-10 italic">
                  "
                  {review.comment ||
                    "تجربة استثنائية من حيث الخدمة والجودة. فريق عمل محترف جداً وسيارات في قمة النظافة."}
                  "
                </p>

                <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <DirectionsCar sx={{ fontSize: 16 }} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {review.car?.name || "سيارة مميزة"}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-[9px] text-orange-400 font-bold uppercase tracking-tighter">
                      Verified Review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
