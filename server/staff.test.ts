import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from './db';
import { users, staff, staffRoles } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Staff Management', () => {
  let testUserId: number;
  let testRoleId: number;
  let testStaffId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    try {
      // Create test user
      const userResult = await db.insert(users).values({
        openId: `test-${Date.now()}`,
        name: 'Test Staff Member',
        email: `test-${Date.now()}@example.com`,
        role: 'user',
        loginMethod: 'test',
      });
      testUserId = (userResult as any).insertId;

      // Create test role
      const roleResult = await db.insert(staffRoles).values({
        name: `TestRole-${Date.now()}`,
        description: 'Test role for staff management',
        permissions: JSON.stringify(['read', 'write']),
      });
      testRoleId = (roleResult as any).insertId;

      // Create test staff member
      const staffResult = await db.insert(staff).values({
        userId: testUserId,
        roleId: testRoleId,
        department: 'Test Department',
        position: 'Test Position',
        isActive: 1,
      });
      testStaffId = (staffResult as any).insertId;
    } catch (error) {
      console.error('Setup error:', error);
      throw error;
    }
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    try {
      // Clean up test data
      await db.delete(staff).where(eq(staff.id, testStaffId));
      await db.delete(staffRoles).where(eq(staffRoles.id, testRoleId));
      await db.delete(users).where(eq(users.id, testUserId));
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });

  it('should create a staff member', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const newStaffResult = await db.insert(staff).values({
      userId: testUserId,
      roleId: testRoleId,
      department: 'New Department',
      position: 'New Position',
      isActive: 1,
    });

    const staffId = (newStaffResult as any).insertId;
    expect(staffId).toBeGreaterThan(0);

    // Verify the staff member was created
    const created = await db
      .select()
      .from(staff)
      .where(eq(staff.id, staffId))
      .limit(1);

    expect(created).toHaveLength(1);
    expect(created[0].department).toBe('New Department');

    // Clean up
    await db.delete(staff).where(eq(staff.id, staffId));
  });

  it('should update a staff member', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    await db
      .update(staff)
      .set({ department: 'Updated Department' })
      .where(eq(staff.id, testStaffId));

    const updated = await db
      .select()
      .from(staff)
      .where(eq(staff.id, testStaffId))
      .limit(1);

    expect(updated[0].department).toBe('Updated Department');
  });

  it('should delete a staff member', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    // Create a temporary staff member to delete
    const tempStaffResult = await db.insert(staff).values({
      userId: testUserId,
      roleId: testRoleId,
      department: 'Temp Department',
      position: 'Temp Position',
      isActive: 1,
    });
    const tempStaffId = (tempStaffResult as any).insertId;

    // Delete it
    await db.delete(staff).where(eq(staff.id, tempStaffId));

    // Verify it's deleted
    const deleted = await db
      .select()
      .from(staff)
      .where(eq(staff.id, tempStaffId));

    expect(deleted).toHaveLength(0);
  });

  it('should retrieve all staff members', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const allStaff = await db.select().from(staff);

    expect(Array.isArray(allStaff)).toBe(true);
    expect(allStaff.length).toBeGreaterThan(0);
  });

  it('should retrieve staff by ID', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const retrieved = await db
      .select()
      .from(staff)
      .where(eq(staff.id, testStaffId))
      .limit(1);

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].id).toBe(testStaffId);
  });

  it('should handle staff role creation', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const roleResult = await db.insert(staffRoles).values({
      name: `NewRole-${Date.now()}`,
      description: 'New test role',
      permissions: JSON.stringify(['read', 'write', 'delete']),
    });

    const roleId = (roleResult as any).insertId;
    expect(roleId).toBeGreaterThan(0);

    // Verify the role was created
    const created = await db
      .select()
      .from(staffRoles)
      .where(eq(staffRoles.id, roleId))
      .limit(1);

    expect(created).toHaveLength(1);
    expect(created[0].name).toContain('NewRole');

    // Clean up
    await db.delete(staffRoles).where(eq(staffRoles.id, roleId));
  });
});
