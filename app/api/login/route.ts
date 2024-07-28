import { NextResponse } from 'next/server';
import { login } from '@/lib/login';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  try {
    const { user, token } = await login({ email, password });
    const response = NextResponse.json({ success: true, user });
    response.cookies.set('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }
}