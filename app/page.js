import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { ArrowRight, Briefcase, Mic, FileText, BarChart2, CheckCircle, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-slate-200 dark:selection:bg-slate-800">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={'/logo.png'} width={170} height={50} alt="Mockify Logo" priority className="object-contain hover:opacity-90 transition-opacity" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-950 dark:hover:text-white transition-colors">Capabilities</a>
            <a href="#workflow" className="hover:text-slate-950 dark:hover:text-white transition-colors">Methodology</a>
            <Link href="/dashboard/upgrade" className="hover:text-slate-950 dark:hover:text-white transition-colors">Pricing &amp; Pro</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-xs transition-colors rounded-lg px-5 py-2 font-semibold text-sm flex items-center gap-2">
                Go to Workspace <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 px-6 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider mb-8 border border-slate-300/60 dark:border-slate-700">
            <span>Professional Interview Practice Studio</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] text-slate-950 dark:text-white">
            Practice to Perfection.
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Refine your technical storytelling and executive presence through rigorous, customized interview simulations and objective communication scoring.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 text-white text-sm font-semibold px-8 py-6 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 tracking-wide">
                Start Practice Session <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/learnuse" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold px-8 py-6 rounded-lg transition-colors">
                View Methodology
              </Button>
            </Link>
          </div>
          
          {/* Executive Value Metrics Bar */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto py-6 px-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs text-left sm:text-center">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Tailored Scenarios</span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Role &amp; Seniority Specific</span>
            </div>
            <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Live Spoken Audio</span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Realistic Dialogue Loops</span>
            </div>
            <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Objective Scoring</span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Actionable Rubric Breakdown</span>
            </div>
          </div>
        </section>

        {/* Core Capabilities Section */}
        <section id="features" className="py-20 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14 text-left">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Capabilities</h2>
              <h3 className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight">Built for Professional Mastery</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-base">Replicate authentic technical screens, structural behavioral framing, and executive presence under pressure.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="p-8 rounded-xl bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-6">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Role-Customized Scenarios</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Generate challenging interview loops customized directly to your specific target position, technical competencies, and experience tenure.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-xl bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-6">
                  <Mic className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Conversational Voice Simulation</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Engage with natural spoken prompts and questions. Practice formulating coherent verbal answers under real-time dialogue conditions.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-xl bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-6">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Contextual Resume Calibration</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Attach your resume in Pro mode to simulate rigorous follow-up questioning based directly on your past work history, project deliverables, and tech stack.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-xl bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-6">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Structured Performance Rubric</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Review complete transcripts of your spoken responses alongside standardized ideal answers, actionable feedback, and competency scores.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology / Workflow Section */}
        <section id="workflow" className="py-20 px-6 max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14 text-left">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Methodology</h2>
            <h3 className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight">How Mockify Works</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block mb-4">Phase 01</span>
                <h4 className="text-base font-bold mb-2 text-slate-900 dark:text-white">Configure Your Loop</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Specify your desired role, seniority level, and technical stack requirements (or import your resume) to initiate an assessment session.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block mb-4">Phase 02</span>
                <h4 className="text-base font-bold mb-2 text-slate-900 dark:text-white">Engage in Verbal Screening</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Listen to verbal interview questions and speak your responses out loud using your microphone to build confidence and fluency.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block mb-4">Phase 03</span>
                <h4 className="text-base font-bold mb-2 text-slate-900 dark:text-white">Analyze &amp; Iterate</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Examine itemized evaluations, study structural model answers, and identify precise communication improvements for your next real-world loop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-6 max-w-6xl mx-auto mb-16">
          <div className="rounded-2xl bg-slate-900 text-white p-10 md:p-14 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">Ready to Practice to Perfection?</h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Start your practice sessions today and build the communication discipline needed for high-stakes technical interviews.
              </p>
            </div>
            <Link href="/dashboard" className="w-full md:w-auto shrink-0">
              <Button size="lg" className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-900 font-semibold px-8 py-6 rounded-lg text-sm transition-colors shadow-xs">
                Enter Practice Studio
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-10 px-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src={'/logo.png'} width={130} height={38} alt="Mockify Logo" className="object-contain" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">© {new Date().getFullYear()} Mockify. Practice to Perfection.</p>
          <div className="flex items-center gap-6 font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/dashboard" className="hover:text-slate-950 dark:hover:text-white transition-colors">Workspace</Link>
            <Link href="/dashboard/learnuse" className="hover:text-slate-950 dark:hover:text-white transition-colors">Methodology</Link>
            <Link href="/dashboard/upgrade" className="hover:text-slate-950 dark:hover:text-white transition-colors">Pro Upgrade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
