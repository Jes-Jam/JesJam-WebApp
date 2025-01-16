import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { publicAccessRequests, classes } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
    req: Request,
    { params }: { params: { requestId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { action } = body;
        const requestId = parseInt(params.requestId);

        console.log("Processing request:", { requestId, action, userId });

        if (!requestId || !["approve", "reject"].includes(action)) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid request parameters" }), 
                { status: 400 }
            );
        }

        // Get the request first
        const existingRequest = await db.query.publicAccessRequests.findFirst({
            where: eq(publicAccessRequests.id, requestId)
        });

        console.log("Existing request:", existingRequest);

        if (!existingRequest) {
            return new NextResponse(
                JSON.stringify({ error: "Request not found" }), 
                { status: 404 }
            );
        }

        // Update request status
        await db.update(publicAccessRequests)
            .set({
                status: action === "approve" ? "approved" : "rejected",
                updatedAt: new Date()
            })
            .where(eq(publicAccessRequests.id, requestId));

        // If approved, update class privacy
        if (action === "approve") {
            await db.update(classes)
                .set({ isPrivateClass: false })
                .where(eq(classes.id, existingRequest.classId));
        }

        // Get updated request
        const updatedRequest = await db.query.publicAccessRequests.findFirst({
            where: eq(publicAccessRequests.id, requestId),
            with: {
                class: {
                    columns: {
                        title: true,
                        imageSrc: true
                    }
                }
            }
        });

        return NextResponse.json({
            message: "Request processed successfully",
            updatedRequest: updatedRequest
        });

    } catch (error) {
        console.error("[PUBLIC_REQUEST_PATCH] Error:", error);
        return new NextResponse(
            JSON.stringify({ 
                error: "Internal Server Error", 
                details: error instanceof Error ? error.message : String(error)
            }), 
            { status: 500 }
        );
    }
}
