import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type MockContext = {
  ctx: TrpcContext;
  notifyOwnerMock: ReturnType<typeof vi.fn>;
};

function createMockContext(): MockContext {
  const notifyOwnerMock = vi.fn().mockResolvedValue(true);

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as any as TrpcContext["res"],
  };

  return { ctx, notifyOwnerMock };
}

describe("contact.submit", () => {
  it("successfully submits a contact form with valid data", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      subject: "Inquiry about Ultimate Paradise package",
      message: "I am interested in booking the Ultimate Paradise package for my honeymoon.",
      packageType: "ultimate-paradise",
    });

    expect(result).toEqual({
      success: true,
      message: "Thank you for your inquiry. We will respond within 24 hours.",
    });
  });

  it("rejects submission with missing name", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        subject: "Inquiry",
        message: "This is a test message.",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Name is required");
    }
  });

  it("rejects submission with invalid email", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "John Doe",
        email: "invalid-email",
        phone: "+1 (555) 123-4567",
        subject: "Inquiry",
        message: "This is a test message.",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid email address");
    }
  });

  it("rejects submission with missing phone", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "John Doe",
        email: "john@example.com",
        phone: "",
        subject: "Inquiry",
        message: "This is a test message.",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Phone is required");
    }
  });

  it("rejects submission with missing subject", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        subject: "",
        message: "This is a test message.",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Subject is required");
    }
  });

  it("rejects submission with message too short", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        subject: "Inquiry",
        message: "Short",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Message must be at least 10 characters");
    }
  });

  it("accepts optional packageType field", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 987-6543",
      subject: "General inquiry",
      message: "I would like more information about your services.",
    });

    expect(result.success).toBe(true);
  });
});
