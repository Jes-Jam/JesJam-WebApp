import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { chapters, classes } from "@/database/schema";
import { eq, and } from "drizzle-orm";


export async function GET(
    req: Request,
    { params }: { params: { classId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = parseInt(params.classId);
        const chapterId = parseInt(params.chapterId);

        if (!classId || isNaN(classId) || !chapterId || isNaN(chapterId)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Get chapter with its associated class information
        const chapter = await db.query.chapters.findFirst({
            where: and(
                eq(chapters.id, chapterId),
                eq(chapters.classId, classId)
            ),
            with: {
                class: {
                    columns: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        // Verify class ownership
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[CHAPTER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { classId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { title, description, order } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = parseInt(params.classId);
        const chapterId = parseInt(params.chapterId);

        const updatedChapter = await db
            .update(chapters)
            .set({
                title,
                description,
                order,
            })
            .where(
                and(
                    eq(chapters.id, chapterId),
                    eq(chapters.classId, classId)
                )
            )
            .returning();

        return NextResponse.json(updatedChapter[0]);
    } catch (error) {
        console.log("[CHAPTER_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { classId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = parseInt(params.classId);
        const chapterId = parseInt(params.chapterId);

        await db
            .delete(chapters)
            .where(
                and(
                    eq(chapters.id, chapterId),
                    eq(chapters.classId, classId)
                )
            );

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.log("[CHAPTER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}