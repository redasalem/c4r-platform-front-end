"use client";

import { useState, useEffect } from "react";
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

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

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
    if (!user) {
      router.push("/auth/login?returnUrl=/dashboard/user");
      return;
    }
    const tab = searchParams.get("tab");
    setValue(getTabIndex(tab));
  }, [searchParams, user, router]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const tabName =
      newValue === 1 ? "bookings" : newValue === 2 ? "password" : "profile";
    router.push(`/dashboard/user?tab=${tabName}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-slate-900 p-10 md:p-14 rounded-[3rem] text-white shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-1.5 rounded-full mb-4 border border-orange-500/20">
              <Person fontSize="small" />
              <span className="font-bold text-xs uppercase tracking-wider">
                لوحة التحكم
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
              مرحباً بك، <span className="text-orange-500">{user?.name}</span>{" "}
              👋
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              إدارة حسابك الشخصي، تتبع حجوزاتك، وتغيير إعدادات الأمان بكل سهولة
              ومن مكان واحد.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-slate-800 rounded-[2.5rem] flex items-center justify-center border border-slate-700 shadow-inner">
              <DirectionsCar sx={{ fontSize: 60, color: "#334155" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Content Area */}
      <div className="space-y-8">
        {/* Premium Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm w-fit mx-auto sm:mx-0">
          {[
            { id: 0, label: "الملف الشخصي", icon: <Person fontSize="small" /> },
            { id: 1, label: "حجوزاتي", icon: <EventNote fontSize="small" /> },
            { id: 2, label: "كلمة المرور", icon: <Lock fontSize="small" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleChange(null, tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all duration-500 ${
                value === tab.id
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 -translate-y-0.5"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content Section */}
        <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          {value === 0 && <ProfileSection user={user} />}
          {value === 1 && <BookingsSection />}
          {value === 2 && <ChangePasswordSection />}
        </div>
      </div>
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
      borderRadius: "1rem",
      bgcolor: "slate.50",
      "&.Mui-focused fieldset": { borderColor: "#f97316" },
      "& fieldset": { borderColor: "#f1f5f9" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
  };

  return (
    <div className="max-w-4xl bg-white rounded-[2rem] border border-slate-50 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-8 pb-8 border-b border-slate-50">
        <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
          <Person sx={{ fontSize: 48, color: "#f97316" }} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 mb-1">
            إعدادات الحساب
          </h3>
          <p className="text-slate-500 font-medium">
            تأكد من بقاء بياناتك الشخصية محدثة لضمان تجربة حجز سلسة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                <Person className="text-slate-400" />
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
          helperText="لا يمكن تغيير البريد الإلكتروني"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email className="text-slate-400" />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
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
                <Phone className="text-slate-400" />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />
      </div>

      <div className="mt-10 flex flex-wrap justify-end gap-5">
        {isEditing ? (
          <>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                p: 1.5,
                px: 6,
                borderRadius: "1rem",
                fontWeight: "black",
                bgcolor: "#f97316",
                "&:hover": { bgcolor: "#ea580c" },
                boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.2)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
            <Button
              variant="text"
              onClick={() => setIsEditing(false)}
              sx={{
                borderRadius: "1rem",
                fontWeight: "bold",
                color: "#94a3b8",
                px: 4,
              }}
            >
              إلغاء
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            startIcon={<Settings fontSize="small" sx={{ ml: 1 }} />}
            sx={{
              p: 1.5,
              px: 6,
              borderRadius: "1rem",
              fontWeight: "black",
              bgcolor: "#0f172a",
              "&:hover": { bgcolor: "#1e293b" },
              boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.2)",
            }}
          >
            تعديل الملف الشخصي
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
      <div className="text-center py-10 text-slate-500">
        <EventNote sx={{ fontSize: 60, color: "#e2e8f0", mb: 2 }} />
        <p>لا توجد حجوزات حالياً</p>
        <Button variant="text" href="/cars" className="mt-4">
          تصفح السيارات
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col lg:flex-row gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
        >
          {/* Car Image Preview */}
          <div className="relative w-full lg:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
            {booking.car?.images?.[0] ? (
              <Image
                src={booking.car.images[0]}
                alt={booking.car.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <DirectionsCar className="text-slate-300" fontSize="large" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Chip
                label={
                  booking.status === "approved"
                    ? "مؤكد"
                    : booking.status === "rejected"
                      ? "مرفوض"
                      : "قيد الانتظار"
                }
                size="small"
                sx={{
                  fontWeight: "900",
                  height: 24,
                  fontSize: "0.7rem",
                  backdropFilter: "blur(4px)",
                  bgcolor:
                    booking.status === "approved"
                      ? "rgba(34, 197, 94, 0.9)"
                      : booking.status === "rejected"
                        ? "rgba(239, 68, 68, 0.9)"
                        : "rgba(249, 115, 22, 0.9)",
                  color: "white",
                  border: "none",
                }}
              />
            </div>
          </div>

          {/* Booking Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-xl text-slate-800">
                  {booking.car?.name || "سيارة غير محددة"}
                </h3>
                <div className="text-left">
                  <span className="text-orange-600 font-black text-xl block">
                    {booking.totalPrice} ريال
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <CalendarMonth className="text-orange-500" fontSize="small" />
                  <span className="text-xs font-bold">
                    من {new Date(booking.startDate).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <CalendarMonth className="text-orange-500" fontSize="small" />
                  <span className="text-xs font-bold">
                    إلى {new Date(booking.endDate).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <Speed className="text-orange-500" fontSize="small" />
                  <span className="text-xs font-bold">
                    المدة: {booking.numberOfDays} أيام
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <Payments className="text-orange-500" fontSize="small" />
                  <span className="text-xs font-bold">الدفع: كاش/تحويل</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              {booking.status === "approved" && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Star sx={{ ml: 1 }} />}
                  onClick={() => handleOpenReview(booking)}
                  sx={{
                    borderRadius: "1.25rem",
                    fontWeight: "black",
                    bgcolor: "#f97316",
                    color: "white",
                    "&:hover": { bgcolor: "#ea580c" },
                    boxShadow: "0 8px 16px -4px rgba(249, 115, 22, 0.3)",
                    textTransform: "none",
                    py: 1.5,
                  }}
                >
                  قيم تجربتك
                </Button>
              )}
              <Button
                fullWidth
                variant="outlined"
                href={`/cars/${booking.car?._id}`}
                sx={{
                  borderRadius: "1.25rem",
                  fontWeight: "black",
                  borderColor: "#e2e8f0",
                  color: "#475569",
                  textTransform: "none",
                  py: 1.5,
                  borderWidth: "2px",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    bgcolor: "#f8fafc",
                    borderWidth: "2px",
                  },
                }}
              >
                تفاصيل السيارة
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Review Dialog */}
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 3, padding: 1, minWidth: 350 } }}
      >
        <DialogTitle className="font-bold text-center">
          كيف كانت تجربتك؟
        </DialogTitle>
        <DialogContent className="flex flex-col items-center space-y-4 pt-4">
          <Typography variant="body2" className="text-slate-500">
            قيم تجربتك مع {selectedBooking?.car?.name}
          </Typography>

          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            precision={1}
          />

          <TextField
            placeholder="اكتب تعليقك هنا..."
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions className="justify-center pb-4">
          <Button
            onClick={() => setReviewOpen(false)}
            className="text-slate-500 font-bold"
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={createReviewMutation.isPending}
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              px: 4,
              backgroundColor: "#f97316",
              "&:hover": { backgroundColor: "#ea580c" },
            }}
          >
            {createReviewMutation.isPending ? "جاري الارسال..." : "نشر التقييم"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
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
      borderRadius: "1rem",
      bgcolor: "slate.50",
      "&.Mui-focused fieldset": { borderColor: "#f97316" },
      "& fieldset": { borderColor: "#f1f5f9" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
  };

  return (
    <div className="max-w-4xl bg-white rounded-[2rem] border border-slate-50 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-8 pb-8 border-b border-slate-50">
        <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
          <Lock sx={{ fontSize: 48, color: "#f97316" }} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 mb-1">
            تغيير كلمة المرور
          </h3>
          <p className="text-slate-500 font-medium">
            ننصح باستخدام كلمة مرور قوية تحتوي على حروف وأرقام لضمان أمان حسابك.
          </p>
        </div>
      </div>

      <div className="max-w-md space-y-6">
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
                <Lock className="text-slate-400" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
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
                <Lock className="text-slate-400" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        <div className="mt-8">
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              p: 2,
              borderRadius: "1.25rem",
              fontWeight: "black",
              bgcolor: "#f97316",
              "&:hover": { bgcolor: "#ea580c" },
              fontSize: "1.1rem",
              boxShadow: "0 12px 20px -5px rgba(249, 115, 22, 0.4)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "تحديث إعدادات الأمان"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
