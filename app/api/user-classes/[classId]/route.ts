import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { classes } from "@/database/schema";
import { eq } from "drizzle-orm";


// GET /api/user-classes/[classId]
export async function GET(
    req: Request,
    { params }: { params: { classId: string } }
) {
    const classId = Number(params.classId);
    const class_ = await db.query.classes.findFirst({
        where: eq(classes.id, classId)
    });
    return NextResponse.json(class_);
}


export async function DELETE(
    req: Request,
    { params }: { params: { classId: string } }
) {
    try {
        const { userId } = auth();
        
        // Debug log the incoming parameters
        console.log("DELETE request params:", {
            receivedParams: params,
            classId: params.classId,
            parsedId: Number(params.classId)
        });

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Make sure we're getting the classId parameter
        if (!params.classId) {
            return new NextResponse("Class ID is required", { status: 400 });
        }

        const classId = Number(params.classId);

        // Validate the parsed ID
        if (isNaN(classId)) {
            return new NextResponse(JSON.stringify({
                error: "Invalid class ID format",
                receivedId: params.classId
            }), { status: 400 });
        }

        const existingClass = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!existingClass) {
            return new NextResponse(JSON.stringify({
                error: "Class not found",
                classId: classId
            }), { status: 404 });
        }

        if (existingClass.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await db.delete(classes).where(eq(classes.id, classId));

        return NextResponse.json({ message: "Class deleted successfully" });
    } catch (error: any) {
        console.error("Delete error:", error);
        return new NextResponse(JSON.stringify({
            error: error.message,
            details: "Server error during delete operation"
        }), { status: 500 });
    }
}
