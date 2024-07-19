import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUser } from '@/utils/db';

export async function GET(request: NextRequest) {
  // Aquí deberías implementar la lógica para obtener el email del usuario autenticado
  // Por ejemplo, usando el objeto de sesión o un token JWT
  const userEmail = 'user@example.com'; // Reemplaza esto con la lógica real de autenticación

  try {
    const user = await getUserByEmail(userEmail);
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return NextResponse.json({ message: 'Error al obtener el usuario' }, { status: 500 });
  }
}

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