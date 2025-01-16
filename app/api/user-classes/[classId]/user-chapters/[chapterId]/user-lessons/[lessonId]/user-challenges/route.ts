import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { challenges, classes } from "@/database/schema";
import { eq, and } from "drizzle-orm";

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
        const lessonId = parseInt(params.lessonId);

        if (!classId || !lessonId) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Verify class ownership or enrollment
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get all challenges for this lesson
        const lessonChallenges = await db.query.challenges.findMany({
            where: and(
                eq(challenges.lessonId, lessonId),
                eq(challenges.type, "CARD") // Only get flashcard type challenges
            ),
            orderBy: challenges.createdAt
        });

        return NextResponse.json(lessonChallenges);

    } catch (error) {
        console.error("[CHALLENGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}