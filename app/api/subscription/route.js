import { NextResponse } from "next/server";
import { checkProStatus, toggleProStatus } from "../../../utils/proStatus";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get("email");

        if (!userEmail) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const isPro = await checkProStatus(userEmail);
        return NextResponse.json({ isPro });
    } catch (error) {
        console.error("Subscription GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const newStatus = await toggleProStatus(email);
        return NextResponse.json({ isPro: newStatus });
    } catch (error) {
        console.error("Subscription POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
