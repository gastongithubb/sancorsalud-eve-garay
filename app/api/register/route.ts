import { NextResponse } from 'next/server';
import { register } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const user = await register(email, password, name);
    
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error en la ruta de registro:', error);
    return NextResponse.json({ success: false, error: 'No se pudo registrar el usuario' }, { status: 400 });
  }
}