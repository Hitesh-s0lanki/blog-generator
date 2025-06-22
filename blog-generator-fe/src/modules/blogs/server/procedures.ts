import { nanoid } from 'nanoid';
import { and, eq, sql } from "drizzle-orm"
import { db } from "@/db"
import { blogs } from "@/db/schema/blog"
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { blogInsertSchema } from "../schema"

import axios from "axios";
import { TRPCError } from "@trpc/server"
import { getImageUrl, uploadImageToS3 } from '@/lib/s3';
import { z } from 'zod';
import { MAX_FREE_BLOG } from '@/constant';

export const blogsRouter = createTRPCRouter({

    create: protectedProcedure
        .input(blogInsertSchema)
        .mutation(async ({ input, ctx }) => {

            // 0) enforce free‐tier limit
            const [{ count }] = await db
                .select({ count: sql<number>`count(*)` })
                .from(blogs)
                .where(eq(blogs.userId, ctx.auth.userId));

            if (Number(count) >= MAX_FREE_BLOG) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: `Free tier limit reached (${MAX_FREE_BLOG} blogs).`,
                });
            }

            let blogData: {
                title: string;
                content: string;
                image: string;
            };

            // 1) fetch the blog using the Python API
            try {
                const resp = await axios.post<{
                    data: {
                        blog: { title: string; content: string; image: string };
                    };
                }>(`${process.env.NEXT_PUBLIC_API_URL}/blog`, input);
                blogData = resp.data.data.blog;
            } catch (err) {
                console.error("Failed to fetch from blog API:", err);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not generate blog from the AI service.",
                });
            }

            // 2) upload the remote image URL into our S3 bucket
            let s3Key: string;
            try {
                s3Key = await uploadImageToS3(blogData.image);
            } catch (err) {
                console.error("S3 upload failed:", err);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to upload blog image.",
                });
            }

            // 3) persist to our database
            const [inserted] = await db
                .insert(blogs)
                .values({
                    id: nanoid(),
                    userId: ctx.auth.userId,
                    topic: input.topic,
                    title: blogData.title,
                    content: blogData.content,
                    image: s3Key,
                })
                .returning({ id: blogs.id });

            // 4) return the newly created blog ID so client can redirect
            return { id: inserted.id };
        }),
    getMany: protectedProcedure
        .query(async ({ ctx }) => {

            // 1) fetch raw rows
            const raw = await db
                .select({
                    id: blogs.id,
                    title: blogs.title,
                    content: blogs.content,
                    image: blogs.image,
                    createdAt: blogs.createdAt
                })
                .from(blogs)
                .where(eq(blogs.userId, ctx.auth.userId))
                .orderBy(blogs.createdAt);

            // 2) resolve signed URLs in parallel, catching per‐item failures
            const items = await Promise.all(
                raw.map(async (row) => {
                    let url: string | null = null;
                    if (row.image) {
                        try {
                            url = await getImageUrl(row.image);
                        } catch (err) {
                            // swallow or rethrow depending on your UX needs
                            console.warn("Image URL failed for", row.id, err);
                            // optionally: url = SOME_FALLBACK_URL;
                        }
                    }
                    return {
                        id: row.id,
                        title: row.title,
                        content: row.content,
                        imageUrl: url,
                        createdAt: row.createdAt
                    };
                })
            );

            return { items };
        }),
    getCount: protectedProcedure.query(async ({ ctx }) => {
        const row = await db
            .select({
                id: blogs.id,
            })
            .from(blogs)
            .where(eq(blogs.userId, ctx.auth.userId));

        return { count: row.length };
    }),
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            // 1) fetch the blog row, ensuring it belongs to the user
            const row = await db
                .select({
                    id: blogs.id,
                    title: blogs.title,
                    content: blogs.content,
                    image: blogs.image,
                })
                .from(blogs)
                .where(
                    and(
                        eq(blogs.id, input.id),
                        eq(blogs.userId, ctx.auth.userId)
                    )
                )
                .limit(1)
                .then((rows) => rows[0]);

            if (!row) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Blog with id "${input.id}" not found.`,
                });
            }

            // 2) resolve signed URL for the image, if present
            let imageUrl: string | null = null;
            if (row.image) {
                try {
                    imageUrl = await getImageUrl(row.image);
                } catch (cause) {
                    console.warn(`Failed to sign URL for ${row.id}:`, cause);
                    // optionally rethrow if you want this to be fatal
                }
            }

            // 3) return the blog
            return {
                id: row.id,
                title: row.title,
                content: row.content,
                imageUrl,
            };
        }),
    getPublicOne: baseProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            // 1) fetch the blog row, ensuring it belongs to the user
            const row = await db
                .select({
                    id: blogs.id,
                    title: blogs.title,
                    content: blogs.content,
                    image: blogs.image,
                })
                .from(blogs)
                .where(
                    and(
                        eq(blogs.id, input.id)
                    )
                )
                .limit(1)
                .then((rows) => rows[0]);

            if (!row) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Blog with id "${input.id}" not found.`,
                });
            }

            // 2) resolve signed URL for the image, if present
            let imageUrl: string | null = null;
            if (row.image) {
                try {
                    imageUrl = await getImageUrl(row.image);
                } catch (cause) {
                    console.warn(`Failed to sign URL for ${row.id}:`, cause);
                    // optionally rethrow if you want this to be fatal
                }
            }

            // 3) return the blog
            return {
                id: row.id,
                title: row.title,
                content: row.content,
                imageUrl,
            };
        })
})