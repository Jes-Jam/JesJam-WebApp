import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { chapters, classes } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(
    req: Request,
    { params }: { params: { classId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = Number(params.classId);

        if (!classId || isNaN(classId)) {
            return new NextResponse("Invalid class ID", { status: 400 });
        }

        const classChapters = await db.query.chapters.findMany({
            where: eq(chapters.classId, classId),
            with: {
                class: true
            }
        });

        return NextResponse.json(classChapters);
    } catch (error) {
        console.error("[CHAPTERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}





export async function POST(
    req: Request,
    { params }: { params: { classId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = Number(params.classId);

        if (!classId || isNaN(classId)) {
            return new NextResponse("Invalid class ID", { status: 400 });
        }

        // Verify the class exists and belongs to the user
        const existingClass = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!existingClass) {
            return new NextResponse("Class not found", { status: 404 });
        }

        if (existingClass.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, description } = await req.json();

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        // Get the highest order number for existing chapters in this class
        const existingChapters = await db.query.chapters.findMany({
            where: eq(chapters.classId, classId),
            orderBy: (chapters, { desc }) => [desc(chapters.order)]
        });

        // Calculate the new order number (highest + 1, or 1 if no chapters exist)
        const newOrder = existingChapters.length > 0 
            ? (existingChapters[0].order + 1) 
            : 1;

        // Create the new chapter
        const newChapter = await db.insert(chapters).values({
            title,
            description,
            classId,
            order: newOrder
        }).returning();

        return NextResponse.json(newChapter[0]);
    } catch (error) {
        console.error("[CHAPTER_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
