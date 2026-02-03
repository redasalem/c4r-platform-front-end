"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Added hooks
import {
  userService,
  bookingService,
  authService,
  reviewService,
} from "@/services/api"; // Added reviewService
import {
  TextField,
  Button,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  EventNote,
  Star,
  CalendarMonth,
  Payments,
  Speed,
  DirectionsCar,
  Email,
  Phone,
  Settings,
  WhatsApp,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Image from "next/image";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from "@mui/material"; // Added Dialog components

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other} className="py-6">
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function UserDashboardContent({ user }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tabs mapping: profile=0, bookings=1, password=2
  const tabParam = searchParams.get("tab");
  const getTabIndex = (tab) => {
    if (tab === "bookings") return 1;
    if (tab === "password") return 2;
    return 0; // default: profile
  };

  const [value, setValue] = useState(getTabIndex(tabParam));

  // Sync tab state with URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    setValue(getTabIndex(tab));
  }, [searchParams]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const tabName =
      newValue === 1 ? "bookings" : newValue === 2 ? "password" : "profile";
    router.push(`/dashboard/user?tab=${tabName}`);
  };

  return (
    <div className="space-y-10">
      {/* Premium Navigation Tabs - Optimized for Mobile */}
      <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-start bg-white/5 backdrop-blur-xl p-2 md:p-2.5 rounded-[2rem] md:rounded-3xl border border-white/10 shadow-2xl w-full md:w-fit mx-auto md:mx-0 overflow-x-auto no-scrollbar gap-1 md:gap-0">
        {[
          {
            id: 0,
            label: "الحساب",
            icon: <Person sx={{ fontSize: { xs: 18, md: 20 } }} />,
          },
          {
            id: 1,
            label: "حجوزاتي",
            icon: <EventNote sx={{ fontSize: { xs: 18, md: 20 } }} />,
          },
          {
            id: 2,
            label: "الأمان",
            icon: <Lock sx={{ fontSize: { xs: 18, md: 20 } }} />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(null, tab.id)}
            className={`flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all duration-500 text-xs sm:text-sm md:text-base whitespace-nowrap ${value === tab.id
                ? "bg-primary text-white shadow-[0_10px_30px_rgba(249,115,22,0.4)] -translate-y-0.5 md:-translate-y-1"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
          >
            <span className={value === tab.id ? "scale-110" : "opacity-70"}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Section */}
      <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {value === 0 && <ProfileSection user={user} />}
        {value === 1 && <BookingsSection />}
        {value === 2 && <ChangePasswordSection />}
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?returnUrl=/dashboard/user");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-6 md:pt-10 px-4">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl p-6 sm:p-10 md:p-14 rounded-3xl sm:rounded-[3rem] md:rounded-[3.5rem] text-white shadow-2xl border border-white/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 md:px-5 py-2 rounded-full mb-4 md:mb-6 border border-primary/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <Person fontSize="small" sx={{ fontSize: { xs: 16, md: 20 } }} />
              <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                لوحة التحكم الحصرية
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-3 md:mb-4 leading-tight tracking-tighter">
              مرحباً بك،{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                {user?.name}
              </span>
            </h1>
            <p className="text-slate-400 text-base md:text-xl font-bold max-w-xl leading-relaxed">
              إدارة حسابك الشخصي، تتبع حجوزاتك، وتغيير إعدادات الأمان بكل فخامة
              ومن مكان واحد.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-40 h-40 bg-white/5 rounded-[3rem] flex items-center justify-center border border-white/10 shadow-2xl relative group">
              <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <DirectionsCar
                sx={{ fontSize: 80, color: "var(--primary)" }}
                className="relative z-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Content Area */}
      <Suspense fallback={<CircularProgress className="m-auto block" />}>
        <UserDashboardContent user={user} />
      </Suspense>
    </div>
  );
}

function ProfileSection({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.updateProfile(formData);
      toast.success("تم تحديث البيانات بنجاح");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error("فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "1.25rem",
      bgcolor: "rgba(255,255,255,0.03)",
      color: "white",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#f97316" },
      transition: "all 0.3s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.4)",
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
    "& .MuiOutlinedInput-input": { fontWeight: "bold" },
  };

  return (
    <div className="max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-5xl border border-white/10 p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start mb-6 sm:mb-8 md:mb-10 pb-6 sm:pb-8 md:pb-10 border-b border-white/5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-xl sm:rounded-2xl md:rounded-4xl flex items-center justify-center shrink-0 shadow-2xl border border-primary/20">
          <Person sx={{ fontSize: { xs: 36, sm: 44, md: 54 }, color: "var(--primary)" }} />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 sm:mb-2 leading-tight">
            إعدادات الحساب
          </h3>
          <p className="text-slate-400 font-bold text-sm sm:text-base md:text-lg">
            تأكد من بقاء بياناتك الشخصية محدثة لضمان تجربة حجز سلسة واحترافية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-4 sm:gap-y-6 md:gap-y-8">
        <TextField
          label="الاسم الكامل"
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={!isEditing}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person className="text-primary" />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />
        <TextField
          label="البريد الإلكتروني"
          fullWidth
          value={formData.email}
          disabled={true}
          variant="outlined"
          helperText="لا يمكن تغيير البريد الإلكتروني لدواعي الأمان"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email className="text-primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            ...inputStyle,
            "& .MuiFormHelperText-root": {
              color: "rgba(255,255,255,0.3)",
              fontWeight: "bold",
              textAlign: "right",
            },
          }}
        />
        <TextField
          label="رقم الهاتف"
          fullWidth
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          disabled={!isEditing}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone className="text-primary" />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />
      </div>

      <div className="mt-6 sm:mt-8 md:mt-12 flex flex-col-reverse sm:flex-row flex-wrap justify-end gap-3 sm:gap-4 md:gap-6">
        {isEditing ? (
          <>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                p: 2,
                px: 8,
                borderRadius: "1.25rem",
                fontWeight: "black",
                bgcolor: "var(--primary)",
                "&:hover": { bgcolor: "var(--primary-hover)" },
                boxShadow: "0 15px 25px -5px rgba(249, 115, 22, 0.3)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "حفظ التغييرات الجديدة"
              )}
            </Button>
            <Button
              variant="text"
              onClick={() => setIsEditing(false)}
              sx={{
                borderRadius: "1.25rem",
                fontWeight: "black",
                color: "rgba(255,255,255,0.4)",
                "&:hover": { color: "white", bgcolor: "white/5" },
                px: 6,
              }}
            >
              تراجع
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            startIcon={<Settings fontSize="small" sx={{ ml: 1 }} />}
            sx={{
              p: 2,
              px: 8,
              borderRadius: "1.25rem",
              fontWeight: "black",
              bgcolor: "white/10",
              color: "white",
              "&:hover": { bgcolor: "white/20" },
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4)",
            }}
          >
            تعديل البيانات الشخصية
          </Button>
        )}
      </div>
    </div>
  );
}

function BookingsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => bookingService.getAll(), // Assuming this returns user's bookings if not admin
  });

  const queryClient = useQueryClient();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const createReviewMutation = useMutation({
    mutationFn: reviewService.create,
    onSuccess: () => {
      toast.success("شكراً لك! تم إضافة تقييمك بنجاح");
      setReviewOpen(false);
      setComment("");
      setRating(5);
      // Optional: invalidate checked bookings if we tracked reviewed status
      queryClient.invalidateQueries(["myBookings"]);
      queryClient.invalidateQueries(["recentReviews"]); // Sync home page
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "فشل إضافة التقييم");
    },
  });

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setReviewOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedBooking) return;
    createReviewMutation.mutate({
      carId: selectedBooking.car._id,
      bookingId: selectedBooking._id,
      rating,
      comment,
    });
  };

  if (isLoading) return <CircularProgress className="m-auto block" />;

  // Safety check for array
  const bookings = data?.data?.bookings || [];

  if (bookings.length === 0) {
    return (
      <div className="text-center py-24 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl">
        <EventNote
          sx={{ fontSize: 100, color: "rgba(255,255,255,0.05)", mb: 4 }}
        />
        <p className="text-slate-400 font-black text-2xl">
          لا توجد حجوزات في سجلك حالياً
        </p>
        <Button
          variant="contained"
          href="/cars"
          sx={{
            mt: 4,
            borderRadius: "1.25rem",
            px: 6,
            py: 1.5,
            fontWeight: "black",
            bgcolor: "var(--primary)",
            "&:hover": { bgcolor: "var(--primary-hover)" },
          }}
        >
          تصفح مجموعة السيارات
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="group relative bg-white/5 backdrop-blur-3xl rounded-3xl md:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl hover:bg-white/10 transition-all duration-700 flex flex-col h-full"
          >
            {/* Status Glow Background */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2 rounded-full ${booking.status === "approved"
                  ? "bg-green-500"
                  : booking.status === "rejected"
                    ? "bg-red-500"
                    : "bg-primary"
                }`}
            />

            {/* Header Info & Image */}
            <div className="relative h-40 md:h-48 overflow-hidden">
              {booking.car?.images?.[0] ? (
                <Image
                  src={booking.car.images[0]}
                  alt={booking.car.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-slate-900 border-b border-white/5">
                  <DirectionsCar
                    className="text-white/10"
                    sx={{ fontSize: { xs: 40, md: 60 } }}
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/50 to-transparent opacity-60" />

              <div className="absolute top-3 md:top-4 left-3 md:left-4 z-20">
                <div className="flex flex-col items-end gap-1.5 md:gap-2">
                  <span
                    className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl border border-white/10 ${booking.status === "approved"
                        ? "bg-green-500/80 text-white"
                        : booking.status === "rejected"
                          ? "bg-red-500/80 text-white"
                          : "bg-primary/80 text-white"
                      }`}
                  >
                    {booking.status === "approved"
                      ? "مؤكد"
                      : booking.status === "rejected"
                        ? "مرفوض"
                        : "قيد الانتظار"}
                  </span>
                  <span className="bg-white/10 backdrop-blur-md px-2 md:px-3 py-1 rounded-lg text-[8px] md:text-[9px] font-bold text-white/60 border border-white/5">
                    #{booking._id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-3 md:bottom-4 right-5 md:right-6 left-5 md:left-6 z-20">
                <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-none group-hover:text-primary transition-colors truncate">
                  {booking.car?.name || "سيارة غير محددة"}
                </h3>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold mt-1">
                  تم الحجز في{" "}
                  {new Date(booking.createdAt).toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white/5 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                  <p className="text-[8px] sm:text-[10px] text-slate-500 font-black mb-1">
                    تاريخ الاستلام
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <CalendarMonth
                      className="text-primary"
                      sx={{ fontSize: { xs: 12, sm: 16 } }}
                    />
                    <span className="text-[10px] sm:text-xs font-black text-white">
                      {new Date(booking.startDate).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                  <p className="text-[8px] sm:text-[10px] text-slate-500 font-black mb-1">
                    تاريخ التسليم
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <CalendarMonth
                      className="text-primary"
                      sx={{ fontSize: { xs: 12, sm: 16 } }}
                    />
                    <span className="text-[10px] sm:text-xs font-black text-white">
                      {new Date(booking.endDate).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4 sm:mb-8">
                <div className="flex justify-between items-center px-1 md:px-2">
                  <span className="text-[9px] sm:text-xs text-slate-500 font-bold">
                    المدة: {booking.numberOfDays} أيام
                  </span>
                  <span className="text-[9px] sm:text-xs text-slate-500 font-bold">
                    المجموع:{" "}
                    <span className="text-primary font-black">
                      {booking.totalPrice} ريال
                    </span>
                  </span>
                </div>

                {/* Document Previews & Contact */}
                <div className="pt-3 md:pt-4 border-t border-white/5 flex items-center justify-between gap-3 md:gap-4">
                  <div className="flex gap-1.5 md:gap-2">
                    {booking.idCard && (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border border-white/10 relative group/doc">
                        <Image
                          src={booking.idCard}
                          alt="ID"
                          fill
                          className="object-cover opacity-60 group-hover/doc:opacity-100"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/doc:opacity-100 transition-opacity" />
                      </div>
                    )}
                    {booking.license && (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border border-white/10 relative group/doc">
                        <Image
                          src={booking.license}
                          alt="License"
                          fill
                          className="object-cover opacity-60 group-hover/doc:opacity-100"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/doc:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>

                  {booking.phoneNumber && (
                    <Button
                      href={`https://wa.me/${booking.phoneNumber.replace("+", "")}`}
                      target="_blank"
                      size="small"
                      startIcon={
                        <WhatsApp
                          className="text-green-500"
                          sx={{
                            ml: { xs: 0, md: 1 },
                            fontSize: { xs: 14, md: 16 },
                          }}
                        />
                      }
                      sx={{
                        borderRadius: "1rem",
                        bgcolor: "rgba(34, 197, 94, 0.1)",
                        color: "#22c55e",
                        fontSize: { xs: "0.6rem", md: "0.7rem" },
                        py: { xs: 0.5, md: 1 },
                        px: { xs: 1, sm: 2 },
                        minWidth: "auto",
                        fontWeight: "black",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        "&:hover": {
                          bgcolor: "rgba(34, 197, 94, 0.2)",
                          border: "1px solid rgba(34, 197, 94, 0.5)",
                        },
                      }}
                    >
                      واتساب
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 sm:gap-3 pt-4 border-t border-white/5">
                {booking.status === "approved" ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenReview(booking)}
                    sx={{
                      borderRadius: "1rem sm:1.25rem",
                      fontWeight: "black",
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      bgcolor: "var(--primary)",
                      "&:hover": { bgcolor: "var(--primary-hover)" },
                      boxShadow: "0 10px 20px -5px rgba(249, 115, 22, 0.3)",
                    }}
                  >
                    قيم التجربة
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      borderRadius: "1rem sm:1.25rem",
                      fontWeight: "black",
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      borderColor: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.15)",
                    }}
                  >
                    لا يمكن التقييم
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  href={`/cars/${booking.car?._id}`}
                  sx={{
                    borderRadius: "1rem sm:1.25rem",
                    fontWeight: "black",
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.3)",
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  التفاصيل
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Review Dialog */}
      {/* Review Dialog - Optimized for Mobile */}
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        dir="rtl"
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: { xs: "2rem", md: "2.5rem" },
            padding: { xs: 1, md: 2 },
            bgcolor: "rgba(15, 23, 42, 0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            margin: { xs: 2, md: 4 },
          },
        }}
      >
        <DialogTitle className="font-black text-2xl md:text-3xl text-center mb-1 md:mb-2">
          كيف كانت تجربتك؟ ✨
        </DialogTitle>
        <DialogContent className="flex flex-col items-center space-y-4 md:space-y-6 pt-4 md:pt-6">
          <Typography
            variant="body2"
            className="text-slate-400 font-bold text-center mb-2"
          >
            قيم تجربتك الفاخرة مع {selectedBooking?.car?.name}
          </Typography>

          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            precision={1}
            dir="rtl"
            sx={{
              fontSize: { xs: "2.5rem", md: "3rem" },
              "& .MuiRating-iconFilled": { color: "#f97316" },
              "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.1)" },
            }}
          />

          <TextField
            placeholder="اكتب تعليقك هنا بكل صراحة..."
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: { xs: 3, md: 4 },
                bgcolor: "rgba(255,255,255,0.03)",
                color: "white",
                fontSize: { xs: "0.85rem", md: "1rem" },
                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              },
            }}
          />
        </DialogContent>
        <DialogActions className="flex-col sm:flex-row justify-center gap-2 sm:gap-4 pb-8 pt-4 px-6">
          <Button
            onClick={() => setReviewOpen(false)}
            className="text-slate-500 font-black px-8"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={createReviewMutation.isPending}
            sx={{
              fontWeight: "black",
              borderRadius: "1.25rem",
              px: { xs: 4, md: 8 },
              py: 1.5,
              width: { xs: "100%", sm: "auto" },
              backgroundColor: "var(--primary)",
              "&:hover": { backgroundColor: "var(--primary-hover)" },
              boxShadow: "0 10px 20px -5px rgba(249, 115, 22, 0.3)",
            }}
          >
            {createReviewMutation.isPending
              ? "جاري النشر..."
              : "نشر التقييم الفاخر"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ChangePasswordSection() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswords({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "1.25rem",
      bgcolor: "rgba(255,255,255,0.03)",
      color: "white",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#f97316" },
      transition: "all 0.3s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.4)",
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
  };

  return (
    <div className="max-w-4xl bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
      <div className="flex flex-col md:flex-row gap-8 items-start mb-10 pb-10 border-b border-white/5">
        <div className="w-24 h-24 bg-primary/10 rounded-4xl flex items-center justify-center shrink-0 shadow-2xl border border-primary/20">
          <Lock sx={{ fontSize: 54, color: "var(--primary)" }} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-white mb-2 leading-tight">
            تغيير كلمة المرور
          </h3>
          <p className="text-slate-400 font-bold text-lg">
            ننصح باستخدام كلمة مرور قوية ومعقدة لضمان أقصى درجات الأمان لحسابك.
          </p>
        </div>
      </div>

      <div className="max-w-md flex flex-col gap-12 mt-6">
        <TextField
          label="كلمة المرور الحالية"
          type={showCurrentPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, currentPassword: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
                  sx={{
                    color: "white !important",
                    opacity: 0.7,
                    "&:hover": {
                      opacity: 1,
                      color: "var(--primary) !important",
                    },
                  }}
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />
        <TextField
          label="كلمة المرور الجديدة"
          type={showNewPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                  sx={{
                    color: "white !important",
                    opacity: 0.7,
                    "&:hover": {
                      opacity: 1,
                      color: "var(--primary) !important",
                    },
                  }}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        <div className="mt-12">
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              p: 2.5,
              borderRadius: "1.5rem",
              fontWeight: "black",
              bgcolor: "var(--primary)",
              "&:hover": { bgcolor: "var(--primary-hover)" },
              fontSize: "1.2rem",
              boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.4)",
              letterSpacing: "-0.02em",
            }}
          >
            {loading ? (
              <CircularProgress size={26} color="inherit" />
            ) : (
              "تحديث إعدادات الأمان السرية"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
