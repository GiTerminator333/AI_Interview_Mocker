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
        { label: "Questions", href: "/dashboard/questions" },
        { label: "Upgrade", href: "/dashboard/upgrade" },
        { label: "How it Works?", href: "/dashboard/learnuse" },
    ];

    return (
        <div className='flex p-4 justify-between bg-secondary shadow-sm'>
            <Image src={'/logo.svg'} width={160} height={100} alt="logo"></Image>
            <ul className='hidden md:flex gap-6 items-center'>
                {navItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`hover:text-purple-800 hover:text-primary hover:font-bold transition-all cursor-pointer ${
                                path === item.href ? 'text-purple-800 text-primary font-bold' : ''
                            } ${item.label === 'Upgrade' ? 'flex items-center gap-1' : ''}`}
                        >
                            {item.label === 'Upgrade' && <Crown className="h-4 w-4 text-amber-500" />}
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="flex items-center gap-3">
                {isPro && (
                    <span className="hidden md:inline-flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">
                        <Crown className="h-3 w-3" /> PRO
                    </span>
                )}
                <UserButton></UserButton>
            </div>
        </div>
    )
}

export default Header