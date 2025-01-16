import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { lessons, challenges, chapters } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(
    req: Request,
    { params }: { params: { classId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // First get all chapters for this class
        const classChapters = await db.query.chapters.findMany({
            where: eq(chapters.classId, parseInt(params.classId)),
            with: {
                lessons: {
                    with: {
                        challenges: true
                    },
                    orderBy: lessons.order
                }
            },
            orderBy: chapters.order
        });

        // Flatten the lessons array and include chapter info
        const allLessons = classChapters.flatMap(chapter => 
            chapter.lessons.map(lesson => ({
                ...lesson,
                chapterTitle: chapter.title
            }))
        );

        return NextResponse.json(allLessons);

    } catch (error) {
        console.error("[CLASS_LESSONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}