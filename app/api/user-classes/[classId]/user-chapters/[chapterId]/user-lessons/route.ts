import db from "@/database/drizzle"
import { lessons } from "@/database/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

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
        const { chapterId } = params
        const body = await req.json()

        const newLesson = await db.insert(lessons).values({
            title: body.title,
            description: body.description,
            chapterId: parseInt(chapterId),
            order: body.order
        }).returning()

        return NextResponse.json(newLesson[0])
    } catch (error) {
        console.error("[LESSONS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}