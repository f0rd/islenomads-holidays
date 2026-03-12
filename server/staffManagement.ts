import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { adminProcedure, router } from './_core/trpc';
import { 
  createStaff, 
  updateStaff, 
  deleteStaff, 
  getStaffByUserId,
  logActivity,
  getStaffById,
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
      const currentStaff = await getStaffByUserId(ctx.user.id);
      if (!currentStaff || currentStaff.role.name !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      const newStaff = await createStaff({
        userId: input.userId,
        roleId: input.roleId,
        department: input.department,
        position: input.position,
        isActive: 1,
      });
      
      // Log activity
      if (currentStaff) {
        await logActivity({
          staffId: currentStaff.id,
          action: 'create_staff',
          entityType: 'staff',
          entityId: newStaff?.id || 0,
          changes: JSON.stringify(input),
        });
      }
      
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
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
      const currentStaff = await getStaffByUserId(ctx.user.id);
      if (!currentStaff || currentStaff.role.name !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      // If name is being updated, update the user record
      if (input.name) {
        const staff = await getStaffById(input.id);
        if (staff) {
          await updateUser(staff.userId, { name: input.name });
        }
      }
      
      const updated = await updateStaff(input.id, {
        roleId: input.roleId,
        department: input.department,
        position: input.position,
        isActive: input.isActive,
      });
      
      // Log activity
      if (currentStaff) {
        await logActivity({
          staffId: currentStaff.id,
          action: 'update_staff',
          entityType: 'staff',
          entityId: input.id,
          changes: JSON.stringify(input),
        });
      }
      
      return updated;
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
      const currentStaff = await getStaffByUserId(ctx.user.id);
      if (!currentStaff || currentStaff.role.name !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      const success = await deleteStaff(input.id);
      
      // Log activity
      if (currentStaff && success) {
        await logActivity({
          staffId: currentStaff.id,
          action: 'delete_staff',
          entityType: 'staff',
          entityId: input.id,
          changes: JSON.stringify({ deleted: true }),
        });
      }
      
      return { success };
    }),
});
