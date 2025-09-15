import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./jwt";
import prisma from "./prisma";

export type AuthRequest = NextApiRequest & {
  user?: any; 
};

export async function authMiddleware(req: AuthRequest, res: NextApiResponse, next: Function) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Missing auth token" });
    const token = auth.split(" ")[1];
    const data: any = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: data.id }, include: { tenant: true } });
    if (!user) return res.status(401).json({ error: "Invalid user" });
    req.user = { id: user.id, email: user.email, tenantId: user.tenantId, role: user.role, tenant: user.tenant };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
