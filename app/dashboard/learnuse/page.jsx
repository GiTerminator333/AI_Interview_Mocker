"use client"
import React from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Briefcase, Mic, Award, FileText, ArrowRight, CheckCircle2, HelpCircle, ShieldCheck, Volume2 } from "lucide-react";

function HowToUsePage() {
    return (
        <div className="space-y-12 pb-14 text-slate-800 dark:text-slate-200">
            {/* Header / Hero Section */}
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Mockify Methodology Manual</span>
                </div>
                <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
                    Practice to Perfection: User Protocol
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-base max-w-3xl">
                    Our platform provides structured rehearsal environments for modern tech and executive interviews. Follow these core procedures to configure challenging situational rounds and evaluate your spoken clarity.
                </p>
            </div>

            {/* Core 3-Step Protocol */}
            <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    3-Phase Practice Protocol
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Step 1 Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xs relative flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-base flex items-center justify-center mb-6">
                                01
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                                Role Setup &amp; Calibration
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                From your studio workspace, select <strong>Configure New Practice Loop</strong>. Specify your exact job position title, technical stack, and tenure level.
                            </p>
                            
                            <div className="mt-5 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                                <p className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                                    <FileText className="w-3.5 h-3.5 text-slate-900 dark:text-amber-400" /> AI Resume Parsing (Pro Studio)
                                </p>
                                <p>Pro members can upload their PDF resume to directly extract verifiable skills, historical architecture projects, and specialized competencies into the evaluation prompt.</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span>PHASE: CALIBRATION</span>
                        </div>
                    </div>

                    {/* Step 2 Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xs relative flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-base flex items-center justify-center mb-6">
                                02
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                                Interactive Verbal Loop
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Enter the interview studio room. Turn on your microphone to practice spoken pacing under conversational time constraints.
                            </p>

                            <div className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                                <div className="flex items-start gap-2">
                                    <Volume2 className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />
                                    <span><strong>Audio Prompts:</strong> Listen to simulated interview prompts delivered via natural speech synthesis.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Mic className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />
                                    <span><strong>Verbal Transcription:</strong> Respond verbally; your spoken communication is accurately transcribed in real time.</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span>PHASE: SIMULATION</span>
                        </div>
                    </div>

                    {/* Step 3 Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xs relative flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-base flex items-center justify-center mb-6">
                                03
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                                Competency Scorecards
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Complete all inquiry rounds to produce an objective performance assessment covering communication framing and technical accuracy.
                            </p>

                            <div className="mt-5 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                                <p className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                                    <Award className="w-3.5 h-3.5 text-amber-500" /> Evaluation Deliverables:
                                </p>
                                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                                    <li>Numerical accuracy ratings (out of 10)</li>
                                    <li>Full transcripts vs. structural model answers</li>
                                    <li>Actionable communication feedback</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span>PHASE: EVALUATION</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro Feature Spotlight */}
            <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-xl p-8 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 bg-slate-800 text-amber-400 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border border-slate-700">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            PRO ADVANCEMENT
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Import Your PDF Resume for Deep Calibration</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Pro members can attach their actual curriculum vitae during session initialization. Our assessment system extracts past architecture implementations and career history to formulate tailored, highly specific follow-up questions.
                        </p>
                    </div>
                    <Link href="/dashboard/upgrade" className="shrink-0 w-full sm:w-auto">
                        <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-7 py-5 rounded-lg shadow-2xs transition-colors w-full sm:w-auto text-sm">
                            Unlock Pro Capabilities
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Frequently Asked Questions / Best Practices */}
            <div className="space-y-6 pt-4">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    Interview Methodology &amp; Best Practices
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
                        <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">How do I maximize my communication ratings?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Structure verbal responses using the STAR format (Situation, Task, Action, Result). Quantify business outcomes, explicitly mention design trade-offs, and state your architectural reasoning clearly.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
                        <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Why should I practice speaking aloud rather than taking notes?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Verbal rehearsal develops muscle memory and conversational confidence under time pressure, preventing filler words and disorganization during high-stakes hiring rounds.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
                        <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">How are accuracy ratings and feedback generated?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Your transcribed answer is evaluated against standardized industry benchmarks and ideal technical responses, focusing on technical depth, completeness, and clarity.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
                        <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Can I repeat or retry questions during a practice loop?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Yes. Before submitting an answer, you can re-record your vocal response as many times as needed to refine your phrasing and communication rhythm.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Call To Action Banner */}
            <div className="p-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">Ready to Put Your Methodology into Practice?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    Return to your studio workspace to configure a tailored rehearsal loop and evaluate your professional communication.
                </p>
                <div className="pt-2">
                    <Link href="/dashboard">
                        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-semibold rounded-lg px-7 py-3.5 text-sm shadow-2xs transition-colors inline-flex items-center gap-2">
                            Enter Workspace <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HowToUsePage;
