import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { classes } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const allClasses = await db.query.classes.findMany({
      orderBy: (classes, { desc }) => [desc(classes.id)],
      where: (classes, { eq }) => eq(classes.isJesJamClass, true)
    });
    
    return NextResponse.json(allClasses);
  } catch (error) {
    console.log("[CLASSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, imageSrc } = body;

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newClass = await db
      .insert(classes)
      .values({
        title,
        imageSrc,
        ownerId: userId,
        isPrivateClass: false,
        isJesJamClass: true
      })
      .returning();

    return NextResponse.json(newClass[0]);
  } catch (error) {
    console.error("[CLASS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}



