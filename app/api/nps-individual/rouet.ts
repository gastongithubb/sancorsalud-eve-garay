// En /app/api/nps-dashboard/route.ts
import { NextResponse } from 'next/server';
import { db, users } from '../../../utils/db';

export async function GET() {
  try {
    const allUsers = await db.select().from(users).all();
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching all users:', error);
    return NextResponse.json({ error: 'Error fetching users data' }, { status: 500 });
  }
}