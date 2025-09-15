import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.split(" ")[1];
  try {
    const { verifyToken } = await import("../../../../lib/jwt");
    const data: any = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: data.id }});
    if (!user) return res.status(401).json({ error: "Invalid token" });
    
    if (user.role !== "ADMIN") return res.status(403).json({ error: "Admins only" });

    const { slug } = req.query;
    const tenant = await prisma.tenant.findUnique({ where: { slug: String(slug) }});
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    if (tenant.id !== user.tenantId) return res.status(403).json({ error: "Cannot upgrade other tenant" });

    const updated = await prisma.tenant.update({ where: { id: tenant.id }, data: { plan: "PRO" }});
    return res.json({ success: true, tenant: updated });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
