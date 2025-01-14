"use server"
import { cache, use } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { classes } from "./schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";


export const getCustomClasses = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
    
  const data = await db.query.classes.findMany({
    where: and(
      eq(classes.ownerId, userId),
      eq(classes.isPrivateClass, true)
    ),
    with: {
      userProgress: true,
      enrollments: true
    }
  });

  return data;
})