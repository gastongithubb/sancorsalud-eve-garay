import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs';
import { SignJWT, jwtVerify } from "jose";

const prisma = new PrismaClient()

const secretKey = process.env.JWT_SECRET_KEY!;
const key = new TextEncoder().encode(secretKey);

// Actualizamos la interfaz para permitir que userId sea string o number
export interface JWTPayload {
  userId: string | number;
  exp?: number;
  [key: string]: any;  // para permitir propiedades adicionales
}

export async function login({ email, password }: { email: string; password: string }) {
  const user = await prisma.auth_users.findUnique({
    where: { email },
  });

  if (!user || !(await bcryptjs.compare(password, user.password))) {
    throw new Error("Credenciales inválidas");
  }

  // Convertimos el id a string para asegurarnos de que siempre sea un string en el token
  const token = await encrypt({ userId: user.id.toString() });

  return { user, token };
}

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

export async function decrypt(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, key);
  return payload as JWTPayload;
}