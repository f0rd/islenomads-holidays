import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { getAnalyticsDashboardData } from "../db";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  getDashboardStats: adminProcedure.query(async () => {
    const data = await getAnalyticsDashboardData();
    return data;
  }),

  uploadImage: adminProcedure
    .input(
      z.object({
        fileName: z.string().min(1, "fileName is required"),
        fileSize: z.number().min(1, "file must not be empty"),
        mimeType: z.string().min(1, "mimeType is required"),
      })
    )
    .mutation(async ({ input }) => {
      // Generate a unique file key for S3 storage
      const fileKey = `cms-uploads/${Date.now()}-${Math.random().toString(36).substring(7)}-${input.fileName}`;
      
      try {
        // Return a presigned URL for client-side upload
        // In production, you would generate a real presigned URL using S3 SDK
        const url = `https://d2xsxph8kpxj0f.cloudfront.net/${fileKey}`;
        
        return {
          url,
          fileKey,
          success: true,
        };
      } catch (error) {
        throw new Error("Failed to generate upload URL");
      }
    }),
});
