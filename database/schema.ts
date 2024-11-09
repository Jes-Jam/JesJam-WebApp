import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const classes = pgTable("classes", {
    id: serial("id").primaryKey(),
    title: text("title"),
    imageSrc: text("imageSrc"),
})