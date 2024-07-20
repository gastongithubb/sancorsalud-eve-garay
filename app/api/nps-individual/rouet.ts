import { NextRequest, NextResponse } from 'next/server';
import { getDB, personnel } from '@/utils/database';

export async function GET(request: NextRequest) {
  const db = getDB();

  try {
    const users = await db.select().from(personnel).all();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener los usuarios' }, { status: 500 });
  }
}