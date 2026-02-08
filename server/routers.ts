import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { getAllBlogPosts, getBlogPostBySlug, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost, getBlogComments, createBlogComment, getAllPackages, getPackageById, getPackageBySlug, createPackage, updatePackage, deletePackage, getAllPackagesAdmin, getAllBlogPostsAdmin, getBoatRoutes, getBoatRouteBySlug, getBoatRouteById, createBoatRoute, updateBoatRoute, deleteBoatRoute, getMapLocations, getMapLocationBySlug, getMapLocationById, createMapLocation, updateMapLocation, deleteMapLocation, getIslandGuides, getIslandGuideBySlug, getIslandGuideById, getAllIslandGuidesAdmin } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().min(1, "Phone is required"),
          subject: z.string().min(1, "Subject is required"),
          message: z.string().min(10, "Message must be at least 10 characters"),
          packageType: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await notifyOwner({
            title: `New Inquiry from ${input.name}`,
            content: `Email: ${input.email}\nPhone: ${input.phone}\nPackage: ${input.packageType || "Not specified"}\n\nSubject: ${input.subject}\n\nMessage:\n${input.message}`,
          });

          return {
            success: true,
            message: "Thank you for your inquiry. We will respond within 24 hours.",
          };
        } catch (error) {
          console.error("[Contact Form] Error:", error);
          throw new Error("Failed to submit contact form. Please try again.");
        }
      }),
  }),

  blog: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getAllBlogPosts(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getBlogPostBySlug(input.slug);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getBlogPostById(input.id);
      }),
    
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          content: z.string().min(1),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
          author: z.string().min(1),
          category: z.string().optional(),
          tags: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createBlogPost(input);
      }),
    
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
          author: z.string().optional(),
          category: z.string().optional(),
          tags: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return updateBlogPost(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteBlogPost(input.id);
      }),
    
    getComments: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return getBlogComments(input.postId);
      }),
    
    addComment: publicProcedure
      .input(
        z.object({
          postId: z.number(),
          name: z.string().min(1),
          email: z.string().email(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        return createBlogComment({ ...input, approved: 0 });
      }),
  }),

  packages: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getAllPackages(input.limit);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getPackageById(input.id);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getPackageBySlug(input.slug);
      }),
    
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().min(1),
          price: z.number().min(0),
          duration: z.string().min(1),
          destination: z.string().min(1),
          highlights: z.string().optional(),
          amenities: z.string().optional(),
          image: z.string().optional(),
          featured: z.number().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createPackage(input);
      }),
    
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          duration: z.string().optional(),
          destination: z.string().optional(),
          highlights: z.string().optional(),
          amenities: z.string().optional(),
          image: z.string().optional(),
          featured: z.number().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return updatePackage(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deletePackage(input.id);
      }),
  }),

  boatRoutes: router({
    list: publicProcedure.query(async () => {
      return getBoatRoutes(true);
    }),
  }),

  mapLocations: router({
    list: publicProcedure.query(async () => {
      return getMapLocations(true);
    }),
  }),

  admin: router({
    blog: router({
      listAll: protectedProcedure
        .query(async () => {
          return getAllBlogPostsAdmin();
        }),
    }),
    
    packages: router({
      listAll: protectedProcedure
        .query(async () => {
          return getAllPackagesAdmin();
        }),
    }),
    islandGuides: router({
      listAll: protectedProcedure
        .query(async () => {
          return getAllIslandGuidesAdmin();
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
