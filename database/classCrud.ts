"use server"
import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { classes } from "./schema";
import { eq, and, or, not } from "drizzle-orm";
import { redirect } from "next/navigation";

export const getClassesByType = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
    
  // Get user's own classes
  const userClasses = await db.query.classes.findMany({
    where: and(
      eq(classes.ownerId, userId),
      eq(classes.isJesJamClass, false)
    ),
  });

  // Get community classes (public classes not owned by user)
  const communityClasses = await db.query.classes.findMany({
    where: and(
      not(eq(classes.ownerId, userId)),
      eq(classes.isJesJamClass, false),
      eq(classes.isPrivateClass, false)
    ),
  });

  return {
    userClasses,
    communityClasses
  };
});