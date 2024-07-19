import { NextRequest, NextResponse } from 'next/server';
import { db, npsTrimestral } from '@/utils/db';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const trimestralData = await db.select()
      .from(npsTrimestral)
      .where(eq(npsTrimestral.userId, Number(userId)))
      .orderBy(desc(npsTrimestral.month))
      .limit(3);

    return NextResponse.json(trimestralData);
  } catch (error) {
    console.error('Error al obtener datos trimestrales de NPS:', error);
    return NextResponse.json({ message: 'Error al obtener datos trimestrales de NPS' }, { status: 500 });
  }
}