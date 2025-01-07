import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { chapters } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function POST(
    req: Request,
    { params }: { params: { classId: string } }
) {
    try {
        const { userId } = auth();
        const { title, description, order } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        const classId = parseInt(params.classId);

        const newChapter = await db.insert(chapters).values({
            classId,
            title,
            description,
            order: order || 1, // Default to 1 if not provided
        }).returning();

        return NextResponse.json(newChapter[0]);
    } catch (error) {
        console.log("[CHAPTERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}