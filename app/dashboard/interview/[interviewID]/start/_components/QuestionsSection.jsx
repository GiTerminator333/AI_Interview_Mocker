"use client"
import React, { useState, useRef, useEffect } from "react";
import { Lightbulb, Volume2, Square, Pause, Play, Loader2, Crown, Lock, Bot, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

// Groq Orpheus voices (canopylabs/orpheus-v1-english)
const VOICES = [
    { id: "troy", label: "Troy (Pro Natural Male)" },
    { id: "diana", label: "Diana (Pro Natural Female)" },
];

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState("troy");
    const [isPro, setIsPro] = useState(false);
    
    const audioRef = useRef(null);
    const { user } = useUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // Check Pro subscription status on mount
    useEffect(() => {
        if (userEmail) {
            fetch(`/api/subscription?email=${encodeURIComponent(userEmail)}`)
                .then(res => res.json())
                .then(data => setIsPro(data.isPro))
                .catch(() => {});
        }
    }, [userEmail]);

    // Stop audio when question changes
    useEffect(() => {
        stopAudio();
    }, [activeQuestionIndex]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setIsPaused(false);
    };

    const speakWithGroq = async (text) => {
        if (!text) return;

        // Stop any currently playing audio
        stopAudio();
        setIsLoading(true);

        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, voice: selectedVoice, email: userEmail })
            });

            if (response.status === 403) {
                // If Pro check failed on backend, revert to fallback
                setIsPro(false);
                fallbackBrowserTTS(text);
                return;
            }

            if (!response.ok) {
                throw new Error(`TTS request failed: ${response.status}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onplay = () => {
                setIsSpeaking(true);
                setIsPaused(false);
            };

            audio.onended = () => {
                setIsSpeaking(false);
                setIsPaused(false);
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
            };

            audio.onerror = () => {
                setIsSpeaking(false);
                setIsPaused(false);
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
            };

            await audio.play();
        } catch (error) {
            console.error("Groq TTS error, reverting to default robotic voice:", error);
            fallbackBrowserTTS(text);
        } finally {
            setIsLoading(false);
        }
    };

    const fallbackBrowserTTS = (text) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(text);
            
            // Give it a standard conversational rate for browser TTS
            speech.rate = 1.0;
            
            speech.onstart = () => {
                setIsSpeaking(true);
                setIsPaused(false);
            };
            speech.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };
            speech.onerror = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };

            window.speechSynthesis.speak(speech);
        } else {
            alert("Sorry, your browser doesn't support Text-to-Speech");
        }
    };

    const handlePlayPause = () => {
        if (isLoading) return;

        const currentText = mockInterviewQuestions[activeQuestionIndex]?.question;

        if (isSpeaking) {
            if (audioRef.current) {
                // Handle HTML5 Audio (Groq Pro Voice)
                if (isPaused) {
                    audioRef.current.play();
                    setIsPaused(false);
                } else {
                    audioRef.current.pause();
                    setIsPaused(true);
                }
            } else if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
                // Handle Browser SpeechSynthesis (Free Robotic Voice)
                if (isPaused) {
                    window.speechSynthesis.resume();
                    setIsPaused(false);
                } else {
                    window.speechSynthesis.pause();
                    setIsPaused(true);
                }
            }
        } else {
            if (isPro) {
                speakWithGroq(currentText);
            } else {
                fallbackBrowserTTS(currentText);
            }
        }
    };

    return mockInterviewQuestions && (
        <div className="p-5 border rounded-lg my-10">
            {/* Question Navigation Pills */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {mockInterviewQuestions && mockInterviewQuestions.map((question, index) => (
                    <h2
                        key={index}
                        className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer transition-all ${
                            activeQuestionIndex == index
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-50'
                        }`}
                    >
                        Question#{index + 1}
                    </h2>
                ))}
            </div>

            {/* Question Text */}
            {/* Question Text */}
            <h2 className="my-5 text-md md:text-lg font-semibold text-slate-900 dark:text-white">
                {mockInterviewQuestions[activeQuestionIndex]?.question}
            </h2>

            {/* AI Voice Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6 shadow-2xs transition-all">
                {/* Left Controls: Play / Pause / Stop */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePlayPause}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-2xs ${
                            isLoading
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-wait'
                                : isSpeaking && !isPaused
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white dark:text-slate-950 font-bold'
                                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white'
                        }`}
                    >
                        {isLoading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Generating Voice...</>
                        ) : isSpeaking && !isPaused ? (
                            <><Pause className="h-4 w-4 fill-current" /> Pause</>
                        ) : isPaused ? (
                            <><Play className="h-4 w-4 fill-current" /> Resume</>
                        ) : (
                            <><Volume2 className="h-4 w-4" /> Listen Question</>
                        )}
                    </button>

                    {/* Stop Button */}
                    {(isSpeaking || isPaused) && (
                        <button
                            onClick={stopAudio}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                        >
                            <Square className="h-3.5 w-3.5 fill-current" /> Stop
                        </button>
                    )}
                </div>

                {/* Studio Quality Center-Anchored Audio Equalizer Spectrum */}
                {isSpeaking && !isPaused ? (
                    <div className="flex-1 flex items-center justify-between gap-[3px] sm:gap-1 h-7 px-3 min-w-[140px] overflow-hidden">
                        {Array.from({ length: 32 }).map((_, idx) => {
                            const waveType = idx % 3 === 0 ? "animate-wave-1" : idx % 3 === 1 ? "animate-wave-2" : "animate-wave-3";
                            const delay = `${((idx * 0.05) % 0.8).toFixed(2)}s`;
                            return (
                                <div
                                    key={idx}
                                    className={`flex-1 h-6 max-w-[3.5px] min-w-[2px] rounded-full transform origin-center transition-colors ${
                                        isPro 
                                            ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-400 shadow-xs shadow-amber-500/30' 
                                            : 'bg-gradient-to-t from-slate-800 via-slate-600 to-slate-400 dark:from-slate-400 dark:via-slate-200 dark:to-white'
                                    } ${waveType}`}
                                    style={{
                                        animationDelay: delay
                                    }}
                                ></div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex-1 min-w-[10px]"></div>
                )}

                {/* Voice Selector & Paywall Indicator */}
                {isPro ? (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                            <Crown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> Pro AI Voice
                        </span>
                        <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white cursor-pointer shadow-2xs"
                        >
                            {VOICES.map((v) => (
                                <option key={v.id} value={v.id}>{v.label}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                            <Bot className="h-3.5 w-3.5 text-slate-500" />
                            <span>Default Robotic Voice (Free)</span>
                        </div>
                        <Link href="/dashboard/upgrade">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xs transition-all cursor-pointer">
                                <Lock className="h-3 w-3" /> Unlock Natural Voice (₹199)
                            </span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Note Box */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-950 shadow-2xs mt-8">
                <h2 className="flex gap-2 items-center text-slate-900 dark:text-white font-bold text-sm">
                    <Lightbulb className="text-amber-500 h-4 w-4 flex-shrink-0" />
                    <span>Rehearsal Procedure & Protocol:</span>
                </h2>
                <p className="text-sm mt-1.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                    Click on <strong>"Listen Question"</strong> to hear your AI verbalize the prompt with simulated interviewer intonation, then select <strong>"Record Answer"</strong> to open your microphone and formulate your spoken defense.
                </p>
                <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-900 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {isPro ? (
                        <>
                            <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            <span>You are operating with ultra-realistic neural <strong>Groq Orpheus Pro AI Voices</strong> for standard executive simulation.</span>
                        </>
                    ) : (
                        <>
                            <Bot className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span>You are testing with the default robotic free system audio. <Link href="/dashboard/upgrade" className="underline font-semibold hover:text-slate-900 dark:hover:text-white transition-colors">Upgrade to Pro (₹199/mo)</Link> to unlock natural neural speech!</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionsSection;