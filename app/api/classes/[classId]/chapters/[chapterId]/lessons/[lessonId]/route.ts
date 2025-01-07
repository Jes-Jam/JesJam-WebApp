import db from "@/database/drizzle"
import { lessons } from "@/database/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: { lessonId: string } }
) {
    try {
        const { lessonId } = params

        if (!lessonId) {
            return new NextResponse("Lesson ID is required", { status: 400 })
        }

        await db.delete(lessons).where(eq(lessons.id, parseInt(lessonId)))

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[LESSON_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { lessonId: string } }
) {
    try {
        const { lessonId } = params
        const body = await req.json()

        if (!lessonId) {
            return new NextResponse("Lesson ID is required", { status: 400 })
        }

        const updatedLesson = await db
            .update(lessons)
            .set({
                title: body.title,
                description: body.description,
                order: body.order,
            })
            .where(eq(lessons.id, parseInt(lessonId)))
            .returning()

        return NextResponse.json(updatedLesson[0])
    } catch (error) {
        console.error("[LESSON_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}