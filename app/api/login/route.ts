import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { user, token } = await login(email, password);
    
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
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