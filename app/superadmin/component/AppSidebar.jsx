


"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSidebar } from '@/app/context/SidebarContext'
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Folder, ChevronDown, } from "lucide-react";

const navItems = [
    {
        icon: <Folder />,
        name: "Admin Panel",
        path: "/superadmin/panel",
    },
    {
        icon: <Folder />,
        name: "Dashboard",
        path: "/superadmin/Dashboard",
    },


    {
        icon: <Folder />,
        name: "User Profile",
        subItems: [

            { name: "Active User ID", path: "/superadmin/Userprofile/activeuser", pro: false },
            { name: "DeActive User ID", path: "/superadmin/Userprofile/deactiveuser", pro: false },
            { name: "Susspend User ID", path: "/superadmin/Userprofile/susspenduser", pro: false },
            { name: "Level Achivers", path: "/superadmin/Userprofile/levelachivers", pro: false },
            { name: "All User", path: "/superadmin/Userprofile/user", pro: false },
            // { name: "Pending Sp", path: "/superadmin/Userprofile/pendingsp", pro: false },
        ],
    },
    {
        icon: <Folder />,
        name: "Bank Kyc",
        subItems: [
            { name: "Pending", path: "/superadmin/BankKyc/pending", pro: false },
            { name: "Approved", path: "/superadmin/BankKyc/approved", pro: false },
            { name: "Rejected", path: "/superadmin/BankKyc/rejected", pro: false },
        ],
    },

    {
        icon: <Folder />,
        name: "Pan Card Kyc",
        subItems: [
            { name: "Pending", path: "/superadmin/panKyc/pending", pro: false },
            { name: "Approved", path: "/superadmin/panKyc/approved", pro: false },
            { name: "Rejected", path: "/superadmin/panKyc/rejected", pro: false },
        ],
    },

    {
        icon: <Folder />,
        name: "Aadhar Kyc",
        subItems: [
            { name: "Pending", path: "/superadmin/aadharkyc/pending", pro: false },
            { name: "Approved", path: "/superadmin/aadharkyc/approved", pro: false },
            { name: "Rejected", path: "/superadmin/aadharkyc/rejected", pro: false },
        ],
    },
    {
        icon: <Folder />,
        name: "Report",
        subItems: [
            { name: "UserReport", path: "/superadmin/Report/UserReport", pro: false },
        ],
    },
    {
        icon: <Folder />,
        name: "Orders",
        subItems: [
            { name: "Approved", path: "/superadmin/order/approvedorder", pro: false },
            { name: "Pending", path: "/superadmin/order/pendingdorder", pro: false },
        ],
    },

    {
        icon: <Folder />,
        name: "Payment History",
        subItems: [
            { name: "Payment History", path: "/superadmin/Paymenthistory", pro: false },
        ],
    },


    {
        icon: <Folder />,
        name: "Closing",
        subItems: [
            { name: "Pair Income Closing", path: "/superadmin/closing/pair", pro: false },
            { name: "Monthly Closing", path: "/superadmin/closing/monthly", pro: false },
            { name: "Travel Fund Closing", path: "/superadmin/closing/travel", pro: false },
            { name: "Bonanza Closing", path: "/superadmin/closing/bonanza", pro: false },
        ],
    },

    {
        icon: <Folder />,
        name: "Pair Withdrawal",
        subItems: [
            { name: "Pending", path: "/superadmin/withdrawal/pending", pro: false },
            { name: "Success", path: "/superadmin/withdrawal/success", pro: false },
            { name: "Invalid", path: "/superadmin/withdrawal/invalid", pro: false },
        ],
    },

    {
        icon: <Folder />,
        name: "Monthly Withdrawal",
        subItems: [
            { name: "Pending", path: "/superadmin/withdrawal/month/pending", pro: false },
            { name: "Success", path: "/superadmin/withdrawal/month/success", pro: false },
            { name: "Invalid", path: "/superadmin/withdrawal/month/invalid", pro: false },
        ],
    },

     {
        icon: <Folder />,
        name: "Travel Fund Withdrawal",
        subItems: [
            { name: "Pending", path: "/superadmin/withdrawal/travel/pending", pro: false },
            { name: "Success", path: "/superadmin/withdrawal/travel/success", pro: false },
            { name: "Invalid", path: "/superadmin/withdrawal/travel/invalid", pro: false },
        ],
    },



    {
        icon: <Folder />,
        name: "Genealogy",
        subItems: [
            { name: "Sales Team", path: "/superadmin/Genealogy/salesteam", pro: false },
            { name: "Direct DS Code", path: "/superadmin/Genealogy/directds", pro: false },
        ],
    },
    {
        icon: <Folder />,
        name: "Level",
        subItems: [
            // { name: "Add Level", path: "/superadmin/Level/add", pro: false },
            { name: "All Level", path: "/superadmin/Level/all", pro: false },
            { name: "Update User", path: "/superadmin/Level/updateuser", pro: false },
        ],
    },

    {
        icon: <Folder />,
        name: "Bonanza",
        subItems: [
            { name: "Bonanza", path: "/superadmin/Bonanza/3MonthsBonanza", pro: false },
            // { name: "Add Bonanza", path: "/superadmin/Bonanza/add", pro: false },
            // { name: "Bonanza List", path: "/superadmin/Bonanza/all", pro: false },
        ],
    },
    {
        icon: <Folder />,
        name: "Product Form",
        subItems: [
            // { name: "Product Group", path: "/superadmin/Product/productgroup", pro: false },
            { name: "Add Product", path: "/superadmin/Product/addproduct", pro: false },
            { name: "All Product", path: "/superadmin/Product/allproduct", pro: false },
        ],
    },

    {
        icon: <Folder />,
        name: "Achivers",
        subItems: [
            { name: "Add Achivers", path: "/superadmin/Achivers/add", pro: false },
            { name: "All Achivers", path: "/superadmin/Achivers/all", pro: false },
        ],
    },

    {
        icon: <Folder />,
        name: "Dashboard Image",
        path: "/superadmin/dashboardimage",
    },

    {
        icon: <Folder />,
        name: "Change Password",
        path: "/superadmin/ChangePassword",
    },

];

