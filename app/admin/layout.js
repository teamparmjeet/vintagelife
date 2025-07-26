"use client"
import { Geist, Geist_Mono } from "next/font/google";
import { useSidebar } from "../context/SidebarContext";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "./component/AppSidebar";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function AdminLayout({ children }) {

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <>
      <div className="min-h-screen xl:flex  bg-white dark:bg-gray-800">
        <AppSidebar />
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          <div className="p-2 mx-auto max-w-(--breakpoint-2xl) bg-white dark:bg-gray-800 md:p-2">{children}</div>
        </div>
      </div>

    </>
  );
}
