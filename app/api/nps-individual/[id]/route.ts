// En /app/api/nps-individual/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/utils/db';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id, 10);
  const updatedData = await request.json();

  try {
    await db.update(users)
      .set({
        nps: updatedData.nps,
        csat: updatedData.csat,
        rd: updatedData.rd,
        responses: updatedData.responses
      })
      .where(eq(users.id, userId))
      .execute();

    // Fetch the updated user data
    const updatedUser = await db.select().from(users).where(eq(users.id, userId)).get();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: 'Error updating user data' }, { status: 500 });
  }
}