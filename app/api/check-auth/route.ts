import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByToken } from '@/utils/users';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth');

  if (token) {
    const user = findUserByToken(token.value);
    if (user) {
      return NextResponse.json({ isAuthenticated: true, user });
    }
  }

  return NextResponse.json({ isAuthenticated: false }, { status: 401 });
}