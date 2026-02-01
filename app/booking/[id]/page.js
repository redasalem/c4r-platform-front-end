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
    <div className="min-h-screen bg-slate-50 pt-20 pb-20" dir="rtl">
      <Breadcrumbs items={[{ label: "إكمال عملية الحجز" }]} />
      <Container maxWidth="lg" className="pt-12">
        <h1 className="text-3xl font-black text-slate-900 mb-8 border-r-4 border-orange-500 pr-4">
          إكمال عملية الحجز
        </h1>

        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Paper className="p-8 rounded-3xl shadow-sm border border-slate-100">
              <form onSubmit={handleBooking} className="space-y-6">
                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
                    <CalendarMonth className="text-orange-500" />
                    <h3>تحديد المواعيد</h3>
                  </div>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="تاريخ الاستلام"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={dates.startDate}
                        onChange={(e) =>
                          setDates({ ...dates, startDate: e.target.value })
                        }
                        required
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="تاريخ التسليم"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={dates.endDate}
                        onChange={(e) =>
                          setDates({ ...dates, endDate: e.target.value })
                        }
                        required
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>
                  </Grid>
                </section>

                {/* Removed Divider */}
                <br />

                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
                    <WhatsApp className="text-green-500" />
                    <h3>معلومات التواصل (واتساب)</h3>
                  </div>
                  <TextField
                    label="رقم الواتساب الفعال"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="مثال: 9665xxxxxxxx+"
                    helperText="يرجى كتابة الرقم كاملاً مع مفتاح الدولة (مثل 966+) للتواصل معك"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": { borderColor: "#22c55e" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#22c55e" },
                      "& .MuiFormHelperText-root": {
                        textAlign: "right",
                        fontWeight: "bold",
                        color: "#64748b",
                      },
                    }}
                  />
                </section>

                {/* Removed Divider */}
                <br />

                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
                    <Speed className="text-orange-500" />
                    <h3>الكيلومترات اليومية</h3>
                  </div>
                  <TextField
                    select
                    fullWidth
                    value={kmPerDay}
                    onChange={(e) => setKmPerDay(e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  >
                    <option value={100}>100 كم / يوم</option>
                    <option value={200}>200 كم / يوم</option>
                    <option value={300}>300 كم / يوم</option>
                    <option value={500}>500 كم / يوم</option>
                  </TextField>
                </section>

                {/* Removed Divider */}
                <br />

                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
                    <UploadFile className="text-orange-500" />
                    <h3>المستندات المطلوبة</h3>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer relative transition-colors ${
                          idCardFile
                            ? "border-green-400 bg-green-50"
                            : "border-slate-200 hover:bg-slate-50 hover:border-orange-300"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => setIdCardFile(e.target.files[0])}
                        />
                        <div className="text-slate-500 text-sm py-2">
                          {idCardFile ? (
                            <CheckCircle className="mb-1 text-green-500 text-3xl block mx-auto" />
                          ) : (
                            <UploadFile className="mb-1 text-orange-400 text-3xl block mx-auto" />
                          )}
                          <p className="font-bold">صورة الهوية / الإقامة</p>
                          <p
                            className={`text-xs truncate mt-1 ${idCardFile ? "text-green-700 font-bold" : ""}`}
                          >
                            {idCardFile ? idCardFile.name : "اضغط للمرفق"}
                          </p>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer relative transition-colors ${
                          licenseFile
                            ? "border-green-400 bg-green-50"
                            : "border-slate-200 hover:bg-slate-50 hover:border-orange-300"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => setLicenseFile(e.target.files[0])}
                        />
                        <div className="text-slate-500 text-sm py-2">
                          {licenseFile ? (
                            <CheckCircle className="mb-1 text-green-500 text-3xl block mx-auto" />
                          ) : (
                            <UploadFile className="mb-1 text-orange-400 text-3xl block mx-auto" />
                          )}
                          <p className="font-bold">صورة رخصة القيادة</p>
                          <p
                            className={`text-xs truncate mt-1 ${licenseFile ? "text-green-700 font-bold" : ""}`}
                          >
                            {licenseFile ? licenseFile.name : "اضغط للمرفق"}
                          </p>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </section>

                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
                  <CheckCircleOutline className="text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-orange-900 leading-none mb-1">
                      سياسة الحجز
                    </p>
                    <p className="text-xs text-orange-700">
                      بإتمامك للحجز، أنت توافق على الشروط والأحكام. سيتم مراجعة
                      الطلب خلال 24 ساعة.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={uploading || createBookingMutation.isPending}
                  sx={{
                    py: 1.8,
                    borderRadius: 4,
                    fontWeight: "black",
                    fontSize: "1.1rem",
                    backgroundColor: "#f97316",
                    "&:hover": { backgroundColor: "#ea580c" },
                    boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                  }}
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <CircularProgress size={24} color="inherit" /> جاري
                      الرفع...
                    </div>
                  ) : createBookingMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <CircularProgress size={24} color="inherit" /> جاري
                      الارسال...
                    </div>
                  ) : (
                    "تأكيد الحجز وإرسال المستندات"
                  )}
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className="sticky top-[120px] h-full">
              <Paper className="p-10 rounded-[32px] shadow-sm border border-slate-100 overflow-hidden h-full">
                <div className="relative h-64 -mx-10 -mt-10 mb-8">
                  <Image
                    src={imageUrl}
                    alt={car?.name || "صورة السيارة"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mb-6">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">
                    {car?.name}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="bg-slate-100 px-4 py-1 rounded-full text-sm font-bold">
                      موديل {car?.year}
                    </span>
                  </div>
                </div>

                <Divider sx={{ mb: 3 }} />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">سعر اليوم:</span>
                    <span className="font-bold text-slate-800">
                      {car?.pricePerDay} ريال
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">عدد الأيام:</span>
                    <span className="font-bold text-slate-800">
                      {diffDays} يوم
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">الضريبة (15%):</span>
                    <span className="text-slate-800">شاملة</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-lg font-black text-slate-900">
                      المجموع الكلي:
                    </span>
                    <span className="text-3xl font-black text-orange-600">
                      {diffDays * car?.pricePerDay}{" "}
                      <span className="text-sm font-medium text-orange-400">
                        ريال
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-2xl flex items-center gap-3 border border-green-100">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
                    <Payments fontSize="small" />
                  </div>
                  <p className="text-xs text-green-800 font-medium">
                    الدفع عند الاستلام أو بعد تأكيد الحجز من الإدارة.
                  </p>
                </div>
              </Paper>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* SUCCESS DIALOG */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseSuccess}
        PaperProps={{
          sx: {
            borderRadius: 4,
            padding: 2,
            textAlign: "center",
            maxWidth: 450,
          },
        }}
      >
        <DialogContent className="flex flex-col items-center pt-8 pb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle className="text-green-600" sx={{ fontSize: 48 }} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            تم الحجز بنجاح!
          </h2>
          <p className="text-slate-500 text-center leading-relaxed">
            طلبك الآن <strong>قيد الانتظار والمراجعة</strong>. سيقوم فريقنا
            بمراجعة المستندات والتواصل معك قريباً لتأكيد الحجز وموعد الاستلام.
          </p>
        </DialogContent>
        <DialogActions className="justify-center pb-6">
          <Button
            variant="contained"
            onClick={handleCloseSuccess}
            sx={{
              borderRadius: 3,
              px: 6,
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: "#f97316",
              "&:hover": { backgroundColor: "#ea580c" },
            }}
          >
            نعم، فهمت
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
