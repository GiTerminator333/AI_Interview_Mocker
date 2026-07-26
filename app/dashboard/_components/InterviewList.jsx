"use client"
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq} from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { History, Briefcase } from "lucide-react";

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        user && GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        const result = await db.select().from(MockInterview)
                            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                            .orderBy(desc(MockInterview.id));
        
        setInterviewList(result);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Recent Practice Sessions</h2>
                </div>
                {interviewList && interviewList.length > 0 && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-3 py-1 rounded-md border border-slate-300/50 dark:border-slate-700">
                        {interviewList.length} {interviewList.length === 1 ? 'Session' : 'Sessions'} Recorded
                    </span>
                )}
            </div>

            {interviewList && interviewList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviewList.map((interview, index) => (
                        <InterviewItemCard key={index} interview={interview} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 mx-auto mb-3 flex items-center justify-center">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">No previous practice sessions found</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Configure your first simulated practice session above to begin tracking evaluations and communication improvements.</p>
                </div>
            )}
        </div>
    );
}

export default InterviewList;