import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { lessons, chapters, classes, challenges } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
export async function GET(
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

        // Get the lesson with its chapter and class information
        const lesson = await db.query.lessons.findFirst({
            where: and(
                eq(lessons.id, lessonId),
                eq(lessons.chapterId, chapterId)
            ),
            with: {
                chapter: {
                    with: {
                        class: {
                            columns: {
                                id: true,
                                title: true
                            }
                        }
                    }
                }
            }
        });

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        // Verify class ownership or enrollment
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!classData || classData.ownerId !== userId) {
            // Here you might want to check if the user is enrolled in the class
            // if they're not the owner
            return new NextResponse("Unauthorized", { status: 401 });
        }

        return NextResponse.json(lesson);
    } catch (error) {
        console.error("[LESSON_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

const flashcardSchema = z.object({
    flashcards: z.array(z.object({
        term: z.string().min(1),
        definition: z.string().min(1),
        imageUrl: z.string().optional()
    }))
});



export async function POST(
    req: Request,
    { params }: { params: { classId: string; chapterId: string; lessonId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { lessonId, classId } = params;
        const body = await req.json();

        // Validate the request body
        const validatedData = flashcardSchema.safeParse(body);
        
        if (!validatedData.success) {
            return new NextResponse("Invalid flashcard data", { status: 400 });
        }

        // Verify class ownership
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, parseInt(classId))
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Format challenges for database
        const challengesToInsert = validatedData.data.flashcards.map(flashcard => ({
            lessonId: parseInt(lessonId),
            type: "CARD",
            content: flashcard,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // Delete existing flashcard challenges for this lesson
        await db.delete(challenges)
            .where(and(
                eq(challenges.lessonId, parseInt(lessonId)),
                eq(challenges.type, "CARD")
            ));

        // Insert new challenges
        const savedChallenges = await db.insert(challenges)
            .values(challengesToInsert as any)
            .returning();

        return NextResponse.json(savedChallenges);

    } catch (error) {
        console.error("[CHALLENGES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

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


