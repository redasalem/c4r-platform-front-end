"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { authService } from "@/services/api";
import {
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Email, ArrowForward } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      if (data.success) {
        toast.success(
          data.message ||
            "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
        );
        // Optionally clear email or redirect
        // setEmail("");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error.response?.data?.message ||
          "فشل إرسال البريد الإلكتروني. تأكد من صحة البريد.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-8 md:p-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <NextImage
              src="/images/logo.jpg"
              alt="C4R Logo"
              width={100}
              height={40}
              className="h-10 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-800">
            نسيت كلمة المرور؟
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة حسابك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-slate-400" />
                  </InputAdornment>
                ),
                className:
                  "rounded-xl font-medium bg-slate-50 hover:bg-white transition-colors",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": { borderColor: "#f97316" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
              }}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1"
            sx={{
              borderRadius: "12px",
              padding: "12px",
              fontSize: "1rem",
              textTransform: "none",
              backgroundColor: "#f97316",
              "&:hover": { backgroundColor: "#ea580c" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "إرسال رابط الاستعادة"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <Link
            href="/auth/login"
            className="text-slate-500 hover:text-orange-500 text-sm font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowForward fontSize="small" className="transform rotate-180" />
            عودة لصفحة الدخول
          </Link>

          <div className="pt-2 border-t border-slate-50">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
