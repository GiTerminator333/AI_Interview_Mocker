"use client"
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import { Briefcase } from "lucide-react";

function Dashboard() {
    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Mockify Practice Studio</span>
                </div>
                <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
                    Dashboard Overview
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-base max-w-2xl">
                    Configure targeted mock interview sessions, review past conversation loops, and track your structured communication scores over time.
                </p>
            </div>

            {/* Quick Actions / Add Interview Widget */}
            <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Practice Loops</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <AddNewInterview />
                </div>
            </div>

            {/* Interview History List */}
            <div className="pt-4">
                <InterviewList />
            </div>
        </div>
    );
}
export default Dashboard;