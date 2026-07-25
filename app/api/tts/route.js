import { NextResponse } from "next/server";
import { checkProStatus } from "../../../utils/proStatus";

export async function POST(request) {
    try {
        const { text, voice = "troy", email } = await request.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        if (email) {
            const isPro = await checkProStatus(email);
            if (!isPro) {
                return NextResponse.json(
                    { error: "Pro subscription required for natural AI voices." },
                    { status: 403 }
                );
            }
        }

        const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Groq API key is not configured" },
                { status: 500 }
            );
        }

        // Groq Orpheus TTS has a max input limit (~4096 chars).
        // For interview questions this is more than enough.
        const trimmedText = text.slice(0, 4000);

        const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "canopylabs/orpheus-v1-english",
                input: trimmedText,
                voice: voice,
                response_format: "wav"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq TTS API error:", response.status, errorText);
            return NextResponse.json(
                { error: `Groq TTS failed: ${response.status}` },
                { status: response.status }
            );
        }

        // Stream the audio back as WAV
        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                "Content-Type": "audio/wav",
                "Cache-Control": "public, max-age=3600" // Cache for 1 hour
            }
        });
    } catch (error) {
        console.error("TTS route error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
