"use server"

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { extname } from "path";
import { nanoid } from "nanoid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";

const REGION = process.env.BLOG_AWS_REGION!;
const BUCKET = process.env.BLOG_AWS_S3_BUCKET_NAME!;
const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.BLOG_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.BLOG_AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadImageToS3(imageUrl: string): Promise<string> {
    // 1. Download remote image
    const response = await axios.get<ArrayBuffer>(imageUrl, {
        responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data);

    // 2. Determine file extension (default to .jpg)
    const urlPath = new URL(imageUrl).pathname;
    const ext = extname(urlPath) || ".png";

    // 3. Generate a unique key
    const key = `blogs/${nanoid()}${ext}`;

    // 4. Upload to S3
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: 'image/png',
        })
    );

    return key;
}

export async function getImageUrl(imageKey: string): Promise<string> {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET,
            Key: imageKey,
        });
        return await getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (cause) {
        console.error("Failed to generate signed URL for", imageKey, cause);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not fetch image URL",
            cause,
        });
    }
}