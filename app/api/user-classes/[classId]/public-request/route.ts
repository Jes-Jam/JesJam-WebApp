import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { classes, publicAccessRequests } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
    req: Request,
    { params }: { params: { classId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = parseInt(params.classId);

        if (!classId) {
            return new NextResponse("Invalid class ID", { status: 400 });
        }

        // Verify class ownership
        const classData = await db.query.classes.findFirst({
            where: eq(classes.id, classId)
        });

        if (!classData || classData.ownerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if there's already a pending request
        const existingRequest = await db.query.publicAccessRequests.findFirst({
            where: and(
                eq(publicAccessRequests.classId, classId),
                eq(publicAccessRequests.status, "pending")
            )
        });

        if (existingRequest) {
            return new NextResponse("Request already pending", { status: 400 });
        }

        // Create new request
        const newRequest = await db
            .insert(publicAccessRequests)
            .values({
                classId,
                ownerId: userId,
                status: "pending",
                requestedAt: new Date(),
                updatedAt: new Date()
            })
            .returning();

        return NextResponse.json(newRequest[0]);

    } catch (error) {
        console.error("[PUBLIC_REQUEST_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { classId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const classId = parseInt(params.classId);

        if (!classId) {
            return new NextResponse("Invalid class ID", { status: 400 });
        }

        // Get latest request for this class
        const request = await db.query.publicAccessRequests.findFirst({
            where: eq(publicAccessRequests.classId, classId),
            orderBy: (publicAccessRequests, { desc }) => [desc(publicAccessRequests.requestedAt)]
        });

        return NextResponse.json(request);

    } catch (error) {
        console.error("[PUBLIC_REQUEST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
