import { NextRequest, NextResponse } from 'next/server';
import { getDB, personnel, eq } from '@/utils/database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const id = parseInt(params.id, 10);

  try {
    const user = await db.select().from(personnel).where(eq(personnel.id, id)).get();
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const id = parseInt(params.id, 10);
  const updateData = await request.json();

  try {
    await db.update(personnel).set(updateData).where(eq(personnel.id, id)).run();
    return NextResponse.json({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return NextResponse.json({ error: 'Error al actualizar el usuario' }, { status: 500 });
  }
}