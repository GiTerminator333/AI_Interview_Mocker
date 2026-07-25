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
            <h2 className="my-5 text-md md:text-lg">
                {mockInterviewQuestions[activeQuestionIndex]?.question}
            </h2>

            {/* AI Voice Controls */}
            <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-blue-50/80 border border-indigo-100 mb-5 shadow-sm">
                {/* Play / Pause / Resume Button */}
                <button
                    onClick={handlePlayPause}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                        isLoading
                            ? 'bg-gray-200 text-gray-500 cursor-wait'
                            : isSpeaking && !isPaused
                                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                >
                    {isLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Generating AI Voice...</>
                    ) : isSpeaking && !isPaused ? (
                        <><Pause className="h-4 w-4" /> Pause</>
                    ) : isPaused ? (
                        <><Play className="h-4 w-4" /> Resume</>
                    ) : (
                        <><Volume2 className="h-4 w-4" /> Listen Question</>
                    )}
                </button>

                {/* Stop Button */}
                {(isSpeaking || isPaused) && (
                    <button
                        onClick={stopAudio}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-red-200 bg-white/80 text-red-600 hover:bg-red-50 transition-all"
                    >
                        <Square className="h-3.5 w-3.5 fill-current" /> Stop
                    </button>
                )}

                {/* Animated Sound Bars (visible when speaking) */}
                {isSpeaking && !isPaused && (
                    <div className="flex items-end gap-[3px] h-4 ml-1">
                        <div className={`w-[3px] rounded-full animate-[bounce_0.5s_infinite_0.0s] ${isPro ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ height: '60%' }}></div>
                        <div className={`w-[3px] rounded-full animate-[bounce_0.5s_infinite_0.15s] ${isPro ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ height: '100%' }}></div>
                        <div className={`w-[3px] rounded-full animate-[bounce_0.5s_infinite_0.3s] ${isPro ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ height: '40%' }}></div>
                        <div className={`w-[3px] rounded-full animate-[bounce_0.5s_infinite_0.1s] ${isPro ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ height: '80%' }}></div>
                        <div className={`w-[3px] rounded-full animate-[bounce_0.5s_infinite_0.25s] ${isPro ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ height: '55%' }}></div>
                    </div>
                )}

                {/* Separator */}
                <div className="hidden sm:block h-6 w-px bg-indigo-200 mx-1"></div>

                {/* Voice Selector & Paywall Indicator */}
                {isPro ? (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 text-amber-800 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-2xs">
                            <Crown className="h-3 w-3 text-amber-600" /> Pro AI Voice
                        </span>
                        <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="bg-white border border-indigo-200 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
                        >
                            {VOICES.map((v) => (
                                <option key={v.id} value={v.id}>{v.label}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium">
                            <Bot className="h-3.5 w-3.5 text-gray-500" />
                            <span>Default Robotic Voice (Free)</span>
                        </div>
                        <Link href="/dashboard/upgrade">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                                <Lock className="h-3 w-3" /> Unlock Natural AI Voice (Pro)
                            </span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Note Box */}
            <div className="border rounded-lg p-5 bg-blue-50/80 border-blue-200 mt-10">
                <h2 className="flex gap-2 items-center text-blue-900 font-semibold">
                    <Lightbulb className="text-blue-600 h-5 w-5" />
                    <span>How it works:</span>
                </h2>
                <p className="text-sm mt-2 text-blue-900 leading-relaxed">
                    Click on <strong>"Listen Question"</strong> to hear the AI Interviewer read out the prompt, then click <strong>"Record Answer"</strong> to respond.
                </p>
                <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center gap-2 text-xs text-blue-800">
                    {isPro ? (
                        <>
                            <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            <span>You are using ultra-realistic neural <strong>Groq Orpheus Pro AI Voices</strong> for your interview session.</span>
                        </>
                    ) : (
                        <>
                            <Bot className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span>You are listening with the default robotic free browser voice. <Link href="/dashboard/upgrade" className="underline font-bold hover:text-primary">Upgrade to Pro</Link> to unlock life-like neural AI human voices!</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionsSection;