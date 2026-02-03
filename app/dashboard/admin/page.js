"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api, {
  bookingService,
  carService,
  reviewService,
  userService,
  authService,
} from "@/services/api"; // Added reviewService, userService, authService
import {
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Rating,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  EventNote,
  DirectionsCar,
  Check,
  Close,
  Delete,
  Add,
  UploadFile,
  AttachMoney,
  Description as DescIcon,
  Phone,
  Person,
  Speed,
  WhatsApp,
  Star,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import Image from "next/image";

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other} className="py-6">
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function AdminTabsContent({ user }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tabs mapping: bookings=0, cars=1, reviews=2, profile=3, password=4
  const tabParam = searchParams.get("tab");
  const getTabIndex = (tab) => {
    if (tab === "cars") return 1;
    if (tab === "reviews") return 2;
    if (tab === "profile") return 3;
    if (tab === "password") return 4;
    return 0; // default: bookings
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
      newValue === 1
        ? "cars"
        : newValue === 2
          ? "reviews"
          : newValue === 3
            ? "profile"
            : newValue === 4
              ? "password"
              : "bookings";
    router.push(`/dashboard/admin?tab=${tabName}`);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-white/10 shadow-2xl min-h-[500px] md:min-h-[600px]">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="admin dashboard tabs"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTab-root": {
            fontSize: { xs: "0.85rem", md: "1.1rem" },
            fontWeight: "900",
            fontFamily: "inherit",
            color: "rgba(255,255,255,0.4)",
            minHeight: { xs: "56px", md: "70px" },
            px: { xs: 2, md: 4 },
            transition: "all 0.3s ease",
            "&:hover": { color: "white" },
          },
          "& .Mui-selected": {
            color: "#f97316 !important",
            scale: "1.02",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#f97316",
            height: "4px",
            borderRadius: "4px",
            boxShadow: "0 0 15px rgba(249,115,22,0.5)",
          },
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          mb: { xs: 2.5, md: 4 },
        }}
      >
        <Tab icon={<EventNote />} iconPosition="start" label="الحجوزات" />
        <Tab icon={<DirectionsCar />} iconPosition="start" label="السيارات" />
        <Tab icon={<Star />} iconPosition="start" label="التعليقات" />
        <Tab icon={<Person />} iconPosition="start" label="حسابي" />
        <Tab icon={<Lock />} iconPosition="start" label="الأمان" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <ManageBookings />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ManageCars />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ManageReviews />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ProfileSection user={user} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ChangePasswordSection />
      </TabPanel>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-2xl p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-white/10 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter">
          لوحة{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
            الإدارة
          </span>
        </h1>
        <p className="text-slate-400 font-bold text-base sm:text-lg">
          أهلاً {user?.name}، مرحباً بك في مركز التحكم الفاخر
        </p>
      </div>

      <Suspense fallback={<CircularProgress className="m-auto block" />}>
        <AdminTabsContent user={user} />
      </Suspense>
    </div>
  );
}

