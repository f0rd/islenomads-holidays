import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { eq } from "drizzle-orm";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { getDb } from "../db";
import { boatRoutes, places } from "../../drizzle/schema";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  app.get("/api/airport-routes", async (_req, res) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database connection failed" });
      }

      const airports = await db
        .select()
        .from(places)
        .where(eq(places.type, "airport"));

      res.json(airports);
    } catch (error) {
      console.error("Error fetching airports:", error);
      res.status(500).json({ error: "Failed to fetch airports" });
    }
  });

  app.get("/api/boat-routes", async (req, res) => {
    try {
      const { islandGuideId } = req.query;
      if (!islandGuideId) {
        return res.status(400).json({ error: "islandGuideId is required" });
      }

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database connection failed" });
      }

      const routes = await db
        .select()
        .from(boatRoutes)
        .where(
          eq(boatRoutes.toIslandGuideId, parseInt(islandGuideId as string))
        );

      res.json(routes);
    } catch (error) {
      console.error("Error fetching boat routes:", error);
      res.status(500).json({ error: "Failed to fetch boat routes" });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}
