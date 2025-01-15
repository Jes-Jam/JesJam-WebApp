import db from "@/database/drizzle"
import { chapters, classes, lessons } from "@/database/schema"
import { auth } from "@clerk/nextjs/server";
import { and, asc, desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: { classId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = parseInt(params.classId);
        const chapterId = parseInt(params.chapterId);

        if (!classId || isNaN(classId) || !chapterId || isNaN(chapterId)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Verify class ownership and chapter existence
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.query.chapters.findFirst({
            where: and(
                eq(chapters.id, chapterId),
                eq(chapters.classId, classId)
            )
        });

        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        // Get lessons ordered by their order field
        const chapterLessons = await db.query.lessons.findMany({
            where: eq(lessons.chapterId, chapterId),
            orderBy: [asc(lessons.order)],
        });

        return NextResponse.json(chapterLessons);
    } catch (error) {
        console.error("[LESSONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { classId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { chapterId } = params;
        const { title, description } = await req.json();

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        // Get the highest order number for existing lessons in this chapter
        const existingLessons = await db.query.lessons.findMany({
            where: eq(lessons.chapterId, parseInt(chapterId)),
            orderBy: [desc(lessons.order)]
        });

        // Calculate new order (highest + 1, or 1 if no lessons exist)
        const newOrder = existingLessons.length > 0 
            ? (existingLessons[0].order + 1) 
            : 1;

        // Create the new lesson
        const newLesson = await db.insert(lessons)
            .values({
                title,
                description,
                chapterId: parseInt(chapterId),
                order: newOrder
            })
            .returning();

        return NextResponse.json(newLesson[0]);
    } catch (error) {
        console.error("[LESSONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}