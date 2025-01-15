import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { challenges, classes } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Validation schema for challenge updates
const updateChallengeSchema = z.object({
    term: z.string().min(1),
    definition: z.string().min(1),
    imageUrl: z.string().optional()
});

export async function PATCH(
    req: Request,
    { params }: { params: { 
        classId: string; 
        chapterId: string; 
        lessonId: string;
        challengeId: string;
    }}
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { classId, lessonId, challengeId } = params;
        const body = await req.json();

        // Validate request body
        const validatedData = updateChallengeSchema.safeParse(body);
        if (!validatedData.success) {
            return new NextResponse("Invalid challenge data", { status: 400 });
        }

        // Verify class ownership
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, parseInt(classId))
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Update the challenge
        const updatedChallenge = await db
            .update(challenges)
            .set({
                content: validatedData.data,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(challenges.id, parseInt(challengeId)),
                    eq(challenges.lessonId, parseInt(lessonId)),
                    eq(challenges.type, "CARD")
                )
            )
            .returning();

        if (!updatedChallenge[0]) {
            return new NextResponse("Challenge not found", { status: 404 });
        }

        return NextResponse.json(updatedChallenge[0]);
    } catch (error) {
        console.error("[CHALLENGE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { 
        classId: string; 
        chapterId: string; 
        lessonId: string;
        challengeId: string;
    }}
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { classId, lessonId, challengeId } = params;

        // Verify class ownership
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, parseInt(classId))
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Delete the challenge
        await db
            .delete(challenges)
            .where(
                and(
                    eq(challenges.id, parseInt(challengeId)),
                    eq(challenges.lessonId, parseInt(lessonId)),
                    eq(challenges.type, "CARD")
                )
            );

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[CHALLENGE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
