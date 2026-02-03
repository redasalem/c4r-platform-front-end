"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { WhatsApp, Email } from "@mui/icons-material";

const FloatingContact = () => {
  const pathname = usePathname();

  // Hide on auth and dashboard pages
  const hidePaths = ["/auth", "/dashboard"];
  const shouldHide = hidePaths.some((path) => pathname?.includes(path));

  if (shouldHide) return null;

  return (
    <>
      {/* WhatsApp - Bottom Right */}
      <a
        href="https://wa.me/966554118873"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-8 right-8 z-[9999] bg-[#22c55e] text-white w-16 h-16 rounded-full items-center justify-center shadow-[0_10px_30px_rgba(34,197,94,0.4)] hover:scale-110 hover:shadow-[0_15px_40px_rgba(34,197,94,0.6)] transition-all duration-300 group"
        aria-label="Contact on WhatsApp"
      >
        <WhatsApp
          sx={{ fontSize: 32 }}
          className="group-hover:rotate-12 transition-transform"
        />
        <span className="absolute -top-2 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
      </a>

      {/* Email - Bottom Left */}
      <a
        href="mailto:Team@C4Rplatform.com"
        className="hidden md:flex fixed bottom-8 left-8 z-[9999] bg-white/10 backdrop-blur-xl border border-white/20 text-white w-14 h-14 rounded-2xl items-center justify-center shadow-2xl hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
        aria-label="Send an Email"
      >
        <Email
          sx={{ fontSize: 28 }}
          className="group-hover:-translate-y-1 transition-transform"
        />
      </a>
    </>
  );
};

export default FloatingContact;
