// app/api/user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/utils/database';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'No authorization token provided' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      profilePicture: user.profilePicture || '/default-avatar.png'
    });
  } catch (error) {
    console.error('Error verifying token or fetching user:', error);
    return NextResponse.json({ message: 'Invalid token or database error' }, { status: 401 });
  }
}