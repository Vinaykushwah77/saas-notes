import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export interface TokenPayload {
  id: string;
  tenantId?: string;
  role?: string;
  [key: string]: any;
}

export function signToken(payload: TokenPayload, expiresIn: string | number = "7d") {
  return jwt.sign(
    payload,
    SECRET,
    { expiresIn } as jwt.SignOptions 
  );
}

export function signTokenInline(payload: TokenPayload, expiresIn: string | number = "7d") {
  return jwt.sign(payload, SECRET, <jwt.SignOptions>{ expiresIn });
}

export function verifyToken(token: string) {
  const decoded = jwt.verify(token, SECRET);
  if (typeof decoded === "string") throw new Error("Invalid token payload");
  return decoded as TokenPayload;
}
