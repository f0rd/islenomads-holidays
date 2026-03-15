import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { adminProcedure, router } from './_core/trpc';
import { 
  createStaff, 
  updateStaff,
  updateUser
} from './db';

export const staffManagementRouter = router({
  create: adminProcedure
    .input(z.object({
      userId: z.number(),
      roleId: z.number(),
      department: z.string().optional(),
      position: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
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
    .mutation(async ({ input, ctx }) => {
      if (input.name && input.id) {
        // Update user name if provided
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
    .mutation(async ({ input, ctx }) => {
      return { success: true };
    }),
});
