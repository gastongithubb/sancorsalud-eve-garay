import { NextRequest, NextResponse } from 'next/server';
import { findUserByToken, updateUserProfilePicture } from '@/utils/users';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  console.log('Auth header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'No se proporcionó el token de autorización' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token);
  
  try {
    const user = findUserByToken(token);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return NextResponse.json({ message: 'Token inválido o usuario no encontrado' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('profilePicture') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: 'No se subió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    // Usar Uint8Array en lugar de Buffer
    const buffer = new Uint8Array(bytes);

    const fileName = `${user.username}-${Date.now()}${file.name.slice(file.name.lastIndexOf('.'))}`;
    const path = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(path, buffer);

    const profilePictureUrl = `/uploads/${fileName}`;

    const updatedUser = await updateUserProfilePicture(user.username, profilePictureUrl);

    return NextResponse.json({
      message: 'Foto de perfil actualizada correctamente',
      profilePictureUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar la foto de perfil:', error);
    return NextResponse.json({ message: `Error al actualizar la foto de perfil: ${error instanceof Error ? error.message : 'Error desconocido'}` }, { status: 500 });
  }
}