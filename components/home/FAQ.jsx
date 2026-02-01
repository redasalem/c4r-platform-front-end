"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore, HelpOutline } from "@mui/icons-material";

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      id: "panel1",
      question: "كم العمر المسموح لاستئجار سيارة؟",
      answer:
        "الحد الأدنى للعمر هو 21 عاماً. قد تنطبق رسوم إضافية للسائقين الشباب (أقل من 25 عاماً) حسب نوع السيارة.",
    },
    {
      id: "panel2",
      question: "هل يوجد خدمة توصيل للمطار؟",
      answer:
        "نعم، نوفر خدمة تسليم واستلام السيارة في جميع المطارات الرئيسية بالمملكة (الرياض، جدة، الدمام) على مدار 24 ساعة.",
    },
    {
      id: "panel3",
      question: "ما هو نوع التأمين المتوفر؟",
      answer:
        "جميع سياراتنا مؤمنة تأميناً شاملاً أساسياً. يمكنك ترقية التأمين ليشمل التغطية الذهبية (إعفاء كامل من التحمل) برسوم إضافية.",
    },
    {
      id: "panel4",
      question: "أين تقع فروع C4R؟",
      answer:
        "نتواجد في المناطق الرئيسية: الرياض، جدة، والمنطقة الشرقية. يمكنك الاطلاع على الخريطة في صفحة اتصل بنا لمعرفة أقرب فرع.",
    },
    {
      id: "panel5",
      question: "هل مبلغ التأمين مسترد؟",
      answer:
        "نعم، يتم استرداد مبلغ التأمين (الوديعة) بالكامل خلال 14 يوم عمل بعد تسليم السيارة والتأكد من خلوها من المخالفات والأضرار.",
    },
    {
      id: "panel6",
      question: "ما هي الوثائق المطلوبة للاستئجار؟",
      answer:
        "الهوية الوطنية/الإقامة سارية المفعول، ورخصة قيادة سارية. للزوار: جواز السفر ورخصة قيادة دولية معتمدة.",
    },
    {
      id: "panel7",
      question: "هل يمكنني توثيق حالة السيارة قبل الاستلام؟",
      answer:
        "بالتأكيد! ننصح دائماً بتصوير السيارة فيديو شامل عند الاستلام وتدوين أي ملاحظات في العقد الإلكتروني لضمان حقك.",
    },
    {
      id: "panel8",
      question: "ما هي طرق الدفع المقبولة؟",
      answer:
        "نقبل الدفع عبر مدى، البطاقات الائتمانية (فيزا/ماستر كارد)، أبل باي، بالإضافة إلى خدمات التقسيط مثل تابي وتمارا.",
    },
  ];

  return (
    <section className="py-16 bg-slate-900" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpOutline className="text-orange-500" sx={{ fontSize: 32 }} />
            <h2 className="text-3xl md:text-4xl font-black text-white">
              الأسئلة الشائعة
            </h2>
          </div>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full opacity-80"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-6xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="mb-2">
              <Accordion
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  color: "#fff",
                  borderRadius: "16px !important", // More rounded to match other sections
                  border:
                    expanded === faq.id
                      ? "1px solid #f97316"
                      : "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  boxShadow:
                    expanded === faq.id
                      ? "0 4px 20px rgba(249, 115, 22, 0.15)"
                      : "none",
                  marginBottom: "16px", // Space between items
                  "&:before": { display: "none" },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expanded === faq.id ? "bg-orange-500 text-white" : "bg-slate-700 text-gray-400"}`}
                    >
                      <ExpandMore />
                    </div>
                  }
                  aria-controls={`${faq.id}-content`}
                  id={`${faq.id}-header`}
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      margin: "12px 0",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: expanded === faq.id ? "bold" : "medium",
                      color: expanded === faq.id ? "#f97316" : "#e2e8f0",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      transition: "color 0.3s",
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    paddingTop: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.95rem",
                      lineHeight: 1.8,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
