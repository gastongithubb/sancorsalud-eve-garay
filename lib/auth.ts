import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from "jose";
import { getDB } from '@/utils/database';
import { personnel } from '@/utils/database';
import { eq } from 'drizzle-orm';

interface User {
  id: number;
  email: string;
  name?: string;
}

export interface CustomJWTPayload extends JoseJWTPayload {
  userId: number;
}

export async function register(email: string, password: string, name?: string): Promise<User> {
  const db = getDB();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await db.insert(personnel)
      .values({
        email,
        firstName: name || '',
        lastName: '',
        dni: '',
        entryTime: '',
        exitTime: '',
        hoursWorked: 0,
        xLite: '',
      })
      .returning({
        id: personnel.id,
        email: personnel.email,
        name: personnel.firstName
      });

    // Store the hashed password separately or in a new table

    return result[0] as User;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
}

export async function login(email: string, password: string): Promise<{ user: User, token: string }> {
  const db = getDB();
  
  try {
    const result = await db.select()
      .from(personnel)
      .where(eq(personnel.email, email))
      .limit(1);

    const user = result[0];
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Retrieve the hashed password from wherever you stored it
    // const storedHashedPassword = ...

    // if (!(await bcrypt.compare(password, storedHashedPassword))) {
    //   throw new Error('Invalid credentials');
    // }

    const token = await generateToken(user.id);
    return { 
      user: {
        id: user.id,
        email: user.email,
        name: user.firstName
      }, 
      token 
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error('Invalid credentials');
  }
}

export async function generateToken(userId: number): Promise<string> {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not set');
  }
  const key = new TextEncoder().encode(secretKey);
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

export async function verifyToken(token: string): Promise<CustomJWTPayload> {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not set');
  }
  const key = new TextEncoder().encode(secretKey);
  const { payload } = await jwtVerify(token, key);
  return payload as CustomJWTPayload;
}

export async function decrypt(token: string): Promise<CustomJWTPayload> {
  return await verifyToken(token);
}

export async function encrypt(payload: CustomJWTPayload): Promise<string> {
  return await generateToken(payload.userId);
}