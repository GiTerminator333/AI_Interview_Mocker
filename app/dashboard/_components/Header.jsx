"use client"

import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Crown } from "lucide-react";


function Header(){
    const path = usePathname();
    const { user } = useUser();
    const [isPro, setIsPro] = useState(false);

    const userEmail = user?.primaryEmailAddress?.emailAddress;

    useEffect(() => {
        if (userEmail) {
            fetch(`/api/subscription?email=${encodeURIComponent(userEmail)}`)
                .then(res => res.json())
                .then(data => setIsPro(data.isPro))
                .catch(() => {});
        }
    }, [userEmail]);

    const navItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Upgrade", href: "/dashboard/upgrade" },
        { label: "How it Works?", href: "/dashboard/learnuse" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800 transition-all">
            <div className="flex px-6 md:px-10 py-3.5 items-center justify-between max-w-7xl mx-auto">
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Image src={'/logo.png'} width={170} height={50} alt="Mockify Logo" priority className="object-contain" />
                </Link>
                <nav>
                    <ul className="hidden md:flex gap-1.5 items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                        {navItems.map((item) => {
                            const isActive = path === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60'
                                        }`}
                                    >
                                        {item.label === 'Upgrade' && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="flex items-center gap-4">
                    {isPro ? (
                        <span className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-slate-800 text-amber-400 border border-slate-700 dark:border-slate-700 px-3 py-1 rounded-md text-xs font-semibold tracking-wide">
                            <Crown className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> PRO MEMBER
                        </span>
                    ) : (
                        <Link href="/dashboard/upgrade" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white px-3.5 py-1.5 rounded-md transition-colors shadow-xs">
                            <Crown className="h-3.5 w-3.5 text-amber-400" /> Upgrade Pro
                        </Link>
                    )}
                    <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header