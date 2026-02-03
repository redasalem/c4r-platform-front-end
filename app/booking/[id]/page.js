"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { carService, bookingService } from "@/services/api";
import {
  CircularProgress,
  Container,
  TextField,
  Button,
  Grid,
  Divider,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  CalendarMonth,
  Payments,
  CheckCircleOutline,
  Speed,
  CheckCircle,
  WhatsApp,
  UploadFile,
} from "@mui/icons-material";
import Image from "next/image";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { toast } from "react-toastify";

export default function BookingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const carId = params.id;

  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [kmPerDay, setKmPerDay] = useState(200);
  const [idCardFile, setIdCardFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Pre-fill phone number from user profile
  useEffect(() => {
    if (user?.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
  }, [user]);

  // Redirect to login if NOT authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("يرجى تسجيل الدخول أولاً لإمام الحجز");
      router.push(`/auth/login?returnUrl=/booking/${carId}`);
    }
  }, [user, authLoading, router, carId]);

  const { data: carResponse, isLoading: carLoading } = useQuery({
    queryKey: ["car", carId],
    queryFn: () => carService.getOne(carId),
  });

  const car = carResponse?.data?.car || carResponse?.data || carResponse;

  const createBookingMutation = useMutation({
    mutationFn: (bookingData) => bookingService.create(bookingData),
    onSuccess: () => {
      setShowSuccessDialog(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "فشل إرسال طلب الحجز");
    },
  });

  const uploadToSecureAPI = async (file) => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "فشل رفع الملف");
    return result.url;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    // 1. Precise Validation
    if (!dates.startDate || !dates.endDate) {
      toast.error("يرجى اختيار تاريخ البداية والنهاية");
      return;
    }

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("لا يمكن اختيار تاريخ في الماضي");
      return;
    }

    if (end <= start) {
      toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }

    // Phone Validation (WhatsApp)
    // Supports: 05xxxxxxxx, 9665xxxxxxxx, +9665xxxxxxxx, or any international format (min 8 digits)
    const phoneRegex = /^[+]?[\d]{8,15}$/;
    if (!phoneNumber) {
      toast.error("يرجى إدخال رقم الواتساب");
      return;
    }

    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      toast.error("يرجى إدخال رقم واتساب صحيح (أرقام فقط مع مفتاح الدولة)");
      return;
    }

    if (!idCardFile || !licenseFile) {
      toast.error("يرجى تحميل جميع المستندات المطلوبة (الهوية والرخصة)");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload Images Securely
      const [idCardUrl, licenseUrl] = await Promise.all([
        uploadToSecureAPI(idCardFile),
        uploadToSecureAPI(licenseFile),
      ]);

      // 2. Calculate Days
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      // 3. Prepare Data
      const bookingData = {
        carId,
        phoneNumber,
        kmPerDay,
        numberOfDays: diffDays,
        startDate: dates.startDate,
        endDate: dates.endDate,
        idCardImageUrl: idCardUrl,
        licenseImageUrl: licenseUrl,
      };

      createBookingMutation.mutate(bookingData);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء رفع المستندات. يرجى المحاولة مرة أخرى.");
    } finally {
      setUploading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    router.push("/dashboard/user");
  };

  if (authLoading || carLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!user) return null;

  const imageUrl =
    car?.image ||
    car?.images?.[0]?.url ||
    car?.images?.[0] ||
    "/images/car-home.png";

  const diffDays =
    dates.startDate && dates.endDate
      ? Math.ceil(
          Math.abs(new Date(dates.endDate) - new Date(dates.startDate)) /
            (1000 * 60 * 60 * 24),
        ) || 1
      : 1;

  return (
    <div
      className="min-h-screen bg-[#020617] relative overflow-hidden pt-28 pb-24"
      dir="rtl"
    >
      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-30" />

      <Breadcrumbs items={[{ label: "إكمال عملية الحجز الفاخرة" }]} />
      <Container maxWidth="lg" className="pt-8 relative z-10">
        <h1 className="text-xl md:text-2xl font-black text-white mb-6 tracking-tighter leading-tight">
          إكمال عملية{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
            طلب الحجز
          </span>
        </h1>

        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="flex-1 min-w-0">
            <div className="bg-white/5 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group h-full">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
              <form
                onSubmit={handleBooking}
                className="space-y-6 relative z-10"
              >
                <section>
                  <div className="flex items-center gap-2 mb-5 text-white">
                    <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                      <CalendarMonth
                        className="text-primary"
                        fontSize="small"
                      />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">
                      تحديد المواعيد
                    </h3>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="تاريخ الاستلام"
                        type="date"
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={dates.startDate}
                        onChange={(e) =>
                          setDates({ ...dates, startDate: e.target.value })
                        }
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            bgcolor: "rgba(255,255,255,0.03)",
                            color: "white",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.1)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#f97316",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255,255,255,0.4)",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f97316",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="تاريخ التسليم"
                        type="date"
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={dates.endDate}
                        onChange={(e) =>
                          setDates({ ...dates, endDate: e.target.value })
                        }
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            bgcolor: "rgba(255,255,255,0.03)",
                            color: "white",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.1)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#f97316",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255,255,255,0.4)",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f97316",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-5 text-white">
                    <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                      <WhatsApp className="text-green-500" fontSize="small" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">
                      معلومات التواصل
                    </h3>
                  </div>
                  <TextField
                    label="رقم الواتساب"
                    fullWidth
                    size="small"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="مثال: 9665xxxxxxxx+"
                    helperText="اكتب الرقم مع مفتاح الدولة"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.03)",
                        color: "white",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                        "&.Mui-focused fieldset": { borderColor: "#22c55e" },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#22c55e" },
                      "& .MuiFormHelperText-root": {
                        textAlign: "right",
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.3)",
                        mt: 0.5,
                      },
                    }}
                  />
                </section>

                <FormControl fullWidth size="small">
                  <InputLabel
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      "&.Mui-focused": { color: "#f97316" },
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    الكيلومترات اليومية
                  </InputLabel>
                  <Select
                    value={kmPerDay}
                    onChange={(e) => setKmPerDay(e.target.value)}
                    label="الكيلومترات اليومية"
                    sx={{
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.03)",
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                      "&.Mui-focused fieldset": { borderColor: "#f97316" },
                      "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "white",
                          borderRadius: "1rem",
                          "& .MuiMenuItem-root": {
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                            "&.Mui-selected": {
                              bgcolor: "rgba(249, 115, 22, 0.2)",
                              color: "#f97316",
                              "&:hover": { bgcolor: "rgba(249, 115, 22, 0.3)" },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value={100}>100 كم / يوم</MenuItem>
                    <MenuItem value={200}>200 كم / يوم</MenuItem>
                    <MenuItem value={300}>300 كم / يوم</MenuItem>
                    <MenuItem value={500}>500 كم / يوم</MenuItem>
                  </Select>
                </FormControl>

                <section>
                  <div className="flex items-center gap-2 mb-5 text-white">
                    <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                      <UploadFile className="text-primary" fontSize="small" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">
                      المستندات المطلوبة
                    </h3>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer relative transition-all duration-500 overflow-hidden group/upload ${
                          idCardFile
                            ? "border-green-500/50 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                          onChange={(e) => setIdCardFile(e.target.files[0])}
                        />
                        <div className="relative z-10">
                          {idCardFile ? (
                            <CheckCircle className="mb-2 text-green-500 text-3xl block mx-auto animate-in zoom-in duration-500" />
                          ) : (
                            <UploadFile className="mb-2 text-primary text-3xl block mx-auto group-hover/upload:scale-110 transition-transform duration-500" />
                          )}
                          <p className="font-black text-white text-sm">
                            صورة الهوية / الإقامة
                          </p>
                          <p
                            className={`text-[10px] mt-1 font-bold truncate px-2 ${idCardFile ? "text-green-400" : "text-slate-500"}`}
                          >
                            {idCardFile ? idCardFile.name : "اضغط للمرفق"}
                          </p>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer relative transition-all duration-500 overflow-hidden group/upload ${
                          licenseFile
                            ? "border-green-500/50 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                          onChange={(e) => setLicenseFile(e.target.files[0])}
                        />
                        <div className="relative z-10">
                          {licenseFile ? (
                            <CheckCircle className="mb-2 text-green-500 text-3xl block mx-auto animate-in zoom-in duration-500" />
                          ) : (
                            <UploadFile className="mb-2 text-primary text-3xl block mx-auto group-hover/upload:scale-110 transition-transform duration-500" />
                          )}
                          <p className="font-black text-white text-sm">
                            صورة رخصة القيادة
                          </p>
                          <p
                            className={`text-[10px] mt-1 font-bold truncate px-2 ${licenseFile ? "text-green-400" : "text-slate-500"}`}
                          >
                            {licenseFile ? licenseFile.name : "اضغط للمرفق"}
                          </p>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </section>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 flex items-start gap-3">
                  <CheckCircleOutline
                    className="text-primary mt-1"
                    fontSize="small"
                  />
                  <div>
                    <p className="text-base font-black text-white">
                      سياسة الحجز
                    </p>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                      بإتمامك للحجز، أنت توافق على الشروط والأحكام. سيتم مراجعة
                      طلبك خلال 24 ساعة.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={uploading || createBookingMutation.isPending}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "black",
                    fontSize: "1rem",
                    backgroundColor: "var(--primary)",
                    "&:hover": { backgroundColor: "var(--primary-hover)" },
                    boxShadow: "0 10px 20px -5px rgba(249, 115, 22, 0.4)",
                  }}
                >
                  {uploading ? (
                    <div className="flex items-center gap-3">
                      <CircularProgress size={24} color="inherit" /> جاري الرفع
                      الآمن...
                    </div>
                  ) : createBookingMutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <CircularProgress size={24} color="inherit" /> جاري تأكيد
                      طلبك...
                    </div>
                  ) : (
                    "تأكيد الحجز وإرسال المستندات"
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="sticky top-[120px]">
              <div className="bg-white/5 backdrop-blur-3xl p-4 rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative h-40 -mx-4 -mt-4 mb-4 overflow-hidden border-b border-white/10">
                  <Image
                    src={imageUrl}
                    alt={car?.name || "صورة السيارة"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-midnight/80 to-transparent" />
                </div>

                <div className="mb-4 relative z-10">
                  <h2 className="text-xl font-black text-white mb-1 tracking-tighter">
                    {car?.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-lg">
                      إصدار {car?.year}
                    </span>
                    <span className="text-slate-500 font-bold text-[10px]">
                      موديل فئة A
                    </span>
                  </div>
                </div>

                <Divider
                  sx={{ mb: 4, borderColor: "rgba(255,255,255,0.05)" }}
                />

                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">سعر اليوم:</span>
                    <span className="font-black text-white">
                      {car?.pricePerDay} ريال
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">
                      مدة الإيجار:
                    </span>
                    <span className="font-black text-white">
                      {diffDays} يوم
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black">
                    <span className="text-slate-400 font-bold">
                      الضريبة المضافة:
                    </span>
                    <span className="text-green-400">شاملة</span>
                  </div>

                  <div className="pt-4 mt-1 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <span className="text-slate-500 font-bold text-[10px] block mb-0.5">
                        المجموع النهائي:
                      </span>
                      <span className="text-2xl font-black text-primary tracking-tighter">
                        {diffDays * car?.pricePerDay}
                      </span>
                    </div>
                    <span className="text-base font-black text-primary/60 pb-0.5">
                      ريال
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/5 rounded-2xl flex items-center gap-3 border border-green-500/10">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center shadow-inner text-green-500">
                    <Payments fontSize="small" />
                  </div>
                  <p className="text-[10px] text-green-500 font-bold leading-relaxed">
                    نظام الدفع المرن: يمكنك الدفع عند استلام السيارة أو عبر
                    التحويل البنكي.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseSuccess}
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
            padding: 3,
            textAlign: "center",
            maxWidth: 450,
            bgcolor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          },
        }}
      >
        <DialogContent className="flex flex-col items-center pt-8 pb-4">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
            <CheckCircle className="text-green-500" sx={{ fontSize: 48 }} />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            تم الحجز بنجاح!
          </h2>
          <p className="text-slate-400 text-center leading-relaxed font-bold">
            طلبك الآن{" "}
            <span className="text-primary font-black">قيد المراجعة</span>. سيقوم
            فريقنا بمنحك الأولوية والتواصل معك قريباً لتأكيد الحجز وموعد
            الاستلام.
          </p>
        </DialogContent>
        <DialogActions className="justify-center pb-8 pt-4">
          <Button
            variant="contained"
            onClick={handleCloseSuccess}
            sx={{
              borderRadius: "1.25rem",
              px: 8,
              py: 2,
              fontWeight: "900",
              fontSize: "1rem",
              backgroundColor: "var(--primary)",
              "&:hover": { backgroundColor: "var(--primary-hover)" },
              boxShadow: "0 10px 20px rgba(249, 115, 22, 0.3)",
            }}
          >
            نعم، فهمت
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
