import { NextRequest, NextResponse } from 'next/server';
import { updateUser, PersonnelRow } from '@/utils/database';

export async function PUT(request: NextRequest) {
  try {
    const updatedUser: PersonnelRow = await request.json();
    await updateUser(updatedUser);
    return NextResponse.json({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return NextResponse.json({ message: 'Error al actualizar el usuario' }, { status: 500 });
  }
}