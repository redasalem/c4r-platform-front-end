"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/api";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { toast } from "react-toastify";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    if (!token) {
      toast.error("رابط غير صالح");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.resetPassword(token, password);
      if (data.success) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "فشل تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 font-bold mb-4">رمز التحقق مفقود!</p>
        <Link href="/auth/login">عودة لصفحة الدخول</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div>
        <TextField
          fullWidth
          label="كلمة المرور الجديدة"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-slate-400" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
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

      <div>
        <TextField
          fullWidth
          label="تأكيد كلمة المرور الجديدة"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-slate-400" />
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
          "حفظ التغييرات"
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-8 md:p-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/logo.png"
              alt="C4R Logo"
              width={100}
              height={40}
              className="h-10 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-800">
            تعيين كلمة المرور جديدة
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            أدخل كلمة المرور الجديدة لحسابك
          </p>
        </div>
        <Suspense
          fallback={
            <div className="text-center">
              <CircularProgress />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
