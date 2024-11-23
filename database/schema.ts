import { relations } from "drizzle-orm"
import { pgTable, integer, serial, text, pgEnum, boolean } from "drizzle-orm/pg-core"

export const classes = pgTable("classes", {
    id: serial("id").primaryKey(),
    title: text("title"),
    imageSrc: text("imageSrc"),
})

// Relationship: classes hasMany userProgress and chapters
export const classesRelation = relations(classes, ({ many }) => ({
    userProgress: many(userProgress),
    chapters: many(chapters)
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

export const challengesEnum = pgEnum("challenges_enum", [
    "SELECT", 
    "CARD",
    "FILL_IN_THE_BLANK",
    // Potential additions:
    // "MULTIPLE_CHOICE",
    // "MATCHING",
    // "SPEAKING",
])

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
    type: challengesEnum("type").notNull(),
    question: text("question").notNull(),
    order: integer("order").notNull(),
})

export const challengeRelations = relations(challenges, ({one, many}) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengeAnswers: many(challengeAnswers),
    challengeProgress: many(challengeProgress)
}))

export const challengeAnswers = pgTable("challenge_answers", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: 'cascade' }).notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
})

export const challengeAnswerRelations = relations(challengeAnswers, ({one}) => ({
    challenge: one(challenges, {
        fields: [challengeAnswers.challengeId], 
        references: [challenges.id],
    })
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

export const userProgress = pgTable('user_progress', {
    userId: text("user_id").primaryKey(),
    activeClassId: integer("active_class_id").references(() => classes.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    userName: text("user_name").notNull().default("User"),
    patels: integer("patels").notNull().default(10), 
    points: integer("points").notNull().default(0),
})


// Relationship: userProgress belongsTo classes 
export const userProgressRelations = relations(userProgress, ({one}) => ({
    activeClass: one(classes, {
        fields: [userProgress.activeClassId],
        references: [classes.id],
    })
}))




