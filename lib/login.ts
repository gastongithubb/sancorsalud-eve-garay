import { prisma } from './prisma'
import bcryptjs from 'bcryptjs';
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
  throw new Error('JWT_SECRET_KEY is not set');
}
const key = new TextEncoder().encode(secretKey);

export interface JWTPayload {
  userId: string;
  exp?: number;
  [key: string]: any;
}

export async function login({ email, password }: { email: string; password: string }) {
  try {
    const user = await prisma.authUser.findUnique({
      where: { email },
    });

    if (!user) {
      console.error('Usuario no encontrado:', email);
      throw new Error("Credenciales inválidas");
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      console.error('Contraseña inválida para el usuario:', email);
      throw new Error("Credenciales inválidas");
    }

    const token = await encrypt({ userId: user.id.toString() });

    return { user, token };
  } catch (error) {
    console.error('Error durante el login:', error);
    throw new Error('Ocurrió un error durante el login. Por favor, intenta de nuevo más tarde.');
  }
}

export async function encrypt(payload: JWTPayload): Promise<string> {
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