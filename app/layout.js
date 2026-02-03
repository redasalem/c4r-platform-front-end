import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import FloatingContact from "@/components/layout/FloatingContact";
import FooterWrapper from "@/components/layout/FooterWrapper";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import Providers from "./providers";
import { Almarai } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

export const metadata = {
  title: "C4R-Platform | تأجير سيارات في السعودية",
  description:
    "منصة C4R لتأجير السيارات الفاخرة والاقتصادية في المملكة العربية السعودية. حجز سريع وآمن وخدمة عملاء 24/7.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/logo1.jpg", // ← Favicon (Tab المتصفح)
    apple: "/logo1.jpg", // ← iOS Home Screen
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${almarai.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <BottomNav />
          <FloatingContact />
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
