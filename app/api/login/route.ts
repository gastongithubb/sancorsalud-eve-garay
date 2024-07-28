import { NextResponse } from 'next/server';
import { login } from '@/lib/login';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

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
    console.error('Error en la ruta de login:', error);
    return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 });
  }
}