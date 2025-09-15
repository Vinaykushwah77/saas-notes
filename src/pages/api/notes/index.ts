import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { authMiddleware } from "../../../lib/middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const run = async (req, res) => {
    const user = req.user;
    const tenantId = user.tenantId;

    if (req.method === "GET") {
      const notes = await prisma.note.findMany({ where: { tenantId } , include: { author: true }});
      return res.json(notes);
    }

    if (req.method === "POST") {
      const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
      if (!tenant) return res.status(400).json({ error: "Tenant not found" });

      if (tenant.plan === "FREE") {
        const count = await prisma.note.count({ where: { tenantId } });
        if (count >= 3) {
          return res.status(403).json({ error: "Free plan note limit reached. Upgrade to Pro." });
        }
      }

      const { title, content } = req.body;
      const note = await prisma.note.create({
        data: { title, content, tenantId, authorId: user.id }
      });
      return res.status(201).json(note);
    }

    return res.status(405).end();
  };

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    const { verifyToken } = await import("../../../lib/jwt");
    const data: any = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: data.id } });
    if (!user) return res.status(401).json({ error: "Invalid token" });
    (req as any).user = { id: user.id, tenantId: user.tenantId, role: user.role };
    return run(req, res);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
