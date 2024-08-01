// app/api/check-admin/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByToken } from '@/utils/users'; // Asumimos que tienes esta función

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth')?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = findUserByToken(token);

  if (!user || !user.isAdmin) {
    return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new NextResponse(JSON.stringify({ isAdmin: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}