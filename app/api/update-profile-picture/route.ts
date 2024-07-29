// app/api/update-profile-picture/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updateAuthUser } from '@/utils/database';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'No authorization token provided' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = await verifyToken(token);
    const data = await request.formData();
    const file: File | null = data.get('profilePicture') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${decoded.userId}-${Date.now()}${file.name.slice(file.name.lastIndexOf('.'))}`;
    const path = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(path, buffer);

    const newProfilePicture = `/uploads/${fileName}`;

    await updateAuthUser(decoded.userId, { profilePicture: newProfilePicture });

    return NextResponse.json({
      message: 'Profile picture updated successfully',
      profilePictureUrl: newProfilePicture
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json({ message: 'Invalid token or database error' }, { status: 401 });
  }
}