import db from "@/database/drizzle"
import { chapters, classes, lessons } from "@/database/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(
    req: Request,
    { params }: { params: { classId: string; chapterId: string } }
) {
    try {
        const { chapterId } = params

        if (!chapterId) {
            return new NextResponse("Chapter ID is required", { status: 400 })
        }

        const lessonsList = await db.query.lessons.findMany({
            where: eq(lessons.chapterId, parseInt(chapterId)),
            orderBy: lessons.order
        })

        return NextResponse.json(lessonsList)
    } catch (error) {
        console.error("[LESSONS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: { classId: string; chapterId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { classId, chapterId } = params
        const body = await req.json()

        // Log incoming data
        console.log("Attempting to create lesson:", {
            classId,
            chapterId,
            body,
            userId
        })

        // First verify the class exists
        const classExists = await db.query.classes.findFirst({
            where: eq(classes.id, parseInt(classId))
        })

        if (!classExists) {
            console.log("Class not found:", classId)
            return new NextResponse("Class not found", { status: 404 })
        }

        // Then verify chapter exists and belongs to the class
        const chapter = await db.query.chapters.findFirst({
            where: and(
                eq(chapters.id, parseInt(chapterId)),
                eq(chapters.classId, parseInt(classId))
            )
        })

        console.log("Found chapter:", chapter)

        if (!chapter) {
            console.log("Chapter not found or doesn't belong to class:", {
                chapterId,
                classId
            })
            return new NextResponse(
                JSON.stringify({ 
                    error: "Chapter not found or doesn't belong to this class" 
                }), 
                { status: 404 }
            )
        }

        // Create lesson with exact schema match
        const newLesson = await db.insert(lessons)
            .values({
                chapterId: parseInt(chapterId),
                title: body.title,
                description: body.description || null,
                order: body.order
            })
            .returning()

        console.log("Created lesson:", newLesson[0])

        return NextResponse.json(newLesson[0])
    } catch (error) {
        console.error("[LESSONS_POST] Full error:", error)
        return new NextResponse(
            JSON.stringify({
                error: "Internal Error",
                details: error instanceof Error ? error.message : String(error)
            }),
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }
}