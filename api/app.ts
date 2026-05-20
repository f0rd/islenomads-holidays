import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/_core/app";

let app: any = null;
let initError: unknown = null;
try {
  app = createApp();
} catch (err) {
  initError = err;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (initError || !app) {
    const err = initError as Error | unknown;
    res.status(500).json({
      stage: "createApp",
      error:
        err instanceof Error
          ? { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 12) }
          : String(err ?? "app is null"),
    });
    return;
  }

  const raw = req.query._p;
  if (raw) {
    const path = Array.isArray(raw) ? raw.join("/") : raw;
    const original = new URL(req.url ?? "/", "http://x");
    original.searchParams.delete("_p");
    const search = original.search || "";
    (req as any).url = `/api/${path}${search}`;
  }
  return app(req, res);
}
