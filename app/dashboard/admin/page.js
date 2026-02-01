"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api, { bookingService, carService, reviewService } from "@/services/api"; // Added reviewService and api
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
  Speed,
  WhatsApp,
  Star,
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

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tabs mapping: bookings=0, cars=1, reviews=2
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "cars" ? 1 : tabParam === "reviews" ? 2 : 0;

  const [value, setValue] = useState(initialTab);

  // Sync tab state with URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "cars") setValue(1);
    else if (tab === "reviews") setValue(2);
    else setValue(0);
  }, [searchParams]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const tabName =
      newValue === 1 ? "cars" : newValue === 2 ? "reviews" : "bookings";
    router.push(`/dashboard/admin?tab=${tabName}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-black text-slate-800">لوحة الإدارة</h1>
        <p className="text-slate-500">
          أهلاً {user?.name}، لديك صلاحيات المدير
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[600px]">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="admin dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              fontSize: "1rem",
              fontWeight: "bold",
              fontFamily: "inherit",
            },
            "& .Mui-selected": {
              color: "#f97316 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#f97316",
            },
          }}
        >
          <Tab
            icon={<EventNote />}
            iconPosition="start"
            label="إدارة الحجوزات"
          />
          <Tab
            icon={<DirectionsCar />}
            iconPosition="start"
            label="إدارة السيارات"
          />
          <Tab
            icon={<DescIcon />}
            iconPosition="start"
            label="إدارة التعليقات"
          />
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
      </div>
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
      <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <EventNote sx={{ fontSize: 40, opacity: 0.2 }} />
        </div>
        <p className="text-lg font-bold text-slate-400">
          لا توجد حجوزات حالياً للمراجعة
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
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

            <div className="flex flex-col md:flex-row gap-6">
              {/* Car Info Column */}
              <div className="md:w-1/3 border-l md:border-l border-slate-100 pl-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-slate-100 p-2 rounded-2xl text-slate-700">
                    <DirectionsCar />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800">
                      {booking.car?.name || "سيارة غير محددة"}
                    </h3>
                    <p className="text-sm text-slate-400 font-bold">
                      موديل {booking.car?.year || "2024"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">بداية الحجز:</span>
                    <span className="font-bold text-slate-700">
                      {booking.startDate
                        ? new Date(booking.startDate).toLocaleDateString(
                            "ar-EG",
                          )
                        : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">نهاية الحجز:</span>
                    <span className="font-bold text-slate-700">
                      {booking.endDate
                        ? new Date(booking.endDate).toLocaleDateString("ar-EG")
                        : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                    <span className="text-slate-500">التكلفة الإجمالية:</span>
                    <span className="font-black text-orange-600 text-lg">
                      {booking.totalPrice} ريال
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Info Column */}
              <div className="md:w-1/3 border-l md:border-l border-slate-100 pl-4">
                <h4 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-wider">
                  بيانات العميل
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      sx={{
                        bgcolor: "#f1f5f9",
                        color: "#64748b",
                        width: 32,
                        height: 32,
                        fontSize: "0.8rem",
                      }}
                    >
                      {booking.user?.name?.charAt(0)}
                    </Avatar>
                    <span className="font-bold text-slate-700">
                      {booking.user?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone fontSize="small" className="text-slate-400" />
                      <span>{booking.phoneNumber}</span>
                    </div>
                    <IconButton
                      size="small"
                      component="a"
                      href={`https://wa.me/${booking.phoneNumber.replace(/\D/g, "").replace(/^00/, "").replace(/^0/, "966")}`}
                      target="_blank"
                      sx={{
                        color: "#22c55e",
                        bgcolor: "#f0fdf4",
                        "&:hover": { bgcolor: "#dcfce7" },
                      }}
                    >
                      <WhatsApp fontSize="small" />
                    </IconButton>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Speed fontSize="small" className="text-slate-400" />
                    <span>{booking.kmPerDay} كم / يوم</span>
                  </div>
                </div>
              </div>

              {/* Actions Column */}
              <div className="md:w-1/3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Chip
                    label={
                      booking.status === "approved"
                        ? "مؤكد"
                        : booking.status === "rejected"
                          ? "مرفوض"
                          : "قيد الانتظار"
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
                      fontWeight: "black",
                      borderRadius: "10px",
                      px: 1,
                      bgcolor:
                        booking.status === "approved"
                          ? "#dcfce7"
                          : booking.status === "rejected"
                            ? "#fee2e2"
                            : "#ffedd5",
                      color:
                        booking.status === "approved"
                          ? "#16a34a"
                          : booking.status === "rejected"
                            ? "#dc2626"
                            : "#ea580c",
                      "& .MuiChip-icon": { color: "inherit" },
                    }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteId(booking._id)}
                    sx={{ bgcolor: "#fef2f2" }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>

                <div className="flex gap-3 mt-6">
                  <a
                    href={booking.idCardImage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    الهوية
                  </a>
                  <a
                    href={booking.licenseImage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    الرخصة
                  </a>
                </div>

                <div className="mt-4 flex gap-2">
                  {booking.status === "pending" ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => approveMutation.mutate(booking._id)}
                        disabled={approveMutation.isPending}
                        sx={{
                          borderRadius: 3,
                          fontWeight: "bold",
                          boxShadow: "none",
                        }}
                      >
                        قبول
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={() => rejectMutation.mutate(booking._id)}
                        disabled={rejectMutation.isPending}
                        sx={{
                          borderRadius: 3,
                          fontWeight: "bold",
                          boxShadow: "none",
                        }}
                      >
                        رفض
                      </Button>
                    </>
                  ) : (
                    <div className="w-full text-center py-2 bg-slate-50 text-slate-400 rounded-xl text-sm font-medium border border-slate-100 italic">
                      تم اتخاذ إجراء
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        dir="rtl"
      >
        <DialogTitle className="font-black text-center">حذف الحجز؟</DialogTitle>
        <DialogContent>
          <Typography className="text-center text-slate-500">
            هل أنت متأكد من حذف هذا الحجز نهائياً؟ لا يمكن التراجع عن هذا
            الإجراء.
          </Typography>
        </DialogContent>
        <DialogActions className="justify-center pb-4">
          <Button
            onClick={() => setDeleteId(null)}
            sx={{ fontWeight: "bold", color: "#64748b" }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(deleteId)}
            disabled={deleteMutation.isPending}
            sx={{ borderRadius: 2, fontWeight: "bold", px: 4 }}
          >
            {deleteMutation.isPending ? "جاري الحذف..." : "نعم، احذف"}
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
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">أسطول السيارات</h2>
          <p className="text-sm text-slate-500 mt-1">
            إدارة السيارات المعروضة للحجز ({cars.length} سيارة)
          </p>
        </div>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddOpen(true)}
          sx={{
            backgroundColor: "#f97316",
            "&:hover": { backgroundColor: "#ea580c" },
            borderRadius: 3,
            fontWeight: "bold",
            px: 3,
          }}
        >
          إضافة سيارة
        </Button>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <DirectionsCar sx={{ fontSize: 60, color: "#cbd5e1", mb: 2 }} />
          <p className="text-slate-500 font-medium">
            لا توجد سيارات مضافة حالياً
          </p>
          <Button
            variant="text"
            color="primary"
            onClick={() => setIsAddOpen(true)}
            sx={{ mt: 1 }}
          >
            + إضافة أول سيارة
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
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
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1">
                      {car.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {car.year} •{" "}
                      {car.region === "eastern"
                        ? "الشرقية"
                        : car.region === "jeddah"
                          ? "جدة"
                          : "الرياض"}
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
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                      backgroundColor:
                        car.category === "with_driver"
                          ? "#dbeafe"
                          : car.category === "corporate"
                            ? "#fef3c7"
                            : "#dcfce7",
                      color:
                        car.category === "with_driver"
                          ? "#2563eb"
                          : car.category === "corporate"
                            ? "#d97706"
                            : "#16a34a",
                    }}
                  />
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setDeleteId(car._id)}
                    sx={{
                      borderRadius: 3,
                      borderWidth: "1.5px",
                      "&:hover": { borderWidth: "1.5px", bgcolor: "#fef2f2" },
                      fontWeight: "bold",
                      py: 1,
                    }}
                  >
                    <span className="hidden md:inline">حـذف</span>
                    <Delete className="md:hidden" sx={{ fontSize: 20 }} />
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
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        dir="rtl"
      >
        <DialogTitle className="font-bold text-slate-800">
          هل أنت متأكد من الحذف؟
        </DialogTitle>
        <DialogContent>
          <p className="text-slate-600">
            سيتم حذف السيارة وجميع الحجوزات المرتبطة بها نهائياً. هذا الإجراء لا
            يمكن التراجع عنه.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{ fontWeight: "bold", color: "slate.500" }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(deleteId)}
            autoFocus
            sx={{ borderRadius: 2, fontWeight: "bold" }}
          >
            حذف نهائي
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

  const deleteMutation = useMutation({
    mutationFn: reviewService.delete,
    onSuccess: () => {
      toast.success("تم حذف التعليق بنجاح");
      queryClient.invalidateQueries(["allReviewsAdmin"]);
    },
    onError: () => toast.error("فشل حذف التعليق"),
  });

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const mockReviews = [
    {
      _id: "mock-adm-1",
      user: { name: "عميل تجريبي", email: "test@example.com", image: null },
      car: { name: "سيارة تجريبية (للمعاينة)" },
      rating: 5,
      comment:
        "هذا تعليق تجريبي لمعاينة التصميم الجديد للوحة التحكم. يمكنك حذفه بمجرد ظهور التعليقات الحقيقية.",
      createdAt: new Date().toISOString(),
    },
  ];

  const dbReviews = data?.data?.reviews || [];
  const reviews = dbReviews.length > 0 ? dbReviews : mockReviews;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star sx={{ fontSize: 40, opacity: 0.2 }} />
        </div>
        <p className="text-lg font-bold">لا توجد تعليقات حالياً للمراجعة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
          >
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "#f1f5f9",
                    color: "#64748b",
                    fontWeight: "black",
                    border: "2px solid white",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                >
                  {review.user?.name?.charAt(0)}
                </Avatar>
                <div>
                  <h4 className="font-black text-slate-800 text-lg">
                    {review.user?.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-bold">
                    {review.user?.email}
                  </p>
                </div>
              </div>
              <IconButton
                onClick={() => {
                  if (window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
                    deleteMutation.mutate(review._id);
                  }
                }}
                sx={{
                  bgcolor: "#fef2f2",
                  color: "#ef4444",
                  "&:hover": { bgcolor: "#fee2e2" },
                }}
              >
                <Delete />
              </IconButton>
            </div>

            <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 relative z-10 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <DirectionsCar className="text-orange-500" fontSize="small" />
                <span className="text-sm font-black text-slate-700">
                  {review.car?.name}
                </span>
              </div>
              <Rating
                value={review.rating}
                readOnly
                size="small"
                sx={{ "& .MuiRating-iconFilled": { color: "#f97316" } }}
              />
            </div>

            <p className="text-slate-600 leading-relaxed font-medium italic relative z-10">
              "{review.comment || "بدون تعليق نصي"}"
            </p>

            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center relative z-10">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                {new Date(review.createdAt).toLocaleDateString("ar-EG")}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-600 font-black uppercase">
                  Verified Review
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
        sx: { borderRadius: 4, overflow: "hidden" },
      }}
    >
      <div className="bg-slate-50 p-5 px-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
              <DirectionsCar />
            </div>
            إضافة سيارة جديدة
          </h2>
          <p className="text-xs text-slate-500 mr-11 mt-1">
            أدخل بيانات السيارة والصورة لإضافتها للمنصة
          </p>
        </div>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </div>

      <DialogContent className="p-6">
        <div className="flex flex-col gap-6 pt-2">
          {/* Image Upload Area */}
          <div
            className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer relative group ${
              file
                ? "border-orange-200 bg-orange-50/30"
                : "border-slate-200 hover:border-orange-300 hover:bg-slate-50"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold flex items-center gap-2">
                    <UploadFile /> تغيير الصورة
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 gap-3 text-slate-500">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-1 group-hover:scale-110 transition-transform">
                  <UploadFile fontSize="large" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-lg text-slate-700">
                    اضغط لرفع صورة
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    PNG, JPG, WEBP (Max 5MB)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 gap-5">
            <TextField
              label="اسم السيارة والموديل"
              placeholder="مثال: تويوتا كامري 2024"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <div className="grid grid-cols-2 gap-5">
              <TextField
                label="المنطقة"
                select
                fullWidth
                variant="outlined"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                SelectProps={{ native: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <option value="riyadh">الرياض</option>
                <option value="jeddah">جدة</option>
                <option value="eastern">المنطقة الشرقية</option>
              </TextField>

              <TextField
                label="سنة الصنع"
                fullWidth
                type="number"
                variant="outlined"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </div>

            <TextField
              label="القسم"
              select
              fullWidth
              variant="outlined"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              SelectProps={{ native: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <option value="regular">سيارات للإيجار</option>
              <option value="with_driver">سيارات بسائق</option>
              <option value="corporate">قسم الشركات</option>
            </TextField>

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
                    <AttachMoney className="text-slate-400" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                },
              }}
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
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
        <Button
          onClick={onClose}
          variant="text"
          color="inherit"
          disabled={uploading}
          sx={{ borderRadius: 2, px: 3, fontWeight: "bold", color: "#64748b" }}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || createMutation.isPending}
          fullWidth
          sx={{
            backgroundColor: "#f97316",
            "&:hover": { backgroundColor: "#ea580c" },
            borderRadius: 2,
            py: 1.2,
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
          }}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <CircularProgress size={20} color="inherit" /> جاري الرفع...
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
