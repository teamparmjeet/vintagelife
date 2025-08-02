"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSidebar } from "@/app/context/SidebarContext";
import { ThemeToggleButton } from "./ThemeToggleButton";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, ChevronDown, Phone } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

// Custom hook for fetching user data
const useUserData = (session) => {
  const [userData, setUserData] = useState({ img: "", userstatus: "", dsid: "", mobile: "", usertype: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/api/user/find-admin-byemail/${session.user.email}`
        );
        const data = response.data;


        if (data?.name) {
          setUserData({
            img: data.image,
            userstatus: data.defaultdata,
            dsid: data.dscode,
            mobile: data.mobileNo,
            usertype: data.usertype,
          });

          if (data.defaultdata !== "user") {
            await signOut({ callbackUrl: "/" });
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  return { ...userData, loading, error };
};

// Custom hook for handling keyboard shortcuts
const useKeydown = (callback, ref) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        ref.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, ref]);
};

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef(null);
  const { data: session } = useSession();
  const { img, userstatus, dsid, mobile, usertype, loading, error } = useUserData(session);

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  useKeydown(() => inputRef.current?.focus(), inputRef);

  return (
    <header className="sticky top-0 z-40 flex w-full  borderw bgn ">
      <div className="flex flex-grow items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="mr-4 textw"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <div className="lg:hidden">
            <Image
              width={40}
              height={40}
              src="/images/logo/logo-blank.png"
              alt="Logo"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          {/* <ThemeToggleButton /> */}

          <div className="relative">
            <button
              onClick={() => setApplicationMenuOpen(!isApplicationMenuOpen)}
              className="flex items-center gap-2 rounded-full  p-1 "
            >
              <Image
                width={36}
                height={36}
                src={img || "/images/user/icon-5359553_640.webp"}
                alt="User"
                className="rounded-full object-cover"
              />
              <span className="hidden text-sm font-medium textw  md:block">
                {session?.user?.name}
              </span>
              <ChevronDown
                className={`hidden h-5 w-5 textw transition-transform  md:block ${isApplicationMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isApplicationMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">DSID: {dsid}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {mobile}
                  </div>
                  <p
                    className={`text-xs font-semibold mt-1 px-2 py-1 rounded-full inline-block ${usertype === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                      }`}
                  >
                    {usertype === 0 ? "Inactive" : "Active"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    Cookies.remove("hasSeenModal");
                    signOut();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-5 w-5 text-gray-500" />
                  <span>Logout</span>
                </button>
              </div>

            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;