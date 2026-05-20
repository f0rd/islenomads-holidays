import type { VercelRequest, VercelResponse } from "@vercel/node";

let createApp: (() => any) | null = null;
let importError: unknown = null;

try {
  const mod = await import("../server/_core/app");
  createApp = mod.createApp;
} catch (err) {
  importError = err;
}

let app: any = null;
let appInitError: unknown = null;
if (createApp) {
  try {
    app = createApp();
  } catch (err) {
    appInitError = err;
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (importError || appInitError) {
    const err = (importError ?? appInitError) as Error | unknown;
    res.status(500).json({
      stage: importError ? "import" : "createApp",
      error:
        err instanceof Error
          ? { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 10) }
          : String(err),
    });
    return;
  }

  if (!app) {
    res.status(500).json({ stage: "no-app", error: "app is null" });
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
