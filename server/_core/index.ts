import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getDb } from "../db";
import { boatRoutes } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Airport routes API endpoint
  app.get('/api/airport-routes', async (req, res) => {
    try {
      const { islandGuideId } = req.query;
      if (!islandGuideId) {
        return res.status(400).json({ error: 'islandGuideId is required' });
      }
      
      // Return empty array for now - will be implemented with database query
      res.json([]);
    } catch (error) {
      console.error('Error fetching airport routes:', error);
      res.status(500).json({ error: 'Failed to fetch airport routes' });
    }
  });
  
  // Boat routes API endpoint
  app.get('/api/boat-routes', async (req, res) => {
    try {
      const { islandGuideId } = req.query;
      if (!islandGuideId) {
        return res.status(400).json({ error: 'islandGuideId is required' });
      }
      
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: 'Database connection failed' });
      }
      
      const routes = await db.select().from(boatRoutes).where(
        eq(boatRoutes.toIslandGuideId, parseInt(islandGuideId as string))
      );
      
      res.json(routes);
    } catch (error) {
      console.error('Error fetching boat routes:', error);
      res.status(500).json({ error: 'Failed to fetch boat routes' });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
