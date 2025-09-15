import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/jwt";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    let currentUser: any;
    try {
        currentUser = verifyToken(token);
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }

    if (currentUser.role !== "ADMIN") {
        return res.status(403).json({ error: "Not allowed" });
    }

    const { email } = req.body as { email: string };

    try {
        const invitedUser = await prisma.user.create({
            data: {
                email,
                role: "MEMBER",
                tenantId: currentUser.tenantId,
                password: "",
            },
        });


        return res.json({ message: "Invitation sent", email: invitedUser.email });
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
}
