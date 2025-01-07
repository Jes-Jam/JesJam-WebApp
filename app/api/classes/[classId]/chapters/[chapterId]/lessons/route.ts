import db from "@/database/drizzle"
import { lessons } from "@/database/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const chapterId = searchParams.get("chapterId")

  if (!chapterId) {
    return new NextResponse("Chapter ID is required", { status: 400 })
  }

  const lessonsList = await db.query.lessons.findMany({
    where: eq(lessons.chapterId, parseInt(chapterId)),
    orderBy: lessons.order
  })

  return NextResponse.json(lessonsList)
}

export async function POST(req: Request) {
  const body = await req.json()
  
  const newLesson = await db.insert(lessons).values({
    title: body.title,
    description: body.description,
    chapterId: body.chapterId,
    order: body.order
  }).returning()

  return NextResponse.json(newLesson[0])
}