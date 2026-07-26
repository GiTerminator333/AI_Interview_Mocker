import React from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { Briefcase, Calendar, BarChart2, Play, Award } from "lucide-react";

function InterviewItemCard({ interview }) {
    return (
        <div className="group border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-sm hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold shrink-0">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                        {interview.jobExperience} {interview.jobExperience == 1 ? 'Yr' : 'Yrs'} Exp
                    </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                    {interview?.jobPosition}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Created {interview.createdAt}</span>
                </div>
            </div>

            <div className="flex items-center gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Link href={`/dashboard/interview/${interview.mockId}/feedback`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full rounded-lg border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 transition-colors">
                        <Award className="w-3.5 h-3.5 mr-1 text-amber-500" />
                        Evaluation
                    </Button>
                </Link>
                <Link href={`/dashboard/interview/${interview.mockId}`} className="flex-1">
                    <Button size="sm" className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white text-xs font-semibold py-2 shadow-2xs transition-colors flex items-center justify-center gap-1.5">
                        <Play className="w-3 h-3 fill-current" />
                        Practice
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default InterviewItemCard;