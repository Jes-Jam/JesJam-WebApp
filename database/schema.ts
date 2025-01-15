import { relations } from "drizzle-orm"
import { pgTable, integer, serial, text, pgEnum, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core"
import { getCurrentDate } from "@/lib/date"

export const classes = pgTable("classes", {
    id: serial("id").primaryKey(),
    title: text("title"),
    imageSrc: text("imageSrc"),
    isPrivateClass: boolean("is_private_class").default(true),
    ownerId: text("owner_id").notNull(),
})

// Relationship: classes hasMany userProgress and chapters
export const classesRelation = relations(classes, ({ many }) => ({
    userProgress: many(userProgress),
    chapters: many(chapters),
    enrollments: many(classEnrollments)
}))

export const chapters = pgTable("chapters", {
    id: serial("id").primaryKey(),
    classId: integer("class_id").references(() => classes.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    order: integer("order").notNull(),
})

// Relationship: chapters belongsTo classes
export const chapterRelations = relations(chapters, ({one, many}) => ({
    class: one(classes, {
        fields: [chapters.classId],
        references: [classes.id],
    }),
    lessons: many(lessons)
}))

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    chapterId: integer("chapter_id").references(() => chapters.id, { onDelete: 'cascade' }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    order: integer("order").notNull(),
})

export const lessonRelations = relations(lessons, ({one, many}) => ({
    chapter: one(chapters, {
        fields: [lessons.chapterId],
        references: [chapters.id],
    }),
    challenges: many(challenges)
}))

// Create an enum for challenge types
export const challengeTypeEnum = pgEnum('challenge_type', [
    'CARD',
    'SELECT',
    'ANSWER_BUILDING'
])

export const challenges = pgTable('challenges', {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
    type: challengeTypeEnum('type').notNull(), // Add the type column using our enum
    content: jsonb('content').notNull(), // Store the challenge data as JSON => more flexible
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id]
    }),
    challengeProgress: many(challengeProgress)
}))

export const challengeProgress = pgTable("challenge_progress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id").references(() => challenges.id, {onDelete: "cascade"}).notNull(),
    completed: boolean("completed").notNull().default(false)
})

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id]
    }),
    userProgress: one(userProgress, {
        fields: [challengeProgress.userId],
        references: [userProgress.userId]
    })
}))

export const classEnrollments = pgTable("class_enrollments", {
    userId: text("user_id").notNull(),
    classId: integer("class_id").references(() => classes.id, {onDelete: 'cascade'}).notNull(),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
    status: text("status", { enum: ["active", "completed", "dropped"]}).notNull().default("active"),
})

export const classEnrollmentRelations = relations(classEnrollments, ({one}) => ({
    user: one(userProgress, {
        fields: [classEnrollments.userId],
        references: [userProgress.userId]
    }),
    class: one(classes, {
        fields: [classEnrollments.classId],
        references: [classes.id]
    })
}))

export const userProgress = pgTable('user_progress', {
    userId: text("user_id").primaryKey(),
    activeClassId: integer("active_class_id").references(() => classes.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("https://placehold.co/40x40"),
    patels: integer("patels").notNull().default(10), 
    points: integer("points").notNull().default(0),
    streakCount: integer("streak_count").notNull().default(0),
    lastStreakDate: date("last_streak_date").notNull().default(getCurrentDate())
})


// Relationship: userProgress belongsTo classes 
export const userProgressRelations = relations(userProgress, ({one, many}) => ({
    activeClass: one(classes, {
        fields: [userProgress.activeClassId],
        references: [classes.id],
    }),
    enrollments: many(classEnrollments)
}))




