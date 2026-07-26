"use client"
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Check, Crown, Zap, FileText, Mic, Brain, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

function UpgradePage() {
    const { user } = useUser();
    const [isPro, setIsPro] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);

    const userEmail = user?.primaryEmailAddress?.emailAddress;

    useEffect(() => {
        if (userEmail) {
            fetchProStatus();
        }
    }, [userEmail]);

    const fetchProStatus = async () => {
        try {
            const res = await fetch(`/api/subscription?email=${encodeURIComponent(userEmail)}`);
            const data = await res.json();
            setIsPro(data.isPro);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePro = async () => {
        setToggling(true);
        try {
            const res = await fetch("/api/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail }),
            });
            const data = await res.json();
            setIsPro(data.isPro);
        } catch (err) {
            console.error(err);
        } finally {
            setToggling(false);
        }
    };

    const freeFeatures = [
        "5 AI-generated interview questions",
        "Speech-to-text answer recording",
        "AI feedback & rating",
        "Unlimited interview sessions",
    ];

    const proFeatures = [
        "Everything in Free",
        "AI Resume Parser (PDF upload)",
        "Personalized questions from your resume",
        "AI Interviewer Voice (Groq Orpheus TTS)",
        "Priority AI model access",
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-slate-900 dark:text-white" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
            {/* Back link */}
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors font-medium">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                    Upgrade Your Interview Prep
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-base max-w-xl mx-auto">
                    Unlock AI-powered resume parsing and personalized interview questions tailored to your actual experience.
                </p>
                {isPro && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                        <Crown className="h-3.5 w-3.5" /> You are an Active Pro Member
                    </div>
                )}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 bg-white dark:bg-slate-950 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free</h3>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Get started with foundational AI mock interviews</p>

                        <div className="mb-8 flex items-baseline">
                            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹0</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm ml-1.5">/ forever</span>
                        </div>

                        <ul className="space-y-3.5 mb-8">
                            {freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button variant="outline" className="w-full rounded-xl h-11 text-sm font-semibold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400" disabled>
                        {isPro ? "Included Plan" : "Current Active Plan"}
                    </Button>
                </div>

                {/* Pro Tier */}
                <div className={`border rounded-2xl p-8 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between ${isPro ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/10' : 'border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900'}`}>
                    <div>
                        {/* Badge */}
                        <div className="absolute top-0 right-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold px-4 py-1 rounded-bl-xl tracking-wider uppercase">
                            RECOMMENDED
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="h-5 w-5 text-amber-500" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro Studio</h3>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Complete suite for rigorous role & resume rehearsal</p>

                        <div className="mb-8 flex items-baseline">
                            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹199</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm ml-1.5">/ month</span>
                        </div>

                        <ul className="space-y-3.5 mb-8">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                    <Check className="h-4 w-4 text-slate-900 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                    <span className="font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <Button
                            className={`w-full rounded-xl h-11 text-sm font-semibold text-white transition-all shadow-xs ${isPro ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'}`}
                            onClick={handleTogglePro}
                            disabled={toggling}
                        >
                            {toggling ? (
                                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                            ) : isPro ? (
                                "Cancel Pro Subscription"
                            ) : (
                                "Upgrade to Pro (₹199/mo)"
                            )}
                        </Button>

                        {!isPro && (
                            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">
                                Instant activation — structured evaluation enabled
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Pro Features Showcase */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">What Pro Unlocks</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs text-left">
                        <FileText className="h-6 w-6 text-slate-900 dark:text-white mb-4" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">AI Resume Parser</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Upload your PDF resume and let our evaluation engine extract your competencies and architectural projects automatically.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs text-left">
                        <Brain className="h-6 w-6 text-slate-900 dark:text-white mb-4" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">Personalized Inquiries</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Experience customized follow-up situational questioning tailored precisely to your targeted career trajectory.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs text-left">
                        <Mic className="h-6 w-6 text-slate-900 dark:text-white mb-4" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">Neural AI Voice Engine</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Rehear simulated verbal questions voiced with ultra-realistic human speech patterns powered by Groq Orpheus TTS.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpgradePage;
