import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "../../../../utils/db";
import { UserResume } from "../../../../utils/schema";
import moment from "moment";
import PDFParser from "pdf2json";

function extractTextFromPDF(buffer) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1); // 1 = extract text content only
        pdfParser.on("pdfParser_dataError", errData => reject(new Error(errData.parserError || "PDF parsing error")));
        pdfParser.on("pdfParser_dataReady", () => {
            const text = pdfParser.getRawTextContent();
            resolve(text);
        });
        pdfParser.parseBuffer(buffer);
    });
}

const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("resume");
        const userEmail = formData.get("email");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (!userEmail) {
            return NextResponse.json({ error: "User email is required" }, { status: 400 });
        }

        // Validate file type
        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
        }

        // Extract text from PDF
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        let resumeText = "";
        try {
            resumeText = await extractTextFromPDF(buffer);
            resumeText = resumeText?.trim();
        } catch (err) {
            console.error("PDF parse error:", err);
            return NextResponse.json({ error: `Failed to read PDF: ${err.message || "Unknown parsing error"}` }, { status: 400 });
        }

        if (!resumeText || resumeText.length < 50) {
            return NextResponse.json({ error: "Could not extract enough text from the PDF. It may be an image-based/scanned resume." }, { status: 400 });
        }

        // Use Groq LLM to parse and structure the resume content
        const parsePrompt = `Analyze this resume text and extract the following information. Return a JSON object with exactly these fields:

{
  "skills": "comma-separated list of all technical skills, tools, frameworks, programming languages found",
  "experience": "a 2-3 sentence summary of the candidate's work experience, highlighting their most recent role and total years of experience",
  "projects": "a 2-3 sentence summary of the most notable projects mentioned, highlighting technologies used"
}

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no extra text.

Resume text:
${resumeText.slice(0, 6000)}`;

        const result = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional resume parser. You extract structured information from resumes. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: parsePrompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        let parsedData;
        try {
            const responseText = result.choices[0]?.message?.content || "";
            parsedData = JSON.parse(responseText);
        } catch (err) {
            console.error("JSON parse error from LLM:", err);
            return NextResponse.json({ error: "Failed to parse resume content" }, { status: 500 });
        }

        // Save to database
        try {
            await db.insert(UserResume).values({
                userEmail: userEmail,
                resumeText: resumeText.slice(0, 10000), // cap storage
                parsedSkills: parsedData.skills || "",
                parsedExperience: parsedData.experience || "",
                parsedProjects: parsedData.projects || "",
                createdAt: moment().format('DD-MM-yyyy'),
            });
        } catch (dbErr) {
            console.error("DB save error:", dbErr);
            // Non-fatal — still return parsed data even if DB save fails
        }

        return NextResponse.json({
            success: true,
            skills: parsedData.skills || "",
            experience: parsedData.experience || "",
            projects: parsedData.projects || "",
        });

    } catch (error) {
        console.error("Resume parse route error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
