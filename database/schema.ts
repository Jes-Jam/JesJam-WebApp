import { relations } from "drizzle-orm"
import { pgTable, integer, serial, text } from "drizzle-orm/pg-core"

export const classes = pgTable("classes", {
    id: serial("id").primaryKey(),
    title: text("title"),
    imageSrc: text("imageSrc"),
})

// Relationship: classes hasMany userProgress
export const classInUserProgress = relations(classes, ({many}) => ({
    userProgress: many(userProgress)
}))

export const userProgress = pgTable('user_progress', {
    userId: text("user_id").primaryKey(),
    activeClassId: text("active_class_id").references(() => classes.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    userName: text("user_name").notNull().default("User"),
    patels: integer("patels").notNull().default(10), 
    points: integer("points").notNull().default(0),
})


// Relationship: userProgress belongsTo classes 
export const userProgressInClasses = relations(userProgress, ({one}) => ({
    activeClass: one(classes, {
        fields: [userProgress.activeClassId],
        references: [classes.id],
    })
}))

