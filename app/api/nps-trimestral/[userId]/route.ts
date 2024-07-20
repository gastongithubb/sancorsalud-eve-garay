import { NextRequest, NextResponse } from 'next/server';
import { getDB, npsTrimestral, eq } from '@/utils/database';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const db = getDB();
  const userId = parseInt(params.userId, 10);

  try {
    const npsData = await db
      .select()
      .from(npsTrimestral)
      .where(eq(npsTrimestral.personnelId, userId))
      .all();
    return NextResponse.json(npsData);
  } catch (error) {
    console.error('Error al obtener los datos de NPS trimestral:', error);
    return NextResponse.json({ error: 'Error al obtener los datos de NPS trimestral' }, { status: 500 });
  }
}