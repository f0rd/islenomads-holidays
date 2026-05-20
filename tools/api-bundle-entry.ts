import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/_core/app";

const app = createApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  const raw = req.query._p;
  if (raw) {
    const path = Array.isArray(raw) ? raw.join("/") : raw;
    const original = new URL(req.url ?? "/", "http://x");
    original.searchParams.delete("_p");
    const search = original.search || "";
    (req as any).url = `/api/${path}${search}`;
  }
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(
    req,
    res
  );
}
