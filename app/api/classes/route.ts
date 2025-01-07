import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { classes } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const allClasses = await db.query.classes.findMany();
    
    return NextResponse.json(allClasses);
  } catch (error) {
    console.log("[CLASSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title, imageSrc, isPreviewAvailable, previewChaptersCount, isPrivateClass } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newClass = await db.insert(classes).values({
      title,
      imageSrc,
      isPrivateClass,
      ownerId: userId,
    }).returning();

    return NextResponse.json(newClass[0]);
  } catch (error) {
    console.log("[CLASSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}