const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
    const pathname = usePathname();
    const handleLinkClick = () => {
        if (isMobileOpen) {
            setIsMobileOpen(false);
        }
    };
    const renderMenuItems = (navItems, menuType) => (
        <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <>
                            <button
                                onClick={() => {
                                    if (isExpanded || isHovered) {
                                        handleSubmenuToggle(index, menuType);
                                    }
                                }}
                                // --- DUAL THEME ---
                                className={`menu-item group rounded-md ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? "bgg textn font-semibold " // Active state
                                    : "hbgb "      // Inactive hover state
                                    } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                                    }`}
                            >
                                <span className="shrink-0">
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <ChevronDown
                                        className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                                            openSubmenu?.index === index
                                            ? "rotate-180"
                                            : ""
                                            }`}
                                    />
                                )}
                            </button>
                            {(isExpanded || isHovered) && (
                                <div
                                    ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
                                    className={`overflow-hidden transition-all duration-300 ease-in-out
                                  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                            ? "max-h-[500px] opacity-100"
                                            : "max-h-0 opacity-0"
                                        }`}
                                >
                                    {/* --- DUAL THEME --- */}
                                    <ul className="ml-5 borderwl  pl-4 mt-2 space-y-2">
                                        {nav.subItems.map((sub) => (
                                            <li key={sub.path}>
                                                <Link
                                                    href={sub.path}
                                                    onClick={handleLinkClick}
                                                    className={`block py-2 text-sm transition-all duration-200 rounded-md px-2 ${isActive(sub.path) ? "font-semibold bgg textn  textw " : "hbgb"}`}
                                                >
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>

                    ) : (
                        nav.path && (
                            <Link
                                href={nav.path}
                                onClick={handleLinkClick}
                                className={`menu-item group rounded-md ${isActive(nav.path) ? "bgg textn font-semibold textw" : "hbgb"}`}
                            >
                                <span className="shrink-0">
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}
                </li>
            ))}
        </ul>
    );

    // --- Unchanged Logic ---
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});
    const isActive = useCallback((path) => path === pathname, [pathname]);
    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => {
                    const newHeight = subMenuRefs.current[key]?.scrollHeight || 0;
                    return { ...prevHeights, [key]: newHeight };
                });
            }
        }
    }, [openSubmenu]);
    const handleSubmenuToggle = (index, menuType) => {
        setOpenSubmenu((prev) =>
            prev?.type === menuType && prev?.index === index ? null : { type: menuType, index }
        );
    };

    return (
        <aside

            className={`fixed  mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bgn textw  borderwr h-screen transition-all duration-300 ease-in-out z-50 ${isExpanded || isMobileOpen
                ? "w-[290px]"
                : isHovered
                    ? "w-[290px]"
                    : "w-[90px]"
                } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className=" hidden lg:block">

                <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                    <Link href="/superadmin" className="w-full flex justify-center items-center">
                        {isExpanded || isHovered || isMobileOpen ? (
                            <>
                                <div className="hidden lg:block"> <Image src="/images/logo/logo-blank.png" alt="Logo" width={80} height={80} /></div>
                            </>
                        ) : (
                            <Image src="/images/logo/logo-blank.png" alt="Logo" width={80} height={80} />
                        )}
                    </Link>
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>

                            <h2 className="mb-4 font-bold uppercase flex leading-[20px] textw">Menu</h2>
                            {renderMenuItems(navItems, "main")}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};
export default AppSidebar;
