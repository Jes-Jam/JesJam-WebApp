import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { lessons, chapters, classes } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
    req: Request,
    { params }: { params: { classId: string; chapterId: string; lessonId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, description } = await req.json();
        const classId = parseInt(params.classId);
        const chapterId = parseInt(params.chapterId);
        const lessonId = parseInt(params.lessonId);

        if (!classId || !chapterId || !lessonId) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Verify class ownership
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Update the lesson
        const updatedLesson = await db
            .update(lessons)
            .set({
                title,
                description,
            })
            .where(
                and(
                    eq(lessons.id, lessonId),
                    eq(lessons.chapterId, chapterId)
                )
            )
            .returning();

        if (!updatedLesson[0]) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        return NextResponse.json(updatedLesson[0]);
    } catch (error) {
        console.error("[LESSON_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { classId: string; chapterId: string; lessonId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = parseInt(params.classId);
        const chapterId = parseInt(params.chapterId);
        const lessonId = parseInt(params.lessonId);

        if (!classId || !chapterId || !lessonId) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Verify class ownership
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Delete the lesson
        await db
            .delete(lessons)
            .where(
                and(
                    eq(lessons.id, lessonId),
                    eq(lessons.chapterId, chapterId)
                )
            );

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[LESSON_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
