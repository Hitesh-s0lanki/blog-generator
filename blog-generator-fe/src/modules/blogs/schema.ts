import { z } from "zod"

export const blogInsertSchema = z.object({
    topic: z.string().min(5, { message: "Topic is required" })
})