import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs';
import { SignJWT } from "jose";

const prisma = new PrismaClient()

const secretKey = process.env.JWT_SECRET_KEY!;
const key = new TextEncoder().encode(secretKey);

export async function login({ email, password }: { email: string; password: string }) {
  const user = await prisma.auth_users.findUnique({
    where: { email },
  });

  if (!user || !(await bcryptjs.compare(password, user.password))) {
    throw new Error("Credenciales inválidas");
  }

  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  return { user, token };
}