function ManageBookings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["allBookings"],
    queryFn: () => bookingService.getAll(),
  });

  const [deleteId, setDeleteId] = useState(null);

  const approveMutation = useMutation({
    mutationFn: bookingService.approve,
    onSuccess: () => {
      toast.success("تم قبول الحجز");
      queryClient.invalidateQueries(["allBookings"]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "فشلت عملية القبول"),
  });

  const rejectMutation = useMutation({
    mutationFn: bookingService.reject,
    onSuccess: () => {
      toast.success("تم رفض الحجز");
      queryClient.invalidateQueries(["allBookings"]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "فشلت عملية الرفض"),
  });

  const deleteMutation = useMutation({
    mutationFn: bookingService.delete,
    onSuccess: () => {
      toast.success("تم حذف الحجز بنجاح");
      queryClient.invalidateQueries(["allBookings"]);
      setDeleteId(null);
    },
    onError: () => toast.error("فشل حذف الحجز"),
  });

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const bookings = data?.data?.bookings || [];

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <EventNote sx={{ fontSize: 48, color: "rgba(255,255,255,0.2)" }} />
        </div>
        <p className="text-xl font-black text-slate-500">
          لا توجد حجوزات حالياً للمراجعة
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 gap-8">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl hover:bg-white/10 transition-all duration-500 relative overflow-hidden group"
          >
            {/* Status Strip */}
            <div
              className={`absolute top-0 right-0 w-2 h-full ${
                booking.status === "approved"
                  ? "bg-green-500"
                  : booking.status === "rejected"
                    ? "bg-red-500"
                    : "bg-orange-400"
              }`}
            />

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Car Info Column */}
              <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-l border-white/5 pb-4 sm:pb-6 lg:pb-0 lg:pl-8">
                <div className="flex items-center gap-3 sm:gap-5 mb-4 sm:mb-6">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shadow-2xl border border-primary/20">
                    <DirectionsCar sx={{ fontSize: 32 }} />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-white tracking-tight">
                      {booking.car?.name || "سيارة غير محددة"}
                    </h3>
                    <p className="text-sm text-slate-400 font-black uppercase tracking-widest mt-1">
                      إصدار {booking.car?.year || "2024"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold">
                      بداية الحجز:
                    </span>
                    <span className="font-black text-white">
                      {booking.startDate
                        ? new Date(booking.startDate).toLocaleDateString(
                            "ar-EG",
                          )
                        : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">نهاية الحجز:</span>
                    <span className="font-bold text-white">
                      {booking.endDate
                        ? new Date(booking.endDate).toLocaleDateString("ar-EG")
                        : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                    <span className="text-slate-500 font-bold">
                      التكلفة الإجمالية:
                    </span>
                    <span className="font-black text-primary text-2xl tracking-tighter">
                      {booking.totalPrice}{" "}
                      <span className="text-xs font-bold text-slate-500">
                        ريال
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Info Column */}
              <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-l border-white/5 pb-4 sm:pb-6 lg:pb-0 lg:pl-8">
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-[0.3em]">
                  بيانات العميل الحصرية
                </h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.05)",
                        color: "var(--primary)",
                        width: 44,
                        height: 44,
                        fontSize: "1.1rem",
                        fontWeight: "900",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      {booking.user?.name?.charAt(0)}
                    </Avatar>
                    <span className="font-black text-white text-lg">
                      {booking.user?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-300 font-bold">
                      <Phone fontSize="small" className="text-primary/70" />
                      <span>{booking.phoneNumber}</span>
                    </div>
                    <IconButton
                      size="small"
                      component="a"
                      href={`https://wa.me/${booking.phoneNumber.replace(/\D/g, "").replace(/^00/, "").replace(/^0/, "966")}`}
                      target="_blank"
                      sx={{
                        color: "#22c55e",
                        bgcolor: "rgba(34, 197, 94, 0.1)",
                        "&:hover": { bgcolor: "rgba(34, 197, 94, 0.2)" },
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                      }}
                    >
                      <WhatsApp fontSize="small" />
                    </IconButton>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-bold">
                    <Speed fontSize="small" className="text-primary/70" />
                    <span>{booking.kmPerDay} كم / يوم</span>
                  </div>
                </div>
              </div>

              {/* Actions Column */}
              <div className="lg:w-1/3 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-auto">
                  <Chip
                    label={
                      booking.status === "approved"
                        ? "تم التأكيد"
                        : booking.status === "rejected"
                          ? "تم الرفض"
                          : "بانتظار المراجعة"
                    }
                    icon={
                      booking.status === "approved" ? (
                        <Check />
                      ) : booking.status === "rejected" ? (
                        <Close />
                      ) : (
                        <EventNote />
                      )
                    }
                    sx={{
                      fontWeight: "900",
                      borderRadius: "15px",
                      px: { xs: 1.5, md: 2 },
                      py: 2,
                      fontSize: { xs: "0.75rem", md: "0.85rem" },
                      bgcolor:
                        booking.status === "approved"
                          ? "rgba(22, 163, 74, 0.1)"
                          : booking.status === "rejected"
                            ? "rgba(220, 38, 38, 0.1)"
                            : "rgba(249, 115, 22, 0.1)",
                      color:
                        booking.status === "approved"
                          ? "#4ade80"
                          : booking.status === "rejected"
                            ? "#f87171"
                            : "#fb923c",
                      border: "1px solid currentColor",
                      "& .MuiChip-icon": {
                        color: "inherit",
                        fontSize: { xs: "0.9rem", md: "1.1rem" },
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteId(booking._id)}
                    sx={{
                      bgcolor: "rgba(220, 38, 38, 0.1)",
                      border: "1px solid rgba(220, 38, 38, 0.2)",
                      "&:hover": { bgcolor: "rgba(220, 38, 38, 0.2)" },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>

                <div className="flex gap-4 mt-8 pb-6 mb-6 border-b border-white/5">
                  <a
                    href={booking.idCardImage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/5 text-white rounded-2xl text-xs font-black hover:bg-white/10 transition-all border border-white/10 group/btn"
                  >
                    <DescIcon
                      fontSize="small"
                      className="text-primary/70 group-hover/btn:text-primary transition-colors"
                    />
                    معاينة الهوية
                  </a>
                  <a
                    href={booking.licenseImage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/5 text-white rounded-2xl text-xs font-black hover:bg-white/10 transition-all border border-white/10 group/btn"
                  >
                    <DescIcon
                      fontSize="small"
                      className="text-primary/70 group-hover/btn:text-primary transition-colors"
                    />
                    معاينة الرخصة
                  </a>
                </div>

                <div className="flex gap-3">
                  {booking.status === "pending" ? (
                    <>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => approveMutation.mutate(booking._id)}
                        disabled={approveMutation.isPending}
                        sx={{
                          borderRadius: "1.25rem",
                          fontWeight: "900",
                          bgcolor: "#16a34a",
                          "&:hover": { bgcolor: "#15803d" },
                          py: 1.5,
                          fontSize: "1rem",
                          boxShadow: "0 15px 25px -5px rgba(22, 163, 74, 0.3)",
                        }}
                      >
                        قبول الحجز
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => rejectMutation.mutate(booking._id)}
                        disabled={rejectMutation.isPending}
                        sx={{
                          borderRadius: "1.25rem",
                          fontWeight: "900",
                          bgcolor: "#dc2626",
                          "&:hover": { bgcolor: "#b91c1c" },
                          py: 1.5,
                          fontSize: "1rem",
                          boxShadow: "0 15px 25px -5px rgba(220, 38, 38, 0.3)",
                        }}
                      >
                        رفض الحجز
                      </Button>
                    </>
                  ) : (
                    <div className="w-full text-center py-3.5 bg-white/5 text-slate-500 rounded-2xl text-sm font-black border border-white/5 italic">
                      تم اتخاذ الإجراء النهائي
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
            bgcolor: "#0f172a",
            backgroundImage:
              "radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 50%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            p: 3,
          },
        }}
        dir="rtl"
      >
        <DialogTitle className="font-black text-3xl text-white text-center mb-2">
          تأكيد حذف الحجز
        </DialogTitle>
        <DialogContent>
          <p className="text-slate-400 font-bold text-center text-lg leading-relaxed">
            هل أنت متأكد من حذف هذا الحجز نهائياً؟ لا يمكن التراجع عن هذا
            الإجراء وقد يؤدي لحذف البيانات المرتبطة به.
          </p>
        </DialogContent>
        <DialogActions className="justify-center gap-4 pb-4">
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              fontWeight: "900",
              color: "rgba(255,255,255,0.4)",
              fontSize: "1.1rem",
            }}
          >
            تراجع
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(deleteId)}
            autoFocus
            sx={{
              borderRadius: "1.25rem",
              fontWeight: "900",
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 10px 20px rgba(185, 28, 28, 0.3)",
            }}
          >
            {deleteMutation.isPending ? "جاري الحذف..." : "نعم، احذفه الآن"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ManageCars() {
  const queryClient = useQueryClient();
  const { data: carsData, isLoading } = useQuery({
    queryKey: ["allCars"],
    queryFn: () => carService.getAll(),
  });

  const [deleteId, setDeleteId] = useState(null); // For Dialog

  const deleteMutation = useMutation({
    mutationFn: carService.delete,
    onSuccess: () => {
      toast.success("تم حذف السيارة بنجاح");
      queryClient.invalidateQueries(["allCars"]);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("فشل حذف السيارة");
      setDeleteId(null);
    },
  });

  const [isAddOpen, setIsAddOpen] = useState(false);

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const cars = carsData?.data?.cars || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl gap-4 sm:gap-6">
        <div className="text-center md:text-right">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            مجموعة السيارات الفاخرة
          </h2>
          <p className="text-[10px] sm:text-sm text-slate-400 mt-2 font-bold uppercase tracking-widest">
            إدارة المركبات المتاحة ({cars.length} سيارة)
          </p>
        </div>

        <Button
          variant="contained"
          fullWidth={false}
          startIcon={<Add sx={{ ml: 1 }} />}
          onClick={() => setIsAddOpen(true)}
          sx={{
            backgroundColor: "var(--primary)",
            "&:hover": { backgroundColor: "var(--primary-hover)" },
            borderRadius: "1.25rem",
            fontWeight: "900",
            px: { xs: 3, md: 4 },
            py: 1.5,
            fontSize: { xs: "0.85rem", md: "1rem" },
            boxShadow: "0 15px 30px rgba(249, 115, 22, 0.3)",
            width: { xs: "100%", md: "auto" },
          }}
        >
          إضافة سيارة جديدة
        </Button>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <DirectionsCar
            sx={{ fontSize: 80, color: "rgba(255,255,255,0.1)", mb: 4 }}
          />
          <p className="text-xl font-black text-slate-500">
            لا توجد سيارات مضافة حالياً
          </p>
          <Button
            variant="text"
            color="primary"
            onClick={() => setIsAddOpen(true)}
            sx={{ mt: 3, fontWeight: "900", fontSize: "1.1rem" }}
          >
            + ابدأ بإضافة أول سيارة
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl hover:bg-white/10 transition-all duration-500 group relative"
            >
              <div className="relative h-48 w-full bg-slate-100">
                {car.image || car.imageUrl ? (
                  <Image
                    src={car.image || car.imageUrl}
                    alt={car.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <DirectionsCar fontSize="large" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Chip
                    label={`${car.pricePerDay} ريال`}
                    color="warning"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-black text-xl text-white line-clamp-1 mb-1 tracking-tight">
                      {car.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                      {car.year} •{" "}
                      <span className="text-primary/70">
                        {car.region === "eastern"
                          ? "الشرقية"
                          : car.region === "jeddah"
                            ? "جدة"
                            : "الرياض"}
                      </span>
                    </p>
                  </div>
                  <Chip
                    label={
                      car.category === "with_driver"
                        ? "بسائق"
                        : car.category === "corporate"
                          ? "شركات"
                          : "إيجار"
                    }
                    size="small"
                    sx={{
                      fontWeight: "900",
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>

                <div className="flex gap-3 mt-6 pt-5 border-t border-white/5">
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => setDeleteId(car._id)}
                    startIcon={<Delete />}
                    sx={{
                      borderRadius: "1.25rem",
                      fontWeight: "900",
                      py: 1.5,
                      bgcolor: "rgba(220, 38, 38, 0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(220, 38, 38, 0.2)",
                      "&:hover": {
                        bgcolor: "rgba(220, 38, 38, 0.2)",
                        border: "1px solid #ef4444",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span className="ml-1">حذف السيارة</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCarDialog open={isAddOpen} onClose={() => setIsAddOpen(false)} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
            bgcolor: "var(--background)",
            backgroundImage:
              "radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 50%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            p: 3,
          },
        }}
        dir="rtl"
      >
        <DialogTitle className="font-black text-3xl text-white text-center mb-2">
          تأكيد الحذف
        </DialogTitle>
        <DialogContent>
          <p className="text-slate-400 font-bold text-center text-lg leading-relaxed">
            سيتم حذف السيارة وجميع بياناتها وحجوزات السجل المرتبطة بها نهائياً
            من قاعدة البيانات. لا يمكن استعادة هذه البيانات لاحقاً.
          </p>
        </DialogContent>
        <DialogActions className="justify-center gap-4 pb-4">
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              fontWeight: "900",
              color: "rgba(255,255,255,0.4)",
              fontSize: "1.1rem",
            }}
          >
            تراجع عن الإجراء
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(deleteId)}
            autoFocus
            sx={{
              borderRadius: "1.25rem",
              fontWeight: "900",
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 10px 20px rgba(185, 28, 28, 0.3)",
            }}
          >
            تأكيد الحذف النهائي
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ManageReviews() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["allReviewsAdmin"],
    queryFn: () => reviewService.getAllAdmin(),
  });

  const [deleteId, setDeleteId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: reviewService.delete,
    onSuccess: () => {
      toast.success("تم حذف التعليق بنجاح");
      queryClient.invalidateQueries(["allReviewsAdmin"]);
      queryClient.invalidateQueries(["recentReviews"]); // Sync home page
      setDeleteId(null);
    },
    onError: () => {
      toast.error("فشل حذف التعليق");
      setDeleteId(null);
    },
  });

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const reviews = data?.data?.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 bg-midnight/30 backdrop-blur-xl rounded-[3rem] border border-dashed border-white/10">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Star sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)" }} />
        </div>
        <p className="text-xl font-bold text-slate-400">
          لا توجد تعليقات حقيقية في قاعدة البيانات حالياً
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-2xl hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-start justify-between mb-6 md:mb-8 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5">
                <Avatar
                  sx={{
                    width: { xs: 50, sm: 64 },
                    height: { xs: 50, sm: 64 },
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: "var(--primary)",
                    fontWeight: "900",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    fontSize: { xs: "1.1rem", sm: "1.4rem" },
                  }}
                >
                  {review.user?.name?.charAt(0)}
                </Avatar>
                <div className="min-w-0">
                  <h4 className="font-black text-white text-lg md:text-xl tracking-tight mb-0.5 truncate">
                    {review.user?.name}
                  </h4>
                  <p className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-widest truncate">
                    {review.user?.email}
                  </p>
                </div>
              </div>
              <IconButton
                onClick={() => setDeleteId(review._id)}
                sx={{
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <Delete />
              </IconButton>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-[1.5rem] p-4 sm:p-6 mb-6 md:mb-8 relative z-10 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <DirectionsCar className="text-primary" sx={{ fontSize: 18 }} />
                <span className="text-xs md:text-sm font-black text-white uppercase tracking-tight">
                  {review.car?.name}
                </span>
              </div>
              <Rating
                value={review.rating}
                readOnly
                size="small"
                sx={{ "& .MuiRating-iconFilled": { color: "var(--primary)" } }}
              />
            </div>

            <p className="text-slate-400 leading-relaxed font-bold text-base md:text-lg italic relative z-10 border-r-2 border-primary/30 pr-4 line-clamp-4 md:line-clamp-none">
              "{review.comment || "بدون تعليق نصي"}"
            </p>

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                {new Date(review.createdAt).toLocaleDateString("ar-EG")}
              </span>
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-500 font-black uppercase tracking-wider">
                  Verified Review
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            borderRadius: { xs: "2rem", md: "2.5rem" },
            bgcolor: "#0f172a",
            backgroundImage:
              "radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 50%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            p: { xs: 2, md: 3 },
            margin: { xs: 2, md: 4 },
          },
        }}
        dir="rtl"
      >
        <DialogTitle className="font-black text-2xl md:text-3xl text-white text-center mb-1 md:mb-2">
          تأكيد حذف التعليق
        </DialogTitle>
        <DialogContent>
          <p className="text-slate-400 font-bold text-center text-base md:text-lg leading-relaxed">
            هل أنت متأكد من حذف هذا التعليق نهائياً؟ سيؤثر هذا على إجمالي تقييم
            السيارة بشكل مباشر. لا يمكن استعادة التعليق بعد الحذف.
          </p>
        </DialogContent>
        <DialogActions className="justify-center gap-4 pb-4">
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              fontWeight: "900",
              color: "rgba(255,255,255,0.4)",
              fontSize: "1.1rem",
            }}
          >
            تراجع
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(deleteId)}
            autoFocus
            sx={{
              borderRadius: "1.25rem",
              fontWeight: "900",
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 10px 20px rgba(185, 28, 28, 0.3)",
            }}
          >
            {deleteMutation.isPending ? "جاري الحذف..." : "تأكيد الحذف النهائي"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function AddCarDialog({ open, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    region: "riyadh",
    category: "regular",
    pricePerDay: "",
    imageUrl: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "1.25rem",
      bgcolor: "rgba(255,255,255,0.03)",
      color: "white",
      fontWeight: "bold",
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

  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: "#0f172a",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "white",
        borderRadius: "1.25rem",
        marginTop: "8px",
        "& .MuiMenuItem-root": {
          fontSize: "1rem",
          fontWeight: "bold",
          py: 1.5,
          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
          "&.Mui-selected": {
            bgcolor: "rgba(249, 115, 22, 0.2)",
            color: "#f97316",
            "&:hover": { bgcolor: "rgba(249, 115, 22, 0.3)" },
          },
        },
      },
    },
  };

  // ... (Keep mutation logic same as before)
  const createMutation = useMutation({
    mutationFn: carService.create,
    onSuccess: () => {
      toast.success("تم إضافة السيارة بنجاح");
      queryClient.invalidateQueries(["allCars"]);
      onClose();
      setFormData({
        name: "",
        year: new Date().getFullYear(),
        region: "riyadh",
        category: "regular",
        pricePerDay: "",
        imageUrl: "",
        description: "",
      });
      setFile(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "فشل إضافة السيارة");
    },
  });

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.pricePerDay ||
      !formData.description ||
      !file
    ) {
      toast.warning("يرجى ملء جميع الحقول المطلوبة وإرفاق صورة");
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "فشل رفع الصورة");

      createMutation.mutate({
        ...formData,
        imageUrl: result.url,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "حدث خطأ أثناء الرفع");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "2.5rem",
          overflow: "hidden",
          bgcolor: "#020617",
          backgroundImage:
            "radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(30, 27, 75, 0.2) 0px, transparent 50%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
        },
      }}
    >
      <div className="bg-white/5 p-8 px-10 border-b border-white/5 flex justify-between items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="bg-primary/20 p-3 rounded-2xl text-primary shadow-2xl border border-primary/20">
              <DirectionsCar sx={{ fontSize: 24 }} />
            </div>
            إضافة سيارة جديدة
          </h2>
          <p className="text-sm text-slate-400 mr-14 mt-2 font-bold uppercase tracking-widest">
            قم بإضافة سيارات فاخرة جديدة إلى مجموعتك
          </p>
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          className="text-slate-500 hover:text-white transition-colors relative z-10"
        >
          <Close />
        </IconButton>
      </div>

      <DialogContent className="p-10 custom-scrollbar">
        <div className="flex flex-col gap-8 pt-2">
          {/* Image Upload Area */}
          <div
            className={`border-2 border-dashed rounded-[2rem] p-8 transition-all cursor-pointer relative group overflow-hidden ${
              file
                ? "border-primary/50 bg-primary/5"
                : "border-white/10 hover:border-primary/30 hover:bg-white/5"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file ? (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-midnight/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <div className="bg-primary px-6 py-2.5 rounded-full text-white font-black flex items-center gap-2 shadow-2xl">
                    <UploadFile /> تغيير الصورة الحالية
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-5 text-slate-400">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-2xl">
                  <UploadFile fontSize="large" />
                </div>
                <div className="text-center">
                  <span className="block font-black text-2xl text-white mb-2 tracking-tight">
                    اضغط لرفع صورة السيارة
                  </span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    PNG, JPG, WEBP • Max 5MB
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 gap-6">
            <TextField
              label="اسم السيارة والموديل"
              placeholder="مثال: تويوتا كامري 2024"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={inputStyle}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>المنطقة</InputLabel>
                <Select
                  label="المنطقة"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  MenuProps={menuProps}
                >
                  <MenuItem value="riyadh">الرياض</MenuItem>
                  <MenuItem value="jeddah">جدة</MenuItem>
                  <MenuItem value="eastern">المنطقة الشرقية</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="سنة الصنع"
                fullWidth
                type="number"
                variant="outlined"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                sx={inputStyle}
              />
            </div>

            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>القسم</InputLabel>
              <Select
                label="القسم"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                MenuProps={menuProps}
              >
                <MenuItem value="regular">سيارات للإيجار</MenuItem>
                <MenuItem value="with_driver">سيارات بسائق</MenuItem>
                <MenuItem value="corporate">قسم الشركات</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="سعر اليوم (ريال)"
              placeholder="0.00"
              fullWidth
              type="number"
              variant="outlined"
              value={formData.pricePerDay}
              onChange={(e) =>
                setFormData({ ...formData, pricePerDay: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney className="text-primary" />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            <TextField
              label="وصف السيارة"
              placeholder="اكتب وصفاً جذاباً للسيارة ومميزاتها..."
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={inputStyle}
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
        <Button
          onClick={onClose}
          variant="text"
          color="inherit"
          disabled={uploading}
          sx={{
            borderRadius: "1.25rem",
            px: 4,
            fontWeight: "900",
            color: "rgba(255,255,255,0.4)",
            fontSize: "1rem",
          }}
        >
          تراجع
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || createMutation.isPending}
          fullWidth
          sx={{
            backgroundColor: "var(--primary)",
            "&:hover": { backgroundColor: "var(--primary-hover)" },
            borderRadius: "1.25rem",
            py: 2,
            fontWeight: "900",
            fontSize: "1.1rem",
            boxShadow: "0 15px 30px rgba(249, 115, 22, 0.3)",
          }}
        >
          {uploading ? (
            <div className="flex items-center gap-3">
              <CircularProgress size={20} color="inherit" /> جاري رفع الصورة...
            </div>
          ) : createMutation.isPending ? (
            "جاري الحفظ..."
          ) : (
            "إضافة السيارة الآن"
          )}
        </Button>
      </DialogActions>
    </Dialog>
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
    <div className="max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-white/10 p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start mb-6 sm:mb-8 md:mb-10 pb-6 sm:pb-8 md:pb-10 border-b border-white/5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-xl sm:rounded-2xl md:rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl border border-primary/20">
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
            startIcon={<SettingsIcon fontSize="small" sx={{ ml: 1 }} />}
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
    <div className="max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-white/10 p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start mb-6 sm:mb-8 md:mb-10 pb-6 sm:pb-8 md:pb-10 border-b border-white/5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-xl sm:rounded-2xl md:rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl border border-primary/20">
          <Lock sx={{ fontSize: { xs: 36, sm: 44, md: 54 }, color: "var(--primary)" }} />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 sm:mb-2 leading-tight">
            تغيير كلمة المرور
          </h3>
          <p className="text-slate-400 font-bold text-sm sm:text-base md:text-lg">
            ننصح باستخدام كلمة مرور قوية ومعقدة لضمان أقصى درجات الأمان لحسابك.
          </p>
        </div>
      </div>

      <div className="max-w-md flex flex-col gap-6 sm:gap-8 md:gap-12 mt-4 sm:mt-6">
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

        <div className="mt-6 sm:mt-8 md:mt-12">
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
              <CircularProgress size={28} color="inherit" />
            ) : (
              "تحديث كلمة المرور الآن"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
