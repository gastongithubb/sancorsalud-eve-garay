import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/utils/db';



export async function PUT(request: NextRequest) {
  try {
    const updatedUser = await request.json();
    await updateUser(updatedUser);
    return NextResponse.json({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return NextResponse.json({ message: 'Error al actualizar el usuario' }, { status: 500 });
  }
}