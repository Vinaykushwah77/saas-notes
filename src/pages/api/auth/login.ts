import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const user = await prisma.user.findUnique({ where: { email }, include: { tenant: true } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user.id, tenantId: user.tenantId, role: user.role });
  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      tenant: { id: user.tenant.id, slug: user.tenant.slug, plan: user.tenant.plan },
    },
  });
}
