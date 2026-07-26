import React from "react"
import Header from "./_components/Header"

function DashboardLayout({children}){
    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout