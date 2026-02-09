import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";
import {
  getAllBlogPosts, getBlogPostBySlug, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost,
  getBlogComments, createBlogComment, getAllPackages, getPackageById, getPackageBySlug, createPackage,
  updatePackage, deletePackage, getAllPackagesAdmin, getAllBlogPostsAdmin, getBoatRoutes, getBoatRouteBySlug,
  getBoatRouteById, createBoatRoute, updateBoatRoute, deleteBoatRoute, getMapLocations, getMapLocationBySlug,
  getMapLocationById, createMapLocation, updateMapLocation, deleteMapLocation, getIslandGuides,
  getFeaturedIslandGuides, getIslandGuideBySlug, getIslandGuideById, createIslandGuide, updateIslandGuide,
  deleteIslandGuide, getAllIslandGuidesAdmin, updateDisplayOrder, getSeoMetaTags, getApprovedSeoMetaTags, createSeoMetaTags,
  updateSeoMetaTags, approveSeoMetaTags, rejectSeoMetaTags, getPendingSeoMetaTags, getSeoMetaTagsByContentType,
  deleteSeoMetaTags, getCrmQueries, getCrmQueryById, createCrmQuery, updateCrmQuery, deleteCrmQuery,
  getCrmInteractions, createCrmInteraction, getCrmCustomerByEmail, createCrmCustomer, updateCrmCustomer,
  getStaffByUserId, getStaffById, getAllStaff, getStaffRole, getStaffRoleByName, createStaffRole, updateStaff,
  logActivity, getAllTransports, getAllTransportsAdmin, getTransportById, createTransport, updateTransport,
  deleteTransport
} from "./db";

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

  transports: router({
    list: publicProcedure.query(async () => {
      return getAllTransports();
    }),

    listAdmin: protectedProcedure.query(async (opts) => {
      if (opts.ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can access this' });
      }
      return getAllTransportsAdmin();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getTransportById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          fromLocation: z.string().min(1, "From location is required"),
          toLocation: z.string().min(1, "To location is required"),
          transportType: z.enum(["ferry", "speedboat", "dhoni", "seaplane"]),
          durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
          priceUSD: z.number().min(0, "Price must be non-negative"),
          capacity: z.number().min(1, "Capacity must be at least 1"),
          operator: z.string().min(1, "Operator is required"),
          departureTime: z.string().optional(),
          schedule: z.string().optional(),
          amenities: z.string().optional(),
          description: z.string().optional(),
          image: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can create transports' });
        }
        return createTransport(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          fromLocation: z.string().optional(),
          toLocation: z.string().optional(),
          transportType: z.enum(["ferry", "speedboat", "dhoni", "seaplane"]).optional(),
          durationMinutes: z.number().optional(),
          priceUSD: z.number().optional(),
          capacity: z.number().optional(),
          operator: z.string().optional(),
          departureTime: z.string().optional(),
          schedule: z.string().optional(),
          amenities: z.string().optional(),
          description: z.string().optional(),
          image: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update transports' });
        }
        const { id, ...data } = input;
        return updateTransport(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can delete transports' });
        }
        return deleteTransport(input.id);
      }),
  }),

  blog: router({
    list: publicProcedure.query(async () => {
      return getAllBlogPosts();
    }),

    listAdmin: protectedProcedure.query(async () => {
      return getAllBlogPostsAdmin();
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
          title: z.string(),
          slug: z.string(),
          content: z.string(),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
          author: z.string(),
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
        const { id, ...data } = input;
        return updateBlogPost(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteBlogPost(input.id);
      }),

    comments: router({
      list: publicProcedure
        .input(z.object({ postId: z.number() }))
        .query(async ({ input }) => {
          return getBlogComments(input.postId);
        }),

      create: publicProcedure
        .input(
          z.object({
            postId: z.number(),
            name: z.string(),
            email: z.string().email(),
            content: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          return createBlogComment(input);
        }),
    }),
  }),

  packages: router({
    list: publicProcedure.query(async () => {
      return getAllPackages();
    }),

    listAdmin: protectedProcedure.query(async () => {
      return getAllPackagesAdmin();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getPackageBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getPackageById(input.id);
      }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        const allPackages = await getAllPackages();
        return allPackages.filter(pkg => pkg.category === input.category);
      }),

    getCategories: publicProcedure.query(async () => {
      return [
        { id: 'family-adventures', label: 'Family Adventures', icon: '👨‍👩‍👧‍👦' },
        { id: 'solo-travel', label: 'Solo Travel', icon: '🧑‍🚀' },
        { id: 'water-sports', label: 'Water Sports', icon: '🏄' },
        { id: 'relaxation', label: 'Relaxation', icon: '🧘' },
        { id: 'luxury', label: 'Luxury', icon: '👑' },
        { id: 'adventure', label: 'Adventure', icon: '🏔️' },
        { id: 'diving-snorkeling', label: 'Diving & Snorkeling', icon: '🤿' },
        { id: 'island-hopping', label: 'Island Hopping', icon: '🏝️' },
      ];
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string(),
          price: z.number(),
          duration: z.string(),
          destination: z.string(),
          category: z.enum(['family-adventures', 'solo-travel', 'water-sports', 'relaxation', 'luxury', 'adventure', 'diving-snorkeling', 'island-hopping']).optional(),
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
        const { id, ...data } = input;
        return updatePackage(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deletePackage(input.id);
      }),
  }),

  boatRoutes: router({
    list: publicProcedure.query(async () => {
      return getBoatRoutes();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getBoatRouteBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getBoatRouteById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string(),
          startPoint: z.string(),
          endPoint: z.string(),
          distance: z.number().optional(),
          duration: z.string(),
          boatType: z.string(),
          capacity: z.number(),
          speed: z.number().optional(),
          price: z.number(),
          schedule: z.string().optional(),
          amenities: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { distance, ...rest } = input;
        return createBoatRoute({
          ...rest,
          distance: distance ? distance.toString() : undefined,
        } as any);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          startPoint: z.string().optional(),
          endPoint: z.string().optional(),
          distance: z.number().optional(),
          duration: z.string().optional(),
          boatType: z.string().optional(),
          capacity: z.number().optional(),
          speed: z.number().optional(),
          price: z.number().optional(),
          schedule: z.string().optional(),
          amenities: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, distance, ...rest } = input;
        const updateData: any = { ...rest };
        if (distance !== undefined) updateData.distance = distance.toString();
        return updateBoatRoute(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteBoatRoute(input.id);
      }),
  }),

  mapLocations: router({
    list: publicProcedure.query(async () => {
      return getMapLocations();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getMapLocationBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getMapLocationById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          locationType: z.string(),
          image: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { latitude, longitude, ...rest } = input;
        return createMapLocation({
          ...rest,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        } as any);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          locationType: z.string().optional(),
          image: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, latitude, longitude, ...rest } = input;
        const updateData: any = { ...rest };
        if (latitude !== undefined) updateData.latitude = latitude.toString();
        if (longitude !== undefined) updateData.longitude = longitude.toString();
        return updateMapLocation(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteMapLocation(input.id);
      }),
  }),

  islandGuides: router({
    list: publicProcedure.query(async () => {
      return getIslandGuides();
    }),

    featured: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getFeaturedIslandGuides(input.limit || 3);
      }),

    listAdmin: protectedProcedure.query(async () => {
      return getAllIslandGuidesAdmin();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getIslandGuideBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getIslandGuideById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createIslandGuide(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          published: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateIslandGuide(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteIslandGuide(input.id);
      }),

    updateDisplayOrder: protectedProcedure
      .input(z.object({
        updates: z.array(z.object({
          id: z.number(),
          displayOrder: z.number(),
        }))
      }))
      .mutation(async ({ input }) => {
        return updateDisplayOrder(input.updates);
      }),
  }),

  seo: router({
    get: protectedProcedure
      .input(z.object({
        contentType: z.string(),
        contentId: z.number(),
      }))
      .query(async ({ input }) => {
        return getSeoMetaTags(input.contentType, input.contentId);
      }),

    getApproved: publicProcedure
      .input(z.object({
        contentType: z.string(),
        contentId: z.number(),
      }))
      .query(async ({ input }) => {
        return getApprovedSeoMetaTags(input.contentType, input.contentId);
      }),

    create: protectedProcedure
      .input(z.object({
        contentType: z.string(),
        contentId: z.number(),
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()).optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
        ogImage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const data: any = { ...input };
        if (data.keywords) {
          data.keywords = JSON.stringify(data.keywords);
        }
        return createSeoMetaTags(data);
      }),

    approve: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const staffId = ctx.user?.id || 1;
        return approveSeoMetaTags(input.id, staffId);
      }),

    reject: protectedProcedure
      .input(z.object({
        id: z.number(),
        reason: z.string(),
      }))
      .mutation(async ({ input }) => {
        return rejectSeoMetaTags(input.id, input.reason);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.keywords) {
          updateData.keywords = JSON.stringify(data.keywords);
        }
        return updateSeoMetaTags(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteSeoMetaTags(input.id);
      }),

    getByContentType: protectedProcedure
      .input(z.object({
        contentType: z.string(),
        status: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return getSeoMetaTagsByContentType(input.contentType, input.status);
      }),
  }),

  crm: router({
    queries: router({
      list: protectedProcedure
        .input(z.object({
          status: z.string().optional(),
        }))
        .query(async ({ input }) => {
          return getCrmQueries(input.status);
        }),

      get: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return getCrmQueryById(input.id);
        }),

      create: protectedProcedure
        .input(z.object({
          customerName: z.string(),
          customerEmail: z.string().email(),
          customerPhone: z.string().optional(),
          customerCountry: z.string().optional(),
          subject: z.string(),
          message: z.string(),
          queryType: z.enum(["booking", "general", "complaint", "feedback", "support", "other"]).optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
          packageId: z.number().optional(),
          islandGuideId: z.number().optional(),
        }))
        .mutation(async ({ input }) => {
          return createCrmQuery(input);
        }),

      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["new", "in_progress", "waiting_customer", "resolved", "closed"]).optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
          assignedTo: z.number().optional(),
          firstResponseAt: z.date().optional(),
          resolvedAt: z.date().optional(),
          closedAt: z.date().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          return updateCrmQuery(id, data);
        }),

      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return deleteCrmQuery(input.id);
        }),
    }),

    interactions: router({
      list: protectedProcedure
        .input(z.object({ queryId: z.number() }))
        .query(async ({ input }) => {
          return getCrmInteractions(input.queryId);
        }),

      create: protectedProcedure
        .input(z.object({
          queryId: z.number(),
          type: z.enum(["note", "email", "call", "meeting", "sms"]),
          subject: z.string().optional(),
          content: z.string(),
          isInternal: z.boolean().optional(),
          attachments: z.array(z.string()).optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const staffId = ctx.user?.id || 1;
          return createCrmInteraction({
            ...input,
            staffId,
            isInternal: input.isInternal ? 1 : 0,
            attachments: input.attachments ? JSON.stringify(input.attachments) : undefined,
          });
        }),
    }),

    customers: router({
      getByEmail: protectedProcedure
        .input(z.object({ email: z.string().email() }))
        .query(async ({ input }) => {
          return getCrmCustomerByEmail(input.email);
        }),

      create: protectedProcedure
        .input(z.object({
          email: z.string().email(),
          name: z.string(),
          phone: z.string().optional(),
          country: z.string().optional(),
          preferredContact: z.enum(["email", "phone", "sms"]).optional(),
          newsletter: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
          return createCrmCustomer({
            ...input,
            newsletter: input.newsletter ? 1 : 0,
          });
        }),

      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          phone: z.string().optional(),
          country: z.string().optional(),
          preferredContact: z.enum(["email", "phone", "sms"]).optional(),
          newsletter: z.boolean().optional(),
          lastContactedAt: z.date().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          return updateCrmCustomer(id, {
            ...data,
            newsletter: data.newsletter !== undefined ? (data.newsletter ? 1 : 0) : undefined,
          });
        }),
    }),
  }),
  
  // Staff and RBAC management
  staff: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      return getStaffByUserId(ctx.user.id);
    }),
    
    list: protectedProcedure.query(async () => {
      return getAllStaff();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getStaffById(input.id);
      }),
    
    updateProfile: protectedProcedure
      .input(z.object({
        department: z.string().optional(),
        position: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
        const staffMember = await getStaffByUserId(ctx.user.id);
        if (!staffMember) throw new TRPCError({ code: 'NOT_FOUND' });
        
        await updateStaff(staffMember.id, input);
        
        // Log activity
        await logActivity({
          staffId: staffMember.id,
          action: 'update_profile',
          entityType: 'staff',
          entityId: staffMember.id,
          changes: JSON.stringify(input),
        });
        
        return getStaffById(staffMember.id);
      }),
    
    roles: router({
      list: protectedProcedure.query(async () => {
        // This would need a getAllStaffRoles function
        return [];
      }),
      
      getByName: protectedProcedure
        .input(z.object({ name: z.string() }))
        .query(async ({ input }) => {
          return getStaffRoleByName(input.name);
        }),
      
      create: protectedProcedure
        .input(z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          permissions: z.array(z.string()),
        }))
        .mutation(async ({ input, ctx }) => {
          if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
          const staffMember = await getStaffByUserId(ctx.user.id);
          if (!staffMember || staffMember.role.name !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN' });
          }
          
          const role = await createStaffRole({
            name: input.name,
            description: input.description,
            permissions: JSON.stringify(input.permissions),
          });
          
          // Log activity
          if (staffMember) {
            await logActivity({
              staffId: staffMember.id,
              action: 'create_role',
              entityType: 'staff_role',
              entityId: role?.id || 0,
              changes: JSON.stringify(input),
            });
          }
          
          return role;
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
