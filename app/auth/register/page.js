"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const { register, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Removed useEffect that caused duplicate toast
  // The AuthContext.register already handles redirect after successful registration

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    await register(formData);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-8 md:p-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/logo.jpg"
              alt="C4R Logo"
              width={100}
              height={40}
              className="h-10 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-800">
            إنشاء حساب جديد
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            انضم إلينا واستمتع بتجربة تأجير مميزة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
          <div>
            <TextField
              fullWidth
              label="الاسم الكامل"
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="text-slate-400" />
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
              label="البريد الإلكتروني"
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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

          <div>
            <TextField
              fullWidth
              label="كلمة المرور"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
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
              label="تأكيد كلمة المرور"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="bg-linear-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1"
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
              "إنشاء الحساب"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-slate-500 text-sm">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/auth/login"
              className="text-orange-500 hover:text-orange-600 font-bold transition-colors"
            >
              سجل دخولك
            </Link>
          </p>

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
