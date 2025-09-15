import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.split(" ")[1];
  try {
    const { verifyToken } = await import("../../../lib/jwt");
    const data: any = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: data.id } });
    if (!user) return res.status(401).json({ error: "Invalid token" });
    const tenantId = user.tenantId;
    const { id } = req.query;

    const note = await prisma.note.findUnique({ where: { id: String(id) }});
    if (!note || note.tenantId !== tenantId) return res.status(404).json({ error: "Not found" });

    if (req.method === "GET") return res.json(note);

    if (req.method === "PUT") {
      const { title, content } = req.body;
      const updated = await prisma.note.update({ where: { id: String(id) }, data: { title, content }});
      return res.json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.note.delete({ where: { id: String(id) }});
      return res.json({ success: true });
    }

    return res.status(405).end();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
