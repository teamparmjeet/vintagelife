'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
    Users,
    UserCheck,
    UserX,
    ClipboardList,
    CalendarPlus,
    CheckCircle,
    BadgeIndianRupee,
    Clock,
    Hourglass,
} from 'lucide-react';

// --- Skeleton Component for Loading State ---
const SkeletonBox = () => (
    <div className="w-full p-4 bg-white rounded-xl shadow-md animate-pulse">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-7 w-20 bg-gray-200 rounded"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);

// --- Refined Card Component ---
const BoxItem = ({ number, title, href, Icon, color = "text-slate-700" }) => {
    const content = (
        <div className="group w-full p-5 bg-white rounded-2xl shadow-md hover:shadow-xl ">
            <div className="flex items-center justify-between">
                <div className="text-left">
                    <h2 className={`text-4xl font-extrabold ${color}`}>
                        {new Intl.NumberFormat('en-IN').format(number)}
                    </h2>
                    <h3 className="text-md text-slate-500 font-medium mt-1">
                        {title}
                    </h3>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-tr from-slate-100 to-white group-hover:from-slate-200 group-hover:to-white transition-all duration-300`}>
                    <Icon className={`w-7 h-7 ${color}`} strokeWidth={1.5} />
                </div>
            </div>

        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        );
    }

    return content;
};


// --- Main Page Component ---
export default function Page() {
    const [data, setData] = useState(null); // Initial state is null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('/api/panel');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching panel data:", error);
                // Set default data on error to prevent crash
                setData({
                    totalUsers: 0, activeUsers: 0, pendingUsers: 0, suspendedUsers: 0,
                    todayRegistrations: 0, todayGreen: 0, successWithdrawals: 0,
                    pendingWithdrawals: 0, pendingCount: 0, successWithdrawalstravel: 0, pendingWithdrawalstravel: 0, pendingCounttravel: 0,
                    successWithdrawalsMonthly: 0, pendingWithdrawalsMonthly: 0, pendingCountMonthly: 0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const dashboardItems = [
        {
            title: "Pending Users",
            dataKey: "pendingUsers",
            href: "/superadmin/Userprofile/deactiveuser",
            Icon: Hourglass,
            color: "text-amber-600",
        },
        {
            title: "Active Users",
            dataKey: "activeUsers",
            href: "/superadmin/Userprofile/activeuser",
            Icon: UserCheck,
            color: "text-green-600",
        },
        {
            title: "Suspended Users",
            dataKey: "suspendedUsers",
            href: "/superadmin/Userprofile/susspenduser",
            Icon: UserX,
            color: "text-red-600",
        },
        {
            title: "Total Users",
            dataKey: "totalUsers",
            href: "/superadmin/Userprofile/user",
            Icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Today's Registrations",
            dataKey: "todayRegistrations",
            Icon: CalendarPlus,
            color: "text-sky-600",
        },
        {
            title: "Today's Green IDs",
            dataKey: "todayGreen",
            Icon: CheckCircle,
            color: "text-teal-600",
        },
        {
            title: "Success Withdrawals (Pair)",
            dataKey: "successWithdrawals",
            href: "/superadmin/withdrawal/success",

            Icon: BadgeIndianRupee,
            color: "text-indigo-600",
        },
        {
            title: "Pending Withdrawals (Pair)",
            dataKey: "pendingWithdrawals",
            href: "/superadmin/withdrawal/pending",

            Icon: Clock,
            color: "text-orange-600",
        },
        {
            title: "Pending Count (Pair)",
            dataKey: "pendingCount",
            Icon: ClipboardList,
            color: "text-fuchsia-600",
        },



        {
            title: "Success Withdrawals (Royalty)",
            dataKey: "successWithdrawalsMonthly",
            href: "/superadmin/withdrawal/month/success",

            Icon: BadgeIndianRupee,
            color: "text-indigo-600",
        },
        {
            title: "Pending Withdrawals (Royalty)",
            dataKey: "pendingWithdrawalsMonthly",
            href: "/superadmin/withdrawal/month/pending",

            Icon: Clock,
            color: "text-orange-600",
        },
        {
            title: "Pending Count (Royalty)",
            dataKey: "pendingCountMonthly",
            Icon: ClipboardList,
            color: "text-fuchsia-600",
        },



        {
            title: "Success Withdrawals (Travel Fund)",
            dataKey: "successWithdrawalstravel",
            href: "/superadmin/withdrawal/travel/success",
            Icon: BadgeIndianRupee,
            color: "text-indigo-600",
        },
        {
            title: "Pending Withdrawals (Travel Fund)",
            dataKey: "pendingWithdrawalstravel",
            href: "/superadmin/withdrawal/travel/pending",
            Icon: Clock,
            color: "text-orange-600",
        },
        {
            title: "Pending Count (Travel Fund)",
            dataKey: "pendingCounttravel",
            Icon: ClipboardList,
            color: "text-fuchsia-600",
        },
    ];

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">📊 Dashboard</h1>
                <p className="text-slate-500 mt-1 text-sm">A compact overview of your application's activity.</p>
            </header>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading
                    ? // --- Show Skeleton Loaders ---
                    Array.from({ length: 9 }).map((_, index) => <SkeletonBox key={index} />)
                    : // --- Show Actual Data Cards ---
                    dashboardItems.map((item) => (
                        <BoxItem
                            key={item.title}
                            number={data ? data[item.dataKey] : 0}
                            title={item.title}
                            href={item.href}
                            Icon={item.Icon}
                            color={item.color}
                        />
                    ))}
            </div>
        </div>
    );
}