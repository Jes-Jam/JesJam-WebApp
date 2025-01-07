import db from "@/database/drizzle"
import { challenges } from "@/database/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

// Validation schema for the challenge data
const challengeSchema = z.object({
    challenges: z.array(z.object({
        type: z.enum(["CARD", "SELECT", "ANSWER_BUILDING"]),
        data: z.object({}).passthrough() // Allow any data structure based on type
    }))
})

export async function GET(
    req: Request,
    { params }: { params: { classId: string; chapterId: string; lessonId: string } }
) {
    try {
        const { lessonId } = params

        if (!lessonId) {
            return new NextResponse("Lesson ID is required", { status: 400 })
        }

        const existingChallenges = await db.query.challenges.findMany({
            where: eq(challenges.lessonId, parseInt(lessonId)),
            orderBy: challenges.createdAt
        })

        return NextResponse.json(existingChallenges)
    } catch (error) {
        console.error("[CHALLENGES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: { classId: string; chapterId: string; lessonId: string } }
) {
    try {
        const { lessonId } = params
        const body = await req.json()

        // Validate the request body
        const validatedData = challengeSchema.safeParse(body)
        
        if (!validatedData.success) {
            return new NextResponse("Invalid challenge data", { status: 400 })
        }

        const { challenges: newChallenges } = validatedData.data

        // Delete existing challenges for this lesson
        await db.delete(challenges)
            .where(eq(challenges.lessonId, parseInt(lessonId)))

        // Insert new challenges
        const challengesToInsert = newChallenges.map(challenge => ({
            lessonId: parseInt(lessonId),
            type: challenge.type,
            content: challenge.data,
            createdAt: new Date(),
            updatedAt: new Date()
        }))

        const savedChallenges = await db.insert(challenges)
            .values(challengesToInsert)
            .returning()

        return NextResponse.json(savedChallenges)

    } catch (error) {
        console.error("[CHALLENGES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}