import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { slug } = req.body;

  try {
    const tenant = await prisma.tenant.update({
      where: { slug },
      data: { plan: "FREE" },
    });
    return res.json({ success: true, tenant });
  } catch (err) {
    return res.status(500).json({ error: "Tenant not found or other error" });
  }
}
