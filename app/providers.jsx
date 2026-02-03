"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Create RTL Theme
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "var(--font-almarai)",
  },
  palette: {
    mode: "dark", // Since app uses dark styling
    primary: {
      main: "#f97316", // Orange
    },
  },
});

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          {children}
          <ToastContainer position="bottom-right" rtl />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
