"use client"
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { v4 as uuidv4 } from 'uuid';


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog"
import { CloudCog, LoaderCircle, Sparkles, FileText, Lock, Upload, X, Crown, CheckCircle2, Briefcase } from "lucide-react";
import { chatSession } from "../../../utils/AiModel";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { useSession, useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import Link from "next/link";


function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobExperience, setJobExperience] = useState();

    const [loading, setLoading] = useState(false);

    // Resume parser states
    const [isPro, setIsPro] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeParsing, setResumeParsing] = useState(false);
    const [resumeData, setResumeData] = useState(null); // { skills, experience, projects }
    const [resumeError, setResumeError] = useState(null);
    const fileInputRef = useRef(null);

    const [jsonResponse, setJsonResponse] = useState();
    const { user } = useUser();
    const router = useRouter();
    const session = useSession();

    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // Check Pro status on mount
    useEffect(() => {
        if (userEmail) {
            fetch(`/api/subscription?email=${encodeURIComponent(userEmail)}`)
                .then(res => res.json())
                .then(data => setIsPro(data.isPro))
                .catch(() => { });
        }
    }, [userEmail]);

    // Resume upload handler
    const handleResumeUpload = async (file) => {
        if (!file || !userEmail) return;

        // Validate
        if (file.type !== "application/pdf") {
            setResumeError("Only PDF files are supported.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setResumeError("File must be under 5MB.");
            return;
        }

        setResumeFile(file);
        setResumeError(null);
        setResumeParsing(true);
        setResumeData(null);

        try {
            const formData = new FormData();
            formData.append("resume", file);
            formData.append("email", userEmail);

            const res = await fetch("/api/resume/parse", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setResumeError(data.error || "Failed to parse resume.");
                return;
            }

            setResumeData({
                skills: data.skills,
                experience: data.experience,
                projects: data.projects,
            });

            // Auto-fill job description with parsed skills if field is empty
            if (!jobDescription || jobDescription.trim().length === 0) {
                setJobDescription(data.skills);
            }
        } catch (err) {
            console.error("Resume upload error:", err);
            setResumeError("Something went wrong. Please try again.");
        } finally {
            setResumeParsing(false);
        }
    };

    const clearResume = () => {
        setResumeFile(null);
        setResumeData(null);
        setResumeError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        console.log(jobPosition, jobDescription, jobExperience)

        // Build prompt — include resume data if available for personalized questions
        let InputPrompt = `Job Position : ${jobPosition}; Job Description: ${jobDescription}; 
                            Years of Experience : ${jobExperience}.`;

        if (resumeData) {
            InputPrompt += `\n\nCandidate's Resume Data:
                Skills: ${resumeData.skills}
                Experience: ${resumeData.experience}
                Notable Projects: ${resumeData.projects}
                
                Use this resume context to ask personalized, specific interview questions that reference the candidate's actual skills and project experience.`;
        }

        InputPrompt += `\n\nBased on this information, provide 5 interview questions along with answers in JSON format. 
                            The response should be a JSON array of objects, where each object has "question" and "answer" fields.
                            Example format: [{"question": "...", "answer": "..."}]`;

        const result = await chatSession.sendMessage(InputPrompt);
        const MockResp = result.response.text().trim();

        console.log(JSON.parse(MockResp));
        setJsonResponse(MockResp);

        if (MockResp) {
            const resp = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: MockResp,
                jobPosition: jobPosition,
                jobDescription: jobDescription,
                jobExperience: jobExperience,
                createdBy: (session.isLoaded && session.isSignedIn) ? session.session?.user?.primaryEmailAddress?.emailAddress : "",
                createdAt: moment().format('DD-MM-yyyy')
            }).returning({ mockId: MockInterview.mockId })
            console.log("response ID: ", resp);
            if (resp) {
                setOpenDialog(false);
            }
            // Navigate to the interview page
            if (resp && resp[0]?.mockId) {
                router.push('/dashboard/interview/' + resp[0]?.mockId);
            } else {
                console.error("Failed to get mockId from response:", resp);
            }
        }
        else { console.log("ERROR") }

        setLoading(false);
    }
    return (
        <div>
            <div
                className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 hover:border-slate-500 dark:hover:border-slate-500 hover:shadow-2xs cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] group"
                onClick={() => setOpenDialog(true)}
            >
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors">
                    +
                </div>
                <h2 className="font-bold text-base text-slate-900 dark:text-white transition-colors">
                    Configure New Practice Loop
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1 max-w-[240px]">
                    Set job role, technical skill requirements, or import your resume for contextual follow-up questioning
                </p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-6 sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                            Session Configuration
                        </DialogTitle>
                        <DialogDescription asChild>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    Provide your targeted role details below to establish appropriate situational framing and evaluation rigor.
                                </p>
                                <form onSubmit={onSubmit} className="space-y-6 text-left text-slate-800 dark:text-slate-200">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5 block">Job Position / Role Title</label>
                                        <Input placeholder="Ex. Senior Full Stack Developer, Product Manager..." required className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 h-11 text-sm" onChange={(event) => setJobPosition(event.target.value)} />
                                    </div>
                                    <div className="mt-6">
                                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5 block">Required Technical Competencies &amp; Stack</label>
                                        <Textarea
                                            placeholder="Ex. React, TypeScript, Node.js, System Design, SQL, Agile..."
                                            required
                                            className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 min-h-[90px] text-sm"
                                            value={jobDescription || ''}
                                            onChange={(event) => setJobDescription(event.target.value)}
                                        ></Textarea>
                                    </div>

                                    {/* Resume Upload Section (Pro Feature) */}
                                    <div className="mt-5 my-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <label className="font-medium text-sm text-gray-800">Upload Resume (PDF)</label>
                                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                                <Crown className="h-2.5 w-2.5" /> Pro
                                            </span>
                                        </div>

                                        {!isPro ? (
                                            /* Locked state for free users */
                                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50/50 text-center">
                                                <Lock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500 mb-3">
                                                    Upload your resume to get personalized interview questions based on your actual skills and experience.
                                                </p>
                                                <Link href="/dashboard/upgrade">
                                                    <Button type="button" variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5">
                                                        <Crown className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> Upgrade to Pro
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            /* Unlocked state for Pro users */
                                            <div>
                                                {!resumeFile ? (
                                                    /* Upload dropzone */
                                                    <div
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="border-2 border-dashed border-primary/30 rounded-lg p-6 bg-primary/5 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/10 transition-all"
                                                    >
                                                        <Upload className="h-8 w-8 text-primary/50 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-600">Click to upload your resume</p>
                                                        <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept=".pdf"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const f = e.target.files?.[0];
                                                                if (f) handleResumeUpload(f);
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    /* File uploaded state */
                                                    <div className="border rounded-lg p-4 bg-white">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-5 w-5 text-primary" />
                                                                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                                                    {resumeFile.name}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    ({(resumeFile.size / 1024).toFixed(0)} KB)
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={clearResume}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <X className="h-4 w-4"/>
                                                            </button>
                                                        </div>

                                                        {/* Parsing state */}
                                                        {resumeParsing && (
                                                            <div className="flex items-center gap-2 text-sm text-primary py-3">
                                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                                <span>AI is analyzing your resume...</span>
                                                            </div>
                                                        )}

                                                        {/* Error state */}
                                                        {resumeError && (
                                                            <p className="text-sm text-red-500 py-2">{resumeError}</p>
                                                        )}

                                                        {/* Parsed results */}
                                                        {resumeData && (
                                                            <div className="space-y-3 mt-2">
                                                                <div className="flex items-start gap-2">
                                                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-xs text-green-600 font-medium">Resume parsed successfully!</span>
                                                                </div>

                                                                {/* Skills */}
                                                                <div className="bg-gray-50 rounded-md p-3">
                                                                    <p className="text-xs font-semibold text-gray-600 mb-1.5">Extracted Skills</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {resumeData.skills.split(',').map((skill, i) => (
                                                                            <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                                                                                {skill.trim()}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Experience */}
                                                                <div className="bg-gray-50 rounded-md p-3">
                                                                    <p className="text-xs font-semibold text-gray-600 mb-1">Experience</p>
                                                                    <p className="text-xs text-gray-700 leading-relaxed">{resumeData.experience}</p>
                                                                </div>

                                                                {/* Projects */}
                                                                <div className="bg-gray-50 rounded-md p-3">
                                                                    <p className="text-xs font-semibold text-gray-600 mb-1">Projects</p>
                                                                    <p className="text-xs text-gray-700 leading-relaxed">{resumeData.projects}</p>
                                                                </div>

                                                                {/* Auto-fill skills button */}
                                                                {jobDescription !== resumeData.skills && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setJobDescription(resumeData.skills)}
                                                                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                                                                    >
                                                                        <Sparkles className="h-3 w-3" /> Use extracted skills as tech description
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5 block">Years of Relevant Experience</label>
                                        <Input placeholder="Ex. 4" type="number" min="0" max="50" required className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 h-11 text-sm" onChange={(event) => setJobExperience(event.target.value)} />
                                    </div>
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-8">
                                        <Button type="button" variant="ghost" className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                        <Button type="submit" disabled={loading} className="rounded-lg px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-semibold text-sm shadow-2xs transition-colors flex items-center gap-2">
                                            {loading ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Preparing Loop...</> : 'Start Practice Session'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;