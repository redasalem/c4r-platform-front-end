"use client";

import React from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  AssignmentReturn,
  CheckCircle,
  Gavel,
  History,
  PriceCheck,
  Warning,
} from "@mui/icons-material";

const PolicyPage = () => {
  const breadcrumbItems = [{ label: "سياسة الاسترجاع والتبديل" }];

  const categories = [
    {
      title: "سياسة الإلغاء قبل الاستلام",
      icon: <AssignmentReturn />,
      items: [
        "يمكنك إلغاء الحجز قبل موعد الاستلام بـ 24 ساعة دون رسوم.",
        "في حال الإلغاء قبل أقل من 24 ساعة من موعد الاستلام، قد تُطبق رسوم إلغاء تعادل قيمة يوم واحد (حسب سياسة شركة التأجير).",
      ],
    },
    {
      title: "سياسة التبديل",
      icon: <CheckCircle />,
      items: [
        "يمكن تبديل السيارة المحجوزة في حال وجود خلل فني أو عدم مطابقتها للمواصفات المطلوبة.",
        "التبديل يعتمد على توفر السيارات المماثلة في مخزون شركة التأجير وقت الطلب.",
      ],
    },
    {
      title: "استرجاع المبالغ المالية",
      icon: <PriceCheck />,
      items: [
        "يتم استرجاع المبالغ المالية عبر نفس طريقة الدفع الأصلية.",
        "تستغرق عملية الاسترجاع البنكي من 7 إلى 14 يوم عمل حسب إجراءات المصرف.",
      ],
    },
    {
      title: "الحالات التي لا يشملها الاسترجاع",
      icon: <Warning />,
      items: [
        "لا يمكن استرجاع قيمة الأيام المتبقية في حال تسليم السيارة قبل الموعد المحدد في العقد (إلا بموافقة استثنائية من مكتب التأجير).",
        "المخالفات المرورية المسجلة أثناء فترة التأجير غير قابلة للاسترجاع وتخصم من مبلغ الإيداع إن وُجد.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto mb-12">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-20 border border-white/10 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

          <h1 className="text-2xl md:text-4xl font-black text-white mb-12 tracking-tighter relative z-10 leading-tight">
            سياسة{" "}
            <span className="text-primary italic">الاسترجاع والتبديل</span>
          </h1>

          <div className="space-y-16 relative z-10">
            {categories.map((category, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                    {category.icon}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                    {category.title}
                  </h2>
                </div>

                <div className="pr-19 font-bold text-lg md:text-xl leading-relaxed text-slate-400">
                  <ul className="space-y-4">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/30 mt-2.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-white/10 text-center relative z-10">
            <p className="text-slate-500 font-bold italic">
              * جميع العمليات تخضع في المقام الأول لعقد التأجير الموقع بين
              العميل وشركة التأجير المنفذة للخدمة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
