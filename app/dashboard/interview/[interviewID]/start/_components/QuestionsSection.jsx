"use client"
import React, { useState, useRef, useEffect } from "react";
import { Lightbulb, Volume2, Square, Pause, Play, Loader2 } from "lucide-react";

// Groq Orpheus voices (canopylabs/orpheus-v1-english)
const VOICES = [
    { id: "troy", label: "Troy (Male Voice)" },
    { id: "diana", label: "Diana (Female Voice)" },
];

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState("troy");
    const audioRef = useRef(null);

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
        };
    }, []);

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
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
                body: JSON.stringify({ text, voice: selectedVoice })
            });

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
            console.error("Groq TTS error:", error);
            // Fallback to browser TTS
            fallbackBrowserTTS(text);
        } finally {
            setIsLoading(false);
        }
    };

    const fallbackBrowserTTS = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(text);
            speech.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };
            setIsSpeaking(true);
            window.speechSynthesis.speak(speech);
        } else {
            alert("Sorry, your browser doesn't support Text-to-Speech");
        }
    };

    const handlePlayPause = () => {
        if (isLoading) return;

        if (isSpeaking && audioRef.current) {
            if (isPaused) {
                audioRef.current.play();
                setIsPaused(false);
            } else {
                audioRef.current.pause();
                setIsPaused(true);
            }
        } else {
            speakWithGroq(mockInterviewQuestions[activeQuestionIndex]?.question);
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
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 mb-5">
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
                        <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                    ) : isSpeaking && !isPaused ? (
                        <><Pause className="h-4 w-4" /> Pause</>
                    ) : isPaused ? (
                        <><Play className="h-4 w-4" /> Resume</>
                    ) : (
                        <><Volume2 className="h-4 w-4" /> Listen</>
                    )}
                </button>

                {/* Stop Button */}
                {(isSpeaking || isPaused) && (
                    <button
                        onClick={stopAudio}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                    >
                        <Square className="h-3.5 w-3.5 fill-current" /> Stop
                    </button>
                )}

                {/* Animated Sound Bars (visible when speaking) */}
                {isSpeaking && !isPaused && (
                    <div className="flex items-end gap-[3px] h-4 ml-1">
                        <div className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.5s_infinite_0.0s]" style={{ height: '60%' }}></div>
                        <div className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.5s_infinite_0.15s]" style={{ height: '100%' }}></div>
                        <div className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.5s_infinite_0.3s]" style={{ height: '40%' }}></div>
                        <div className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.5s_infinite_0.1s]" style={{ height: '80%' }}></div>
                        <div className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.5s_infinite_0.25s]" style={{ height: '55%' }}></div>
                    </div>
                )}

                {/* Separator */}
                <div className="h-6 w-px bg-indigo-200 mx-1"></div>

                {/* Voice Selector */}
                <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    {VOICES.map((v) => (
                        <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                </select>
            </div>

            {/* Note Box */}
            <div className="border rounded-lg p-5 bg-blue-100 mt-10">
                <h2 className="flex gap-2 items-center text-blue-900">
                    <Lightbulb className="mr-2" />
                    <strong>Note:</strong>
                </h2>
                <h2 className="text-sm my-2 text-blue-900">
                    Click on <strong>"Listen"</strong> to hear the AI Interviewer read out the question using a natural voice powered by Groq Orpheus. Then click <strong>"Record Answer"</strong> to respond.
                </h2>
            </div>
        </div>
    );
}

export default QuestionsSection;