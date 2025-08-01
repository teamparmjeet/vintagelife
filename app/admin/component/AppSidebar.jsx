"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSidebar } from '@/app/context/SidebarContext'
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Grid2X2, UserCircle, NotepadText, UsersRound, Medal, FileUser, BookOpenText,Mountain, NotebookText, KeyRound, MailPlus, Trophy, ScrollText, ChevronDown } from "lucide-react";
const navItems = [
    {
        icon: <Grid2X2 />,
        name: "Dashboard",
        path: "/admin/Dashboard",
    },
    {
        icon: <UserCircle />,
        name: "User Profile",
        subItems: [
            { name: "My Profile", path: "/admin/Userprofile/profile", pro: false },
            { name: "I-Card", path: "/admin/Userprofile/i-card", pro: false },
            { name: "Agreement", path: "/admin/Userprofile/agreement", pro: false },
            { name: "Addendum", path: "/admin/Userprofile/addendum", pro: false },
            { name: "View KYC", path: "/admin/Userprofile/viewkyc", pro: false },
        ],
    },
    {
        icon: <UsersRound />,
        name: "Genealogy",
        subItems: [
            { name: "Sales Team", path: "/admin/Genealogy/salesteam", pro: false },
            { name: "Direct DS Code", path: "/admin/Genealogy/directds", pro: false },
        ],
    },
    {
        icon: <FileUser />,
        name: "Account",
        subItems: [
            { name: "Total Income", path: "/admin/Account/totalincome", pro: false },
            { name: "Sales Groth Income", path: "/admin/Account/salesgrowth", pro: false },
            // { name: "Monthly Sale Income", path: "/admin/Account/mysales", pro: false },
            { name: "Sales Performance Income", path: "/admin/Account/salesperformance", pro: false },
            { name: "Tds Deduction Report", path: "/admin/Account/tdsdeduction", pro: false },
            // { name: "My Repurchase Payments", path: "/admin/Account/repurchasepayments", pro: false },
            { name: "Step Pendency", path: "/admin/Account/stepending", pro: false },
        ],
    },
    {
        icon: <Medal />,
        name: "Bonanza",
         path: "/admin/bonanza"
    },
    {
        icon: <NotepadText />,
        name: "Withdrawal",
        path: "/admin/payment",
    },
     {
        icon: <Mountain />,
        name: "My Trip",
        path: "/admin/mytrip",
    },
    {
        icon: <BookOpenText />,
        name: "Order Form",
        subItems: [
            { name: "New Order Form", path: "/admin/OrderForm/Order/CreateOrder", pro: false },
            { name: "Cart", path: "/admin/OrderForm/Order/Cart", pro: false },
            { name: "Pending Orders", path: "/admin/OrderForm/pendingorder", pro: false },
            { name: "My Approved Orders", path: "/admin/OrderForm/approvedorder", pro: false },
            { name: "My Delivered Orders", path: "/admin/OrderForm/deliveredOrder", pro: false },
            { name: "Product List", path: "/admin/OrderForm/productlist", pro: false },
        ],
    },
    // {
    //     icon: <NotepadText />,
    //     name: "Agreement",
    //     path: "/admin/agreement",
    // },
    // {
    //     icon: <NotebookText />,
    //     name: "Statement",
    //     path: "/admin/Statement",
    // },
    {
        icon: <KeyRound />,
        name: "Change Password",
        path: "/admin/ChangePassword",
    },
    // {
    //     icon: <Trophy />,
    //     name: "Company Achievers",
    //     subItems: [
    //         { name: "Rank Achievers", path: "/admin/CompanyAchivers/Rank", pro: false },
    //         { name: "Trip Achievers", path: "/admin/CompanyAchivers/Trip", pro: false },
    //         { name: "Car Achievers", path: "/admin/CompanyAchivers/Car", pro: false },
    //         { name: "Marketing Plan", path: "/admin/CompanyAchivers/Marketing", pro: false },
    //     ],
    // },
    // {
    //     icon: <ScrollText />,
    //     name: "Public Notice",
    //     subItems: [
    //         { name: "Times of India", path: "/admin/PublicNotice/TimesIndia", pro: false },
    //         { name: "Rashtriya Saharas", path: "/admin/PublicNotice/RashtriyaSaharas", pro: false },
    //     ],
    // },

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
                    <Link href="/admin" className="w-full flex justify-center items-center">
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

