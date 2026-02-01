import React from "react";
import Link from "next/link";
import { Container } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";

const Breadcrumbs = ({ items }) => {
  return (
    <div className="py-4">
      <Container maxWidth="lg">
        <nav className="flex items-center gap-2 text-sm md:text-base" dir="rtl">
          <Link
            href="/"
            className="text-orange-500 text-xl hover:text-orange-400 font-bold transition-colors"
          >
            الرئيسية
          </Link>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronLeft className="text-slate-500 text-sm" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-orange-500 hover:text-orange-400 font-bold transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-black/75 font-bold">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumbs;
