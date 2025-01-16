import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { publicAccessRequests, classes, userProgress } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // TODO: Add admin role check here

        const requests = await db.query.publicAccessRequests.findMany({
            where: eq(publicAccessRequests.status, "pending"),
            with: {
                class: {
                    columns: {
                        title: true,
                        imageSrc: true
                    }
                }
            },
            columns: {
                id: true,
                classId: true,
                status: true,
                requestedAt: true,
                ownerId: true
            }
        });

        // Fetch user information for each request
        const requestsWithOwners = await Promise.all(
            requests.map(async (request) => {
                const owner = await db.query.userProgress.findFirst({
                    where: eq(userProgress.userId, request.ownerId),
                    columns: {
                        userName: true
                    }
                });

                return {
                    ...request,
                    owner: {
                        user_name: owner?.userName || "Unknown User"
                    }
                };
            })
        );

        return NextResponse.json(requestsWithOwners);

    } catch (error) {
        console.error("[PUBLIC_REQUESTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
