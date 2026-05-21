import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { adminProcedure, router } from './_core/trpc';
import {
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffById,
  updateUser,
} from './db';

export const staffManagementRouter = router({
  create: adminProcedure
    .input(z.object({
      userId: z.number(),
      roleId: z.number(),
      department: z.string().optional(),
      position: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const newStaff = await createStaff({
        userId: input.userId,
        roleId: input.roleId,
        department: input.department,
        position: input.position,
        isActive: 1,
      });
      return newStaff;
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      roleId: z.number().optional(),
      department: z.string().optional(),
      position: z.string().optional(),
      isActive: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      if (input.name) {
        const existing = await getStaffById(input.id);
        if (existing) {
          await updateUser(existing.userId, { name: input.name });
        }
      }

      const updated = await updateStaff(input.id, {
        roleId: input.roleId,
        department: input.department,
        position: input.position,
        isActive: input.isActive,
      });

      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const ok = await deleteStaff(input.id);
      return { success: ok };
    }),
});
