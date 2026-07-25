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
        "AI tech description auto-fill",
        "Unlimited interview sessions",
    ];

    const proFeatures = [
        "Everything in Free",
        "AI Resume Parser (PDF upload)",
        "Personalized questions from your resume",
        "AI Interviewer Voice (Groq Orpheus TTS)",
        "Priority AI model access",
        "Advanced analytics (coming soon)",
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
            {/* Back link */}
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Upgrade Your Interview Prep
                </h1>
                <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">
                    Unlock AI-powered resume parsing and personalized interview questions tailored to your experience.
                </p>
                {isPro && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
                        <Crown className="h-4 w-4" /> You are a Pro member!
                    </div>
                )}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <div className="border-2 border-gray-200 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-gray-600" />
                        <h3 className="text-xl font-bold text-gray-800">Free</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">Get started with AI mock interviews</p>

                    <div className="mb-8">
                        <span className="text-4xl font-bold text-gray-900">$0</span>
                        <span className="text-gray-500 text-sm ml-1">/ forever</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                        {freeFeatures.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Button variant="outline" className="w-full" disabled>
                        {isPro ? "Your Previous Plan" : "Current Plan"}
                    </Button>
                </div>

                {/* Pro Tier */}
                <div className={`border-2 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all relative overflow-hidden ${isPro ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50' : 'border-primary bg-gradient-to-br from-primary/5 to-indigo-50'}`}>
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                        RECOMMENDED
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        <h3 className="text-xl font-bold text-gray-800">Pro</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">Personalized AI-powered interview prep</p>

                    <div className="mb-8">
                        <span className="text-4xl font-bold text-gray-900">$9</span>
                        <span className="text-gray-500 text-sm ml-1">/ month</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                        {proFeatures.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${i === 0 ? 'text-green-500' : 'text-primary'}`} />
                                <span className={i > 0 ? 'font-medium' : ''}>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <Button
                        className={`w-full text-white font-semibold ${isPro ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                        onClick={handleTogglePro}
                        disabled={toggling}
                    >
                        {toggling ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                        ) : isPro ? (
                            "Cancel Pro Subscription"
                        ) : (
                            "Upgrade to Pro"
                        )}
                    </Button>

                    {!isPro && (
                        <p className="text-xs text-center text-gray-400 mt-3">
                            Demo mode — no payment required
                        </p>
                    )}
                </div>
            </div>

            {/* Pro Features Showcase */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">What Pro Unlocks</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl border bg-white">
                        <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-2">AI Resume Parser</h3>
                        <p className="text-sm text-gray-500">Upload your PDF resume and let AI extract your skills, experience, and projects automatically.</p>
                    </div>
                    <div className="p-6 rounded-xl border bg-white">
                        <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-2">Personalized Questions</h3>
                        <p className="text-sm text-gray-500">Get interview questions tailored to your actual experience and the technologies on your resume.</p>
                    </div>
                    <div className="p-6 rounded-xl border bg-white">
                        <Mic className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-2">AI Voice Interviewer</h3>
                        <p className="text-sm text-gray-500">Hear questions read aloud using natural neural voices powered by Groq Orpheus TTS.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpgradePage;
